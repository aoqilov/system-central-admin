export type MemoryCategory = "events" | "nature" | "guests" | "other";

export interface MemoryItem {
  id: number;
  title: string;
  description: string;
  category: MemoryCategory;
  date: string;
  photo_count: number;
  like_count: number;
  view_count: number;
  thumbnail: string | null;
}

export interface CreateMemoryPayload {
  title: string;
  description: string;
  category: MemoryCategory;
  date: string;
  photo_count: number;
  thumbnail: File | null;
}

export type UpdateMemoryPayload = Partial<CreateMemoryPayload>;
