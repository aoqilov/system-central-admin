import { useState } from "react";

export type PaymentType = "cash" | "card" | "transfer";

export interface Round {
  id: string;
  startedAt: string;
  paymentType: PaymentType;
  peopleCount: number;
  totalAmount: number;
  attractionName: string;
}

const STORAGE_KEY = "operator_rounds";

export function useRounds() {
  const [rounds, setRounds] = useState<Round[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Round[];
    } catch {
      return [];
    }
  });

  function addRound(data: Omit<Round, "id" | "startedAt">) {
    const newRound: Round = {
      ...data,
      id: `r-${Date.now()}`,
      startedAt: new Date().toISOString(),
    };
    setRounds((prev) => {
      const updated = [newRound, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function clearRounds() {
    setRounds([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { rounds, addRound, clearRounds };
}
