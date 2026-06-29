import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { SmenaProvider } from "@/context/SmenaContext";
import { KassaSidebar, KassaBottomNav } from "./sidebar/KassaSidebar";
import { KassaHeader } from "./header/KassaHeader";

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}

function KassaLayoutBody() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen tablet:flex" style={{ background: "var(--bg-main)" }}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 tablet:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <KassaSidebar
        collapsed={collapsed}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <KassaHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((o) => !o)}
        />

        <main className="flex-1 pb-20 tablet:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <KassaBottomNav />
    </div>
  );
}

export default function KassaLayout() {
  return (
    <SmenaProvider>
      <KassaLayoutBody />
    </SmenaProvider>
  );
}
