import api from "@/api-config/axiosInstance";
import type { FileData, AttractionFilesResult } from "@/types/file.types";

const BASE_URL = import.meta.env.VITE_API_URL;

export function getFileUrl(id: number): string {
  return `${BASE_URL}/api/v1/files/${id}/view`;
}

export async function uploadFile(
  file: File,
  fieldName = "files",
): Promise<number> {
  const form = new FormData();
  form.append(fieldName, file);
  const { data } = await api.post<{
    statusCode: number;
    data: { files: AttractionFilesResult };
  }>("/files", form, { headers: { "Content-Type": "multipart/form-data" } });
  return data.data.files.files[0];
}

export async function uploadFiles(
  files: File[],
  fieldName = "files",
): Promise<number[]> {
  const form = new FormData();
  files.forEach((f) => form.append(fieldName, f));
  const { data } = await api.post<{
    statusCode: number;
    data: { files: AttractionFilesResult };
  }>("/files", form, { headers: { "Content-Type": "multipart/form-data" } });
  return data.data.files.files;
}

export async function fetchFile(id: number): Promise<FileData> {
  const { data } = await api.get<{
    statusCode: number;
    data: { file: FileData };
  }>(`/files/${id}`);
  return data.data.file;
}

export async function fetchFiles(ids: number[]): Promise<FileData[]> {
  const { data } = await api.get<{
    statusCode: number;
    data: { files: FileData[] };
  }>("/files", { params: { ids: ids.join(",") } });
  return data.data.files;
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
