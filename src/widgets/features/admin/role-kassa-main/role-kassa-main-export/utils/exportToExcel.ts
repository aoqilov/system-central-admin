import type { PaymentRow } from "../types";
import { colTotal, grandTotal } from "../types";

interface ExportParams {
  rows: PaymentRow[];
  kassas: string[];
  kartaSold: (number | null)[];
  dateLabel: string;
  parkName: string;
}

export async function exportToExcel({
  rows,
  kassas,
  kartaSold,
  dateLabel,
  parkName,
}: ExportParams): Promise<void> {
  const { Workbook } = await import("exceljs");
  const wb = new Workbook();
  wb.creator = "ParkOps";
  const ws = wb.addWorksheet("Z-Отчёт");

  const colCount = kassas.length + 2;

  ws.columns = [
    { width: 22 },
    ...kassas.map(() => ({ width: 18 })),
    { width: 18 },
  ];

  // ── Title ──
  const titleRow = ws.addRow(["Отчёт по кассовым операциям"]);
  ws.mergeCells(titleRow.number, 1, titleRow.number, colCount);
  titleRow.height = 28;
  titleRow.getCell(1).font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF1F3864" } };
  titleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

  // ── Park / Date ──
  const parkRow = ws.addRow([`Парк: ${parkName}`]);
  ws.mergeCells(parkRow.number, 1, parkRow.number, colCount);
  parkRow.getCell(1).font = { name: "Calibri", size: 11, color: { argb: "FF404040" } };
  parkRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

  const dateInfoRow = ws.addRow([`Дата: ${dateLabel}`]);
  ws.mergeCells(dateInfoRow.number, 1, dateInfoRow.number, colCount);
  dateInfoRow.getCell(1).font = { name: "Calibri", size: 11, color: { argb: "FF404040" } };
  dateInfoRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };

  const spacer = ws.addRow([]);
  spacer.height = 6;

  // ── Header row ──
  const hdr = ws.addRow(["Тип оплаты", ...kassas, "Итого"]);
  hdr.height = 28;
  hdr.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
    cell.font   = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { horizontal: col === 1 ? "left" : "center", vertical: "middle" };
    cell.border = {
      top:    { style: "thin", color: { argb: "FF2D4E8A" } },
      bottom: { style: "thin", color: { argb: "FF2D4E8A" } },
      left:   { style: "thin", color: { argb: "FF2D4E8A" } },
      right:  { style: "thin", color: { argb: "FF2D4E8A" } },
    };
  });

  // ── Data rows ──
  rows.forEach((row, idx) => {
    const rowTotal = row.kassas.reduce((s, k) => s + (k.noDiscount ?? 0), 0);
    const eRow = ws.addRow([row.type, ...row.kassas.map((k) => k.noDiscount), rowTotal]);
    eRow.height = 20;
    const bg = idx % 2 === 0 ? "FFFFFFFF" : "FFEBF3FB";

    eRow.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      cell.font   = { name: "Calibri", size: 11, color: { argb: "FF1F1F1F" } };
      cell.border = {
        top:    { style: "thin", color: { argb: "FFAEB9C8" } },
        bottom: { style: "thin", color: { argb: "FFAEB9C8" } },
        left:   { style: "thin", color: { argb: "FFAEB9C8" } },
        right:  { style: "thin", color: { argb: "FFAEB9C8" } },
      };

      if (col === 1) {
        cell.alignment = { horizontal: "left", vertical: "middle" };
      } else if (col === colCount) {
        cell.numFmt    = "#,##0.00";
        cell.alignment = { horizontal: "right", vertical: "middle" };
        cell.font      = { name: "Calibri", size: 11, bold: true, color: { argb: "FF1F1F1F" } };
      } else {
        if (cell.value === null || cell.value === undefined) {
          cell.value     = "—";
          cell.font      = { name: "Calibri", size: 11, color: { argb: "FF9E9E9E" } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        } else {
          cell.numFmt    = "#,##0.00";
          cell.alignment = { horizontal: "right", vertical: "middle" };
        }
      }
    });
  });

  // ── Итого row ──
  const totRow = ws.addRow([
    "Итого",
    ...kassas.map((_, ki) => colTotal(rows, ki, "noDiscount")),
    grandTotal(rows, "noDiscount"),
  ]);
  totRow.height = 24;
  totRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.fill   = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } };
    cell.font   = { name: "Calibri", size: 11, bold: true, color: { argb: "FF1F3864" } };
    cell.border = {
      top:    { style: "medium", color: { argb: "FF1F3864" } },
      bottom: { style: "medium", color: { argb: "FF1F3864" } },
      left:   { style: "thin",   color: { argb: "FF1F3864" } },
      right:  { style: "thin",   color: { argb: "FF1F3864" } },
    };
    cell.alignment = { horizontal: col === 1 ? "left" : "right", vertical: "middle" };
    if (col > 1) cell.numFmt = "#,##0.00";
  });

  // ── Продано карт row ──
  const kartaSum = kartaSold.reduce<number>((s, n) => s + (n ?? 0), 0);
  const kartaExRow = ws.addRow([
    "Продано карт",
    ...kartaSold.map((n) => (n !== null ? `${n} шт.` : "—")),
    `${kartaSum} шт.`,
  ]);
  kartaExRow.height = 24;
  kartaExRow.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.fill      = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
    cell.font      = { name: "Calibri", size: 11, bold: true, color: { argb: "FF7F6000" } };
    cell.border    = {
      top:    { style: "thin", color: { argb: "FFD6B656" } },
      bottom: { style: "thin", color: { argb: "FFD6B656" } },
      left:   { style: "thin", color: { argb: "FFD6B656" } },
      right:  { style: "thin", color: { argb: "FFD6B656" } },
    };
    cell.alignment = { horizontal: col === 1 ? "left" : "center", vertical: "middle" };
  });

  // ── Download ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href    = url;
  a.download = `Z-otchet_${parkName}_${dateLabel}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
