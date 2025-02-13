import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { parseCSV } from "@/lib/csvParser";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "sample.csv");
    const csvContent = readFileSync(filePath, "utf-8");
    const data = parseCSV(csvContent);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        ETag: '"csv-data-v1"',
      },
    });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    return NextResponse.json(
      { error: "Failed to process CSV data" },
      { status: 500 }
    );
  }
}
