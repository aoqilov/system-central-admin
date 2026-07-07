import { useEffect, useState, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { parseDate } from "@internationalized/date";
import { LuCircleAlert } from "react-icons/lu";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import CusSelect from "@/components/ui/select/CusSelect";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, updateEmployee } from "../api/employeesApi";
import type { ApiEmployee, UpdateEmployeePayload } from "../types";
import { formatPhoneNumber } from "@/widgets/features/login/hooks/useLoginForm";
import { uploadFile, getFileUrl } from "@/widgets/api-global/files-route/filesApi";

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
  new_file: File | null;
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
  const [isUploading, setIsUploading] = useState(false);

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
    control,
    handleSubmit,
    reset,
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
      new_file: null,
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
        new_file: null,
      });
      updateMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, employee.id]);

  async function onSubmit(data: FormValues) {
    const rawPhone = data.phone.replace(/\D/g, "");
    const apiPhone = employee.phone_number.replace(/\D/g, "");
    const payload: UpdateEmployeePayload = {};

    if (data.new_file) {
      setIsUploading(true);
      try {
        payload.file = await uploadFile(data.new_file);
      } catch {
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

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

  const isPending = isUploading || updateMut.isPending;
  const loadingText = isUploading ? "Фото загружается..." : "Сохранение...";

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
            isDisabled={isPending}
            onClick={onClose}
          >
            Отмена
          </CusButton>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="blue"
            onClick={handleSubmit(onSubmit)}
            isLoading={isPending}
            loadingText={loadingText}
          >
            Сохранить
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

        <Section title="Фото">
          <Controller
            control={control}
            name="new_file"
            render={({ field, fieldState }) => (
              <CusFileUpload
                label="Фото сотрудника"
                sublabel={employee.file ? "Загрузите новое фото, чтобы заменить текущее" : undefined}
                currentImageUrl={employee.file ? getFileUrl(employee.file) : undefined}
                accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                maxFiles={1}
                maxFileSize={10 * 1024 * 1024}
                helperText="JPG, PNG, WEBP · Max 10 MB"
                errorText={fieldState.error?.message}
                onFileChange={(files) => field.onChange(files[0] ?? null)}
              />
            )}
          />
        </Section>

        <Section title="Личные данные">
          <Row2>
            <Controller
              control={control}
              name="firstname"
              rules={{ required: "Обязательное поле", minLength: { value: 2, message: "Минимум 2 символа" } }}
              render={({ field, fieldState }) => (
                <CusInput
                  label="Имя"
                  isRequired
                  placeholder="Иван"
                  errorText={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="lastname"
              rules={{ required: "Обязательное поле", minLength: { value: 2, message: "Минимум 2 символа" } }}
              render={({ field, fieldState }) => (
                <CusInput
                  label="Фамилия"
                  isRequired
                  placeholder="Иванов"
                  errorText={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </Row2>
          <Controller
            control={control}
            name="date_of_birth"
            rules={{ required: "Укажите дату рождения" }}
            render={({ field, fieldState }) => (
              <CusCalendar
                label="Дата рождения"
                isRequired
                errorText={fieldState.error?.message}
                value={field.value ? [parseDate(field.value.slice(0, 10))] : undefined}
                onValueChange={({ value }) => {
                  const v = value[0];
                  field.onChange(
                    v
                      ? `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`
                      : ""
                  );
                }}
              />
            )}
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
          <Controller
            control={control}
            name="telegram_username"
            render={({ field }) => (
              <CusInput
                label="Telegram"
                placeholder="@username"
                {...field}
              />
            )}
          />
        </Section>

        <Section title="Доступ">
          <Controller
            control={control}
            name="password"
            rules={{
              minLength: { value: 6, message: "Минимум 6 символов" },
              maxLength: { value: 6, message: "Максимум 6 символов" },
            }}
            render={({ field, fieldState }) => (
              <CusInput
                label="Новый пароль (необязательно)"
                type="password"
                placeholder="6 символов"
                maxLength={6}
                errorText={fieldState.error?.message}
                {...field}
              />
            )}
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
          <Controller
            control={control}
            name="salary"
            render={({ field }) => (
              <CusInput
                label="Оклад (UZS)"
                placeholder="2 500 000"
                type="number"
                {...field}
              />
            )}
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
