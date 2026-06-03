import { useState, type ReactNode } from "react";
import {
  LuZap,
  LuUser,
  LuStar,
  LuTrash2,
  LuPlus,
  LuCheck,
  LuInfo,
  LuX,
  LuSearch,
  LuSettings,
  LuMousePointer2,
  LuTag,
  LuTextCursorInput,
  LuChevronDown,
  LuToggleLeft,
  LuTable2,
} from "react-icons/lu";
import { CusButton } from "../components/ui/buttons/CusButton";
import { CusBadge } from "../components/ui/badge/CusBadge";
import { CusInput } from "../components/ui/inputs/CusInput";
import { CusTextArea } from "../components/ui/inputs/CusTextArea";
import { CusCheckbox } from "../components/ui/inputs/CusCheckbox";
import { CusSwitch } from "../components/ui/inputs/CusSwitch";
import CusSelect from "../components/ui/select/CusSelect";
import { CusTable } from "../components/ui/table/CusTable";
import type { ColumnDef } from "../components/ui/table/CusTable";
import { CusCard, CusCardHeader } from "../components/shared/card/CusCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <p
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-dim)" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

// ─── Table demo data ──────────────────────────────────────────────────────────

interface DemoRow {
  id: number;
  name: string;
  role: string;
  status: string;
  score: number;
}

const TABLE_DATA: DemoRow[] = [
  {
    id: 1,
    name: "Alisher Karimov",
    role: "Operator",
    status: "Faol",
    score: 94,
  },
  {
    id: 2,
    name: "Dilnoza Yusupova",
    role: "Kassir",
    status: "Ta'tilda",
    score: 88,
  },
  {
    id: 3,
    name: "Bobur Toshmatov",
    role: "Security",
    status: "Faol",
    score: 76,
  },
  { id: 4, name: "Kamola Nazarova", role: "Admin", status: "Faol", score: 99 },
  {
    id: 5,
    name: "Jasur Mirzayev",
    role: "Cleaner",
    status: "Nofaol",
    score: 61,
  },
];

