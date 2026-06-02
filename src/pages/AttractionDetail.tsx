import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  LuArrowLeft,
  LuUserPlus,
  LuImage,
  LuUser,
  LuRuler,
  LuWeight,
  LuClock,
  LuTag,
  LuCalendar,
  LuCheck,
  LuUsers,
  LuActivity,
  LuInfo,
  LuLayoutGrid,
  LuHistory,
} from "react-icons/lu";
import {
  attractions,
  type AttractionCategory,
  type AttractionStatus,
} from "../data/attractions";
import { employees, EmployeeStatus } from "../data/employees";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusButton } from "../components/ui/buttons/CusButton";
import { CusDialog } from "../components/ui/dialog/CusDialog";
import { CusDrawer } from "../components/ui/dialog/CusDrawer";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
  CusInfoRow as InfoRow,
} from "../components/shared/card/CusCard";
import { useTranslation } from "../i18n/languageConfig";
import dayjs from "dayjs";

// ─── Types ────────────────────────────────────────────────────────────────────

type CP =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "cyan"
  | "purple"
  | "pink";

const STATUS_TO_BADGE: Record<
  AttractionStatus,
  "active" | "pending" | "fired"
> = { open: "active", maintenance: "pending", closed: "fired" };

const CATEGORY_COLOR: Record<AttractionCategory, CP> = {
  thrill: "red",
  family: "blue",
  kids: "green",
  water: "cyan",
  playground: "orange",
  entertainment: "purple",
};

// ─── Chart helpers ────────────────────────────────────────────────────────────

function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function VisitorsTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        color: "var(--text-4)",
      }}
    >
      <p className="mb-1">{label}</p>
      <p className="font-medium" style={{ color: "#22c55e" }}>
        Tashrif: {payload[0].value?.toLocaleString()}
      </p>
    </div>
  );
}

function RevenueTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm border shadow-xl"
      style={{
        background: "var(--bg-tooltip)",
        borderColor: "var(--border-2)",
        color: "var(--text-4)",
      }}
    >
      <p className="mb-1">{label}</p>
      <p className="font-medium" style={{ color: "#3b82f6" }}>
        Daromad: {payload[0].value?.toLocaleString()} UZS
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AttractionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("attractionDetail.");

  const [assignOpen, setAssignOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);
  const [localOperatorId, setLocalOperatorId] = useState<number | undefined>(
    undefined,
  );

  const attraction = attractions.find((a) => a.id === Number(id));

  if (!attraction) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center gap-3"
        style={{ minHeight: 400 }}
      >
        <p
          className="text-base font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {t("notFound")}
        </p>
        <CusButton
          size="sm"
          variant="outline"
          leftIcon={<LuArrowLeft size={14} />}
          onClick={() => navigate("/attractions")}
        >
          {t("backTo")}
        </CusButton>
      </div>
    );
  }

  // ── Derived values ───────────────────────────────────────────────────────────

  const operatorId =
    localOperatorId ?? attraction.relationOperator.mainOperatorId;
  const operator = operatorId
    ? employees.find((e) => e.id === operatorId)
    : null;

  const helpers = (attraction.relationOperator.helperOperatorIds ?? [])
    .map(({ id, relationdate }) => ({
      emp: employees.find((e) => e.id === id),
      relationdate,
    }))
    .filter(
      (h): h is { emp: NonNullable<typeof h.emp>; relationdate: string } =>
        !!h.emp,
    );

  const historyOperator = attraction.relationOperator.relationHistory
    ? employees.find(
        (e) =>
          e.id === attraction.relationOperator.relationHistory!.mainOperatorId,
      )
    : null;

  const mainImg = attraction.images.imageAttractionMain;

  // Chart data — use stored stats, format date as MM/DD label
  const visitorChartData = (attraction.statsVisitors ?? []).map((s) => ({
    day: shortDate(s.date),
    visitors: s.count,
  }));
  const revenueChartData = (attraction.statsRevenue ?? []).map((s) => ({
    day: shortDate(s.date),
    revenue: s.amount,
  }));

  // Today's totals (last entry)
  const sv = attraction.statsVisitors ?? [];
  const sr = attraction.statsRevenue ?? [];
  const todayVisitors = sv.length > 0 ? sv[sv.length - 1].count : 0;
  const todayRevenue = sr.length > 0 ? sr[sr.length - 1].amount : 0;

  // Operator connection info
  const connectedDate = operator?.createdAt ?? "";
  const connectedDays = connectedDate
    ? Math.round(
        (new Date("2026-06-02").getTime() - new Date(connectedDate).getTime()) /
          86400000,
      )
    : 0;

  // Restriction rows
  const rules = attraction.rulesAttraction;
  type RI = { icon: React.ElementType; label: string; value: string };
  const restrictionRows: RI[] = [];
  if (rules) {
    if (rules.minAge !== null && rules.minAge !== undefined)
      restrictionRows.push({
        icon: LuUser,
        label: "Minimal yosh",
        value: `${rules.minAge} yosh`,
      });
    if (rules.minHeight !== undefined)
      restrictionRows.push({
        icon: LuRuler,
        label: "Min bo'y",
        value: `${rules.minHeight} sm`,
      });
    if (rules.maxHeight !== undefined)
      restrictionRows.push({
        icon: LuRuler,
        label: "Max bo'y",
        value: `${rules.maxHeight} sm`,
      });
    if (rules.minWeight !== undefined)
      restrictionRows.push({
        icon: LuWeight,
        label: "Min vazn",
        value: `${rules.minWeight} kg`,
      });
    if (rules.maxWeight !== undefined)
      restrictionRows.push({
        icon: LuWeight,
        label: "Max vazn",
        value: `${rules.maxWeight} kg`,
      });
    if (rules.maxWeightPerCup !== undefined)
      restrictionRows.push({
        icon: LuWeight,
        label: "Max vazn (chashka)",
        value: `${rules.maxWeightPerCup} kg`,
      });
    if (rules.maxWeightPerBoat !== undefined)
      restrictionRows.push({
        icon: LuWeight,
        label: "Max vazn (qayiq)",
        value: `${rules.maxWeightPerBoat} kg`,
      });
  }

  // Assign candidates (active employees)
  const assignCandidates = employees.filter(
    (e) => e.status === EmployeeStatus.ACTIVE,
  );

  function handleAssign() {
    if (selectedEmp !== null) {
      setLocalOperatorId(selectedEmp);
      setAssignOpen(false);
      setSelectedEmp(null);
    }
  }

  return (
    <div className="p-4 tablet:p-6 space-y-4">
      {/* ── Back ──────────────────────────────────────────────────────────────── */}
      <CusButton
        variant="outline"
        onClick={() => navigate("/attractions")}
        colorPalette="gray"
        size="xs"
      >
        <LuArrowLeft size={14} />
        {t("backTo")}
      </CusButton>

      {/* ═══════════════════════════════════════════════════════════════════════
          ROW 1: Attraction Card + Operator Card
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-stretch">
        {/* ── Attraction Header Card ─────────────────────────────────────────── */}
        <Card>
          <div className="flex" style={{ minHeight: 148 }}>
            {/* Image */}
            <div className="shrink-0 self-stretch bg-red-300 h-full ">
              {mainImg ? (
                <div style={{ minHeight: 148, width: 300 }}>
                  <img
                    src={mainImg}
                    alt={attraction.name}
                    className=" object-cover "
                    style={{ display: "block" }}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center "
                  style={{ background: "var(--bg-hover)" }}
                >
                  <LuImage size={28} style={{ color: "var(--text-muted)" }} />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
              <h1
                className="text-xl font-semibold leading-tight truncate"
                style={{ color: "var(--text-default)" }}
              >
                {attraction.name}
              </h1>
              {attraction.manufacturer && (
                <p
                  className="text-xs mt-1 truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {attraction.manufacturer}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <CusBadge
                  colorPalette={CATEGORY_COLOR[attraction.category]}
                  variant="surface"
                  size="sm"
                >
                  {t(`categories.${attraction.category}`)}
                </CusBadge>
                <CusBadge status={STATUS_TO_BADGE[attraction.status]} size="sm">
                  {t(`statuses.${attraction.status}`)}
                </CusBadge>
              </div>
              <button
                onClick={() => setHistoryOpen(true)}
                className="mt-3 self-start flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border-default)",
                  cursor: "pointer",
                }}
              >
                <LuHistory size={11} />
                Operatorlar tarixi
              </button>
            </div>
          </div>
        </Card>

        {/* ── Operator Card ─────────────────────────────────────────────────── */}
        {operator ? (
          <Card>
            <div className="flex " style={{ minHeight: 148 }}>
              {/* Avatar */}
              <div className="shrink-0 self-stretch " style={{ width: 120 }}>
                <img
                  src={
                    operator.avatarUrl ??
                    `https://i.pravatar.cc/150?u=${operator.id}`
                  }
                  alt={operator.fullName ?? operator.firstName}
                  className="w-full h-full object-cover "
                  style={{ display: "block" }}
                />
              </div>
              {/* Info */}
              <div className="flex-1 p-4 min-w-0 flex flex-col justify-center">
                <span
                  className="text-[11px] font-medium mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Asosiy operator
                </span>
                <p
                  className="text-sm font-semibold leading-tight truncate"
                  style={{ color: "var(--text-default)" }}
                >
                  {operator.fullName ??
                    `${operator.firstName} ${operator.lastName}`}
                </p>
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {connectedDate}
                  <span
                    className="ml-2 px-1.5 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: "var(--bg-hover)",
                      color: "var(--text-2)",
                    }}
                  >
                    {connectedDays} kun
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <CusBadge
                    status={
                      operator.status === EmployeeStatus.ACTIVE
                        ? "active"
                        : "fired"
                    }
                    size="sm"
                  >
                    {operator.status}
                  </CusBadge>
                  {operator.currency && (
                    <CusBadge colorPalette="gray" variant="surface" size="sm">
                      {operator.currency}
                    </CusBadge>
                  )}
                </div>
              </div>
            </div>

            {/* Helpers */}
            {helpers.length > 0 && (
              <div
                className="border-t px-4 py-3"
                style={{ borderColor: "var(--border-default)" }}
              >
                <p
                  className="text-[11px] mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Yordamchilar
                </p>
                <div className="flex flex-wrap gap-2">
                  {helpers.map(({ emp, relationdate }) => (
                    <div
                      key={emp.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                      style={{
                        background: "var(--bg-hover)",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      <img
                        src={
                          emp.avatarUrl ??
                          `https://i.pravatar.cc/150?u=${emp.id}`
                        }
                        alt={emp.fullName ?? emp.firstName}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          className="text-[11px] font-medium leading-tight"
                          style={{ color: "var(--text-default)" }}
                        >
                          {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                        </p>
                        <p
                          className="text-[10px] leading-tight"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {relationdate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ) : (
          /* No operator → blur ghost + plus icon */
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
            {/* Blurred ghost skeleton */}
            <div
              style={{
                filter: "blur(5px)",
                opacity: 0.2,
                pointerEvents: "none",
                position: "absolute",
                inset: 0,
                display: "flex",
              }}
            >
              <div
                style={{
                  width: 120,
                  background: "var(--bg-hover)",
                  borderRadius: "12px 0 0 12px",
                }}
              />
              <div
                className="flex-1 p-5"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <div
                  className="rounded"
                  style={{
                    width: 130,
                    height: 14,
                    background: "var(--bg-hover)",
                  }}
                />
                <div
                  className="rounded"
                  style={{
                    width: 90,
                    height: 11,
                    background: "var(--bg-hover)",
                  }}
                />
                <div
                  className="rounded"
                  style={{
                    width: 60,
                    height: 20,
                    marginTop: 4,
                    background: "var(--bg-hover)",
                  }}
                />
              </div>
            </div>
            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--bg-hover)",
                  border: "1.5px dashed var(--border-2)",
                }}
              >
                <LuUserPlus size={22} style={{ color: "var(--text-muted)" }} />
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Operator biriktirish
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BODY: Charts (left) + Aside info (right)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_1.2fr] gap-4 items-start">
        {/* ── Left: charts stacked ──────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Visitors chart */}
          <Card>
            <CardHeader
              icon={LuUsers}
              title="Haftalik tashriflar"
              iconColor="#22c55e"
            />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={visitorChartData}
                  margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "var(--chart-tick)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<VisitorsTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar
                    dataKey="visitors"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Revenue chart */}
          <Card>
            <CardHeader
              icon={LuTag}
              title="Haftalik daromad"
              iconColor="#3b82f6"
            />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={revenueChartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#3b82f6"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "var(--chart-tick)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--chart-tick)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<RevenueTooltip />}
                    cursor={{ stroke: "var(--border-2)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
                    activeDot={{
                      r: 5,
                      fill: "#3b82f6",
                      stroke: "var(--bg-main)",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── Right: aside info ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader
            icon={LuActivity}
            title="Attraksion ma'lumoti"
            iconColor="#a78bfa"
          />
          <div className="px-5 pb-2">
            <InfoRow
              icon={LuTag}
              label="Narx"
              value={`${attraction.price.toLocaleString()} UZS`}
            />
            {rules && (
              <>
                <InfoRow
                  icon={LuClock}
                  label="Aylanish vaqti"
                  value={`${rules.roundTime} daqiqa`}
                />
                <InfoRow
                  icon={LuLayoutGrid}
                  label="Joylar soni"
                  value={`${rules.numberOfPlaceRound} ta`}
                />
                {restrictionRows.map((row, i) => (
                  <InfoRow
                    key={row.label}
                    icon={row.icon}
                    label={row.label}
                    value={row.value}
                    last={i === restrictionRows.length - 1}
                  />
                ))}
                {restrictionRows.length === 0 && (
                  <p
                    className="text-sm py-3 border-t"
                    style={{
                      color: "var(--text-muted)",
                      borderColor: "var(--border-default)",
                    }}
                  >
                    Cheklovlar yo'q
                  </p>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          History Drawer
      ═══════════════════════════════════════════════════════════════════════ */}
      <CusDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Operator tarixi"
        placement="end"
        size="md"
      >
        <div className="space-y-6">
          {/* Current: 2 columns */}
          <div>
            <p
              className="text-xs font-semibold uppercase mb-3"
              style={{ color: "var(--text-muted)", letterSpacing: "0.07em" }}
            >
              Joriy holat
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Main operator */}
              <div
                className="rounded-lg p-3.5 border"
                style={{
                  borderColor: "var(--border-default)",
                  background: "var(--bg-hover)",
                }}
              >
                <p
                  className="text-xs font-medium mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Asosiy operator
                </p>
                {operator ? (
                  <>
                    <p
                      className="text-xs mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {attraction.relationOperator.relationDay ?? connectedDate}
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          operator.avatarUrl ??
                          `https://i.pravatar.cc/150?u=${operator.id}`
                        }
                        alt={operator.fullName ?? operator.firstName}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <p
                        className="text-sm font-medium leading-tight"
                        style={{ color: "var(--text-default)" }}
                      >
                        {operator.fullName ??
                          `${operator.firstName} ${operator.lastName}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Biriktilmagan
                  </p>
                )}
              </div>

              {/* Helper operators */}
              <div
                className="rounded-lg p-3.5 border"
                style={{
                  borderColor: "var(--border-default)",
                  background: "var(--bg-hover)",
                }}
              >
                <p
                  className="text-xs font-medium mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Yordamchilar
                </p>
                {helpers.length > 0 ? (
                  <div className="space-y-3">
                    {helpers.map(({ emp, relationdate }) => (
                      <div key={emp.id}>
                        <p
                          className="text-xs mb-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {dayjs(relationdate).format("DD.MM.YYYY")} da
                          biriktirilgan
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              emp.avatarUrl ??
                              `https://i.pravatar.cc/150?u=${emp.id}`
                            }
                            alt={emp.fullName ?? emp.firstName}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <p
                            className="text-sm leading-tight"
                            style={{ color: "var(--text-default)" }}
                          >
                            {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Yo'q
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* History */}
        </div>
      </CusDrawer>

      {/* ═══════════════════════════════════════════════════════════════════════
          Assign Operator Modal
      ═══════════════════════════════════════════════════════════════════════ */}
      <CusDialog
        open={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setSelectedEmp(null);
        }}
        title="Operator biriktirish"
        description="Attraksion uchun xodimni tanlang"
        size="md"
        footer={
          <>
            <CusButton
              variant="outline"
              onClick={() => {
                setAssignOpen(false);
                setSelectedEmp(null);
              }}
            >
              Bekor qilish
            </CusButton>
            <CusButton isDisabled={selectedEmp === null} onClick={handleAssign}>
              Biriktirish
            </CusButton>
          </>
        }
      >
        <div className="space-y-2">
          {assignCandidates.map((emp) => {
            const isSelected = selectedEmp === emp.id;
            return (
              <button
                key={emp.id}
                onClick={() => setSelectedEmp(emp.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left"
                style={{
                  background: isSelected ? "var(--bg-hover)" : "transparent",
                  border: `1px solid ${isSelected ? "var(--border-2)" : "var(--border-default)"}`,
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                <img
                  src={emp.avatarUrl ?? `https://i.pravatar.cc/150?u=${emp.id}`}
                  alt={emp.fullName ?? emp.firstName}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-default)" }}
                  >
                    {emp.fullName ?? `${emp.firstName} ${emp.lastName}`}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {emp.role}
                  </p>
                </div>
                {isSelected && (
                  <LuCheck
                    size={16}
                    style={{ color: "#22c55e", flexShrink: 0 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </CusDialog>
    </div>
  );
}
