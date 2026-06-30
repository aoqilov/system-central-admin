import type { CashboxReport } from "./types";

export const KASSA_RAQAMI = 1;

export interface PaySummary {
  naqd: number;
  uzcard: number;
  humo: number;
  uzumbank: number;
  click: number;
  payme: number;
  total: number;
  txCount: number;
  kartaSotildi: number;
  kartaReg: number;
}

export const EMPTY_SUMMARY: PaySummary = {
  naqd: 0, uzcard: 0, humo: 0, uzumbank: 0,
  click: 0, payme: 0, total: 0, txCount: 0,
  kartaSotildi: 0, kartaReg: 0,
};

export function reportToPaySummary(report: CashboxReport | null | undefined): PaySummary {
  if (!report) return EMPTY_SUMMARY;
  return {
    naqd:        report.cash_amount,
    uzcard:      report.uzcard_amount,
    humo:        report.humo_amount,
    uzumbank:    report.uzum_amount,
    click:       report.click_amount,
    payme:       report.payme_amount,
    total:       report.total_amount,
    txCount:     report.transactions_count,
    kartaSotildi: report.activated_cards_count,
    kartaReg:    report.relationed_cards_count,
  };
}

export function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln`;
  return n.toLocaleString();
}

export function buildXHtml(item: CashboxReport, isCopy = false): string {
  const op = `${item.operator.firstname} ${item.operator.lastname}`;
  const s = reportToPaySummary(item);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>X-Otchet</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  html, body { width: 80mm; margin: 0; padding: 4mm; font-family: 'Courier New',monospace; font-size: 9pt; color: #000; background: #fff; }
  .c  { text-align: center; }
  .b  { font-weight: bold; }
  .row { display: flex; justify-content: space-between; font-size: 8.5pt; margin: 2px 0; }
  .sep { border: none; border-top: 1px dashed #000; margin: 6px 0; }
  .stitle { font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; color: #444; }
</style>
</head>
<body>
  <div class="c b" style="font-size:13pt;letter-spacing:2px">KASSA X-OTCHET</div>
  ${isCopy ? `<div class="c b" style="font-size:9pt;color:#dc2626;letter-spacing:2px;margin-top:2px">*** NUSXA / COPY ***</div>` : ""}
  <div class="c" style="font-size:8pt;margin-top:3px">KASSA RAQAMI: ${KASSA_RAQAMI}</div>
  <div class="c" style="font-size:8pt">${item.report_date}</div>
  <hr class="sep">
  <div class="row"><span>Xodim</span><span>${op}</span></div>
  <div class="row"><span>Boshlandi</span><span>${item.opened_at}</span></div>
  ${item.closed_at ? `<div class="row"><span>Yopildi</span><span>${item.closed_at}</span></div>` : ""}
  <hr class="sep">
  <div class="stitle">TO'LOV TURLARI</div>
  <div class="row"><span>Naqd</span><span>${s.naqd.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzCard</span><span>${s.uzcard.toLocaleString()} so'm</span></div>
  <div class="row"><span>Humo</span><span>${s.humo.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzumBank</span><span>${s.uzumbank.toLocaleString()} so'm</span></div>
  <div class="row"><span>Click</span><span>${s.click.toLocaleString()} so'm</span></div>
  <div class="row"><span>Payme</span><span>${s.payme.toLocaleString()} so'm</span></div>
  <hr class="sep">
  <div class="row b" style="font-size:10pt"><span>JAMI</span><span>${s.total.toLocaleString()} so'm</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Tranzaksiyalar</span><span>${s.txCount} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta sotildi</span><span>${s.kartaSotildi} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta reg.</span><span>${s.kartaReg} ta</span></div>
  <hr class="sep">
  <div class="c b" style="font-size:8pt;color:#dc2626;letter-spacing:1px;margin-top:4px">SMENA YOPILDI · ${item.closed_at ?? ""}</div>
  <div class="c" style="font-size:7.5pt;color:#777;margin-top:5px">${item.report_date} ${item.closed_at ?? ""}</div>
</body>
</html>`;
}

export function buildZHtml(report: CashboxReport, isCopy = false): string {
  const op = `${report.operator.firstname} ${report.operator.lastname}`;
  const s = reportToPaySummary(report);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Z-Otchet</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  html, body { width: 80mm; margin: 0; padding: 4mm; font-family: 'Courier New',monospace; font-size: 9pt; color: #000; background: #fff; }
  .c  { text-align: center; }
  .b  { font-weight: bold; }
  .row { display: flex; justify-content: space-between; font-size: 8.5pt; margin: 2px 0; }
  .sep { border: none; border-top: 1px dashed #000; margin: 6px 0; }
  .stitle { font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; color: #444; }
</style>
</head>
<body>
  <div class="c b" style="font-size:13pt;letter-spacing:2px">KASSA Z-OTCHET</div>
  ${isCopy ? `<div class="c b" style="font-size:9pt;letter-spacing:2px;color:#dc2626;margin-top:2px">*** NUSXA / COPY ***</div>` : ""}
  <div class="c" style="font-size:8pt;margin-top:3px">KASSA RAQAMI: ${KASSA_RAQAMI}</div>
  <div class="c" style="font-size:8pt">${report.report_date}</div>
  <hr class="sep">
  <div class="row"><span>Xodim</span><span>${op}</span></div>
  <div class="row"><span>Boshlandi</span><span>${report.opened_at}</span></div>
  <div class="row"><span>Yopildi</span><span>${report.closed_at ?? ""}</span></div>
  <hr class="sep">
  <div class="stitle">TO'LOV TURLARI</div>
  <div class="row"><span>Naqd</span><span>${s.naqd.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzCard</span><span>${s.uzcard.toLocaleString()} so'm</span></div>
  <div class="row"><span>Humo</span><span>${s.humo.toLocaleString()} so'm</span></div>
  <div class="row"><span>UzumBank</span><span>${s.uzumbank.toLocaleString()} so'm</span></div>
  <div class="row"><span>Click</span><span>${s.click.toLocaleString()} so'm</span></div>
  <div class="row"><span>Payme</span><span>${s.payme.toLocaleString()} so'm</span></div>
  <hr class="sep">
  <div class="row b" style="font-size:10pt"><span>JAMI</span><span>${s.total.toLocaleString()} so'm</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Tranzaksiyalar</span><span>${s.txCount} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta sotildi</span><span>${s.kartaSotildi} ta</span></div>
  <div class="row" style="font-size:8pt;color:#555"><span>Karta reg.</span><span>${s.kartaReg} ta</span></div>
  <hr class="sep">
  <div class="c b" style="font-size:8pt;color:#dc2626;letter-spacing:1px;margin-top:4px">SMENA YOPILDI · ${report.closed_at ?? ""}</div>
  <div class="c" style="font-size:7.5pt;color:#777;margin-top:5px">${report.report_date} ${report.closed_at ?? ""}</div>
</body>
</html>`;
}

export function openPrint(html: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank", "width=400,height=600");
  if (!win) { URL.revokeObjectURL(url); return; }
  win.focus();
  setTimeout(() => { win.print(); win.close(); URL.revokeObjectURL(url); }, 300);
}
