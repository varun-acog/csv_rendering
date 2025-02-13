"use client";

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { TableData } from '@/lib/types';

export default function BrowserCache() {
  const [data, setData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cached-csv', {
          headers: {
            'Cache-Control': 'max-age=3600',
          },
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const csvData = await response.json();
        setData(csvData);
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
        <h1 className="text-2xl font-bold mb-6">Browser Caching</h1>
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
      <h1 className="text-2xl font-bold mb-6">Browser Caching</h1>
      <DataTable
        data={data}
        title="Browser Cached Data"
        loading={loading}
        onSort={(columnIndex) => {
          console.log('Sorting column:', columnIndex);
        }}
      />
    </div>
  );
}