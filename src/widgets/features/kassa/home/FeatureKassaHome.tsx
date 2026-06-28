import {
  LuQrCode,
  LuCircleCheck,
  LuClock,
  LuHash,
  LuLayers,
  LuBanknote,
  LuTrash2,
  LuPause,
} from "react-icons/lu";
import { useRef, useState } from "react";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusSegment } from "@/components/ui/segment/CusSegment";
import type { PayType, KartaType } from "./components/AktivatsaPanel";
import { ToastList } from "./components/ToastList";
import { QrInfoRow } from "./components/QrInfoRow";
import { AktivatsaPanel } from "./components/AktivatsaPanel";
import { RelationPanel } from "./components/RelationPanel";
import { ScanInput, type ScanInputHandle } from "./components/ScanInput";
import { PendingList } from "./components/PendingList";
import { HidDeviceStatus } from "./components/HidDeviceStatus";
import { useKassaHome } from "./hooks/useKassaHome";
import { useHidDevices } from "./hooks/useHidDevices";
import PageHeader from "@/widgets/shared-ui/PageHeader";

export default function FeatureKassaHome() {
  const scanRef = useRef<ScanInputHandle>(null);
  const { supported, devices, requestAccess } = useHidDevices();
  const [payType, setPayType] = useState<PayType>("naqd");
  const [kartaType, setKartaType] = useState<KartaType>("uzcard");
  const [provider, setProvider] = useState<"payme" | "click" | "uzum-bank">(
    "payme",
  );
  const {
    qrInfo,
    rightMode,
    panelKey,
    toasts,
    pending,
    removeToast,
    handleScan,
    handleNewOperation,
    handlePark,
    handleRestorePending,
    handleRemovePending,
    handleSuccess,
    handleModeChange,
  } = useKassaHome();

  return (
    <div className="flex flex-col h-full">
      <ToastList items={toasts} onRemove={removeToast} />

      {/* Page header */}

      <div
        className="flex justify-between px-4 tablet:px-6 py-2 border-b shrink-0"
        style={{ borderColor: "var(--border-default)" }}
      >
        <PageHeader title="Kassa butka #3" />
        <HidDeviceStatus
          supported={supported}
          devices={devices}
          requestAccess={requestAccess}
        />
      </div>

      {/* 3-column panel */}
      <div className="flex flex-col desktop:flex-row flex-1 desktop:min-h-0 desktop:overflow-hidden">
        {/* Col 1 — Scan */}
        <div
          className="w-full desktop:w-2/6 flex flex-col desktop:shrink-0 border-b desktop:border-b-0 desktop:border-r"
          style={{ borderColor: "var(--border-default)" }}
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 tablet:p-6 flex flex-col gap-3">
            <ScanInput ref={scanRef} onScan={handleScan} />

            {qrInfo.status && (
              <div
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{
                  background:
                    qrInfo.status === "active" ? "#22c55e18" : "#6b728018",
                  border: `1px solid ${qrInfo.status === "active" ? "#22c55e40" : "#6b728040"}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background:
                      qrInfo.status === "active" ? "#22c55e25" : "#6b728025",
                  }}
                >
                  {qrInfo.status === "active" ? (
                    <LuCircleCheck size={16} style={{ color: "#22c55e" }} />
                  ) : (
                    <LuClock size={16} style={{ color: "#6b7280" }} />
                  )}
                </div>
                <div>
                  <p
                    className="font-bold text-sm leading-none"
                    style={{
                      color: qrInfo.status === "active" ? "#22c55e" : "#6b7280",
                    }}
                  >
                    {qrInfo.status === "active" ? "Aktiv" : "Nofaol"}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color:
                        qrInfo.status === "active" ? "#4ade8099" : "#9ca3af99",
                    }}
                  >
                    {qrInfo.status === "active"
                      ? "QR kod faol holatda"
                      : "QR kod faol emas"}
                  </p>
                </div>
              </div>
            )}

            <div
              className="rounded-2xl border p-3 flex flex-col gap-2"
              style={{
                background: "var(--bg-second)",
                borderColor: "var(--border-default)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Karta ma'lumotlari
              </p>
              <QrInfoRow icon={LuHash} label="Raqam" value={qrInfo.raqam} />
              <QrInfoRow icon={LuQrCode} label="Token" value={qrInfo.token} />
              <QrInfoRow
                icon={LuLayers}
                label="Partiya"
                value={qrInfo.partiya}
              />
              <QrInfoRow
                icon={LuBanknote}
                label="Summa"
                value={qrInfo.amount ? `${qrInfo.amount} so'm` : ""}
              />
            </div>

            <PendingList
              items={pending}
              onRestore={(id) => {
                handleRestorePending(id);
                scanRef.current?.focus();
              }}
              onRemove={handleRemovePending}
            />
          </div>

          {/* Sticky bottom buttons */}
          <div
            className="shrink-0 px-4 tablet:px-6 py-3 border-t flex gap-2"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-main)",
            }}
          >
            <CusButton
              size="xl"
              colorPalette="red"
              variant="solid"
              onClick={() => {
                handleNewOperation();
                setPayType("naqd");
                setKartaType("uzcard");
                setProvider("payme");
                scanRef.current?.focus();
              }}
              className="flex-1"
            >
              <LuTrash2 size={16} />
              Tozalash
            </CusButton>
            <CusButton
            size="xl"
              colorPalette="orange"
              variant="solid"
              isDisabled={!qrInfo.raqam}
              onClick={() => {
                handlePark();
                scanRef.current?.focus();
              }}
              className="flex-1"
            >
              <LuPause size={16} />
              Kutish
            </CusButton>
          </div>
        </div>

        {/* Col 2 — Mode segment */}
        <div
          className="w-full desktop:w-2/6 flex flex-col desktop:overflow-y-auto desktop:shrink-0 border-b desktop:border-b-0 desktop:border-r"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div
            className="px-4 tablet:px-6 py-3 border-b shrink-0"
            style={{ borderColor: "var(--border-default)" }}
          >
            <CusSegment
              layout="block"
              value={rightMode}
              onValueChange={handleModeChange}
              items={[
                { id: "aktivatsa", label: "Aktivatsa / To'ldirish" },
                { id: "relation", label: "Userga relation" },
              ]}
            />
          </div>

          {rightMode === "aktivatsa" && (
            <div className="px-4 tablet:px-6 py-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-3)" }}
                >
                  To'lov turi
                </p>
                <CusSegment
                  layout="block"
                  value={payType}
                  onValueChange={(v) => setPayType(v as PayType)}
                  items={[
                    { id: "naqd", label: "Naqd" },
                    { id: "karta", label: "Karta" },
                    { id: "online-tolov", label: "Online to'lov" },
                  ]}
                />
              </div>

              {payType === "karta" && (
                <div className="flex flex-col gap-1.5">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-3)" }}
                  >
                    Karta turi
                  </p>
                  <CusSegment
                    value={kartaType}
                    onValueChange={(v) => setKartaType(v as KartaType)}
                    items={[
                      { id: "uzcard", label: "UzCard" },
                      { id: "humo", label: "Humo" },
                    ]}
                  />
                </div>
              )}

              {payType === "online-tolov" && (
                <div className="flex flex-col gap-1.5">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-3)" }}
                  >
                    To'lov tizimi
                  </p>
                  <CusSegment
                    value={provider}
                    onValueChange={(v) =>
                      setProvider(v as "payme" | "click" | "uzum-bank")
                    }
                    items={[
                      { id: "payme", label: "Payme" },
                      { id: "click", label: "Click" },
                      { id: "uzum-bank", label: "Uzum Bank" },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Col 3 — To'lov paneli */}
        <div className="w-full desktop:w-2/6 flex flex-col desktop:overflow-hidden">
          <div className="flex-1 p-4 tablet:p-6 flex flex-col desktop:overflow-hidden">
            {rightMode === "aktivatsa" && (
              <AktivatsaPanel
                key={panelKey}
                onSuccess={() =>
                  handleSuccess("Aktivatsa muvaffaqiyatli bajarildi!")
                }
              />
            )}
            {rightMode === "relation" && (
              <RelationPanel
                key={panelKey}
                onSuccess={() =>
                  handleSuccess(
                    "Karta foydalanuvchiga muvaffaqiyatli bog'landi!",
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
