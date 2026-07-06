// import dayjs from "dayjs";
// import type { TopupTransaction } from "./types";
// import { LOGO_B64 } from "./../../../../../public/icons/logo";
// import { openPrint } from "@/widgets/features/kassa/otchet/otchet.helpers";

// function payLabel(tx: TopupTransaction): string {
//   if (tx.payment_type === "cash") return "Наличные";
//   if (tx.payment_type === "card")
//     return tx.payment_card_type === "humo" ? "Humo" : "UzCard";
//   if (tx.payment_service_type === "payme") return "Payme";
//   if (tx.payment_service_type === "click") return "Click";
//   if (tx.payment_service_type === "uzum") return "Uzum Bank";
//   return "Онлайн";
// }

// export function buildActivationHtml(tx: TopupTransaction): string {
//   console.log(tx);
//   return `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8">
// <title>Чек</title>
// <style>
//   @page { size: 80mm auto; margin: 0; }
//   * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
//   html, body {
//     width: 80mm;
//     margin: 0;
//     padding: 3mm 4mm 20mm;
//     font-family: 'Consolas', 'Menlo', 'Courier New', monospace;
//     font-size: 11pt;
//     font-weight: 700;
//     line-height: 1.45;
//     color: #000;
//     background: #fff;
//   }
//   .c { text-align: center; }
//   .logo { display: block; margin: 0 auto 2mm; width: 25mm; height: auto; image-rendering: pixelated; }
//   .title { font-size: 13pt; font-weight: 900; letter-spacing: 1px; }
//   .sep { border: none; border-top: 2px dashed #000; margin: 2.5mm 0; }
//   .row {
//     display: flex;
//     justify-content: space-between;
//     align-items: baseline;
//     gap: 2mm;
//     margin: 1.5mm 0;
//     font-size: 10.5pt;
//   }
//   .row .dots { flex: 1; border-bottom: 1px dotted #000; transform: translateY(-2px); }
//   .row .val { white-space: nowrap; font-variant-numeric: tabular-nums; }
//   .amount { font-size: 20pt; font-weight: 900; text-align: center; margin: 3mm 0; }
//   .footer { font-size: 10pt; font-weight: 900; text-align: center; letter-spacing: 2px; margin-top: 3mm; }
// </style>
// </head>
// <body>
//   <img class="logo" src="${LOGO_B64}" alt="">
//   <div class="c title">АКТИВАЦИЯ / ПОПОЛНЕНИЕ</div>

//   <hr class="sep">

//   <div class="amount">${tx.amount.toLocaleString("ru-RU")} UZS</div>

//   <hr class="sep">

//   <div class="row"><span>Карта</span><span class="dots"></span><span class="val">${tx.card}</span></div>
//   <div class="row"><span>Тип оплаты</span><span class="dots"></span><span class="val">${payLabel(tx)}</span></div>
//   <div class="row"><span>Баланс до</span><span class="dots"></span><span class="val">${tx.balance_before.toLocaleString("ru-RU")}</span></div>
//   <div class="row"><span>Баланс после</span><span class="dots"></span><span class="val">${tx.balance_after.toLocaleString("ru-RU")}</span></div>
//   <div class="row"><span>Дата</span><span class="dots"></span><span class="val">${dayjs(tx.created_at).format("DD.MM.YYYY HH:mm")}</span></div>
//   <div class="row"><span>№ транз.</span><span class="dots"></span><span class="val">${tx.id}</span></div>

//   <hr class="sep">
//   <div class="footer">Желаем ярких эмоций и отличного дня 🌟</div>
// </body>
// </html>`;
// }

// export { openPrint };
import dayjs from "dayjs";
import type { TopupTransaction } from "./types";
import { LOGO_B64 } from "./../../../../../public/icons/logo";
import { openPrint } from "@/widgets/features/kassa/otchet/otchet.helpers";

function payLabel(tx: TopupTransaction): string {
  if (tx.payment_type === "cash") return "Наличные";
  if (tx.payment_type === "card")
    return tx.payment_card_type === "humo" ? "Humo" : "UzCard";
  if (tx.payment_service_type === "payme") return "Payme";
  if (tx.payment_service_type === "click") return "Click";
  if (tx.payment_service_type === "uzum") return "Uzum Bank";
  return "Онлайн";
}

