import dayjs from "dayjs";
import type { CashboxReport } from "./types";
import { LOGO_B64 } from "./../../../../../public/icons/logo";

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
  naqd: 0,
  uzcard: 0,
  humo: 0,
  uzumbank: 0,
  click: 0,
  payme: 0,
  total: 0,
  txCount: 0,
  kartaSotildi: 0,
  kartaReg: 0,
};

export function reportToPaySummary(
  report: CashboxReport | null | undefined,
): PaySummary {
  if (!report) return EMPTY_SUMMARY;
  return {
    naqd: report.cash_amount,
    uzcard: report.uzcard_amount,
    humo: report.humo_amount,
    uzumbank: report.uzum_amount,
    click: report.click_amount,
    payme: report.payme_amount,
    total: report.total_amount,
    txCount: report.transactions_count,
    kartaSotildi: report.activated_cards_count,
    kartaReg: report.relationed_cards_count,
  };
}

export function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export function buildXHtml(item: CashboxReport, isCopy = false): string {
  const op = `${item.operator.firstname} ${item.operator.lastname}`;
  const s = reportToPaySummary(item);

  const payRow = (label: string, value: number) => `
    <div class="row"><span>${label}</span><span class="dots"></span><span class="val">${value.toLocaleString("ru-RU")}</span></div>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>X-Otchet</title>
<style>
  @page { size: 80mm auto; margin: 0; }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    box-sizing: border-box;
  }

  html, body {
    width: 80mm;
    margin: 0;
    padding: 3mm 4mm 20mm;
 font-family: 'Arial Black', 'Arial', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    line-height: 1.45;
    color: #000;
    background: #fff;
  }

  .c { text-align: center; }

  .logo {
    display: block;
    margin: 0 auto 2mm;
    width: 48mm;                 /* 384px @ 203dpi = 1:1, scaling yo'q */
    height: auto;
    image-rendering: pixelated;  /* qirralarni yumshatmasin */
  }

  .title {
    font-size: 15pt;
    font-weight: 900;
    letter-spacing: 1px;
    margin-bottom: 1mm;
  }

  .copy {
    font-size: 11pt;
    font-weight: 900;
    border: 2px solid #000;
    padding: 1mm 0;
    margin: 2mm 0;
    letter-spacing: 2px;
  }

  .meta { font-size: 10pt; }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 2mm;
    margin: 1.2mm 0;
    font-size: 10.5pt;
  }

  .row .val {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .row .dots {
    flex: 1;
    border-bottom: 1px dotted #000;
    transform: translateY(-2px);
  }

  .sep {
    border: none;
    border-top: 2px dashed #000;
    margin: 2.5mm 0;
  }

  .stitle {
    font-size: 10pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 1mm 0 1.5mm;
  }

  .total {
    font-size: 14pt;
    font-weight: 900;
    margin: 2mm 0;
  }

  .footer {
    font-size: 12pt;
    font-weight: 900;
    letter-spacing: 1px;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
    padding: 1.5mm 0;
    margin-top: 3mm;
  }
</style>
</head>
<body>
  <img class="logo" src="${LOGO_B64}" alt="">

  <div class="c title">KASSA X-OTCHET</div>
  ${isCopy ? `<div class="c copy">*** NUSXA / COPY ***</div>` : ""}
  <div class="c meta">KASSA RAQAMI: ${KASSA_RAQAMI}</div>
  <div class="c meta">${dayjs(item.report_date).format("DD.MM.YYYY HH:mm")}</div>

  <hr class="sep">

  <div class="row"><span>Xodim</span><span class="val"> #${item.operator.id}</span></div>
  <div class="row"><span>Boshlandi</span><span class="val">${dayjs(item.opened_at).format("DD.MM.YYYY HH:mm")}</span></div>
  ${item.closed_at ? `<div class="row"><span>Yopildi</span><span class="val">${dayjs(item.closed_at).format("DD.MM.YYYY HH:mm")}</span></div>` : ""}

  <hr class="sep">

  <div class="stitle">To'lov turlari (so'm)</div>
  ${payRow("Naqd", s.naqd)}
  ${payRow("UzCard", s.uzcard)}
  ${payRow("Humo", s.humo)}
  ${payRow("UzumBank", s.uzumbank)}
  ${payRow("Click", s.click)}
  ${payRow("Payme", s.payme)}

  <hr class="sep">

  <div class="row total"><span>JAMI</span><span class="val">${s.total.toLocaleString("ru-RU")}</span></div>

  <div class="row"><span>Tranzaksiyalar</span><span class="val">${s.txCount} ta</span></div>
  <div class="row"><span>Karta sotildi</span><span class="val">${s.kartaSotildi} ta</span></div>
  <div class="row"><span>Karta reg.</span><span class="val">${s.kartaReg} ta</span></div>

  ${item.closed_at ? `<div class="c footer">SMENA YOPILDI<br>${dayjs(item.closed_at).format("DD.MM.YYYY HH:mm")}</div>` : ""}
</body>
</html>`;
}
export function buildXHtmlRussian(item: CashboxReport, isCopy = false): string {
  const op = `${item.operator.firstname} ${item.operator.lastname}`;
  const s = reportToPaySummary(item);

  const payRow = (label: string, value: number) => `
    <div class="row"><span>${label}</span><span class="dots"></span><span class="val">${value.toLocaleString("ru-RU")}</span></div>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>X-Отчет</title>
<style>
  @page { size: 80mm auto; margin: 0; }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    box-sizing: border-box;
  }

  html, body {
    width: 80mm;
    margin: 0;
    padding: 3mm 4mm 20mm;
 font-family: 'Arial Black', 'Arial', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    line-height: 1.45;
    color: #000;
    background: #fff;
  }

  .c { text-align: center; }

  .logo {
    display: block;
    margin: 0 auto 2mm;
    width: 48mm;
    height: auto;
    image-rendering: pixelated;
  }

  .title {
    font-size: 15pt;
    font-weight: 900;
    letter-spacing: 1px;
    margin-bottom: 1mm;
  }

  .copy {
    font-size: 11pt;
    font-weight: 900;
    border: 2px solid #000;
    padding: 1mm 0;
    margin: 2mm 0;
    letter-spacing: 2px;
  }

  .meta { font-size: 10pt; }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 2mm;
    margin: 1.2mm 0;
    font-size: 10.5pt;
  }

  .row .val {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .row .dots {
    flex: 1;
    border-bottom: 1px dotted #000;
    transform: translateY(-2px);
  }

  .sep {
    border: none;
    border-top: 2px dashed #000;
    margin: 2.5mm 0;
  }

  .stitle {
    font-size: 10pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 1mm 0 1.5mm;
  }

  .total {
    font-size: 14pt;
    font-weight: 900;
    margin: 2mm 0;
  }

  .footer {
    font-size: 12pt;
    font-weight: 900;
    letter-spacing: 1px;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
    padding: 1.5mm 0;
    margin-top: 3mm;
  }
</style>
</head>
<body>
  <img class="logo" src="${LOGO_B64}" alt="">

  <div class="c title">КАССОВЫЙ X-ОТЧЕТ</div>
  ${isCopy ? `<div class="c copy">*** КОПИЯ ***</div>` : ""}
  <div class="c meta">НОМЕР КАССЫ: ${KASSA_RAQAMI}</div>
  <div class="c meta">${dayjs(item.report_date).format("DD.MM.YYYY HH:mm")}</div>

  <hr class="sep">

  <div class="row"><span>Сотрудник</span><span class="val">#${item.operator.id}</span></div>
  <div class="row"><span>Открытие</span><span class="val">${dayjs(item.opened_at).format("DD.MM.YYYY HH:mm")}</span></div>
  ${item.closed_at ? `<div class="row"><span>Закрытие</span><span class="val">${dayjs(item.closed_at).format("DD.MM.YYYY HH:mm")}</span></div>` : ""}

  <hr class="sep">

  <div class="stitle">Типы оплаты (сум)</div>
  ${payRow("Наличные", s.naqd)}
  ${payRow("UzCard", s.uzcard)}
  ${payRow("Humo", s.humo)}
  ${payRow("UzumBank", s.uzumbank)}
  ${payRow("Click", s.click)}
  ${payRow("Payme", s.payme)}

  <hr class="sep">

  <div class="row total"><span>ИТОГО</span><span class="val">${s.total.toLocaleString("ru-RU")}</span></div>

  <div class="row"><span>Транзакции</span><span class="val">${s.txCount} шт</span></div>
  <div class="row"><span>Карт продано</span><span class="val">${s.kartaSotildi} шт</span></div>
  <div class="row"><span>Карт зарегистрировано</span><span class="val">${s.kartaReg} шт</span></div>

  ${item.closed_at ? `<div class="c footer">СМЕНА ЗАКРЫТА<br>${dayjs(item.closed_at).format("DD.MM.YYYY HH:mm")}</div>` : ""}
</body>
</html>`;
}

