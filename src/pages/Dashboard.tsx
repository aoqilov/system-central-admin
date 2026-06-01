import { useState } from "react";
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
import { CusInput } from "../components/ui/inputs/CusInput";
import {
  CusCheckbox,
  CusCheckboxGroup,
} from "../components/ui/inputs/CusCheckbox";
import { CusSwitch } from "../components/ui/inputs/CusSwitch";
import { CusTextArea } from "../components/ui/inputs/CusTextArea";
import { CusDrawer } from "../components/ui/dialog/CusDrawer";
import { CusButton } from "../components/ui/buttons/CusButton";

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
    </div>
  );
}