const TABLE_COLS: ColumnDef<DemoRow>[] = [
  { key: "id", header: "#", width: 40, sortable: true },
  { key: "name", header: "Ism", sortable: true },
  { key: "role", header: "Lavozim", sortable: true },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <CusBadge
        colorPalette={
          r.status === "Faol"
            ? "green"
            : r.status === "Ta'tilda"
              ? "yellow"
              : "gray"
        }
        variant="subtle"
        size="sm"
      >
        {r.status}
      </CusBadge>
    ),
  },
  { key: "score", header: "KPI", width: 70, align: "center", sortable: true },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevUI() {
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [cb1, setCb1] = useState(true);
  const [cb2, setCb2] = useState(false);
  const [selectVal, setSelectVal] = useState("operator");
  const [inputVal, setInputVal] = useState("");
  const [tableSelected, setTableSelected] = useState<number[]>([]);

  return (
    <div className="p-4 tablet:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div
        className="pb-4"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
          Developer
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          UI Components
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          ParkOps komponent kutubxonasi — faqat dev rejimida ko'rinadi.
        </p>
      </div>

      {/* ── CusButton ── */}
      <CusCard>
        <CusCardHeader icon={LuMousePointer2} title="CusButton" />
        <div className="p-4 space-y-4">
          <Section title="Variants">
            <Row>
              <CusButton colorPalette="blue">Primary</CusButton>
              <CusButton variant="outline" colorPalette="blue">
                Outline
              </CusButton>
              <CusButton variant="ghost" colorPalette="blue">
                Ghost
              </CusButton>
              <CusButton variant="subtle" colorPalette="blue">
                Subtle
              </CusButton>
            </Row>
          </Section>
          <Section title="Colors">
            <Row>
              <CusButton colorPalette="blue">Blue</CusButton>
              <CusButton colorPalette="green">Green</CusButton>
              <CusButton colorPalette="red">Red</CusButton>
              <CusButton colorPalette="orange">Orange</CusButton>
              <CusButton colorPalette="purple">Purple</CusButton>
              <CusButton colorPalette="gray">Gray</CusButton>
            </Row>
          </Section>
          <Section title="Sizes">
            <Row>
              <CusButton size="xs">xs</CusButton>
              <CusButton size="sm">sm</CusButton>
              <CusButton size="md">md</CusButton>
              <CusButton size="lg">lg</CusButton>
            </Row>
          </Section>
          <Section title="With icons">
            <Row>
              <CusButton colorPalette="blue" leftIcon={<LuPlus size={14} />}>
                Qo'shish
              </CusButton>
              <CusButton
                colorPalette="red"
                variant="outline"
                leftIcon={<LuTrash2 size={14} />}
              >
                O'chirish
              </CusButton>
              <CusButton colorPalette="green" leftIcon={<LuCheck size={14} />}>
                Saqlash
              </CusButton>
              <CusButton
                colorPalette="gray"
                rightIcon={<LuSettings size={14} />}
              >
                Sozlamalar
              </CusButton>
            </Row>
          </Section>
          <Section title="States">
            <Row>
              <CusButton isLoading colorPalette="blue">
                Loading
              </CusButton>
              <CusButton isDisabled colorPalette="blue">
                Disabled
              </CusButton>
            </Row>
          </Section>
        </div>
      </CusCard>

      {/* ── CusBadge ── */}
      <CusCard>
        <CusCardHeader icon={LuTag} title="CusBadge" />
        <div className="p-4 space-y-4">
          <Section title="Subtle (default)">
            <Row>
              <CusBadge colorPalette="blue">Blue</CusBadge>
              <CusBadge colorPalette="green">Green</CusBadge>
              <CusBadge colorPalette="red">Red</CusBadge>
              <CusBadge colorPalette="orange">Orange</CusBadge>
              <CusBadge colorPalette="yellow">Yellow</CusBadge>
              <CusBadge colorPalette="purple">Purple</CusBadge>
              <CusBadge colorPalette="gray">Gray</CusBadge>
              <CusBadge colorPalette="cyan">Cyan</CusBadge>
            </Row>
          </Section>
          <Section title="Solid">
            <Row>
              <CusBadge colorPalette="blue" variant="solid">
                Blue
              </CusBadge>
              <CusBadge colorPalette="green" variant="solid">
                Green
              </CusBadge>
              <CusBadge colorPalette="red" variant="solid">
                Red
              </CusBadge>
              <CusBadge colorPalette="purple" variant="solid">
                Purple
              </CusBadge>
              <CusBadge colorPalette="gray" variant="solid">
                Gray
              </CusBadge>
            </Row>
          </Section>
          <Section title="Outline">
            <Row>
              <CusBadge colorPalette="blue" variant="outline">
                Blue
              </CusBadge>
              <CusBadge colorPalette="green" variant="outline">
                Green
              </CusBadge>
              <CusBadge colorPalette="red" variant="outline">
                Red
              </CusBadge>
            </Row>
          </Section>
          <Section title="Sizes">
            <Row>
              <CusBadge colorPalette="blue" size="sm">
                Small
              </CusBadge>
              <CusBadge colorPalette="blue" size="md">
                Medium
              </CusBadge>
              <CusBadge colorPalette="blue" size="lg">
                Large
              </CusBadge>
            </Row>
          </Section>
          <Section title="Preset: status">
            <Row>
              <CusBadge status="active" />
              <CusBadge status="inactive" />
              <CusBadge status="vacation" />
              <CusBadge status="fired" />
              <CusBadge status="pending" />
            </Row>
          </Section>
          <Section title="Preset: role">
            <Row>
              <CusBadge role="SUPER_ADMIN" />
              <CusBadge role="OPERATOR_ATTRACTION" />
              <CusBadge role="CASHIER" />
              <CusBadge role="SECURITY" />
              <CusBadge role="CLEANER" />
            </Row>
          </Section>
          <Section title="With icons">
            <Row>
              <CusBadge colorPalette="green" leftIcon={<LuCheck size={10} />}>
                Faol
              </CusBadge>

              <CusBadge colorPalette="red" leftIcon={<LuX size={10} />}>
                Xato
              </CusBadge>
              <CusBadge colorPalette="blue" leftIcon={<LuInfo size={10} />}>
                Ma'lumot
              </CusBadge>
              <CusBadge colorPalette="purple" leftIcon={<LuZap size={10} />}>
                VIP
              </CusBadge>
              <CusBadge colorPalette="orange" leftIcon={<LuStar size={10} />}>
                Top
              </CusBadge>
            </Row>
          </Section>
        </div>
      </CusCard>

      {/* ── CusInput / CusTextArea ── */}
      <CusCard>
        <CusCardHeader
          icon={LuTextCursorInput}
          title="CusInput & CusTextArea"
        />
        <div className="p-4 space-y-4 max-w-sm">
          <Section title="Inputs">
            <CusInput
              label="Ism"
              placeholder="Ismni kiriting..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <CusInput
              label="Telefon"
              placeholder="+998 90 000 00 00"
              leftElement={<LuUser size={14} />}
            />
            <CusInput
              label="Qidirish"
              placeholder="Qidirish..."
              leftElement={<LuSearch size={14} />}
            />
            <CusInput
              label="Xatolik misoli"
              placeholder="..."
              errorText="Bu maydon to'ldirilishi shart"
            />
            <CusInput label="O'chirilgan" placeholder="Disabled" disabled />
          </Section>
          <Section title="TextArea">
            <CusTextArea label="Izoh" placeholder="Izoh yozing..." rows={3} />
          </Section>
        </div>
      </CusCard>

      {/* ── CusSelect ── */}
      <CusCard>
        <CusCardHeader icon={LuChevronDown} title="CusSelect" />
        <div className="p-4 max-w-xs space-y-3">
          <Section title="Single select">
            <CusSelect
              label="Lavozim"
              value={selectVal}
              onChange={(v) => setSelectVal(v as string)}
              options={[
                { value: "admin", label: "Admin" },
                { value: "operator", label: "Operator" },
                { value: "cashier", label: "Kassir" },
                { value: "security", label: "Security" },
                { value: "cleaner", label: "Cleaner" },
              ]}
            />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Tanlangan: <strong>{selectVal}</strong>
            </p>
          </Section>
        </div>
      </CusCard>

      {/* ── CusSwitch / CusCheckbox ── */}
      <CusCard>
        <CusCardHeader icon={LuToggleLeft} title="CusSwitch & CusCheckbox" />
        <div className="p-4 space-y-4">
          <Section title="Switch">
            <Row>
              <CusSwitch
                checked={sw1}
                onCheckedChange={(v) => setSw1(v)}
                label="Dark mode"
              />
              <CusSwitch
                checked={sw2}
                onCheckedChange={(v) => setSw2(v)}
                label="Bildirishnomalar"
              />
              <CusSwitch checked={true} disabled label="Disabled (on)" />
              <CusSwitch checked={false} disabled label="Disabled (off)" />
            </Row>
          </Section>
          <Section title="Checkbox">
            <Row>
              <CusCheckbox
                checked={cb1}
                onChange={(e) => setCb1(e.target.checked)}
                label="Yodlab qol"
              />
              <CusCheckbox
                checked={cb2}
                onChange={(e) => setCb2(e.target.checked)}
                label="Shartlarga roziman"
              />
              <CusCheckbox checked={true} disabled label="Disabled (on)" />
              <CusCheckbox
                checked={false}
                indeterminate
                label="Indeterminate"
              />
            </Row>
          </Section>
        </div>
      </CusCard>

      {/* ── CusTable ── */}
      <CusCard>
        <CusCardHeader icon={LuTable2} title="CusTable" />
        <div className="p-4 space-y-3">
          <Section title="Selectable + sortable">
            <CusTable<DemoRow>
              data={TABLE_DATA}
              columns={TABLE_COLS}
              selectable
              selectedRows={tableSelected}
              onSelectionChange={setTableSelected}
              interactive
              stickyHeader
              maxH="300px"
            />
            {tableSelected.length > 0 && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {tableSelected.length} ta tanlandi (index:{" "}
                {tableSelected.join(", ")})
              </p>
            )}
          </Section>
        </div>
      </CusCard>

      {/* ── Icons ── */}
      <CusCard>
        <div className="p-4">
          <Row>
            {[
              LuZap,
              LuUser,
              LuStar,
              LuTrash2,
              LuPlus,
              LuCheck,
              LuInfo,
              LuX,
              LuSearch,
              LuSettings,
            ].map((Icon, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  background: "var(--bg-hover)",
                  color: "var(--text-default)",
                }}
              >
                <Icon size={16} />
              </div>
            ))}
          </Row>
        </div>
      </CusCard>

      <div className="pb-8" />
    </div>
  );
}
