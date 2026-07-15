import React from "react";

const Dashboard = () => {
  return (
    <div className="px-4 tablet:p-6 ">
      <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
        Обзор
      </p>
      <h1
        className="text-2xl font-semibold"
        style={{ color: "var(--text-default)" }}
      >
        Дашборд
      </h1>
      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
        С возвращением. Вот что происходит сегодня.
      </p>
    </div>
  );
};

export default Dashboard;
