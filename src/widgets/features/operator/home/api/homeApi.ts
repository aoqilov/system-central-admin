import type { CardCounts, Round, SmenaInfo } from "../types";

export const MOCK_ATTRACTION_NAME = "Junior Jet";

export const MOCK_SMENA: SmenaInfo = {
  number: 3,
  openedAt: "",
  operatorName: "Ahmad Karimov",
};

function cards(asosiy: number, online: number, vip: number, mehmon: number, parkXodim: number): CardCounts {
  return { jami: asosiy + online + vip + mehmon + parkXodim, asosiy, online, vip, mehmon, parkXodim };
}

export const MOCK_ROUNDS: Round[] = [
  { id: "r1", time: "18:26", num: 5, cards: cards(4, 2, 1, 1, 0), price: 15_000, total: 120_000 },
  { id: "r2", time: "17:23", num: 4, cards: cards(3, 1, 0, 0, 0), price: 15_000, total:  60_000 },
  { id: "r3", time: "17:22", num: 3, cards: cards(1, 0, 0, 0, 0), price: 15_000, total:  15_000 },
  { id: "r4", time: "16:51", num: 2, cards: cards(5, 0, 2, 1, 0), price: 15_000, total: 120_000 },
  { id: "r5", time: "14:34", num: 1, cards: cards(1, 0, 0, 0, 0), price: 15_000, total:  15_000 },
];
