import * as XLSX from "xlsx";
import { type AttractionRow } from "../types";

interface ExportParams {
  rows: AttractionRow[];
  filename: string;
}

export function exportToExcel({ rows, filename }: ExportParams) {
  const totalPaid = rows.reduce((s, r) => s + r.paid, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.total, 0);

  // 10 columns: #, Привлечение, Round, Всего, Offline, Online, VIP, Организация, Оплачено, Итого
  const header1 = [
    "#",
    "Привлечение",
    "Round",
    "Тип карты",
    "",
    "",
    "",
    "",
    "Оплачено",
    "Итого",
  ];
  const header2 = [
    "",
    "",
    "",
    "Всего",
    "Offline",
    "Online",
    "VIP",
    "Организация",
    "",
    "",
  ];

  const dataRows = rows.map((r, i) => [
    i + 1,
    r.name,
    r.roundCount,
    r.cards.jami || 0,
    r.cards.asosiy || 0,
    r.cards.online || 0,
    r.cards.vip || 0,
    r.cards.organization || 0,
    r.paid,
    r.total,
  ]);

  const footerRow = [
    "Итого",
    "",
    "",
    rows.reduce((s, r) => s + r.cards.jami, 0),
    rows.reduce((s, r) => s + r.cards.asosiy, 0),
    rows.reduce((s, r) => s + r.cards.online, 0),
    rows.reduce((s, r) => s + r.cards.vip, 0),
    rows.reduce((s, r) => s + r.cards.organization, 0),
    totalPaid,
    totalRevenue,
  ];

  const ws = XLSX.utils.aoa_to_sheet([
    header1,
    header2,
    ...dataRows,
    footerRow,
  ]);

  const lastRow = 2 + rows.length;
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // #
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Привлечение
    { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Round
    { s: { r: 0, c: 3 }, e: { r: 0, c: 7 } }, // Тип карты (5 cols)
    { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } }, // Оплачено
    { s: { r: 0, c: 9 }, e: { r: 1, c: 9 } }, // Итого
    { s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 2 } }, // Итого footer
  ];

  ws["!cols"] = [
    { wch: 5 },
    { wch: 26 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Отчёт");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
