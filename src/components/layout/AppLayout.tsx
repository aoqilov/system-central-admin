import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import {
  CusBreadCrumb,
  type BreadCrumbItem,
} from "../ui/bread-crumb/CusBreadCrumb";
import { LuChevronRight } from "react-icons/lu";
import { useTranslation } from "../../i18n/languageConfig";

const SECTION_MAP: Record<string, { key: string; parentPath?: string }> = {
  "live-monitor": { key: "sidebar.liveMonitor" },
  employees:      { key: "sidebar.employees" },
  employee:       { key: "sidebar.employees",  parentPath: "/employees" },
  attractions:    { key: "sidebar.attractions" },
  attraction:     { key: "sidebar.attractions", parentPath: "/attractions" },
  reports:        { key: "sidebar.reports" },
  settings:       { key: "sidebar.settings" },
  support:        { key: "sidebar.support" },
};

function useBreadcrumbs(): BreadCrumbItem[] {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  if (pathname === "/") return [{ label: t("sidebar.dashboard") }];

  const [section, id] = pathname.split("/").filter(Boolean);
  const mapped = SECTION_MAP[section];
  const label = mapped ? t(mapped.key) : section;
  const items: BreadCrumbItem[] = [{ label: t("sidebar.dashboard"), to: "/" }];

  if (id && mapped?.parentPath) {
    items.push({ label, to: mapped.parentPath });
    items.push({ label: `#${id}` });
  } else {
    items.push({ label });
  }

  return items;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="min-h-screen desktop:flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 desktop:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavClick={() => {
          if (window.innerWidth < 1020) setSidebarOpen(false);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />
        <main>
          <div
            className="px-4 tablet:px-6 py-2 "
            style={{ borderColor: "var(--border-default)" }}
          >
            <CusBreadCrumb
              items={breadcrumbs}
              separator={<LuChevronRight size={10} />}
            />
          </div>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
