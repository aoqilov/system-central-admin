export type KassaStatus = "active" | "inactive" | "maintenance";

export interface Kassa {
  id: number;
  name: string;
  location: string;
  status: KassaStatus;
  cashierId?: number | null;
  openedAt?: string;
  closedAt?: string;
  todayRevenue: number;
  todayTransactions: number;
  lastActivity?: string;
  note?: string;
}

export const kassaList: Kassa[] = [
  {
    id: 1,
    name: "Bosh Kassa",
    location: "Asosiy kirish",
    status: "active",
    cashierId: null,
    openedAt: "09:00",
    todayRevenue: 4_850_000,
    todayTransactions: 112,
    lastActivity: "17:42",
  },
  {
    id: 2,
    name: "Kassa #2",
    location: "Shimoliy kirish",
    status: "active",
    cashierId: 4,
    openedAt: "09:15",
    todayRevenue: 3_210_000,
    todayTransactions: 87,
    lastActivity: "17:38",
  },
  {
    id: 3,
    name: "Kassa #3",
    location: "Janubiy kirish",
    status: "inactive",
    openedAt: undefined,
    todayRevenue: 0,
    todayTransactions: 0,
    lastActivity: undefined,
    note: "Bugun ishlamadi",
  },
  {
    id: 4,
    name: "Kassa #4",
    location: "Suv zonasi",
    status: "active",
    cashierId: 7,
    openedAt: "10:00",
    todayRevenue: 2_640_000,
    todayTransactions: 64,
    lastActivity: "17:35",
  },
  {
    id: 5,
    name: "Kassa #5",
    location: "Bolalar maydoni",
    status: "active",
    cashierId: 9,
    openedAt: "09:30",
    todayRevenue: 1_920_000,
    todayTransactions: 53,
    lastActivity: "17:40",
  },
  {
    id: 6,
    name: "Kassa #6",
    location: "Ekstremal zona",
    status: "maintenance",
    openedAt: undefined,
    todayRevenue: 0,
    todayTransactions: 0,
    lastActivity: undefined,
    note: "Texnik xizmat ko'rsatilmoqda",
  },
  {
    id: 7,
    name: "Kassa #7",
    location: "Markaziy maydon",
    status: "active",
    cashierId: 11,
    openedAt: "09:00",
    todayRevenue: 3_780_000,
    todayTransactions: 95,
    lastActivity: "17:44",
  },
  {
    id: 8,
    name: "Kassa #8",
    location: "Sharqiy kirish",
    status: "inactive",
    openedAt: undefined,
    todayRevenue: 0,
    todayTransactions: 0,
    lastActivity: undefined,
    note: "Kassir tayinlanmagan",
  },
];
