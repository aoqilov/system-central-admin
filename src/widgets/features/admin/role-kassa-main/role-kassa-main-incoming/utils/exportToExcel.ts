import type { DailyZReport, ZReportStatus } from "../types";

const STATUS_LABEL: Record<ZReportStatus, string> = {
  open:      "Активная",
  closed:    "Ожидание",
  confirmed: "Подтверждено",
  cancelled: "Отказ",
};

const STATUS_COLOR: Record<ZReportStatus, string> = {
  open:      "FF3B82F6",
  closed:    "FF6B7280",
  confirmed: "FF22C55E",
  cancelled: "FFEF4444",
};

interface ExportParams {
  reports: DailyZReport[];
  dateLabel: string;
  parkName: string;
}

export async function exportToExcel({
  reports,
  dateLabel,
  parkName,
}: ExportParams): Promise<void> {
  const { Workbook } = await import("exceljs");
  const wb = new Workbook();
  wb.creator = "ParkOps";
  const ws = wb.addWorksheet("Z-Отчёты");

  const COLS = 12;

  ws.columns = [
    { width: 22 }, // Касса
    { width: 16 }, // Статус
    { width: 18 }, // Выручка
    { width: 16 }, // Наличные
    { width: 14 }, // UzCard
    { width: 14 }, // Humo
    { width: 14 }, // UzumBank
    { width: 14 }, // Click
    { width: 14 }, // Payme
    { width: 14 }, // Продано карт
    { width: 12 }, // Рег. карт
    { width: 18 }, // Транзакции
  ];

  // ── Title ──
  const titleRow = ws.addRow(["Приём Z-отчётов"]);
  ws.mergeCells(titleRow.number, 1, titleRow.number, COLS);
  titleRow.height = 28;
  titleRow.getCell(1).font      = { name: "Calibri", size: 14, bold: true, color: { argb: "FF1F3864" } };
  titleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

  const parkRow = ws.addRow([`Парк: ${parkName}`]);
  ws.mergeCells(parkRow.number, 1, parkRow.number, COLS);
  parkRow.getCell(1).font      = { name: "Calibri", size: 11, color: { argb: "FF404040" } };
  parkRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

  const dateRow = ws.addRow([`Дата: ${dateLabel}`]);
  ws.mergeCells(dateRow.number, 1, dateRow.number, COLS);
  dateRow.getCell(1).font      = { name: "Calibri", size: 11, color: { argb: "FF404040" } };
  dateRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

  const spacer = ws.addRow([]);
  spacer.height = 6;

  // ── Header ──
  const hdr = ws.addRow([
    "Касса", "Статус", "Выручка", "Наличные",
    "UzCard", "Humo", "UzumBank", "Click", "Payme",
    "Продано карт", "Рег. карт", "Транзакции",
  ]);
  hdr.height = 28;
  hdr.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
    cell.font      = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { horizontal: col <= 2 ? "left" : "center", vertical: "middle" };
    cell.border    = {
      top:    { style: "thin", color: { argb: "FF2D4E8A" } },
      bottom: { style: "thin", color: { argb: "FF2D4E8A" } },
      left:   { style: "thin", color: { argb: "FF2D4E8A" } },
      right:  { style: "thin", color: { argb: "FF2D4E8A" } },
    };
  });

  // ── Data rows ──
  reports.forEach((r, idx) => {
    const statusColor = STATUS_COLOR[r.status] ?? "FF6B7280";
    const bg = idx % 2 === 0 ? "FFFFFFFF" : "FFEBF3FB";

    const row = ws.addRow([
      r.cashbox_name,
      STATUS_LABEL[r.status] ?? r.status,
      r.total_amount,
      r.cash_amount,
      r.uzcard_amount,
      r.humo_amount,
      r.uzum_amount,
      r.click_amount,
      r.payme_amount,
      r.activated_cards_count,
      r.relationed_cards_count,
      r.transactions_count,
    ]);
    row.height = 20;

    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      cell.font   = { name: "Calibri", size: 10, color: { argb: "FF1F1F1F" } };
      cell.border = {
        top:    { style: "thin", color: { argb: "FFAEB9C8" } },
        bottom: { style: "thin", color: { argb: "FFAEB9C8" } },
        left:   { style: "thin", color: { argb: "FFAEB9C8" } },
        right:  { style: "thin", color: { argb: "FFAEB9C8" } },
      };

      if (col === 1) {
        cell.alignment = { horizontal: "left", vertical: "middle" };
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF1F1F1F" } };
      } else if (col === 2) {
        cell.font      = { name: "Calibri", size: 10, bold: true, color: { argb: statusColor } };
        cell.alignment = { horizontal: "left", vertical: "middle" };
      } else if (col >= 3 && col <= 9) {
        cell.numFmt    = "#,##0.00";
        cell.alignment = { horizontal: "right", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      }
    });
  });

  // ── Totals row ──
  if (reports.length > 0) {
    const sum = (fn: (r: DailyZReport) => number) =>
      reports.reduce((s, r) => s + fn(r), 0);

    const totRow = ws.addRow([
      "Итого",
      "",
      sum((r) => r.total_amount),
      sum((r) => r.cash_amount),
      sum((r) => r.uzcard_amount),
      sum((r) => r.humo_amount),
      sum((r) => r.uzum_amount),
      sum((r) => r.click_amount),
      sum((r) => r.payme_amount),
      sum((r) => r.activated_cards_count),
      sum((r) => r.relationed_cards_count),
      sum((r) => r.transactions_count),
    ]);
    totRow.height = 24;
    totRow.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } };
      cell.font      = { name: "Calibri", size: 10, bold: true, color: { argb: "FF1F3864" } };
      cell.border    = {
        top:    { style: "medium", color: { argb: "FF1F3864" } },
        bottom: { style: "medium", color: { argb: "FF1F3864" } },
        left:   { style: "thin",   color: { argb: "FF1F3864" } },
        right:  { style: "thin",   color: { argb: "FF1F3864" } },
      };
      cell.alignment = { horizontal: col <= 2 ? "left" : "right", vertical: "middle" };
      if (col >= 3 && col <= 9) cell.numFmt = "#,##0.00";
    });
  }

  // ── Возврат карт row ──
  const vozvratRow = ws.addRow([
    "Возврат карт",
    "",
    "", "", "", "", "", "", "",
    0,
    "",
    "",
  ]);
  vozvratRow.height = 24;
  vozvratRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDE8E8" } };
    cell.font      = { name: "Calibri", size: 10, bold: true, color: { argb: "FFEF4444" } };
    cell.border    = {
      top:    { style: "thin", color: { argb: "FFEF4444" } },
      bottom: { style: "thin", color: { argb: "FFEF4444" } },
      left:   { style: "thin", color: { argb: "FFEF4444" } },
      right:  { style: "thin", color: { argb: "FFEF4444" } },
    };
    cell.alignment = { horizontal: col <= 2 ? "left" : "center", vertical: "middle" };
  });

  // ── Download ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = `Z-otchetlar_${parkName}_${dateLabel}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
