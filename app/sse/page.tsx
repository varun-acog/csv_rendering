"use client";

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { TableData } from '@/lib/types';

export default function SSE() {
  const [data, setData] = useState<TableData>({ headers: [], rows: [] });
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    const connect = () => {
      if (retryCount >= maxRetries) {
        setError('Connection failed. Please refresh the page to try again.');
        setIsConnecting(false);
        return;
      }

      try {
        eventSource = new EventSource('/api/sse');
        setIsConnecting(true);

        eventSource.onopen = () => {
          setIsConnecting(false);
          setError(null);
          retryCount = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const newData = JSON.parse(event.data);
            setData(prevData => ({
              headers: prevData.headers.length ? prevData.headers : newData.headers,
              rows: [...prevData.rows, ...newData.rows]
            }));
          } catch (err) {
            console.error('Error parsing SSE data:', err);
            setError('Failed to parse streaming data');
          }
        };

        eventSource.onerror = () => {
          eventSource?.close();
          retryCount++;
          retryTimeout = setTimeout(connect, retryDelay);
        };
      } catch (error) {
        console.error('Error setting up EventSource:', error);
        setError('Failed to establish connection');
        setIsConnecting(false);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearTimeout(retryTimeout);
    };
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Live Updates with SSE</h1>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-100 text-red-800 px-4 py-2 rounded mt-2 hover:bg-red-200 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : null}

      {isConnecting ? (
        <div className="text-blue-700 bg-blue-50 border border-blue-200 px-4 py-3 rounded mb-4">
          Connecting to data stream...
        </div>
      ) : null}

      <DataTable
        data={data}
        title="Live Data Feed"
        loading={isConnecting}
        onSort={(columnIndex) => {
          console.log('Sorting column:', columnIndex);
        }}
      />
    </div>
  );
}