export function buildZHtml(report: CashboxReport, isCopy = false): string {
  const op = `${report.operator.firstname} ${report.operator.lastname}`;
  const s = reportToPaySummary(report);

  const payRow = (label: string, value: number) => `
    <div class="row"><span>${label}</span><span class="dots"></span><span class="val">${value.toLocaleString("ru-RU")}</span></div>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Z-Otchet</title>
<style>
  @page { size: 80mm auto; margin: 0; }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    box-sizing: border-box;
  }

  html, body {
    width: 80mm;
    margin: 0;
    padding: 3mm 4mm 20mm;
   font-family: 'Arial Black', 'Arial', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    line-height: 1.45;
    color: #000;
    background: #fff;
  }

  .c { text-align: center; }

  .logo {
    display: block;
    margin: 0 auto 2mm;
    width: 48mm;
    height: auto;
    image-rendering: pixelated;
  }

  .title { font-size: 15pt; font-weight: 900; letter-spacing: 1px; margin-bottom: 1mm; }

  .copy {
    font-size: 11pt;
    font-weight: 900;
    border: 2px solid #000;
    padding: 1mm 0;
    margin: 2mm 0;
    letter-spacing: 2px;
  }

  .meta { font-size: 10pt; }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 2mm;
    margin: 1.2mm 0;
    font-size: 10.5pt;
  }

  .row .val { white-space: nowrap; font-variant-numeric: tabular-nums; }

  .row .dots { flex: 1; border-bottom: 1px dotted #000; transform: translateY(-2px); }

  .sep { border: none; border-top: 2px dashed #000; margin: 2.5mm 0; }

  .stitle {
    font-size: 10pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 1mm 0 1.5mm;
  }

  .total { font-size: 14pt; font-weight: 900; margin: 2mm 0; }

  .footer {
    font-size: 12pt;
    font-weight: 900;
    letter-spacing: 1px;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
    padding: 1.5mm 0;
    margin-top: 3mm;
  }
</style>
</head>
<body>
  <img class="logo" src="${LOGO_B64}" alt="">

  <div class="c title">KASSA Z-OTCHET</div>
  ${isCopy ? `<div class="c copy">*** NUSXA / COPY ***</div>` : ""}
  <div class="c meta">KASSA RAQAMI: ${KASSA_RAQAMI}</div>
  <div class="c meta">${report.report_date}</div>

  <hr class="sep">

  <div class="row"><span>Xodim</span><span class="val">${op} (#${report.operator.id})</span></div>
  <div class="row"><span>Boshlandi</span><span class="val">${dayjs(report.opened_at).format("DD.MM.YYYY HH:mm")}</span></div>
  ${report.closed_at ? `<div class="row"><span>Yopildi</span><span class="val">${dayjs(report.closed_at).format("DD.MM.YYYY HH:mm")}</span></div>` : ""}

  <hr class="sep">

  <div class="stitle">To'lov turlari (so'm)</div>
  ${payRow("Naqd", s.naqd)}
  ${payRow("UzCard", s.uzcard)}
  ${payRow("Humo", s.humo)}
  ${payRow("UzumBank", s.uzumbank)}
  ${payRow("Click", s.click)}
  ${payRow("Payme", s.payme)}

  <hr class="sep">

  <div class="row total"><span>JAMI</span><span class="val">${s.total.toLocaleString("ru-RU")}</span></div>

  <div class="row"><span>Tranzaksiyalar</span><span class="val">${s.txCount} ta</span></div>
  <div class="row"><span>Karta sotildi</span><span class="val">${s.kartaSotildi} ta</span></div>
  <div class="row"><span>Karta reg.</span><span class="val">${s.kartaReg} ta</span></div>

  <hr class="sep" style="border-top: 2px solid #000;">
  <div class="c" style="font-size: 13pt; font-weight: 900; letter-spacing: 1px; padding: 2mm 0;">SMENA YOPILDI<br>${dayjs(report.closed_at || report.report_date).format("DD.MM.YYYY HH:mm")}</div>
  <hr class="sep" style="border-top: 2px solid #000;">
</body>
</html>`;
}

