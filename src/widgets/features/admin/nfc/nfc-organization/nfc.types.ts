export type { Card, CardStatus } from "@/types/card.types";

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

export const CARD_STATUS_TRANSITIONS: Record<
  import("@/types/card.types").CardStatus,
  import("@/types/card.types").CardStatus[]
> = {
  inactive: ["active"],
  active: ["blocked", "lost", "frozen"],
  blocked: ["inactive"],
  lost: ["inactive"],
  frozen: ["active"],
};
