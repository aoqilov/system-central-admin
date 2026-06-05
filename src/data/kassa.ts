export type KassaStatus = "active" | "inactive" | "maintenance";

export interface Kassa {
  id: number;
  name: string;
  location: string;
  status: KassaStatus;
  cashierId?: number | null;
  note?: string;
}

export const kassaList: Kassa[] = [
  { id: 1, name: "Bosh Kassa", location: "Asosiy kirish", status: "active", cashierId: null },
  { id: 2, name: "Kassa #2", location: "Shimoliy kirish", status: "active", cashierId: 4 },
  { id: 3, name: "Kassa #3", location: "Janubiy kirish", status: "inactive", note: "Bugun ishlamadi" },
  { id: 4, name: "Kassa #4", location: "Suv zonasi", status: "active", cashierId: 7 },
  { id: 5, name: "Kassa #5", location: "Bolalar maydoni", status: "active", cashierId: 9 },
  { id: 6, name: "Kassa #6", location: "Ekstremal zona", status: "maintenance", note: "Texnik xizmat ko'rsatilmoqda" },
  { id: 7, name: "Kassa #7", location: "Markaziy maydon", status: "active", cashierId: 11 },
  { id: 8, name: "Kassa #8", location: "Sharqiy kirish", status: "inactive", note: "Kassir tayinlanmagan" },
];
