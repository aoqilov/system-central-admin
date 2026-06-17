import { useParams, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuTriangleAlert, LuRefreshCw } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fetchEmployeeById, fetchRoles } from "./api/employesDetailApi";
import EmployeeHeaderCard from "./components/EmployeeHeaderCard";
import EmployeeInfoSidebar from "./components/EmployeeInfoSidebar";

export default function FeatureEmployeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: employee,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployeeById(Number(id)),
    enabled: !!id,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const roleName = roles.find((r) => r.id === employee?.role)?.name ?? "";

  if (isPending) {
    return (
      <div
        className="p-6 flex items-center justify-center"
        style={{ minHeight: 300 }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "3px solid var(--border-default)",
              borderTopColor: "#3b82f6",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center gap-3"
        style={{ minHeight: 300 }}
      >
        <LuTriangleAlert size={28} style={{ color: "#ef4444" }} />
        <p
          className="text-base font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Ошибка загрузки данных
        </p>
        <CusButton
          size="sm"
          variant="outline"
          leftIcon={<LuRefreshCw size={13} />}
          onClick={() => refetch()}
        >
          Повторить
        </CusButton>
      </div>
    );
  }

  if (!employee) {
    return (
      <div
        className="p-6 flex flex-col items-center justify-center gap-3"
        style={{ minHeight: 300 }}
      >
        <p
          className="text-base font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Сотрудник не найден
        </p>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>ID: {id}</p>
        <CusButton
          size="sm"
          variant="outline"
          leftIcon={<LuArrowLeft size={14} />}
          onClick={() => navigate("/employees")}
        >
          Назад к списку
        </CusButton>
      </div>
    );
  }

  return (
    <div className="p-4 tablet:p-6 space-y-5">
      <CusButton
        variant="outline"
        colorPalette="gray"
        size="xs"
        onClick={() => navigate("/employees")}
      >
        <LuArrowLeft size={14} />
        Назад
      </CusButton>

      <EmployeeHeaderCard employee={employee} roleName={roleName} />

      <div className="grid grid-cols-1 desktop:grid-cols-[1fr_300px] gap-4">
        <div />
        <EmployeeInfoSidebar employee={employee} />
      </div>
    </div>
  );
}
