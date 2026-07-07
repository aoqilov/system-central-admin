export type NfcType = "classic" | "vip" | "org";
export type CardStatus = "active" | "inactive" | "blocked" | "lost" | "frozen";

export interface UnifiedCard {
  uid: string;
  id: number;
  type: NfcType;
  batch: string;
  batchName?: string;
  card: string;
  nfc: string;
  status: CardStatus;
  owner?: string;
  imported_at: string;
  activatedAt: string | null;
}

export interface NfcTypeStats {
  total: number;
  active: number;
  inactive: number;
  blocked: number;
  lost: number;
  frozen: number;
}

export interface NfcAllStats {
  total: NfcTypeStats;
  byType: Record<NfcType, NfcTypeStats>;
  batches: Array<{
    batchId: number;
    batchName: string;
    type: NfcType;
    total: number;
    active: number;
    inactive: number;
    blocked: number;
    lost: number;
    frozen: number;
  }>;
}

export interface GetAllCardsQuery {
  search?: string;
  type?: NfcType | "all";
  status?: CardStatus | "all";
  page?: number;
  limit?: number;
}

export interface GetAllCardsResponse {
  cards: UnifiedCard[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
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

export const NFC_TYPE_META: Record<
  NfcType,
  { label: string; color: string; colorPalette: "blue" | "purple" | "orange" }
> = {
  classic: { label: "Classic",     color: "var(--color-blue)",   colorPalette: "blue"   },
  vip:     { label: "VIP",         color: "var(--color-purple)", colorPalette: "purple" },
  org:     { label: "Организация", color: "#f97316",             colorPalette: "orange" },
};
