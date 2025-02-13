import fs from 'fs/promises';
import path from 'path';
import { parseCSV, csvToHTML } from '@/lib/csvParser';

export default async function BuildTimeHTML() {
  // This would normally read from a real CSV file during build
  const csvContent = `Name,Age,City
John Doe,30,New York
Jane Smith,25,Los Angeles
Bob Johnson,35,Chicago`;

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
}