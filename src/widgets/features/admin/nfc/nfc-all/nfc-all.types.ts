import type { CardType, CardStatus } from "@/types/card.types";

export type { CardType as NfcType, CardStatus };

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
  totalBalance: number;
  byType: Record<CardType, NfcTypeStats>;
  batches: Array<{
    batchId: number;
    batchName: string;
    type: CardType;
    total: number;
    active: number;
    inactive: number;
    blocked: number;
    lost: number;
    frozen: number;
  }>;
}

export const CARD_STATUS_META: Record<
  import("@/types/card.types").CardStatus,
  { label: string; scheme: "gray" | "green" | "blue" | "red" | "yellow" }
> = {
  active: { label: "Активна", scheme: "green" },
  inactive: { label: "Не активна", scheme: "red" },
  blocked: { label: "Заблокирована", scheme: "gray" },
  lost: { label: "Утеряна", scheme: "yellow" },
  frozen: { label: "Заморожена", scheme: "blue" },
};

export const NFC_TYPE_META: Record<
  CardType,
  { label: string; color: string; colorPalette: "blue" | "purple" | "orange" }
> = {
  classic: {
    label: "Classic",
    color: "var(--color-blue)",
    colorPalette: "blue",
  },
  vip: { label: "VIP", color: "var(--color-purple)", colorPalette: "purple" },
  organization: {
    label: "Организация",
    color: "#f97316",
    colorPalette: "orange",
  },
};
