"use client";

import { useState } from 'react';
import { parseCSV } from '@/lib/csvParser';
import { DataTable } from '@/components/ui/data-table';
import type { TableData } from '@/lib/types';

export default function UserTriggered() {
  const [data, setData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const content = await file.text();
      const parsedData = parseCSV(content);
      setData(parsedData);
    } catch (error) {
      console.error('Error parsing file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">User-triggered React Table</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Upload CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90"
        />
      </div>

      {data ? (
        <DataTable
          data={data}
          title="Uploaded Data"
          loading={loading}
          onSort={(columnIndex) => {
            console.log('Sorting column:', columnIndex);
          }}
        />
      ) : (
        <div className="text-center text-muted-foreground">
          Upload a CSV file to view the data
        </div>
      )}
    </div>
  );
}