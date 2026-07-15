import type { Attraction } from "@/widgets/features/admin/attractions/types";

export type { Attraction };

// ── Aksiya ────────────────────────────────────────────────────────────────────

export type AksiyaStatus = "active" | "plan" | "archive";

export interface AksiyaItem {
  id: number;
  title: string;
  description: string;
  main_image: string | null;
  from: string;       // YYYY-MM-DD
  to: string;         // YYYY-MM-DD
  discount: number;   // percent 0..100
  status: AksiyaStatus;
  created_at: string;
  attractions: { id: number; qty: number }[];
}

export interface CreateAksiyaPayload {
  title: string;
  description: string;
  main_image: File | null;
  from: string;
  to: string;
  discount: number;
  status: AksiyaStatus;
  attractions: { id: number; qty: number }[];
}

export interface UpdateAksiyaPayload extends Partial<CreateAksiyaPayload> {}

// ── Package builder ───────────────────────────────────────────────────────────

// id → quantity (uncommitted selection)
export type Draft = Record<number, number>;

export interface PackageItem {
  id: number;
  qty: number;
}

export interface DiscountRule {
  from: string;      // YYYY-MM-DD, can be ""
  to: string;        // YYYY-MM-DD, can be ""
  discount: number;  // 0..100 integer
}

export interface DiscountDraft {
  from: string;
  to: string;
  discount: number;
}

// Derived preview line — never stored in state
export interface PreviewLine {
  id: number;
  qty: number;
  attraction: Attraction;
  unitPrice: number;
  lineOriginal: number;
  lineFinal: number;
}
