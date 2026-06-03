import { LuPlus } from "react-icons/lu";
import { CusButton } from "../../../components/ui/buttons/CusButton";
import { CusBadge } from "../../../components/ui/badge/CusBadge";
import type { Party } from "../qr.types";

interface Props {
  parties: Party[];
  activeBatchId: string | null;
  onSelect: (batchId: string) => void;
  onNewParty: () => void;
}

export function PartyTabs({ parties, activeBatchId, onSelect, onNewParty }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {parties.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Hali partiya yo'q — birinchisini yarating.
        </p>
      )}

      {parties.map((p) => {
        const isActive = p.batchId === activeBatchId;
        return (
          <CusButton
            key={p.batchId}
            size="sm"
            variant={isActive ? "subtle" : "ghost"}
            colorPalette={isActive ? "blue" : "gray"}
            onClick={() => onSelect(p.batchId)}
            className="shrink-0"
          >
            {p.partia}
            <span className="ml-1.5">
              <CusBadge
                colorPalette={isActive ? "blue" : "gray"}
                variant="subtle"
                size="sm"
              >
                {p.count}
              </CusBadge>
            </span>
          </CusButton>
        );
      })}

      <CusButton
        size="sm"
        variant="outline"
        colorPalette="blue"
        leftIcon={<LuPlus size={13} />}
        onClick={onNewParty}
        className="shrink-0 ml-1"
      >
        Yangi partiya
      </CusButton>
    </div>
  );
}
