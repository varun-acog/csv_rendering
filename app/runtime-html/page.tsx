"use client";

import { useEffect, useRef } from 'react';
import { parseCSV, csvToHTML } from '@/lib/csvParser';

export default function RuntimeHTML() {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Simulating CSV fetch
      const response = await fetch('/api/csv');
      const csvContent = await response.text();
      const csvData = parseCSV(csvContent);
      const tableHTML = csvToHTML(csvData);
      
      if (tableRef.current) {
        tableRef.current.innerHTML = tableHTML;
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Run-time HTML Table</h1>
      <div ref={tableRef} className="rounded-lg border bg-card" />
    </div>
  );
}