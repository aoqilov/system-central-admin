import { useState } from "react";
import { type RightMode, type KartaType, type QrInfo, type PendingItem, EMPTY_QR } from "../types";
import { useToast } from "./useToast";

export function useKassaHome() {
  const [qrInfo, setQrInfo] = useState<QrInfo>(EMPTY_QR);
  const [rightMode, setRightMode] = useState<RightMode>("aktivatsa");
  const [kartaType, setKartaType] = useState<KartaType>("uzcard");
  const [panelKey, setPanelKey] = useState(0);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const { toasts, show: showToast, remove } = useToast();

  function handleScan(scannedValue: string) {
    setQrInfo({
      status: "active",
      raqam: scannedValue,
      token: "TKN-8F3D-A12C",
      partiya: "B2-007",
      amount: "45 000",
    });
  }

  function handleClear() {
    setQrInfo(EMPTY_QR);
  }

  function handleNewOperation() {
    setQrInfo(EMPTY_QR);
    setPanelKey((k) => k + 1);
  }

  function handlePark() {
    if (!qrInfo.raqam) return;
    setPending((prev) => [
      ...prev,
      { id: Date.now().toString(), qrInfo, savedAt: new Date() },
    ]);
    setQrInfo(EMPTY_QR);
    setPanelKey((k) => k + 1);
  }

  function handleRestorePending(id: string) {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    if (qrInfo.raqam) {
      setPending((prev) =>
        prev.map((p) => (p.id === id ? { ...p, qrInfo } : p))
      );
    } else {
      setPending((prev) => prev.filter((p) => p.id !== id));
    }
    setQrInfo(item.qrInfo);
  }

  function handleRemovePending(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  function handleSuccess(message: string) {
    showToast(message, "success");
    setQrInfo(EMPTY_QR);
    setPanelKey((k) => k + 1);
  }

  function handleModeChange(v: string) {
    setRightMode(v as RightMode);
    setPanelKey((k) => k + 1);
  }

  return {
    qrInfo,
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
