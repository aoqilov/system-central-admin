export type RightMode = "aktivatsa" | "karta" | "relation";
export type CardScanStatus = "empty" | "scanning" | "active" | "blocked" | "expired" | "error";
export type PayType = "naqd" | "karta" | "online";
export type KartaType = "uzcard" | "humo";

export interface QrInfo {
  status: "active" | "no-active" | null;
  raqam: string;
  token: string;
  partiya: string;
  amount: string;
}

export const EMPTY_QR: QrInfo = {
  status: null,
  raqam: "",
  token: "",
  partiya: "",
  amount: "",
};

export interface PendingItem {
  id: string;
  qrInfo: QrInfo;
  savedAt: Date;
}
