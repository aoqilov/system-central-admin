export interface CardCounts {
  jami: number;
  asosiy: number;
  online: number;
  vip: number;
  mehmon: number;
  parkXodim: number;
}

export interface Round {
  id: string;
  time: string;
  num: number;
  cards: CardCounts;
  price: number;
  total: number;
}

export interface SmenaInfo {
  number: number;
  openedAt: string;
  operatorName: string;
}

export function fmt(n: number) {
  return n.toLocaleString("uz-UZ");
}
