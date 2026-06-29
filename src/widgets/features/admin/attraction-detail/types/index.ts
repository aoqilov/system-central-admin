import type { ElementType } from "react";

// ─── UI helpers ───────────────────────────────────────────────────────────────

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

// ─── API types ────────────────────────────────────────────────────────────────

export interface AttractionOperatorItem {
  id: number;
  firstname: string;
  lastname: string;
  file: number;
  type: "main" | "assistant";
}

export type AttractionStatus = "active" | "inactive" | "maintenance" | "closed";

export interface AttractionDetail {
  id: number;
  name: string;
  manufacturer: string;
  category: number;
  status: AttractionStatus;
  dashboard_file: number | null;
  main_file: number | null;
  files: number[];
  price: number;
  duration: number;
  seats: number;
  age_limit: number;
  min_height: number;
  max_weight: number;
  description: string;
  operators: AttractionOperatorItem[];
}

export interface AttractionDetailResponse {
  statusCode: number;
  data: {
    attraction: AttractionDetail;
  };
}

// ─── Assign operator ──────────────────────────────────────────────────────────

export type AttractionOperatorType = "main" | "assistant";

export interface AttractionOperatorRecord {
  id: number;
  attraction: number;
  type: AttractionOperatorType;
  status: "active" | "inactive";
  operator: {
    id: number;
    firstname: string;
    lastname: string;
    file: number | null;
  };
}

export interface AssignAttractionOperatorBody {
  operator: number;
  type: AttractionOperatorType;
}

export interface AssignAttractionOperatorResponse {
  statusCode: number;
  data: {
    "attraction-operator": AttractionOperatorRecord;
  };
}
