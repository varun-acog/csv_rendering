"use client";

import { parseCSV } from '@/lib/csvParser';
import { DataTable } from '@/components/ui/data-table';

export default function BuildTimeReact() {
  const csvContent = `Name,Age,City
John Doe,30,New York
Jane Smith,25,Los Angeles
Bob Johnson,35,Chicago`;

  const data = parseCSV(csvContent);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Build-time React Component</h1>
      <DataTable 
        data={data}
        title="Employee Data"
        onSort={(columnIndex) => {
          console.log('Sorting column:', columnIndex);
        }}
      />
    </div>
  );
}