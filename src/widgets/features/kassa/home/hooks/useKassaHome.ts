import { useState } from "react";
import {
  type RightMode,
  type KartaType,
  type QrInfo,
  type PendingItem,
  type NfcCard,
  EMPTY_QR,
} from "../types";
import { useToast } from "./useToast";
import { checkNfc } from "../api/apiKassaHomePay";

export function useKassaHome() {
  const [qrInfo, setQrInfo]         = useState<QrInfo>(EMPTY_QR);
  const [card, setCard]             = useState<NfcCard | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [rightMode, setRightMode]   = useState<RightMode>("aktivatsa");
  const [kartaType, setKartaType]   = useState<KartaType>("uzcard");
  const [panelKey, setPanelKey]     = useState(0);
  const [pending, setPending]       = useState<PendingItem[]>([]);
  const { toasts, show: showToast, remove } = useToast();

  async function handleScan(nfc: string) {
    setScanLoading(true);
    try {
      const res = await checkNfc(nfc);
      const c = res.data.card;
      setCard(c);
      setQrInfo({
        status: c.status === "active" ? "active" : "no-active",
        raqam: c.card,
        token: c.nfc,
        partiya: c.batch,
        amount: String(c.balance),
      });
    } catch {
      showToast("NFC karta topilmadi", "error");
      setCard(null);
      setQrInfo(EMPTY_QR);
    } finally {
      setScanLoading(false);
    }
  }

  function handleClear() {
    setQrInfo(EMPTY_QR);
    setCard(null);
  }

  function handleNewOperation() {
    setQrInfo(EMPTY_QR);
    setCard(null);
    setPanelKey((k) => k + 1);
  }

  function handlePark() {
    if (!qrInfo.raqam) return;
    setPending((prev) => [
      ...prev,
      { id: Date.now().toString(), qrInfo, savedAt: new Date() },
    ]);
    setQrInfo(EMPTY_QR);
    setCard(null);
    setPanelKey((k) => k + 1);
  }

  function handleRestorePending(id: string) {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    if (qrInfo.raqam) {
      setPending((prev) =>
        prev.map((p) => (p.id === id ? { ...p, qrInfo } : p)),
      );
    } else {
      setPending((prev) => prev.filter((p) => p.id !== id));
    }
    setQrInfo(item.qrInfo);
    setCard(null);
  }

  function handleRemovePending(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  function handleSuccess(message: string) {
    showToast(message, "success");
    setQrInfo(EMPTY_QR);
    setCard(null);
    setPanelKey((k) => k + 1);
  }

  function handleModeChange(v: string) {
    setRightMode(v as RightMode);
    setPanelKey((k) => k + 1);
  }

  return {
    qrInfo,
    card,
    scanLoading,
    rightMode,
    kartaType,
    setKartaType,
    panelKey,
    toasts,
    pending,
    removeToast: remove,
    handleScan,
    handleClear,
    handleNewOperation,
    handlePark,
    handleRestorePending,
    handleRemovePending,
    handleSuccess,
    handleModeChange,
  };
}
