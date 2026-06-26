export interface Round {
  id: string;
  time: string;
  num: number;
  online: number;
  karta: number;
  clientCount: number;
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