// Ruscha Z-otchet (DOIM original — copy banneri yo'q)
export function buildZHtmlRussian(
  report: CashboxReport,
  isCopy = false,
): string {
  const op = `${report.operator.firstname} ${report.operator.lastname}`;
  const s = reportToPaySummary(report);

  const payRow = (label: string, value: number) => `
    <div class="row"><span>${label}</span><span class="dots"></span><span class="val">${value.toLocaleString("ru-RU")}</span></div>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Z-Отчет</title>
<style>
  @page { size: 80mm auto; margin: 0; }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    box-sizing: border-box;
  }

  html, body {
    width: 80mm;
    margin: 0;
    padding: 3mm 4mm 20mm;
font-family: 'Arial Black', 'Arial', sans-serif;
    font-size: 11pt;
    font-weight: 700;
    line-height: 1.45;
    color: #000;
    background: #fff;
  }

  .c { text-align: center; }

  .logo {
    display: block;
    margin: 0 auto 2mm;
    width: 48mm;
    height: auto;
    image-rendering: pixelated;
  }

  .title { font-size: 15pt; font-weight: 900; letter-spacing: 1px; margin-bottom: 1mm; }

  .copy {
    font-size: 11pt;
    font-weight: 900;
    border: 2px solid #000;
    padding: 1mm 0;
    margin: 2mm 0;
    letter-spacing: 2px;
  }

  .meta { font-size: 10pt; }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 2mm;
    margin: 1.2mm 0;
    font-size: 10.5pt;
  }

  .row .val { white-space: nowrap; font-variant-numeric: tabular-nums; }

  .row .dots { flex: 1; border-bottom: 1px dotted #000; transform: translateY(-2px); }

  .sep { border: none; border-top: 2px dashed #000; margin: 2.5mm 0; }

  .stitle {
    font-size: 10pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 1mm 0 1.5mm;
  }

  .total { font-size: 14pt; font-weight: 900; margin: 2mm 0; }

  .footer {
    font-size: 12pt;
    font-weight: 900;
    letter-spacing: 1px;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
    padding: 1.5mm 0;
    margin-top: 3mm;
  }
</style>
</head>
<body>
  <img class="logo" src="${LOGO_B64}" alt="">

  <div class="c title">КАССОВЫЙ Z-ОТЧЕТ</div>
  ${isCopy ? `<div class="c copy">*** КОПИЯ ***</div>` : ""}
  <div class="c meta">НОМЕР КАССЫ: ${KASSA_RAQAMI}</div>
  <div class="c meta">${dayjs(report.report_date).format("DD.MM.YYYY HH:mm")}</div>

  <hr class="sep">

  <div class="row"><span>Сотрудник</span><span class="val"> (#${report.operator.id})</span></div>
  <div class="row"><span>Открытие</span><span class="val">${dayjs(report.opened_at).format("DD.MM.YYYY HH:mm")}</span></div>
  ${report.closed_at ? `<div class="row"><span>Закрытие</span><span class="val">${dayjs(report.closed_at).format("DD.MM.YYYY HH:mm")}</span></div>` : ""}

  <hr class="sep">

  <div class="stitle">Типы оплаты (сум)</div>
  ${payRow("Наличные", s.naqd)}
  ${payRow("UzCard", s.uzcard)}
  ${payRow("Humo", s.humo)}
  ${payRow("UzumBank", s.uzumbank)}
  ${payRow("Click", s.click)}
  ${payRow("Payme", s.payme)}

  <hr class="sep">

  <div class="row total"><span>ИТОГО</span><span class="val">${s.total.toLocaleString("ru-RU")}</span></div>

  <div class="row"><span>Транзакции</span><span class="val">${s.txCount} шт</span></div>
  <div class="row"><span>Карт продано</span><span class="val">${s.kartaSotildi} шт</span></div>
  <div class="row"><span>Карт зарег.</span><span class="val">${s.kartaReg} шт</span></div>

  <hr class="sep" style="border-top: 2px solid #000;">
  <div class="c" style="font-size: 13pt; font-weight: 900; letter-spacing: 1px; padding: 2mm 0;">СМЕНА ЗАКРЫТА<br>${dayjs(report.closed_at || report.report_date).format("DD.MM.YYYY HH:mm")}</div>
  <hr class="sep" style="border-top: 2px solid #000;">
</body>
</html>`;
}
export function openPrint(html: string) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url);
  if (!win) {
    URL.revokeObjectURL(url);
    return;
  }
  win.onload = () => {
    win.focus();
    win.print();
    win.onafterprint = () => {
      win.close();
      URL.revokeObjectURL(url);
    };
  };
}
