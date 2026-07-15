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
import { useCheckNfc } from "./useCheckNfc";

export function useKassaHome() {
  const [qrInfo, setQrInfo] = useState<QrInfo>(EMPTY_QR);
  const [card, setCard] = useState<NfcCard | null>(null);
  const [rightMode, setRightMode] = useState<RightMode>("aktivatsa");
  const [kartaType, setKartaType] = useState<KartaType>("uzcard");
  const [panelKey, setPanelKey] = useState(0);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const { toasts, show: showToast, remove } = useToast();

  const checkNfcMutation = useCheckNfc(
    (c: NfcCard) => {
      setCard(c);
      setQrInfo({
        status: c.status === "active" ? "active" : "no-active",
        raqam: c.card,
        token: c.nfc,
        partiya: c.batch,
        amount: String(c.balance),
        importedAt: c.imported_at,
      });
    },
    (msg) => showToast(msg, "error", false),
  );

  function handleScan(rawNfc: string) {
    checkNfcMutation.mutate(rawNfc);
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
    showToast(message, "success", true);
    setQrInfo(EMPTY_QR);
    setCard(null);
    setPanelKey((k) => k + 1);
  }

  function handleError(message: string) {
    showToast(message, "error", false);
  }

  function handleModeChange(v: string) {
    setRightMode(v as RightMode);
    setPanelKey((k) => k + 1);
  }

  return {
    qrInfo,
    card,
    scanLoading: checkNfcMutation.isPending,
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
    handleError,
    handleModeChange,
  };
}
