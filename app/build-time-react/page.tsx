import fs from 'fs/promises';
import path from 'path';
import { parseCSV, csvToHTML } from '@/lib/csvParser';

export default async function BuildTimeHTML() {
  // Path to the CSV file in the root "data/" directory
  const filePath = path.join(process.cwd(), 'data', 'sample.csv');

  try {
    // Read the CSV file asynchronously
    const csvContent = await fs.readFile(filePath, 'utf-8');

    // Parse and convert CSV data into an HTML table
    const csvData = parseCSV(csvContent);
    const tableHTML = csvToHTML(csvData);

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Build-time HTML Table</h1>
        <div 
          className="rounded-lg border bg-card"
          dangerouslySetInnerHTML={{ __html: tableHTML }} 
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Error Loading CSV</h1>
        <p className="text-red-500">Failed to load CSV file. Ensure the file exists in the "data/" directory.</p>
      </div>
    );
  }
}
