"use client";

import React from 'react';
import { TableProps } from '@/lib/types';
import { ArrowUpDown } from 'lucide-react';

export function DataTable({ data, title, onSort, loading }: TableProps) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase border-b bg-muted">
            <tr>
              {data.headers.map((header, index) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left cursor-pointer hover:bg-accent"
                  onClick={() => onSort?.(index)}
                >
                  <div className="flex items-center gap-2">
                    {header}
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}