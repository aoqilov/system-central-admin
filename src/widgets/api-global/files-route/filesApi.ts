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

export interface AttractionFilesResult {
  dashboard_file: number | null;
  main_file: number | null;
  files: number[];
}

// --- API

// Bitta fayl yuklaydi → file id qaytaradi (response: data.files.files[0])
export async function uploadFile(
  file: File,
  fieldName = "files",
): Promise<number> {
  const form = new FormData();
  form.append(fieldName, file);
  const { data } = await api.post<{
    statusCode: number;
    data: { files: AttractionFilesResult };
  }>("/files", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.files.files[0];
}

// Bir nechta fayl yuklaydi → id lar massivini qaytaradi (response: data.files.files)
export async function uploadFiles(
  files: File[],
  fieldName = "files",
): Promise<number[]> {
  const form = new FormData();
  files.forEach((f) => form.append(fieldName, f));

  console.group("📤 uploadFiles()");
  console.log("Files count:", files.length);
  files.forEach((f, i) =>
    console.log(`  [${i}] name=${f.name} size=${f.size}b type=${f.type}`),
  );
  console.log("POST /files → sending...");

  const { data } = await api.post<{
    statusCode: number;
    data: { files: AttractionFilesResult };
  }>("/files", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data.files.files;
}

// Bitta faylni id bo'yicha oladi
export async function fetchFile(id: number): Promise<FileData> {
  const { data } = await api.get<FileResponse>(`/files/${id}`);
  return data.data.file;
}

// Bir nechta faylni id lar ro'yxati bo'yicha oladi
export async function fetchFiles(ids: number[]): Promise<FileData[]> {
  const { data } = await api.get<FilesResponse>("/files", {
    params: { ids: ids.join(",") },
  });
  return data.data.files;
}

// Fayl URL ini qaytaradi (ko'rish uchun)
export function getFileUrl(id: number): string {
  const base = "https://central-park.rzbtech.uz";
  return `${base}/api/v1/files/${id}/view`;
}

// Attraction uchun: main, dashboard va qo'shimcha fayllarni yuklaydi
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
