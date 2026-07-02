import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Drawer } from "@chakra-ui/react";
import { LuCircleAlert } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import {
  uploadAttractionFiles,
  getFileUrl,
} from "@/widgets/api-global/files-route/filesApi";
import {
  updateAttraction,
  fetchAttractionsCategory,
} from "../api/attractionsApi";
import type { Attraction, UpdateAttractionPayload } from "../types";

const STATUS_OPTIONS = [
  { label: "Faol", value: "active" },
  { label: "Nofaol", value: "inactive" },
  { label: "Texnik xizmat", value: "maintenance" },
  { label: "Yopiq", value: "closed" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  attraction: Attraction;
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
  device: string;
  description: string;
  status: string;
  new_main_file: File | null;
  new_dashboard_file: File | null;
  new_files: File[];
}

function toFormValues(a: Attraction): FormValues {
  return {
    name: a.name,
    manufacturer: a.manufacturer,
    category: String(a.category),
    price: String(a.price),
    duration: String(a.duration),
    seats: String(a.seats),
    age_limit: String(a.age_limit),
    min_height: String(a.min_height),
    max_weight: String(a.max_weight),
    device: a.device ? String(a.device) : "",
    description: a.description ?? "",
    status: a.status,
    new_main_file: null,
    new_dashboard_file: null,
    new_files: [],
  };
}

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Xatolik yuz berdi. Qayta urinib ko'ring.";
}

export default function ModalEditAttraction({ open, onClose, attraction }: Props) {
  const qc = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [remainingFileIds, setRemainingFileIds] = useState<number[]>(
    attraction.files ?? []
  );

  const { data: categories = [] } = useQuery({
    queryKey: ["attraction-categories"],
    queryFn: fetchAttractionsCategory,
    staleTime: Infinity,
  });

  const updateMut = useMutation({
    mutationFn: (payload: UpdateAttractionPayload) =>
      updateAttraction(attraction.id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attractions"] });
      qc.invalidateQueries({ queryKey: ["attraction-stats"] });
    },
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: toFormValues(attraction),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(attraction));
      updateMut.reset();
      setRemainingFileIds(attraction.files ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: FormValues) {
    setIsUploading(true);

    const hasNewFiles =
      data.new_main_file || data.new_dashboard_file || data.new_files.length > 0;

    let fileIds: {
      main_file?: number;
      dashboard_file?: number;
      files?: number[];
    } = {
      main_file: attraction.main_file || undefined,
      dashboard_file: attraction.dashboard_file || undefined,
      files: remainingFileIds.length > 0 ? remainingFileIds : undefined,
    };

    if (hasNewFiles) {
      try {
        const result = await uploadAttractionFiles({
          main_file: data.new_main_file,
          dashboard_file: data.new_dashboard_file,
          files: data.new_files,
        });
        if (result.main_file != null) fileIds.main_file = result.main_file;
        if (result.dashboard_file != null) fileIds.dashboard_file = result.dashboard_file;
        if (result.files.length > 0)
          fileIds.files = [...remainingFileIds, ...result.files];
      } catch {
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);

    const payload: UpdateAttractionPayload = {
      name: data.name.trim(),
      manufacturer: data.manufacturer.trim(),
      category: Number(data.category),
      price: Number(data.price),
      duration: Number(data.duration),
      seats: Number(data.seats),
      age_limit: Number(data.age_limit),
      min_height: Number(data.min_height),
      max_weight: Number(data.max_weight),
      device: data.device ? Number(data.device) : undefined,
      description: data.description.trim() || undefined,
      status: data.status,
      ...fileIds,
    };

    try {
      await updateMut.mutateAsync(payload);
      onClose();
    } catch {
      // updateMut.error state orqali UI da ko'rsatiladi
    }
  }

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  const isPending = isUploading || updateMut.isPending;
  const loadingText = isUploading ? "Rasmlar yuklanmoqda..." : "Saqlanmoqda...";

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Attraksionni tahrirlash"
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
            colorPalette="orange"
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
        {updateMut.error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <LuCircleAlert size={15} style={{ color: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#ef4444" }}>
              {getApiError(updateMut.error)}
            </span>
          </div>
        )}

        {/* Rasmlar */}
        <Section title="Rasmlar">
          <Row2>
            <Controller
              control={control}
              name="new_main_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Asosiy rasm"
                  sublabel={
                    attraction.main_file
                      ? "Yangi yuklasangiz almashadi"
                      : "Sayt va dashboardda ko'rsatiladi"
                  }
                  currentImageUrl={
                    attraction.main_file ? getFileUrl(attraction.main_file) : undefined
                  }
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 10 MB"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
            <Controller
              control={control}
              name="new_dashboard_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Dashboard rasmi"
                  sublabel={
                    attraction.dashboard_file
                      ? "Yangi yuklasangiz almashadi"
                      : "Admin panelda ko'rsatiladi"
                  }
                  currentImageUrl={
                    attraction.dashboard_file
                      ? getFileUrl(attraction.dashboard_file)
                      : undefined
                  }
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 10 MB"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
          </Row2>
          <Controller
            control={control}
            name="new_files"
            render={({ field, fieldState }) => (
              <CusFileUpload
                label="Galereya"
                sublabel="Mavjud rasmlarni X bilan o'chirishingiz yoki yangi qo'shishingiz mumkin"
                currentImageUrls={
                  remainingFileIds.length > 0
                    ? remainingFileIds.map((id) => getFileUrl(id))
                    : undefined
                }
                onRemoveCurrentImageUrl={(i) =>
                  setRemainingFileIds((prev) => prev.filter((_, idx) => idx !== i))
                }
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
          <Row2>
            <Controller
              control={control}
              name="device"
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Device ID"
                  placeholder="abc123"
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
          </Row2>
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
            name="status"
            rules={{ required: "Statusni tanlang" }}
            render={({ field, fieldState }) => (
              <div>
                <Label text="Status" required />
                <CusSelect
                  options={STATUS_OPTIONS}
                  placeholder="Status tanlang"
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                />
                {fieldState.error && (
                  <ErrorText text={fieldState.error.message ?? ""} />
                )}
              </div>
            )}
          />
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

// ─── Helper components ────────────────────────────────────────────────────────


function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>
      {text}
      {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </p>
  );
}

function ErrorText({ text }: { text: string }) {
  return <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{text}</p>;
}
