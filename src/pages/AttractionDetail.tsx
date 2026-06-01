import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuTag,
  LuClock,
  LuUsers,
  LuUser,
  LuRuler,
  LuWeight,
  LuInfo,
  LuBriefcase,
  LuImage,
  LuActivity,
} from "react-icons/lu";
import {
  attractions,
  type AttractionCategory,
  type AttractionStatus,
} from "../data/attractions";
import { employees } from "../data/employees";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusButton } from "../components/ui/buttons/CusButton";
import { useTranslation } from "../i18n/languageConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

type CP = "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink";

const STATUS_TO_BADGE: Record<AttractionStatus, "active" | "pending" | "fired"> = {
  open:        "active",
  maintenance: "pending",
  closed:      "fired",
};

const CATEGORY_COLOR: Record<AttractionCategory, CP> = {
  thrill:        "red",
  family:        "blue",
  kids:          "green",
  water:         "cyan",
  playground:    "orange",
  entertainment: "purple",
};

// ─── Header Stat ──────────────────────────────────────────────────────────────

function HeaderStat({
  value,
  label,
  color,
  divider = true,
}: {
  value: string;
  label: string;
  color?: string;
  divider?: boolean;
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center py-4 px-2 tablet:px-4 tablet:py-5 bg-[var(--bg-main)] rounded-xl text-center"
      style={divider ? { borderLeft: "1px solid var(--border-default)" } : {}}
    >
      <p
        className="text-xl tablet:text-2xl font-bold leading-none"
        style={{ color: color ?? "var(--text-default)" }}
      >
        {value}
      </p>
      <p
        className="text-xs mt-1.5 text-center"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      {color && (
        <div
          className="w-5 h-0.5 mt-2 rounded-full"
          style={{ background: color }}
        />
      )}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={last ? {} : { borderBottom: "1px solid var(--border-default)" }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-hover)" }}
      >
        <Icon size={13} style={{ color: "var(--text-muted)" }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  children,
  iconColor,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconColor?: string;
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} style={{ color: iconColor ?? "var(--text-muted)" }} />
        <p className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AttractionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("attractionDetail.");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const attraction = attractions.find((a) => a.id === Number(id));

  if (!attraction) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center gap-3"
        style={{ minHeight: 400 }}
      >
        <p className="text-base font-semibold" style={{ color: "var(--text-default)" }}>
          {t("notFound")}
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          ID: {id}
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

  const mainImg = attraction.imageAttractionMain;
  const secondaryImgs = attraction.imageAttractionSecondary ?? [];
  const allImgs = [...(mainImg ? [mainImg] : []), ...secondaryImgs];

  const operator   = attraction.relationOperatorId
    ? employees.find((e) => e.id === attraction.relationOperatorId)
    : null;
  const helpers    = (attraction.relationOperatorHelpers ?? [])
    .map((hid) => employees.find((e) => e.id === hid))
    .filter(Boolean);

  const hasRestrictions =
    attraction.minAge !== null ||
    attraction.minHeight !== undefined ||
    attraction.maxHeight !== undefined ||
    attraction.minWeight !== undefined ||
    attraction.maxWeight !== undefined ||
    attraction.maxWeightPerCup !== undefined ||
    attraction.maxWeightPerBoat !== undefined;

  const hasPricingDetail =
    attraction.priceStandard !== undefined || attraction.priceVIP !== undefined;

  return (
    <div className="p-4 tablet:p-6 space-y-5">

      {/* ── Lightbox ──────────────────────────────────────────────────────────── */}
      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightboxSrc}
            alt={attraction.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90dvh",
              borderRadius: 16,
              objectFit: "contain",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      )}

      {/* ── Back ──────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate("/attractions")}
        className="flex items-center gap-1.5 text-sm"
        style={{
          color: "var(--text-muted)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <LuArrowLeft size={14} />
        {t("backTo")}
      </button>

      {/* ── Header card ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--bg-second)",
          borderColor: "var(--border-default)",
        }}
      >
        <div className="flex flex-col desktop:flex-row">

          {/* Left: main image + thumbnails */}
          <div className="relative desktop:w-[320px] shrink-0">
            {mainImg ? (
              <img
                src={mainImg}
                alt={attraction.name}
                onClick={() => setLightboxSrc(mainImg)}
                className="w-full object-cover cursor-zoom-in"
                style={{ height: 220, display: "block" }}
              />
            ) : (
              <div
                className="w-full flex items-center justify-center"
                style={{
                  height: 220,
                  background: "var(--bg-hover)",
                  color: "var(--text-muted)",
                }}
              >
                <LuImage size={32} />
              </div>
            )}
            {/* Thumbnails */}
            {secondaryImgs.length > 0 && (
              <div
                className="flex gap-1.5 p-2 overflow-x-auto"
                style={{ borderTop: "1px solid var(--border-default)" }}
              >
                {allImgs.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    onClick={() => setLightboxSrc(src)}
                    className="shrink-0 cursor-pointer rounded-md object-cover"
                    style={{
                      width: 52,
                      height: 38,
                      opacity: lightboxSrc === src ? 1 : 0.75,
                      border: lightboxSrc === src
                        ? "2px solid #3b82f6"
                        : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: name + info + stats */}
          <div className="flex flex-col flex-1">
            {/* Name + badges */}
            <div className="p-5 desktop:p-6 flex-1">
              <h1
                className="text-xl desktop:text-3xl font-semibold leading-tight"
                style={{ color: "var(--text-default)" }}
              >
                {attraction.name}
              </h1>
              {attraction.manufacturer && (
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {attraction.manufacturer}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
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
            </div>

            {/* 3 header stats */}
            <div
              className="flex border-t"
              style={{ borderColor: "var(--border-default)" }}
            >
              <HeaderStat
                value={`${attraction.price.toLocaleString()}`}
                label={`${t("price")} (UZS)`}
                color="#3b82f6"
                divider={false}
              />
              <HeaderStat
                value={attraction.waitTime > 0 ? `${attraction.waitTime}` : "—"}
                label={`${t("waitTime")}, ${t("minSuffix")}`}
                color="#f59e0b"
              />
              <HeaderStat
                value={attraction.visitors.toLocaleString()}
                label={t("visitors")}
                color="#22c55e"
              />
            </div>
          </div>
        </div>

        {/* Note banner */}
        {attraction.note && (
          <div
            className="px-5 py-3 flex items-start gap-2.5"
            style={{
              borderTop: "1px solid var(--border-default)",
              background: "var(--bg-hover)",
            }}
          >
            <LuInfo size={13} style={{ color: "#f59e0b", marginTop: 2, flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              {attraction.note}
            </p>
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 desktop:grid-cols-[1fr_300px] gap-4">

        {/* Left */}
        <div className="space-y-4">

          {/* Restrictions */}
          {hasRestrictions && (() => {
            type RI = { icon: React.ElementType; label: string; value: string };
            const items: RI[] = [];
            if (attraction.minAge !== null && attraction.minAge !== undefined)
              items.push({ icon: LuUser,   label: t("minAge"),           value: `${attraction.minAge} ${t("ageSuffix")}` });
            if (attraction.minHeight !== undefined)
              items.push({ icon: LuRuler,  label: t("minHeight"),        value: `${attraction.minHeight} ${t("heightSuffix")}` });
            if (attraction.maxHeight !== undefined)
              items.push({ icon: LuRuler,  label: t("maxHeight"),        value: `${attraction.maxHeight} ${t("heightSuffix")}` });
            if (attraction.minWeight !== undefined)
              items.push({ icon: LuWeight, label: t("minWeight"),        value: `${attraction.minWeight} ${t("weightSuffix")}` });
            if (attraction.maxWeight !== undefined)
              items.push({ icon: LuWeight, label: t("maxWeight"),        value: `${attraction.maxWeight} ${t("weightSuffix")}` });
            if (attraction.maxWeightPerCup !== undefined)
              items.push({ icon: LuWeight, label: t("maxWeightPerCup"), value: `${attraction.maxWeightPerCup} ${t("weightSuffix")}` });
            if (attraction.maxWeightPerBoat !== undefined)
              items.push({ icon: LuWeight, label: t("maxWeightPerBoat"), value: `${attraction.maxWeightPerBoat} ${t("weightSuffix")}` });
            return (
              <SectionCard icon={LuActivity} title={t("restrictions")} iconColor="#ef4444">
                {items.map((item, i) => (
                  <InfoRow
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    last={i === items.length - 1}
                  />
                ))}
              </SectionCard>
            );
          })()}

          {/* Image gallery */}
          {secondaryImgs.length > 0 && (
            <SectionCard icon={LuImage} title={t("images")}>
              <div className="grid grid-cols-2 tablet:grid-cols-3 gap-2">
                {secondaryImgs.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    onClick={() => setLightboxSrc(src)}
                    className="w-full rounded-lg object-cover cursor-zoom-in"
                    style={{ height: 110 }}
                  />
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">

          {/* Pricing */}
          <SectionCard icon={LuTag} title={t("pricing")} iconColor="#3b82f6">
            <div className="space-y-2.5">
              {hasPricingDetail ? (
                <>
                  {attraction.priceStandard !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                        {t("standard")}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
                        {attraction.priceStandard.toLocaleString()}{" "}
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>UZS</span>
                      </span>
                    </div>
                  )}
                  {attraction.priceVIP !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                        {t("vip")}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#f59e0b" }}
                      >
                        {attraction.priceVIP.toLocaleString()}{" "}
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>UZS</span>
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {t("price")}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-default)" }}>
                    {attraction.price.toLocaleString()}{" "}
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>UZS</span>
                  </span>
                </div>
              )}
              <div
                className="flex items-center justify-between pt-2.5"
                style={{ borderTop: "1px solid var(--border-default)" }}
              >
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("waitTime")}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
                  {attraction.waitTime > 0
                    ? `${attraction.waitTime} ${t("minSuffix")}`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("visitors")}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#22c55e" }}
                >
                  {attraction.visitors.toLocaleString()}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Operators */}
          <SectionCard icon={LuBriefcase} title={t("operators")}>
            {!operator && helpers.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {t("noOperator")}
              </p>
            ) : (
              <div className="space-y-3">
                {operator && (
                  <div>
                    <p className="text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                      {t("operator")}
                    </p>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={operator.avatarUrl ?? `https://i.pravatar.cc/150?u=${operator.id}`}
                        alt={operator.fullName}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-default)" }}
                      >
                        {operator.fullName}
                      </span>
                    </div>
                  </div>
                )}
                {helpers.length > 0 && (
                  <div style={operator ? { borderTop: "1px solid var(--border-default)", paddingTop: 12 } : {}}>
                    <p className="text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                      {t("helpers")}
                    </p>
                    <div className="space-y-2">
                      {helpers.map((h) => h && (
                        <div key={h.id} className="flex items-center gap-2.5">
                          <img
                            src={h.avatarUrl ?? `https://i.pravatar.cc/150?u=${h.id}`}
                            alt={h.fullName}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <span className="text-sm" style={{ color: "var(--text-2)" }}>
                            {h.fullName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
