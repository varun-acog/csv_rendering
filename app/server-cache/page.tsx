"use client";

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { TableData } from '@/lib/types';

export default function ServerCache() {
  const [data, setData] = useState<TableData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cached-csv');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Server-Side Caching</h1>
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
      <h1 className="text-2xl font-bold mb-6">Server-Side Caching</h1>
      <DataTable
        data={data}
        title="Cached Data"
        onSort={(columnIndex) => {
          console.log('Sorting column:', columnIndex);
        }}
      />
    </div>
  );
}