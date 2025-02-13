import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "sample.csv");
    const csvContent = readFileSync(filePath, "utf-8");
    return new NextResponse(csvContent);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return new NextResponse("Error reading CSV file", { status: 500 });
  }
}
