import React from "react";

const Dashboard = () => {
  return (
    <div className="px-4 tablet:p-6 ">
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
  );
};

export default Dashboard;
