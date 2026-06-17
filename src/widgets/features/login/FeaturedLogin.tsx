import LoginCard from "./components/LoginCard";

export default function FeaturedLogin() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-default)" }}>
            ParkOps
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Control Center
          </p>
        </div>

        <LoginCard />
      </div>
    </div>
  );
}
