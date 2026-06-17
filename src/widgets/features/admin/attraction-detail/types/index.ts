import type { ElementType } from "react";

export type CP =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "cyan"
  | "purple"
  | "pink";

export interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

export interface RestrictionRow {
  icon: ElementType;
  label: string;
  value: string;
}
