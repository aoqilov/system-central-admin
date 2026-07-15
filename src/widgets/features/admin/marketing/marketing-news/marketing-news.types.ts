export type NewsStatus = "planned" | "active" | "archived";

export interface NewsItem {
  id: number;
  title: string;
  paragraph: string;
  main_image: string | null;
  likes: number;
  views: number;
  created_at: string;
  expired_at: string;
  status: NewsStatus;
}

export interface CreateNewsPayload {
  title: string;
  paragraph: string;
  main_image: File | null;
  expired_at: string;
  status: NewsStatus;
}

export interface UpdateNewsPayload extends Partial<CreateNewsPayload> {
  status?: NewsStatus;
}
