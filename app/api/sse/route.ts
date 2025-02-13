import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { parseCSV } from "@/lib/csvParser";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const filePath = join(process.cwd(), "data", "sample.csv");
    const csvContent = readFileSync(filePath, "utf-8");
    const { headers, rows } = parseCSV(csvContent);

    const encoder = new TextEncoder();
    const abortController = new AbortController();
    const { signal } = abortController;
    let closed = false; // Track stream closure to prevent multiple close calls

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send headers first
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                headers,
                rows: [rows[0]],
              })}\n\n`
            )
          );

          // Stream data with delays
          for (let i = 1; i < rows.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (signal.aborted) {
              console.warn("Client disconnected, stopping SSE stream.");
              if (!closed) {
                closed = true;
                controller.close();
              }
              return;
            }

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  headers,
                  rows: [rows[i]],
                })}\n\n`
              )
            );
          }

          if (!closed) {
            closed = true;
            controller.close();
          }
        } catch (error) {
          console.error("Error in SSE stream:", error);
          if (!closed) {
            closed = true;
            controller.error(error);
          }
        }
      },
      cancel() {
        if (!closed) {
          closed = true;
          abortController.abort();
        }
      },
    });

    const response = new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });

    req.signal.addEventListener("abort", () => {
      console.warn("Client request aborted, stopping SSE stream.");
      if (!closed) {
        closed = true;
        abortController.abort();
      }
    });

    return response;
  } catch (error) {
    console.error("Error processing CSV file:", error);
    return new NextResponse("Error processing CSV file", { status: 500 });
  }
}
