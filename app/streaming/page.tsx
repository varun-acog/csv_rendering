"use client";

import { useEffect, useRef, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { TableData } from '@/lib/types';

export default function Streaming() {
  const [data, setData] = useState<TableData>({ headers: [], rows: [] });
  const [error, setError] = useState<string | null>(null);
  const decoder = useRef(new TextDecoder());
  const buffer = useRef('');
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    abortController.current = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch('/api/stream-csv', {
          signal: abortController.current?.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer.current += decoder.current.decode(value, { stream: true });
          const lines = buffer.current.split('\n');
          
          if (lines.length > 1) {
            buffer.current = lines.pop() || '';
            
            setData(prevData => {
              const newRows = lines.map(line => 
                line.split(',').map(cell => cell.trim())
              );
              
              if (prevData.headers.length === 0 && newRows.length > 0) {
                return {
                  headers: newRows[0],
                  rows: newRows.slice(1)
                };
              }
              
              return {
                headers: prevData.headers,
                rows: [...prevData.rows, ...newRows]
              };
            });
          }
        }

        // Handle any remaining data in the buffer
        if (buffer.current) {
          const finalLine = buffer.current.trim();
          if (finalLine) {
            setData(prevData => ({
              headers: prevData.headers,
              rows: [...prevData.rows, finalLine.split(',').map(cell => cell.trim())]
            }));
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log('Fetch aborted');
          } else {
            setError(error.message);
            console.error('Error streaming data:', error);
          }
        }
      }
    };

    fetchData();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Streaming HTML Table</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Streaming HTML Table</h1>
      <DataTable
        data={data}
        title="Streaming Data"
        onSort={(columnIndex) => {
          console.log('Sorting column:', columnIndex);
        }}
      />
    </div>
  );
}