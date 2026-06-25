import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Drawer } from "@chakra-ui/react";
import { LuCircleAlert } from "react-icons/lu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import { uploadAttractionFiles } from "@/widgets/api-global/files-route/filesApi";
import {
  createAttraction,
  fetchAttractionsCategory,
} from "../api/attractionsApi";
import type { CreateAttractionPayload } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  manufacturer: string;
  category: string;
  price: string;
  duration: string;
  seats: string;
  age_limit: string;
  min_height: string;
  max_weight: string;
  description: string;
  main_file: File | null;
  dashboard_file: File | null;
  files: File[];
}

const DEFAULT_VALUES: FormValues = {
  name: "",
  manufacturer: "",
  category: "",
  price: "",
  duration: "",
  seats: "",
  age_limit: "",
  min_height: "",
  max_weight: "",
  description: "",
  main_file: null,
  dashboard_file: null,
  files: [],
};

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return (
    e?.response?.data?.message ?? "Xatolik yuz berdi. Qayta urinib ko'ring."
  );
}

export default function ModalAddAttraction({ open, onClose }: Props) {
  const qc = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["attraction-categories"],
    queryFn: fetchAttractionsCategory,
    staleTime: Infinity,
  });

  const createMut = useMutation({
    mutationFn: (payload: CreateAttractionPayload) => createAttraction(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attractions"] });
      qc.invalidateQueries({ queryKey: ["attraction-stats"] });
    },
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES);
      createMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: FormValues) {
    setIsUploading(true);

    const hasFiles = data.main_file || data.dashboard_file || data.files.length > 0;
    let uploadedIds: { main_file?: number; dashboard_file?: number; files?: number[] } = {};

    if (hasFiles) {
      try {
        const result = await uploadAttractionFiles({
          main_file: data.main_file,
          dashboard_file: data.dashboard_file,
          files: data.files,
        });
        uploadedIds = {
          main_file: result.main_file ?? undefined,
          dashboard_file: result.dashboard_file ?? undefined,
          files: result.files.length > 0 ? result.files : undefined,
        };
      } catch (err) {
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);

    const payload: CreateAttractionPayload = {
      name: data.name.trim(),
      manufacturer: data.manufacturer.trim(),
      category: Number(data.category),
      price: Number(data.price),
      duration: Number(data.duration),
      seats: Number(data.seats),
      age_limit: Number(data.age_limit),
      min_height: Number(data.min_height),
      max_weight: Number(data.max_weight),
      description: data.description.trim() || undefined,
      ...uploadedIds,
    };

    try {
      await createMut.mutateAsync(payload);
      onClose();
    } catch {
      // createMut.error state orqali UI da ko'rsatiladi
    }
  }

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  const isPending = isUploading || createMut.isPending;
  const loadingText = isUploading ? "Rasmlar yuklanmoqda..." : "Saqlanmoqda...";

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Yangi attraksion qo'shish"
      size="xl"
      placement="end"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Drawer.ActionTrigger asChild>
            <CusButton variant="outline" size="sm" isDisabled={isPending}>
              Bekor qilish
            </CusButton>
          </Drawer.ActionTrigger>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="blue"
            isLoading={isPending}
            loadingText={loadingText}
            onClick={handleSubmit(onSubmit)}
          >
            Saqlash
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {createMut.error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <LuCircleAlert
              size={15}
              style={{ color: "#ef4444", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: "#ef4444" }}>
              {getApiError(createMut.error)}
            </span>
          </div>
        )}

        {/* Rasmlar */}
        <Section title="Rasmlar">
          <Row2>
            <Controller
              control={control}
              name="main_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Asosiy rasm"
                  sublabel="Sayt va dashboardda ko'rsatiladi"
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 5 MB"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
            <Controller
              control={control}
              name="dashboard_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Dashboard rasmi"
                  sublabel="Admin panelda ko'rsatiladi"
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 5 MB"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
          </Row2>
          <Controller
            control={control}
            name="files"
            render={({ field, fieldState }) => (
              <CusFileUpload
                label="Galereya"
                sublabel="Max 4 ta rasm qo'shishingiz mumkin"
                accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                maxFiles={4}
                maxFileSize={10 * 1024 * 1024}
                helperText="JPG, PNG, WEBP · Max 10 MB"
                errorText={fieldState.error?.message}
                onFileChange={(files) => field.onChange(files)}
              />
            )}
          />
        </Section>

        {/* Asosiy ma'lumotlar */}
        <Section title="Asosiy ma'lumotlar">
          <Row2>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Majburiy maydon",
                minLength: { value: 2, message: "Minimum 2 ta belgi" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Nomi"
                  isRequired
                  placeholder="Roller Coaster"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="manufacturer"
              rules={{ required: "Majburiy maydon" }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Ishlab chiqaruvchi"
                  isRequired
                  placeholder="Intamin"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>

          <Controller
            control={control}
            name="category"
            rules={{ required: "Kategoriyani tanlang" }}
            render={({ field, fieldState }) => (
              <div>
                <Label text="Kategoriya" required />
                <CusSelect
                  options={categoryOptions}
                  placeholder="Kategoriya tanlang"
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                />
                {fieldState.error && (
                  <ErrorText text={fieldState.error.message ?? ""} />
                )}
              </div>
            )}
          />
        </Section>

        {/* Texnik ma'lumotlar */}
        <Section title="Texnik ma'lumotlar">
          <Row2>
            <Controller
              control={control}
              name="price"
              rules={{
                required: "Majburiy maydon",
                min: { value: 1, message: "0 dan katta bo'lishi kerak" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Narxi (UZS)"
                  isRequired
                  placeholder="25000"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="duration"
              rules={{
                required: "Majburiy maydon",
                min: { value: 1, message: "0 dan katta bo'lishi kerak" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Davomiyligi (daqiqa)"
                  isRequired
                  placeholder="5"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
          <Row2>
            <Controller
              control={control}
              name="seats"
              rules={{
                required: "Majburiy maydon",
                min: { value: 1, message: "0 dan katta bo'lishi kerak" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="O'rindiqlar soni"
                  isRequired
                  placeholder="24"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
        </Section>

        {/* Cheklovlar */}
        <Section title="Cheklovlar">
          <Row2>
            <Controller
              control={control}
              name="age_limit"
              rules={{
                required: "Majburiy maydon",
                min: { value: 0, message: "0 yoki undan katta" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Minimal yosh"
                  isRequired
                  placeholder="12"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="min_height"
              rules={{
                required: "Majburiy maydon",
                min: { value: 1, message: "0 dan katta bo'lishi kerak" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Minimal bo'y (sm)"
                  isRequired
                  placeholder="120"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
          <Row2>
            <Controller
              control={control}
              name="max_weight"
              rules={{
                required: "Majburiy maydon",
                min: { value: 1, message: "0 dan katta bo'lishi kerak" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Maksimal og'irlik (kg)"
                  isRequired
                  placeholder="100"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
        </Section>

        {/* Qo'shimcha */}
        <Section title="Qo'shimcha">
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <CusTextArea
                ref={field.ref}
                label="Tavsif"
                placeholder="Attraksion haqida qisqacha ma'lumot..."
                rows={3}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorText={fieldState.error?.message}
              />
            )}
          />
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
  children: React.ReactNode;
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

function Row2({ children }: { children: React.ReactNode }) {
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
