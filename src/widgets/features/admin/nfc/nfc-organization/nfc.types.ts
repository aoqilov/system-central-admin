export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface Card {
  id: number;
  batch: string;
  card: string;
  nfc: string;
  status: "active" | "inactive" | "blocked" | "lost" | "frozen";
  createdAt: string;
  imported_at: string;
  activatedAt: string | null;
  owner?: string;
}
export type CardStatus = Card["status"];

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

export interface UploadCardsResponse {
  inserted: number;
}

export interface DeleteCardsPayload {
  cardIDs: number[];
}

export interface DeleteCardsResponse {
  success: true;
}

export interface UpdateCardPayload {
  status: CardStatus;
}

export interface UpdateCardResponse {
  card: Card;
}

export const CARD_STATUS_META: Record<
  CardStatus,
  { label: string; scheme: "gray" | "green" | "blue" | "red" }
> = {
  active:   { label: "Активна",       scheme: "green" },
  inactive: { label: "Не активна",    scheme: "gray"  },
  blocked:  { label: "Заблокирована", scheme: "red"   },
  lost:     { label: "Утеряна",       scheme: "red"   },
  frozen:   { label: "Заморожена",    scheme: "blue"  },
};

export const CARD_STATUS_TRANSITIONS: Record<CardStatus, CardStatus[]> = {
  inactive: ["active"],
  active:   ["blocked", "lost", "frozen"],
  blocked:  ["inactive"],
  lost:     ["inactive"],
  frozen:   ["active"],
};
