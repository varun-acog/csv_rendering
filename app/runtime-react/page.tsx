"use client";

import { useEffect, useState } from 'react';
import { parseCSV } from '@/lib/csvParser';
import { DataTable } from '@/components/ui/data-table';
import type { TableData } from '@/lib/types';

export default function RuntimeReact() {
  const [data, setData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/csv');
        const csvContent = await response.text();
        const parsedData = parseCSV(csvContent);
        setData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Run-time React Component</h1>
        <DataTable
          data={{ headers: [], rows: [] }}
          title="Loading..."
          loading={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Run-time React Component</h1>
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