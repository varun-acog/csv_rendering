export interface TableData {
  headers: string[];
  rows: any[][];
}

export interface TableProps {
  data: TableData;
  title: string;
  onSort?: (columnIndex: number) => void;
  loading?: boolean;
}

export interface CSVParserOptions {
  delimiter?: string;
  skipHeader?: boolean;
}

export interface CacheConfig {
  ttl: number;
  key: string;
}