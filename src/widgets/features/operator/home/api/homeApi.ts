import type { Round, SmenaInfo } from "../types";

export const MOCK_ATTRACTION_NAME = "Junior Jet";

export const MOCK_SMENA: SmenaInfo = {
  number: 3,
  openedAt: "",
  operatorName: "Ahmad Karimov",
};

export const MOCK_ROUNDS: Round[] = [
  { id: "r1", time: "18:26", num: 5, online: 30_000,  karta: 90_000,  clientCount: 8, total: 120_000 },
  { id: "r2", time: "17:23", num: 4, online: 60_000,  karta: 0,       clientCount: 4, total: 60_000  },
  { id: "r3", time: "17:22", num: 3, online: 15_000,  karta: 0,       clientCount: 1, total: 15_000  },
  { id: "r4", time: "16:51", num: 2, online: 0,       karta: 120_000, clientCount: 8, total: 120_000 },
  { id: "r5", time: "14:34", num: 1, online: 18_000,  karta: 0,       clientCount: 1, total: 18_000  },
];
