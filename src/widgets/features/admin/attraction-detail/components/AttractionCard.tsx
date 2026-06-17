import { LuImage, LuHistory } from "react-icons/lu";
import { CusBadge } from "../../../../../components/ui/badge/CusBadge";
import {
  CusCard as Card,
} from "../../../../../components/shared/card/CusCard";
import { useTranslation } from "../../../../../i18n/languageConfig";
import { STATUS_TO_BADGE, CATEGORY_COLOR } from "../hooks/useAttractionDetail";
import type { Attraction } from "../../../../../data/attractions";

interface Props {
  attraction: Attraction;
  onHistoryOpen: () => void;
}

export function AttractionCard({ attraction, onHistoryOpen }: Props) {
  const { t } = useTranslation("attractionDetail.");
  const mainImg = attraction.images.imageAttractionMain;

  return (
    <Card>
      <div className="flex" style={{ minHeight: 148 }}>
        <div className="shrink-0 self-stretch h-full">
          {mainImg ? (
            <div style={{ minHeight: 148, width: 300 }}>
              <img
                src={mainImg}
                alt={attraction.name}
                className="object-cover"
                style={{ display: "block" }}
              />
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "var(--bg-hover)" }}
            >
              <LuImage size={28} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
        </div>
        <div className="flex-1 p-5 min-w-0 flex flex-col justify-center">
          <h1
            className="text-xl font-semibold leading-tight truncate"
            style={{ color: "var(--text-default)" }}
          >
            {attraction.name}
          </h1>
          {attraction.manufacturer && (
            <p className="text-xs mt-1 truncate" style={{ color: "var(--text-muted)" }}>
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
            onClick={onHistoryOpen}
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
  );
}
