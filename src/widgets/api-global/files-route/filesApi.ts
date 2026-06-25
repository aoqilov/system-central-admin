import api from "@/api-config/axiosInstance";

// --- Types
export interface FileData {
  id: number;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface FileResponse {
  statusCode: number;
  data: {
    file: FileData;
  };
}

export interface FilesResponse {
  statusCode: number;
  data: {
    files: FileData[];
  };
}

// --- API

export interface AttractionFilesResult {
  dashboard_file: number | null;
  main_file: number | null;
  files: number[];
}

export async function uploadAttractionFiles(params: {
  main_file?: File | null;
  dashboard_file?: File | null;
  files?: File[];
}): Promise<AttractionFilesResult> {
  const form = new FormData();
  if (params.main_file) form.append("main_file", params.main_file);
  if (params.dashboard_file)
    form.append("dashboard_file", params.dashboard_file);
  (params.files ?? []).forEach((f) => form.append("files", f));
  const { data } = await api.post<{
    statusCode: number;
    data: { files: AttractionFilesResult };
  }>("/files", form, { headers: { "Content-Type": "multipart/form-data" } });
  return data.data.files;
}

export async function fetchFile(id: number): Promise<FileData> {
  const { data } = await api.get<FileResponse>(`/files/${id}`);
  return data.data.file;
}

export async function fetchFiles(ids: number[]): Promise<FileData[]> {
  const { data } = await api.get<FilesResponse>("/files", {
    params: { ids: ids.join(",") },
  });
  return data.data.files;
}

export function getFileUrl(id: number): string {
  const base = import.meta.env.VITE_API_URL ?? "";
  return `${base}/api/v1/files/${id}/view`;
}
