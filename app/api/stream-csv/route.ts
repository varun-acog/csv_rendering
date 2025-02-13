import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "sample.csv");
    const fileStream = createReadStream(filePath, { encoding: "utf-8" });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of fileStream) {
          const lines = chunk.split("\n");
          for (const line of lines) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            controller.enqueue(new TextEncoder().encode(line + "\n"));
          }
        }
        controller.close();
      },
      cancel() {
        fileStream.destroy();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/csv",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error streaming CSV file:", error);
    return new NextResponse("Error streaming CSV file", { status: 500 });
  }
}
