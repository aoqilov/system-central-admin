import { useEffect, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { LuCircleAlert } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, updateEmployee } from "../api/employeesApi";
import type { ApiEmployee, UpdateEmployeePayload } from "../types";
import { formatPhoneNumber } from "@/widgets/features/login/hooks/useLoginForm";

interface Props {
  open: boolean;
  onClose: () => void;
  employee: ApiEmployee;
}

interface FormValues {
  firstname: string;
  lastname: string;
  date_of_birth: string;
  phone: string;
  telegram_username: string;
  password: string;
  role: string;
  salary: string;
  status: string;
}

function phoneToDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("998") ? digits.slice(3) : digits;
  return formatPhoneNumber(local.slice(0, 9));
}

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Произошла ошибка. Попробуйте снова.";
}

const STATUS_OPTIONS = [
  { label: "Активный", value: "active" },
  { label: "Неактивный", value: "inactive" },
  { label: "В отпуске", value: "vacation" },
  { label: "Уволен", value: "fired" },
];

export default function ModalEditEmploye({ open, onClose, employee }: Props) {
  const qc = useQueryClient();

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateEmployeePayload;
    }) => updateEmployee(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      date_of_birth: "",
      phone: "",
      telegram_username: "",
      password: "",
      role: "",
      salary: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstname: employee.firstname,
        lastname: employee.lastname,
        date_of_birth: employee.date_of_birth ?? "",
        phone: phoneToDisplay(employee.phone_number),
        telegram_username: employee.telegram_username ?? "",
        password: "",
        role: String(employee.role),
        salary: employee.salary ? String(employee.salary) : "",
        status: employee.status ?? "active",
      });
      updateMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, employee.id]);

  function onSubmit(data: FormValues) {
    const rawPhone = data.phone.replace(/\D/g, "");
    const apiPhone = employee.phone_number.replace(/\D/g, "");
    const payload: UpdateEmployeePayload = {};

    if (data.firstname.trim() !== employee.firstname)
      payload.firstname = data.firstname.trim();
    if (data.lastname.trim() !== employee.lastname)
      payload.lastname = data.lastname.trim();
    if (data.date_of_birth !== employee.date_of_birth)
      payload.date_of_birth = data.date_of_birth;
    if (rawPhone !== apiPhone) payload.phone_number = `+${rawPhone.replace(/^\+/, "")}`;
    if (data.telegram_username.trim() !== (employee.telegram_username ?? ""))
      payload.telegram_username = data.telegram_username.trim();
    if (data.password) payload.password = data.password;
    if (Number(data.role) !== employee.role) payload.role = Number(data.role);
    if (
      data.salary
        ? Number(data.salary) !== employee.salary
        : employee.salary !== 0
    )
      payload.salary = data.salary ? Number(data.salary) : null;
    if (data.status !== employee.status) payload.status = data.status;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    updateMut.mutate({ id: employee.id, payload }, { onSuccess: onClose });
  }

  const roleOptions = roles.map((r) => ({
    label: r.name,
    value: String(r.id),
  }));

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Редактировать сотрудника"
      size="xl"
      placement="end"
      footer={
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <CusButton
            variant="outline"
            size="sm"
            isDisabled={updateMut.isPending}
            onClick={onClose}
          >
            Отмена
          </CusButton>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="blue"
            onClick={handleSubmit(onSubmit)}
            isDisabled={updateMut.isPending}
          >
            {updateMut.isPending ? "Сохранение..." : "Сохранить"}
          </CusButton>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {updateMut.error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <LuCircleAlert
              size={15}
              style={{ color: "#ef4444", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: "#ef4444" }}>
              {getApiError(updateMut.error)}
            </span>
          </div>
        )}

        <Section title="Личные данные">
          <Row2>
            <CusInput
              label="Имя"
              isRequired
              placeholder="Иван"
              errorText={errors.firstname?.message}
              {...register("firstname", {
                required: "Обязательное поле",
                minLength: { value: 2, message: "Минимум 2 символа" },
              })}
            />
            <CusInput
              label="Фамилия"
              isRequired
              placeholder="Иванов"
              errorText={errors.lastname?.message}
              {...register("lastname", {
                required: "Обязательное поле",
                minLength: { value: 2, message: "Минимум 2 символа" },
              })}
            />
          </Row2>
          <CusInput
            label="Дата рождения"
            isRequired
            type="date"
            errorText={errors.date_of_birth?.message}
            {...register("date_of_birth", {
              required: "Укажите дату рождения",
            })}
          />
        </Section>

        <Section title="Контактная информация">
          <Controller
            control={control}
            name="phone"
            rules={{
              validate: (v) =>
                v.replace(/\s/g, "").length >= 13 ||
                "Введите полный номер (+998XXXXXXXXX)",
            }}
            render={({ field, fieldState }) => (
              <CusInput
                label="Телефон"
                isRequired
                placeholder="+998 90 000 00 00"
                value={field.value}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  const local = (
                    digits.startsWith("998") ? digits.slice(3) : digits
                  ).slice(0, 9);
                  field.onChange(formatPhoneNumber(local));
                }}
                errorText={fieldState.error?.message}
              />
            )}
          />
          <CusInput
            label="Telegram"
            placeholder="@username"
            {...register("telegram_username")}
          />
        </Section>

        <Section title="Доступ">
          <CusInput
            label="Новый пароль (необязательно)"
            type="password"
            placeholder="Минимум 6 символов"
            errorText={errors.password?.message}
            {...register("password", {
              minLength: { value: 6, message: "Минимум 6 символов" },
            })}
          />
        </Section>

        <Section title="Рабочие данные">
          <div>
            <Label text="Роль" required />
            <Controller
              control={control}
              name="role"
              rules={{ required: "Выберите роль" }}
              render={({ field, fieldState }) => (
                <>
                  <CusSelect
                    options={roleOptions}
                    placeholder="Выберите роль"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error && (
                    <ErrorText text={fieldState.error.message ?? ""} />
                  )}
                </>
              )}
            />
          </div>
          <CusInput
            label="Оклад (UZS)"
            placeholder="2 500 000"
            type="number"
            {...register("salary")}
          />
          <div>
            <Label text="Статус" />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <CusSelect
                  options={STATUS_OPTIONS}
                  placeholder="Статус"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </Section>
      </div>
    </CusDrawer>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 12,
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Row2({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-2)",
        marginBottom: 6,
      }}
    >
      {text}
      {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </p>
  );
}

function ErrorText({ text }: { text: string }) {
  return <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{text}</p>;
}
