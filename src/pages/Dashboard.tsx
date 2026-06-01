import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuUsers,
  LuDollarSign,
  LuActivity,
  LuFerrisWheel,
  LuSearch,
  LuMail,
  LuLock,
  LuPhone,
} from "react-icons/lu";
import { CusTable, type ColumnDef } from "../components/ui/table/CusTable";
import { CusPagination } from "../components/ui/table/CusPagination";
import { CusBadge } from "../components/ui/badge/CusBadge";
import {
  LuStar,
  LuCheck,
  LuTriangleAlert,
  LuShield,
} from "react-icons/lu";
import {
  employees,
  EmployeeStatus,
  EmployeeRole,
  type Employee,
} from "../data/employees";
import { CusInput } from "../components/ui/inputs/CusInput";
import {
  CusCheckbox,
  CusCheckboxGroup,
} from "../components/ui/inputs/CusCheckbox";
import { CusSwitch } from "../components/ui/inputs/CusSwitch";
import { CusTextArea } from "../components/ui/inputs/CusTextArea";
import { CusDrawer } from "../components/ui/dialog/CusDrawer";
import { CusButton } from "../components/ui/buttons/CusButton";
import { CusBreadCrumb } from "../components/ui/bread-crumb/CusBreadCrumb";
import { LuChevronRight, LuSlash } from "react-icons/lu";

interface DashboardCard {
  label: string;
  value: string;
  icon: IconType;
  color: string;
}

