import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  attractions,
  type AttractionCategory,
  type AttractionStatus,
} from "../../../../../data/attractions";
import { employees, EmployeeStatus } from "../../../../../data/employees";
import type { CP } from "../types";

export const STATUS_TO_BADGE: Record<AttractionStatus, "active" | "pending" | "fired"> = {
  open: "active",
  maintenance: "pending",
  closed: "fired",
};

export const CATEGORY_COLOR: Record<AttractionCategory, CP> = {
  thrill: "red",
  family: "blue",
  kids: "green",
  water: "cyan",
  playground: "orange",
  entertainment: "purple",
};

function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function useAttractionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignOpen, setAssignOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);
  const [localOperatorId, setLocalOperatorId] = useState<number | undefined>(undefined);

  const attraction = attractions.find((a) => a.id === Number(id));

  const operatorId = localOperatorId ?? attraction?.relationOperator.mainOperatorId;
  const operator = operatorId ? (employees.find((e) => e.id === operatorId) ?? null) : null;

  const helpers = attraction
    ? (attraction.relationOperator.helperOperatorIds ?? [])
        .map(({ id, relationdate }) => ({
          emp: employees.find((e) => e.id === id),
          relationdate,
        }))
        .filter(
          (h): h is { emp: NonNullable<typeof h.emp>; relationdate: string } => !!h.emp,
        )
    : [];

  const visitorChartData = (attraction?.statsVisitors ?? []).map((s) => ({
    day: shortDate(s.date),
    visitors: s.count,
  }));

  const revenueChartData = (attraction?.statsRevenue ?? []).map((s) => ({
    day: shortDate(s.date),
    revenue: s.amount,
  }));

  const connectedDate = operator?.createdAt ?? "";
  const connectedDays = connectedDate
    ? Math.round(
        (new Date("2026-06-02").getTime() - new Date(connectedDate).getTime()) / 86400000,
      )
    : 0;

  const assignCandidates = employees.filter((e) => e.status === EmployeeStatus.ACTIVE);

  function handleAssign() {
    if (selectedEmp !== null) {
      setLocalOperatorId(selectedEmp);
      setAssignOpen(false);
      setSelectedEmp(null);
    }
  }

  return {
    attraction,
    operator,
    helpers,
    visitorChartData,
    revenueChartData,
    connectedDate,
    connectedDays,
    assignCandidates,
    assignOpen,
    setAssignOpen,
    historyOpen,
    setHistoryOpen,
    selectedEmp,
    setSelectedEmp,
    handleAssign,
    navigate,
  };
}
