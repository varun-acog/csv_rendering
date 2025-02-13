import fs from "fs/promises";
import path from "path";
import { parseCSV } from "@/lib/csvParser";
import { DataTable } from "@/components/ui/data-table";

export default async function BuildTimeReact() {
  const filePath = path.join(process.cwd(), "data", "sample.csv");

  try {
    // Read the CSV file at build time
    const csvContent = await fs.readFile(filePath, "utf-8");

    // Parse CSV data
    const data = parseCSV(csvContent);

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Build-time React Component</h1>
        {/* Pass only serializable props */}
        <DataTable
          data={data}
          title="Employee Data"
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Error Loading CSV</h1>
        <p className="text-red-500">
          Failed to load CSV file. Ensure the file exists in the correct location.
        </p>
      </div>
    );
  }
}
