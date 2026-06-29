export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface Card {
  id: number;
  code: string;
  status: "active" | "inactive" | "blocked" | "lost" | "frozen";
  createdAt: string;
}

export type CardStatus = Card["status"];

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface BatchStat {
  batch: number;
  batchName: string;
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  lost: number;
  frozen: number;
  tethered: number;
}

export interface GetCardsStatsResponse {
  card_stats: BatchStat[];
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface GetCardsQuery {
  search?: string;
  statuses?: string;
  batch?: number;
  page?: number;
  limit?: number;
}

export interface CardsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCardsResponse {
  cards: Card[];
  pagination: CardsPagination;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadCardsResponse {
  inserted: number;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export interface DeleteCardsPayload {
  cardIDs: number[];
}

export interface DeleteCardsResponse {
  success: true;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export interface UpdateCardPayload {
  status: CardStatus;
}

export interface UpdateCardResponse {
  card: Card;
}

// ─── UI constants ─────────────────────────────────────────────────────────────

export const CARD_STATUS_META: Record<
  CardStatus,
  { label: string; scheme: "gray" | "green" | "blue" | "red" }
> = {
  active:   { label: "Faol",       scheme: "green" },
  inactive: { label: "Faolsiz",    scheme: "gray"  },
  blocked:  { label: "Bloklangan", scheme: "red"   },
  lost:     { label: "Yo'qolgan",  scheme: "red"   },
  frozen:   { label: "Muzlatilgan", scheme: "blue" },
};

export const CARD_STATUS_TRANSITIONS: Record<CardStatus, CardStatus[]> = {
  inactive: ["active"],
  active:   ["blocked", "lost", "frozen"],
  blocked:  ["inactive"],
  lost:     ["inactive"],
  frozen:   ["active"],
};