const cards: DashboardCard[] = [
  {
    label: "Total Visitors Today",
    value: "2 340",
    icon: LuUsers,
    color: "#3b82f6",
  },
  {
    label: "Today's Revenue",
    value: "$31 200",
    icon: LuDollarSign,
    color: "#22c55e",
  },
  {
    label: "Active Sessions",
    value: "1 420",
    icon: LuActivity,
    color: "#06b6d4",
  },
  {
    label: "Attractions Open",
    value: "4 / 5",
    icon: LuFerrisWheel,
    color: "#eab308",
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          {title}
        </p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const [clearVal, setClearVal] = useState("Tozalanadigan matn");
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerEnd, setDrawerEnd] = useState(false);
  const [drawerStart, setDrawerStart] = useState(false);
  const [drawerBottom, setDrawerBottom] = useState(false);

  return (
    <div className="p-4 tablet:p-6 space-y-6 max-w-3xl">
      {/* Page header */}
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Overview
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Welcome back. Here's what's happening today.
        </p>
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl p-5 border flex items-start gap-4"
            style={{
              background: "var(--bg-second)",
              borderColor: "var(--border-default)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${c.color}18` }}
            >
              <c.icon size={18} style={{ color: c.color }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {c.label}
              </p>
              <p
                className="text-2xl font-semibold mt-1"
                style={{ color: "var(--text-default)" }}
              >
                {c.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      <CusCheckboxGroup
        label="Kategoriyalar"
        direction="row"
        value={selected}
        onChange={setSelected}
      >
        <CusCheckbox label="Ekstremal" value="thrill" />
        <CusCheckbox label="Oilaviy" value="family" />
        <CusCheckbox label="Bolalar" value="kids" />
        <CusCheckbox label="Suv" value="water" />
      </CusCheckboxGroup>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Tanlangan:{" "}
        <span style={{ color: "var(--text-3)" }}>
          {selected.length ? selected.join(", ") : "hech narsa"}
        </span>
      </p>
      {/* ── CusInput showcase ─────────────────────────────────────── */}
      {/* 1. Asosiy holatlar */}
      <Section title="Asosiy holatlar">
        <CusInput placeholder="Oddiy input, hech narsa yo'q" />
        <CusInput
          label="Label bilan"
          placeholder="Label ustida ko'rinadi"
          rightElement={
            <span
              style={{
                background: "var(--bg-input)",
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              Optional
            </span>
          }
          leftElement={
            <span
              style={{
                background: "var(--bg-input)",
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              @
            </span>
          }
        />
        <CusInput
          label="Required input"
          isRequired
          placeholder="* belgisi chiqadi"
        />
        <CusInput
          label="Helper text"
          helperText="Bu maydon to'g'risida qo'shimcha ma'lumot"
          placeholder="Quyida kulrang izoh"
        />
      </Section>
      {/* 2. Xato holati */}
      <Section title="Xato holati (errorText)">
        <CusInput
          label="Email"
          isRequired
          errorText="Bu maydon to'ldirilishi shart"
          placeholder="example@mail.com"
          type="email"
        />
        <CusInput
          label="Parol"
          errorText="Parol kamida 8 ta belgidan iborat bo'lishi kerak"
          type="password"
          defaultValue="123"
        />
      </Section>
      {/* 3. Iconlar */}
      <Section title="Left / Right element">
        <CusInput
          label="Qidiruv"
          leftElement={<LuSearch size={14} />}
          placeholder="Qidiring..."
        />
        <CusInput
          label="Email"
          leftElement={<LuMail size={14} />}
          placeholder="example@mail.com"
          type="email"
        />
        <CusInput
          label="Telefon"
          leftElement={<LuPhone size={14} />}
          rightElement={
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              +998
            </span>
          }
          placeholder="90 000 00 00"
          type="tel"
        />
        <CusInput
          label="Parol"
          leftElement={<LuLock size={14} />}
          placeholder="••••••••"
          type="password"
        />
      </Section>
      {/* 4. Clearable */}
      <Section title="Clearable (X tugma)">
        {/* Controlled */}
        <CusInput
          label="Controlled + clearable"
          clearable
          leftElement={<LuSearch size={14} />}
          value={clearVal}
          onChange={(e) => setClearVal(e.target.value)}
          onClear={() => setClearVal("")}
          placeholder="Matn kiriting..."
        />
        {/* Uncontrolled */}
        <CusInput
          label="Uncontrolled + clearable"
          clearable
          defaultValue="O'chiriladigan matn"
          placeholder="Matn kiriting..."
        />
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Controlled value:{" "}
          <span style={{ color: "var(--text-3)" }}>"{clearVal}"</span>
        </p>
      </Section>
      {/* 5. Disabled / ReadOnly */}
      <Section title="Disabled / ReadOnly">
        <CusInput label="Disabled" disabled value="O'zgartirib bo'lmaydi" />
        <CusInput
          label="ReadOnly"
          readOnly
          value="Faqat o'qish uchun"
          helperText="Bu maydon o'zgartirilmaydi"
        />
      </Section>
      {/* 6. Hajmlar */}
      <Section title="Hajmlar (inputSize)">
        <CusInput inputSize="xs" placeholder="xs — juda kichik" label="xs" />
        <CusInput inputSize="sm" placeholder="sm — kichik" label="sm" />
        <CusInput
          inputSize="md"
          placeholder="md — standart"
          label="md (default)"
        />
        <CusInput inputSize="lg" placeholder="lg — katta" label="lg" />
      </Section>
      {/* 7. Variantlar */}
      <Section title="Variantlar">
        <CusInput
          variant="outline"
          label="outline (default)"
          placeholder="Chegara bilan"
        />
        <CusInput variant="subtle" label="subtle" placeholder="Yengil fon" />
        <CusInput
          variant="flushed"
          label="flushed"
          placeholder="Faqat pastki chiziq"
        />
      </Section>
      {/* ── CusCheckbox showcase ──────────────────────────────────── */}
      {/* 8. Asosiy checkbox holatlari */}
      <Section title="CusCheckbox — asosiy holatlar">
        <CusCheckbox label="Oddiy checkbox" />
        <CusCheckbox label="Default checked" defaultChecked />
        <CusCheckbox label="Indeterminate (qisman)" indeterminate />
        <CusCheckbox label="Disabled" disabled />
        <CusCheckbox label="Disabled + checked" disabled defaultChecked />
      </Section>
      {/* 9. Label + description + required + error */}
      <Section title="CusCheckbox — label, description, error">
        <CusCheckbox label="Required checkbox" isRequired />
        <CusCheckbox
          label="Email xabarnomalar"
          description="Yangi xabarlar kelganda email yuboriladi"
        />
        <CusCheckbox
          label="Shartlarga roziman"
          description="Foydalanish shartlari va maxfiylik siyosatini o'qidim"
          errorText="Bu maydonni belgilash shart"
        />
      </Section>
      {/* 10. Hajmlar */}
      <Section title="CusCheckbox — hajmlar">
        <CusCheckbox size="sm" label="sm — kichik" defaultChecked />
        <CusCheckbox size="md" label="md — standart (default)" defaultChecked />
        <CusCheckbox size="lg" label="lg — katta" defaultChecked />
      </Section>
      {/* 11. Group */}
      <Section title="CusCheckboxGroup">
        <CusCheckboxGroup label="Attraksion kategoriyalari" direction="column">
          <CusCheckbox
            label="Ekstremal"
            description="Tez va hayajonli"
            defaultChecked
          />
          <CusCheckbox label="Oilaviy" description="Barcha yoshlar uchun" />
          <CusCheckbox
            label="Bolalar"
            description="7 yoshgacha"
            defaultChecked
          />
          <CusCheckbox label="Suv" description="Suv attraksionlari" />
        </CusCheckboxGroup>

        <CusCheckboxGroup label="Tezkor tanlash" direction="row" gap={20}>
          <CusCheckbox label="Dushanba" />
          <CusCheckbox label="Seshanba" defaultChecked />
          <CusCheckbox label="Chorshanba" />
          <CusCheckbox label="Payshanba" defaultChecked />
          <CusCheckbox label="Juma" defaultChecked />
        </CusCheckboxGroup>

        <CusCheckboxGroup
          label="Majburiy tanlash"
          isRequired
          errorText="Kamida bitta variant tanlang"
        >
          <CusCheckbox label="Variant A" />
          <CusCheckbox label="Variant B" />
        </CusCheckboxGroup>
      </Section>
      {/* 12. CusSwitch — asosiy holatlar */}
      <Section title="CusSwitch — asosiy holatlar">
        <CusSwitch label="Oddiy switch" />
        <CusSwitch label="Default yoqilgan" defaultChecked />
        <CusSwitch label="Disabled" disabled />
        <CusSwitch label="Disabled + yoqilgan" disabled defaultChecked />
        <CusSwitch label="ReadOnly" readOnly defaultChecked />
      </Section>
      {/* 13. CusSwitch — label, description, error */}
      <Section title="CusSwitch — label, description, error">
        <CusSwitch label="Required switch" isRequired />
        <CusSwitch
          label="Push xabarnomalar"
          description="Yangi buyurtmalar kelganda bildirishnoma yuboriladi"
        />
        <CusSwitch
          label="Shartlarga roziman"
          description="Foydalanish shartlari va maxfiylik siyosatini o'qidim"
          errorText="Davom etish uchun roziliğingizni bildiring"
        />
      </Section>
      {/* 14. CusSwitch — hajmlar */}
      <Section title="CusSwitch — hajmlar">
        <CusSwitch size="xs" label="xs — juda kichik" defaultChecked />
        <CusSwitch size="sm" label="sm — kichik" defaultChecked />
        <CusSwitch size="md" label="md — standart (default)" defaultChecked />
        <CusSwitch size="lg" label="lg — katta" defaultChecked />
      </Section>
      {/* 15. CusTextArea — asosiy holatlar */}
      <Section title="CusTextArea — asosiy holatlar">
        <CusTextArea label="Oddiy textarea" placeholder="Matn kiriting..." />
        <CusTextArea label="Rows belgilangan" rows={5} placeholder="5 qator..." />
        <CusTextArea label="Required" isRequired placeholder="..." />
        <CusTextArea
          label="Helper text"
          helperText="Maksimal 300 ta belgi"
          placeholder="O'zingiz haqingizda..."
        />
        <CusTextArea
          label="Xato holati"
          isRequired
          errorText="Bu maydon to'ldirilishi shart"
          placeholder="..."
        />
        <CusTextArea label="Disabled" disabled value="O'zgartirib bo'lmaydi" />
      </Section>
      {/* 16. CusTextArea — autoresize */}
      <Section title="CusTextArea — autoresize">
        <CusTextArea
          label="Cheksiz o'sadi"
          autoresize
          placeholder="Yozing, textarea kengayadi..."
        />
        <CusTextArea
          label="Max 5 qator"
          autoresize
          maxH="5lh"
          placeholder="5 qatordan keyin scroll..."
        />
      </Section>
      {/* 17. CusTextArea — variantlar */}
      <Section title="CusTextArea — variantlar">
        <CusTextArea variant="outline" label="outline (default)" placeholder="Chegara bilan" />
        <CusTextArea variant="subtle" label="subtle" placeholder="Yengil fon" />
        <CusTextArea variant="flushed" label="flushed" placeholder="Faqat pastki chiziq" />
      </Section>

      {/* ── CusTable showcase ────────────────────────────────────── */}

      {/* 18. CusTable — asosiy ishlatilish */}
      <Section title="CusTable — asosiy (line variant + sort)">
        {/* columns — har bir ustun uchun tavsif:
            key    : data obyektidagi field nomi
            header : ustun sarlavhasi
            sortable: true bo'lsa, bosganda sort ishlaydi
            render : custom cell ko'rinishi (ixtiyoriy) */}
        <CusTable<Employee>
          data={employees}
          variant="line"
          size="md"
          columns={[
            {
              key: "fullName",
              header: "Ism familiya",
              sortable: true,
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={row.avatarUrl}
                    alt={row.fullName}
                    style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span style={{ color: "var(--text-default)", fontWeight: 500 }}>
                    {row.fullName}
                  </span>
                </div>
              ),
            },
            {
              key: "role",
              header: "Lavozim",
              sortable: true,
              render: (row) => {
                const map: Record<EmployeeRole, { label: string; color: string }> = {
                  [EmployeeRole.ADMIN]:    { label: "Super Admin", color: "#8b5cf6" },
                  [EmployeeRole.CASHIER]:  { label: "Kassir",      color: "#3b82f6" },
                  [EmployeeRole.OPERATOR]: { label: "Operator",    color: "#06b6d4" },
                  [EmployeeRole.SECURITY]: { label: "Security",    color: "#f59e0b" },
                  [EmployeeRole.CLEANER]:  { label: "Cleaner",     color: "#6b7280" },
                };
                const m = map[row.role];
                return (
                  <span style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    background: `${m.color}20`,
                    color: m.color,
                  }}>
                    {m.label}
                  </span>
                );
              },
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
              render: (row) => {
                const map: Record<EmployeeStatus, { label: string; color: string }> = {
                  [EmployeeStatus.ACTIVE]:   { label: "Faol",     color: "#22c55e" },
                  [EmployeeStatus.INACTIVE]: { label: "Nofaol",   color: "#6b7280" },
                  [EmployeeStatus.FIRED]:    { label: "Ishdan bo'shatilgan", color: "#ef4444" },
                  [EmployeeStatus.VACATION]: { label: "Ta'tilda",  color: "#f59e0b" },
                };
                const m = map[row.status];
                return (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: m.color, display: "inline-block",
                    }} />
                    <span style={{ color: m.color, fontSize: 12 }}>{m.label}</span>
                  </span>
                );
              },
            },
            {
              key: "phone",
              header: "Telefon",
              render: (row) => (
                <span style={{ color: "var(--text-2)", fontFamily: "monospace", fontSize: 12 }}>
                  {row.phone ?? "—"}
                </span>
              ),
            },
            {
              key: "salary",
              header: "Maosh",
              align: "right",
              sortable: true,
              render: (row) => (
                <span style={{ color: "var(--text-default)", fontWeight: 500 }}>
                  {row.salary?.toLocaleString() ?? "—"}{" "}
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>UZS</span>
                </span>
              ),
            },
          ] satisfies ColumnDef<Employee>[]}
        />
      </Section>

      {/* 19. CusTable — outline + striped + interactive + maxH scroll */}
      <Section title="CusTable — outline + striped + scroll + onRowClick">
        <CusTable<Employee>
          data={employees}
          variant="outline"
          size="sm"
          striped
          interactive
          maxH="260px"
          onRowClick={(row) => alert(`Tanlandi: ${row.fullName}`)}
          columns={[
            { key: "id",       header: "#",           width: 40, align: "center" },
            { key: "fullName", header: "Ism",          sortable: true },
            {
              key: "role",
              header: "Lavozim",
              render: (row) => (
                <span style={{ color: "var(--text-2)", fontSize: 12 }}>
                  {row.role.replace("_", " ")}
                </span>
              ),
            },
            { key: "createdAt", header: "Qo'shilgan", sortable: true },
          ] satisfies ColumnDef<Employee>[]}
          caption="Qatorni bosing — alert chiqadi"
        />
      </Section>

      {/* 20. CusTable — loading holati */}
      <Section title="CusTable — isLoading holati">
        <CusTable<Employee>
          data={[]}
          isLoading
          variant="line"
          columns={[
            { key: "fullName", header: "Ism" },
            { key: "role",     header: "Lavozim" },
            { key: "status",   header: "Status" },
          ] satisfies ColumnDef<Employee>[]}
        />
      </Section>

      {/* 21. CusTable — bo'sh holat */}
      <Section title="CusTable — bo'sh data holati">
        <CusTable<Employee>
          data={[]}
          variant="outline"
          emptyText="Hech qanday xodim topilmadi"
          columns={[
            { key: "fullName", header: "Ism" },
            { key: "role",     header: "Lavozim" },
            { key: "status",   header: "Status" },
          ] satisfies ColumnDef<Employee>[]}
        />
      </Section>

      {/* ── CusBadge showcase ────────────────────────────────────── */}

      {/* 22. CusBadge — variantlar */}
      <Section title="CusBadge — variantlar (variant prop)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <CusBadge variant="solid"   colorPalette="blue">solid</CusBadge>
          <CusBadge variant="subtle"  colorPalette="blue">subtle</CusBadge>
          <CusBadge variant="outline" colorPalette="blue">outline</CusBadge>
          <CusBadge variant="surface" colorPalette="blue">surface</CusBadge>
          <CusBadge variant="plain"   colorPalette="blue">plain</CusBadge>
        </div>
      </Section>

      {/* 23. CusBadge — ranglar */}
      <Section title="CusBadge — colorPalette (barcha ranglar)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(["gray","red","orange","yellow","green","teal","blue","cyan","purple","pink"] as const).map(
            (c) => (
              <CusBadge key={c} colorPalette={c} variant="subtle">
                {c}
              </CusBadge>
            )
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {(["gray","red","orange","yellow","green","teal","blue","cyan","purple","pink"] as const).map(
            (c) => (
              <CusBadge key={c} colorPalette={c} variant="solid">
                {c}
              </CusBadge>
            )
          )}
        </div>
      </Section>

      {/* 24. CusBadge — o'lchamlar */}
      <Section title="CusBadge — size (o'lchamlar)">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <CusBadge size="xs" colorPalette="purple">xs</CusBadge>
          <CusBadge size="sm" colorPalette="purple">sm</CusBadge>
          <CusBadge size="md" colorPalette="purple">md</CusBadge>
          <CusBadge size="lg" colorPalette="purple">lg</CusBadge>
        </div>
      </Section>

      {/* 25. CusBadge — dot, leftIcon, rightIcon */}
      <Section title="CusBadge — dot · leftIcon · rightIcon">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <CusBadge colorPalette="green"  dot>dot • Faol</CusBadge>
          <CusBadge colorPalette="red"    dot>dot • Xato</CusBadge>
          <CusBadge colorPalette="yellow" dot>dot • Kutilmoqda</CusBadge>

          <CusBadge colorPalette="blue"   variant="solid"   leftIcon={<LuStar size={10} />}>
            leftIcon
          </CusBadge>
          <CusBadge colorPalette="green"  variant="outline" rightIcon={<LuCheck size={10} />}>
            rightIcon
          </CusBadge>
          <CusBadge colorPalette="orange" variant="surface"
            leftIcon={<LuTriangleAlert size={10} />}
            rightIcon={<LuShield size={10} />}
          >
            ikkala icon
          </CusBadge>
        </div>
      </Section>

      {/* 26. CusBadge status prop — preset */}
      <Section title="CusBadge — status prop (barcha holatlar)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <CusBadge status="active" />
          <CusBadge status="inactive" />
          <CusBadge status="vacation" />
          <CusBadge status="fired" />
          <CusBadge status="pending" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          <CusBadge status="active"   variant="solid"   size="md" />
          <CusBadge status="inactive" variant="solid"   size="md" />
          <CusBadge status="vacation" variant="outline" size="md" />
          <CusBadge status="fired"    variant="outline" size="md" />
          <CusBadge status="pending"  variant="surface" size="md" />
        </div>
      </Section>

      {/* 27. CusBadge role prop — preset */}
      <Section title="CusBadge — role prop (barcha lavozimlar)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <CusBadge role="SUPER_ADMIN" />
          <CusBadge role="OPERATOR_ATTRACTION" />
          <CusBadge role="CASHIER" />
          <CusBadge role="SECURITY" />
          <CusBadge role="CLEANER" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          <CusBadge role="SUPER_ADMIN"         variant="solid"   size="md" />
          <CusBadge role="OPERATOR_ATTRACTION" variant="solid"   size="md" />
          <CusBadge role="CASHIER"             variant="outline" size="md" />
          <CusBadge role="SECURITY"            variant="outline" size="md" />
          <CusBadge role="CLEANER"             variant="subtle"  size="md" />
        </div>
      </Section>

      {/* 28. CusBadge — CusTable ichida (real use-case) */}
      <Section title="CusBadge — CusTable ichida (real use-case)">
        <CusTable<Employee>
          data={employees.slice(0, 6)}
          variant="line"
          size="sm"
          columns={[
            {
              key: "fullName",
              header: "Xodim",
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={row.avatarUrl}
                    style={{ width: 24, height: 24, borderRadius: "50%" }}
                  />
                  <span style={{ fontWeight: 500, color: "var(--text-default)" }}>
                    {row.fullName}
                  </span>
                </div>
              ),
            },
            {
              key: "role",
              header: "Lavozim",
              render: (row) => <CusBadge role={row.role} />,
            },
            {
              key: "status",
              header: "Status",
              render: (row) => {
                const map = {
                  ACTIVE:   "active",
                  INACTIVE: "inactive",
                  FIRED:    "fired",
                  VACATION: "vacation",
                } as const;
                return <CusBadge status={map[row.status] ?? "pending"} />;
              },
            },
          ] satisfies ColumnDef<Employee>[]}
        />
      </Section>

      {/* ── CusPagination showcase ───────────────────────────────── */}

      {/* 29. CusPagination — asosiy variantlar */}
      <Section title="CusPagination — asosiy (controlled)">
        {(() => {
          const [page, setPage] = useState(1);
          const PAGE_SIZE = 4;
          const paginated = useMemo(
            () => employees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
            [page]
          );
          return (
            <div className="space-y-3">
              <CusTable<Employee>
                data={paginated}
                variant="line"
                size="sm"
                columns={[
                  { key: "fullName", header: "Ism",     render: (r) => <span style={{ fontSize: 13, color: "var(--text-default)" }}>{r.fullName}</span> },
                  { key: "role",     header: "Lavozim", render: (r) => <CusBadge role={r.role} /> },
                  { key: "status",   header: "Status",  render: (r) => <CusBadge status={{ ACTIVE:"active", INACTIVE:"inactive", FIRED:"fired", VACATION:"vacation" }[r.status] as "active"} /> },
                ] satisfies ColumnDef<Employee>[]}
              />
              <CusPagination
                count={employees.length}
                pageSize={PAGE_SIZE}
                page={page}
                onPageChange={setPage}
                showPageText
              />
            </div>
          );
        })()}
      </Section>

      {/* 30. CusPagination — showSizeSelect bilan */}
      <Section title="CusPagination — showSizeSelect + siblingCount">
        {(() => {
          const [page2, setPage2] = useState(1);
          const [size2, setSize2] = useState(5);
          return (
            <CusPagination
              count={120}
              pageSize={size2}
              page={page2}
              siblingCount={2}
              onPageChange={setPage2}
              onPageSizeChange={(s) => { setSize2(s); setPage2(1); }}
              showPageText
              showSizeSelect
              pageSizeOptions={[5, 10, 20, 50]}
            />
          );
        })()}
      </Section>

      {/* 31. CusPagination — o'lchamlar */}
      <Section title="CusPagination — size (xs · sm · md)">
        <div className="space-y-4">
          <CusPagination count={100} pageSize={10} size="xs" />
          <CusPagination count={100} pageSize={10} size="sm" />
          <CusPagination count={100} pageSize={10} size="md" />
        </div>
      </Section>

      {/* 18. CusDrawer — barcha placement'lar */}
      <Section title="CusDrawer — placement'lar">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <CusButton size="sm" onClick={() => setDrawerEnd(true)}>
            O'ngdan (end)
          </CusButton>
          <CusButton size="sm" variant="outline" onClick={() => setDrawerStart(true)}>
            Chapdan (start)
          </CusButton>
          <CusButton size="sm" variant="subtle" onClick={() => setDrawerBottom(true)}>
            Pastdan (bottom)
          </CusButton>
        </div>

        {/* end — filter / form panel */}
        <CusDrawer
          open={drawerEnd}
          onClose={() => setDrawerEnd(false)}
          title="Filter panel"
          description="Qidiruvni sozlang"
          placement="end"
          size="sm"
          footer={
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <CusButton
                variant="outline"
                style={{ flex: 1 }}
                onClick={() => setDrawerEnd(false)}
              >
                Bekor qilish
              </CusButton>
              <CusButton style={{ flex: 1 }} onClick={() => setDrawerEnd(false)}>
                Qo'llash
              </CusButton>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CusInput label="Qidiruv" leftElement={<LuSearch size={14} />} placeholder="Nom bo'yicha..." />
            <CusCheckboxGroup label="Kategoriyalar" direction="column">
              <CusCheckbox label="Ekstremal" value="thrill" defaultChecked />
              <CusCheckbox label="Oilaviy" value="family" />
              <CusCheckbox label="Bolalar" value="kids" />
            </CusCheckboxGroup>
            <CusSwitch label="Faqat faol attraksionlar" defaultChecked />
          </div>
        </CusDrawer>

        {/* start — navigatsiya panel */}
        <CusDrawer
          open={drawerStart}
          onClose={() => setDrawerStart(false)}
          title="Menyu"
          placement="start"
          size="xs"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {["Dashboard", "Attraksionlar", "Xodimlar", "Hisobotlar", "Sozlamalar"].map((item) => (
              <div
                key={item}
                onClick={() => setDrawerStart(false)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: "var(--text-2)",
                  fontSize: 14,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </CusDrawer>

        {/* bottom — action sheet */}
        <CusDrawer
          open={drawerBottom}
          onClose={() => setDrawerBottom(false)}
          title="Amal tanlang"
          placement="bottom"
          size="sm"
          footer={
            <CusButton
              variant="outline"
              style={{ width: "100%" }}
              onClick={() => setDrawerBottom(false)}
            >
              Bekor qilish
            </CusButton>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Tahrirlash", color: "var(--text-2)" },
              { label: "Ko'chirish", color: "var(--text-2)" },
              { label: "O'chirish", color: "#ef4444" },
            ].map((action) => (
              <div
                key={action.label}
                onClick={() => setDrawerBottom(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: action.color,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {action.label}
              </div>
            ))}
          </div>
        </CusDrawer>
      </Section>

      {/* ── CusBreadCrumb showcase ──────────────────────────────── */}

      {/* 32. CusBreadCrumb — oddiy ishlatilish */}
      <Section title="CusBreadCrumb — oddiy">
        <CusBreadCrumb
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Xodimlar", to: "/employees" },
            { label: "Ali Valiyev" },
          ]}
        />
      </Section>

      {/* 33. CusBreadCrumb — custom separator */}
      <Section title="CusBreadCrumb — custom separator (chevron · slash)">
        <CusBreadCrumb
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Attraksionlar", to: "/attractions" },
            { label: "Roller Coaster" },
          ]}
          separator={<LuChevronRight size={12} />}
        />
        <CusBreadCrumb
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Hisobotlar", to: "/reports" },
            { label: "Iyun 2026" },
          ]}
          separator={<LuSlash size={12} />}
        />
      </Section>

      {/* 34. CusBreadCrumb — o'lchamlar */}
      <Section title="CusBreadCrumb — size (sm · md · lg)">
        <CusBreadCrumb
          size="sm"
          items={[{ label: "Dashboard", to: "/" }, { label: "sm size" }]}
        />
        <CusBreadCrumb
          size="md"
          items={[{ label: "Dashboard", to: "/" }, { label: "md size" }]}
        />
        <CusBreadCrumb
          size="lg"
          items={[{ label: "Dashboard", to: "/" }, { label: "lg size" }]}
        />
      </Section>

      {/* 35. CusBreadCrumb — sahifa sarlavhasi ichida (real use-case) */}
      <Section title="CusBreadCrumb — page header ichida (real use-case)">
        <div>
          <CusBreadCrumb
            size="sm"
            items={[
              { label: "Dashboard", to: "/" },
              { label: "Xodimlar", to: "/employees" },
              { label: "Ali Valiyev" },
            ]}
            separator={<LuChevronRight size={10} />}
          />
          <h2
            className="text-xl font-semibold mt-1"
            style={{ color: "var(--text-default)" }}
          >
            Ali Valiyev
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Operator · Faol
          </p>
        </div>
      </Section>
    </div>
  );
}
