export function parseCSV(csvContent: string, options: { delimiter?: string } = {}): {
  headers: string[];
  rows: string[][];
} {
  const delimiter = options.delimiter || ',';
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(delimiter).map(header => header.trim());
  const rows = lines.slice(1).map(line => 
    line.split(delimiter).map(cell => cell.trim())
  );

  return { headers, rows };
}

export function csvToHTML(csvData: { headers: string[]; rows: string[][] }): string {
  const headerRow = csvData.headers
    .map(header => `<th>${header}</th>`)
    .join('');
  
  const bodyRows = csvData.rows
    .map(row => row.map(cell => `<td>${cell}</td>`).join(''))
    .map(row => `<tr>${row}</tr>`)
    .join('');

  return `
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>${headerRow}</tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        ${bodyRows}
      </tbody>
    </table>
  `;
}