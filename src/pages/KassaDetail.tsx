import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuUserPlus,
  LuMapPin,
  LuHash,
  LuActivity,
  LuBanknote,
  LuInfo,
} from "react-icons/lu";
import { kassaList, type KassaStatus } from "../data/kassa";
import { employees, EmployeeStatus } from "../data/employees";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusButton } from "../components/ui/buttons/CusButton";
import { CusDialog } from "../components/ui/dialog/CusDialog";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
  CusInfoRow as InfoRow,
} from "../components/shared/card/CusCard";

// ─── Configs ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<KassaStatus, "active" | "pending" | "fired"> = {
  active:      "active",
  maintenance: "pending",
  inactive:    "fired",
};

const STATUS_LABEL: Record<KassaStatus, string> = {
  active:      "Faol",
  maintenance: "Ta'mirda",
  inactive:    "Yopiq",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KassaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignOpen, setAssignOpen]   = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);
  const [localCashierId, setLocalCashier] = useState<number | undefined>(undefined);

  const kassa = kassaList.find((k) => k.id === Number(id));

  if (!kassa) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3" style={{ minHeight: 400 }}>
        <p className="text-base font-semibold" style={{ color: "var(--text-default)" }}>
          Kassa topilmadi
        </p>
        <CusButton size="sm" variant="outline" leftIcon={<LuArrowLeft size={14} />} onClick={() => navigate("/kassa")}>
          Kassalarga qaytish
        </CusButton>
      </div>
    );
  }

  const cashierId = localCashierId ?? kassa.cashierId;
  const cashier   = cashierId ? employees.find((e) => e.id === cashierId) : null;
  const assignCandidates = employees.filter((e) => e.status === EmployeeStatus.ACTIVE);

  function handleAssign() {
    if (selectedEmp !== null) {
      setLocalCashier(selectedEmp);
      setAssignOpen(false);
      setSelectedEmp(null);
    }
  }

  return (
    <div className="p-4 tablet:p-6 space-y-4">

      {/* Back */}
      <CusButton variant="outline" colorPalette="gray" size="xs" onClick={() => navigate("/kassa")}>
        <LuArrowLeft size={14} />
        Kassalarga qaytish
      </CusButton>

      {/* ══════════════════════════════════════════════════════════════════════
          ROW 1: Kassa info + Kassir
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">

        {/* Kassa info card */}
        <Card>
          <div className="flex" style={{ minHeight: 148 }}>
            <div
              className="shrink-0 self-stretch flex items-center justify-center rounded-l-xl"
              style={{ width: 120, background: "var(--bg-hover)" }}
            >
              <LuBanknote size={40} style={{ color: "var(--text-muted)" }} />
            </div>
            <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
              <h1 className="text-xl font-semibold leading-tight truncate" style={{ color: "var(--text-default)" }}>
                {kassa.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <LuMapPin size={11} style={{ color: "var(--text-muted)" }} />
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{kassa.location}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <CusBadge status={STATUS_BADGE[kassa.status]} size="sm">
                  {STATUS_LABEL[kassa.status]}
                </CusBadge>
                <span className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "var(--bg-hover)", color: "var(--text-2)" }}>
                  #{kassa.id}
                </span>
              </div>
              {kassa.note && (
                <p className="text-xs mt-2.5" style={{ color: "var(--text-muted)" }}>
                  {kassa.note}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Kassir card */}
        {cashier ? (
          <Card>
            <div className="flex" style={{ minHeight: 148 }}>
              <div className="shrink-0 self-stretch" style={{ width: 120 }}>
                <img
                  src={cashier.avatarUrl ?? `https://i.pravatar.cc/150?u=${cashier.id}`}
                  alt={cashier.fullName ?? cashier.firstName}
                  className="w-full h-full object-cover rounded-l-xl"
                  style={{ display: "block" }}
                />
              </div>
              <div className="flex-1 p-4 min-w-0 flex flex-col justify-center">
                <span className="text-[11px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Kassir
                </span>
                <p className="text-sm font-semibold leading-tight truncate" style={{ color: "var(--text-default)" }}>
                  {cashier.fullName ?? `${cashier.firstName} ${cashier.lastName}`}
                </p>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  {cashier.createdAt ?? ""}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <CusBadge
                    status={cashier.status === EmployeeStatus.ACTIVE ? "active" : "fired"}
                    size="sm"
                  >
                    {cashier.status}
                  </CusBadge>
                  {cashier.currency && (
                    <CusBadge colorPalette="gray" variant="surface" size="sm">
                      {cashier.currency}
                    </CusBadge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <button
            onClick={() => setAssignOpen(true)}
            className="relative rounded-xl border overflow-hidden w-full"
            style={{
              background: "var(--bg-second)",
              borderColor: "var(--border-default)",
              minHeight: 148,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ filter: "blur(5px)", opacity: 0.2, pointerEvents: "none", position: "absolute", inset: 0, display: "flex" }}>
              <div style={{ width: 120, background: "var(--bg-hover)", borderRadius: "12px 0 0 12px" }} />
              <div className="flex-1 p-5" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                <div className="rounded" style={{ width: 130, height: 14, background: "var(--bg-hover)" }} />
                <div className="rounded" style={{ width: 90,  height: 11, background: "var(--bg-hover)" }} />
                <div className="rounded" style={{ width: 60,  height: 20, marginTop: 4, background: "var(--bg-hover)" }} />
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--bg-hover)", border: "1.5px dashed var(--border-2)" }}>
                <LuUserPlus size={22} style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Kassir biriktirish</p>
            </div>
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Aside info
      ══════════════════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader icon={LuActivity} title="Kassa ma'lumoti" iconColor="#a78bfa" />
        <div className="px-5 pb-2">
          <InfoRow icon={LuHash}   label="Kassa ID"    value={`#${kassa.id}`} />
          <InfoRow icon={LuMapPin} label="Joylashuv"   value={kassa.location} />
          {kassa.note && (
            <InfoRow icon={LuInfo} label="Izoh" value={kassa.note} last />
          )}
        </div>
      </Card>

      {/* ── Assign kassir dialog ──────────────────────────────────────────────── */}
      <CusDialog
        open={assignOpen}
        onClose={() => { setAssignOpen(false); setSelectedEmp(null); }}
        title="Kassir biriktirish"
        footer={
          <div className="flex justify-end gap-2">
            <CusButton size="sm" variant="outline" colorPalette="gray"
              onClick={() => { setAssignOpen(false); setSelectedEmp(null); }}>
              Bekor qilish
            </CusButton>
            <CusButton size="sm" variant="solid" colorPalette="blue"
              isDisabled={selectedEmp === null} onClick={handleAssign}>
              Biriktirish
            </CusButton>
          </div>
        }
      >
        <div className="space-y-1">
          {assignCandidates.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmp(emp.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                background: selectedEmp === emp.id ? "var(--bg-hover)" : "transparent",
                border: `1px solid ${selectedEmp === emp.id ? "var(--border-2)" : "transparent"}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <img
                src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
                alt={emp.fullName ?? emp.firstName}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-default)" }}>
                  {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {emp.role ?? ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CusDialog>

    </div>
  );
}
