export interface FileData {
  id: number;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface AttractionFilesResult {
  dashboard_file: number | null;
  main_file: number | null;
  files: number[];
}
