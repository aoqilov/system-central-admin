# ParkOps Control Center — CLAUDE.md

Park boshqaruv tizimi: admin dashboard + operator mobile UI. React + Vite + TypeScript.

---

## Stack

| Tool | Version |
|------|---------|
| React | 18 |
| TypeScript | strict mode |
| Vite | 8 |
| Tailwind CSS | 3 (custom breakpoints) |
| Recharts | 3 |
| React Router | 7 |
| TanStack Query | 5 |
| Axios | latest |
| react-icons | lucide set (`react-icons/lu`) |
| dayjs | date formatting |
| framer-motion | animations |
| vite-plugin-pwa | PWA support |
| Chakra UI | v3 |

---

## Path Alias

`@` → `src/` (configured in `vite.config.ts` + `tsconfig.json`).

```ts
// vite.config.ts
resolve: { alias: { '@': path.resolve(__dirname, './src') } }

// tsconfig.json
"paths": { "@/*": ["./src/*"] }
// No baseUrl needed with moduleResolution: bundler
```

Always import with `@/` — never use relative `../../../` paths across feature boundaries.

---

## API Config (`src/api-config/`)

```
axiosInstance.ts   → axios instance, baseURL = VITE_API_URL + /api/v1
interceptors.ts    → Bearer token injector + 401 → redirect /login
queryClient.ts     → TanStack QueryClient (staleTime 5min, retry 1)
```

`interceptors.ts` is imported once in `main.tsx` (side-effect only).  
`queryClient` is provided via `<QueryClientProvider>` in `main.tsx`.

### Env vars
```
VITE_API_URL=https://192.168.0.146:4050
VITE_TOKEN_KEY=parkops_token   (optional, defaults to "parkops_token")
```

---

## Routes

### Admin (`AppLayout` + `AuthGuard roles={["admin"]}`)
| Path | Page |
|------|------|
| `/` | Dashboard |
| `/live-monitor` | LiveMonitor (direct sub-routes, no separate redirect page) |
| `/live-monitor/attraction` | LiveMonitorAttraction |
| `/live-monitor/employees` | LiveMonitorEmployees |
| `/live-monitor/kassa` | LiveMonitorKassa |
| `/employees` | Employees table |
| `/employee/:id` | EmployeeDetail |
| `/attractions` | Attractions table |
| `/attraction/:id` | AttractionDetail |
| `/kassa` | Kassa list |
| `/kassa/:id` | KassaDetail |
| `/reports/kassa` | ReportsKassa |
| `/reports/employees` | ReportsEmployees |
| `/reports/attractions` | ReportsAttractions |
| `/settings` | Settings |
| `/support` | Support |

### Kassa (`KassaLayout` + `AuthGuard roles={["kassa"]}`)
| Path | Page |
|------|------|
| `/rolekassa` | KassaHome |
| `/rolekassa/stats` | KassaStats |

### Operator (`OperatorLayout` + `AuthGuard roles={["operator"]}`)
| Path | Page |
|------|------|
| `/operator` | OperatorHome |
| `/operator/payment` | OperatorPayment |
| `/operator/profile` | OperatorProfile |

### Auth
- `/login` — Login
- `/unauthorized` — Unauthorized
- `*` — NotFound

---

## Auth System

Login flow: `POST /auth/login` → JWT → decode `role_id` → `GET /roles` → map to role name → save to localStorage → navigate.

All auth utilities live in `src/widgets/features/login/api/authApi.ts`:
```ts
UserRole = "superadmin" | "admin" | "operator" | "kassa"
saveAuth(token, role)     // saves to localStorage
getStoredToken()
getStoredRole()
clearAuth()
decodeToken(token)        // atob JWT payload decode
getRoleDefaultPath(role)  // admin→"/", operator→"/operator", kassa→"/rolekassa"
```

`AuthGuard` (`src/middleware/AuthGuard.tsx`) imports from `authApi.ts`.

Phone format for login: `+998 XX XXX XX XX` (client display), stripped to `+998XXXXXXXXX` for API.

---

## FSD Widget Pattern

All features live in `src/widgets/features/<role>/<feature>/` with:
```
api/          → <feature>Api.ts  (axios calls, inline endpoints — no central endpoints.ts)
types/        → index.ts
hooks/        → use<Feature>.ts
components/   → sub-components
modals/       → modal components (optional)
Feature<Name>.tsx  → root export, thin composition
```

Pages (`src/pages/`) are thin wrappers:
```tsx
import Feature<Name> from "@/widgets/features/...";
export default function Page() { return <Feature<Name> />; }
```