export function buildActivationHtml(
  tx: TopupTransaction,
  cardPrice?: number,
): string {
  const hasCardPrice = !!cardPrice && cardPrice > 0;
  const total = hasCardPrice ? tx.amount + cardPrice : tx.amount;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Чек</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
  html, body {
    width: 80mm;
    margin: 0;
    padding: 3mm 4mm 20mm;
    font-family: 'Consolas', 'Menlo', 'Courier New', monospace;
    font-size: 11pt;
    font-weight: 700;
    line-height: 1.45;
    color: #000;
    background: #fff;
  }
  .c { text-align: center; }
  .logo { display: block; margin: 0 auto 2mm; width: 25mm; }
  .title { font-size: 13pt; font-weight: 900; letter-spacing: 1px; }
  .sep { border: none; border-top: 2px dashed #000; margin: 2.5mm 0; }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 2mm;
    margin: 1.5mm 0;
    font-size: 10.5pt;
  }
  .row .dots { flex: 1; border-bottom: 1px dotted #000; transform: translateY(-2px); }
  .row .val { white-space: nowrap; font-variant-numeric: tabular-nums; }
  .amount { font-size: 20pt; font-weight: 900; text-align: center; margin: 3mm 0; }
  .total-row { font-size: 12pt; font-weight: 900; }
  .footer { font-size: 10pt; font-weight: 900; text-align: center; margin-top: 3mm; }
</style>
</head>
<body>
  <img class="logo" src="${LOGO_B64}" alt="">
  <div class="c" style="font-size:10.5pt; font-weight:900; margin:1mm 0 0.5mm;">ООО &quot;JET INVEST&quot;</div>
  <div class="c" style="font-size:10pt; font-weight:700; color:#222; margin-bottom:1mm;">г. Ташкент, Мирзо-Улугбекский р-н,<br>ул. МОВАРОУННАХР</div>
  <div class="c title">${hasCardPrice ? "АКТИВАЦИЯ + ПОПОЛНЕНИЕ" : "ПОПОЛНЕНИЕ"}</div>

  <hr class="sep">

  ${
    hasCardPrice
      ? `
    <div class="row">
      <span>Пополнение</span><span class="dots"></span>
      <span class="val">${tx.amount.toLocaleString("ru-RU")} UZS</span>
    </div>
    <div class="row">
      <span>Карта (1 раз)</span><span class="dots"></span>
      <span class="val">${cardPrice!.toLocaleString("ru-RU")} UZS</span>
    </div>
    <hr class="sep">
    <div class="row total-row">
      <span>ИТОГО</span><span class="dots"></span>
      <span class="val">${total.toLocaleString("ru-RU")} UZS</span>
    </div>
  `
      : `
    <div class="amount">${tx.amount.toLocaleString("ru-RU")} UZS</div>
  `
  }

  <hr class="sep" style="margin-top: 5mm;">
  <div class="row"><span>Дата</span><span class="dots"></span><span class="val">${dayjs(tx.created_at).format("DD.MM.YYYY HH:mm")}</span></div>
  <div class="row"><span>Карта</span><span class="dots"></span><span class="val">${tx.card}</span></div>
  <div class="row"><span>Тип оплаты</span><span class="dots"></span><span class="val">${payLabel(tx)}</span></div>
  <div class="row"><span>Баланс до</span><span class="dots"></span><span class="val">${tx.balance_before.toLocaleString("ru-RU")}</span></div>
  <div class="row"><span>Баланс после</span><span class="dots"></span><span class="val">${tx.balance_after.toLocaleString("ru-RU")}</span></div>
  <div class="row"><span>№ транз.</span><span class="dots"></span><span class="val">${tx.id}</span></div>
  <div class="row"><span>Касса</span><span class="dots"></span><span class="val">#${tx.cashbox}</span></div>
  <div class="row"><span>Смена</span><span class="dots"></span><span class="val">#${tx.xreport}</span></div>

  <hr class="sep">

  <div class="footer">
    Хорошего отдыха!<br/>
    Желаем ярких эмоций!
  </div>
</body>
</html>`;
}

export { openPrint };