### Shared widgets (`src/widgets/shared-ui/`)
```
PageHeader.tsx   → title, highlight?, label?, subtitle?  (used on every admin page)
```

---

## Custom UI Components (`src/components/ui/`)

Always use these — never raw HTML equivalents.

```
CusButton        → buttons/CusButton.tsx      (isDisabled prop, NOT disabled)
CusBadge         → badge/CusBadge.tsx
CusTable         → table/CusTable.tsx
CusPagination    → table/CusPagination.tsx
CusInput         → inputs/CusInput.tsx
CusCheckbox      → inputs/CusCheckbox.tsx
CusSwitch        → inputs/CusSwitch.tsx
CusTextArea      → inputs/CusTextArea.tsx
CusSelect        → select/CusSelect.tsx
CusDialog        → dialog/CusDialog.tsx
CusDrawer        → dialog/CusDrawer.tsx       (placement="end" for detail drawers)
CusPopover       → popover/CusPopover.tsx
CusBreadCrumb    → bread-crumb/CusBreadCrumb.tsx
```

### Shared Card Components (`src/components/shared/card/`)
```
CusCard         → wrapper card
CusCardHeader   → card header with title + actions
CusInfoRow      → label/value row inside cards
```

---

## Theming — CSS Variables

Tailwind color tokens (`park.*`) map to CSS variables:

```
park-bg         → var(--bg-main)
park-bgCard     → var(--bg-second)
park-bgHover    → var(--bg-hover)
park-bgInput    → var(--bg-input)
park-bgTooltip  → var(--bg-tooltip)
park-border     → var(--border-default)
park-border2    → var(--border-2)
park-text       → var(--text-default)
park-text2      → var(--text-2)
park-text3      → var(--text-3)
park-text4      → var(--text-4)
park-textMuted  → var(--text-muted)
park-textDim    → var(--text-dim)
```

Dark mode: `darkMode: 'class'` — toggle class on `<html>`.  
Font: `Plus Jakarta Sans` (sans), `JetBrains Mono` (mono).

---

## Responsive Breakpoints

**Never use** `sm:`, `md:`, `lg:` — only custom breakpoints:

```
(no prefix)  → 0–479px     mobile default
tablet:      → 480px+
desktop:     → 1020px+
wide:        → 1440px+
```

Common patterns:
```tsx
// Grid
className="grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3"

// Charts side by side
className="grid-cols-1 desktop:grid-cols-2"

// Padding
className="p-4 tablet:p-6"

// Tables always wrap
<div className="overflow-x-auto"><table className="min-w-[600px]" /></div>
```

---

## Key Layout Patterns

### AttractionDetail / KassaDetail
```tsx
// Row 1: info + operator card
<div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] items-start gap-4">
  <InfoCard />
  <OperatorCard />   {/* avatar self-stretch w-120, blur ghost if none */}
</div>

// Body: charts + aside
<div className="grid grid-cols-1 desktop:grid-cols-[3fr_1.2fr] items-start gap-4">
  <div className="space-y-4">/* charts */</div>
  <AsideInfoCard />
</div>
```

### Recharts Tooltip (avoids TS error)
```ts
interface TipProps {
  active?: boolean;
  payload?: Array<{ value?: number; name?: string }>;
  label?: string;
}
```
Do NOT use `TooltipProps<number, string>` — causes TS destructuring error.

### Array Last Element
```ts
arr.slice(-1)[0]   // ✓ correct
arr.at(-1)         // ✗ requires es2022 lib — not configured
```

---

## Operator Pages Rules (`src/pages/forOperator/`)

Pages inside `OperatorLayout` are used by non-technical staff on mobile/tablet:

- **Max width**: 768px, `mx-auto`, mobile-first
- **Buttons**: min-height 56px, always icon + text
- **Numbers**: 20–28px+, semibold — must be larger than labels
- **Tap feedback**: `scale(0.95–0.98)` + bg change, 100–150ms
- **No hidden gestures**, one main action per screen
- High contrast, no clutter, group with spacing not borders

---

## i18n

Custom hook: `useTranslation(prefix)` — translation keys in `ru.json` and `uz.json`.

---

## Sidebar Nav Order

Dashboard → LiveMonitor → Employees → Attractions → Kassa (`LuBanknote`) → Reports → [Settings, Support]

---

## Kassa Page Charts

- **Chart 1**: Stacked BarChart — each active kassa = color stack, `stackId="a"`, custom legend div
- **Chart 2**: Grouped BarChart — Naqd `#22c55e` / UzCard `#3b82f6` / Karta `#8b5cf6`; `<Legend formatter>` Uzbek names; `radius={[6,6,0,0]}`
