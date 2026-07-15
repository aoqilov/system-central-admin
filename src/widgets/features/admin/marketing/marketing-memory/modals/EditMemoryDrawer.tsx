import { useEffect, useRef, useState } from "react";
import { Drawer } from "@chakra-ui/react";
import { LuImage, LuX, LuUpload, LuPencil } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseDate } from "@internationalized/date";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { updateMemory } from "../api/marketingMemoryApi";
import type { MemoryItem, MemoryCategory } from "../marketing-memory.types";

interface Props {
  open: boolean;
  onClose: () => void;
  item: MemoryItem | null;
}

interface FormState {
  title: string;
  description: string;
  category: MemoryCategory;
  date: string;
  photo_count: string;
  thumbnail: File | null;
  thumbnailPreview: string | null;
}

const CATEGORY_OPTIONS: { value: MemoryCategory; label: string; color: string }[] = [
  { value: "events", label: "Мероприятия", color: "#8b5cf6" },
  { value: "nature", label: "Природа",     color: "#22c55e" },
  { value: "guests", label: "Гости",       color: "#3b82f6" },
  { value: "other",  label: "Прочее",      color: "#6b7280" },
];

export function EditMemoryDrawer({ open, onClose, item }: Props) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    title: "", description: "", category: "events",
    date: "", photo_count: "", thumbnail: null, thumbnailPreview: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (open && item) {
      setForm({
        title: item.title,
        description: item.description,
        category: item.category,
        date: item.date,
        photo_count: String(item.photo_count),
        thumbnail: null,
        thumbnailPreview: item.thumbnail,
      });
      setErrors({});
    }
  }, [open, item]);

  const mut = useMutation({
    mutationFn: () =>
      updateMemory(item!.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        date: form.date,
        photo_count: Number(form.photo_count) || 0,
        ...(form.thumbnail ? { thumbnail: form.thumbnail } : {}),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["marketing-memory"] });
      onClose();
    },
  });

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Название не может быть пустым";
    if (!form.description.trim()) errs.description = "Описание не может быть пустым";
    if (!form.date) errs.date = "Укажите дату";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleFileSelect(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    setForm((p) => ({ ...p, thumbnail: file, thumbnailPreview: URL.createObjectURL(file) }));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0] ?? null);
  }

  function removeImage() {
    setForm((p) => ({ ...p, thumbnail: null, thumbnailPreview: null }));
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Изменить воспоминание"
      size="md"
      placement="end"
      footer={
        <>
          <Drawer.ActionTrigger asChild>
            <CusButton variant="outline" colorPalette="gray" onClick={onClose}>
              Отмена
            </CusButton>
          </Drawer.ActionTrigger>
          <CusButton
            colorPalette="blue"
            leftIcon={<LuPencil size={14} />}
            isLoading={mut.isPending}
            isDisabled={mut.isPending}
            onClick={() => { if (validate()) mut.mutate(); }}
          >
            Сохранить
          </CusButton>
        </>
      }
    >
      <div className="space-y-5">
        {/* Thumbnail */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
            Обложка (60×60)
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
          {form.thumbnailPreview ? (
            <div className="relative" style={{ width: 80, height: 80 }}>
              <img
                src={form.thumbnailPreview}
                alt="preview"
                style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover", display: "block" }}
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                <LuX size={11} />
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
              >
                <LuImage size={11} />
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2 rounded-xl cursor-pointer transition-colors"
              style={{
                border: `1.5px dashed ${isDragging ? "var(--border-2)" : "var(--border-default)"}`,
                background: isDragging ? "var(--bg-hover)" : "transparent",
                padding: "20px 0",
                justifyContent: "center",
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--bg-hover)" }}
              >
                <LuUpload size={18} style={{ color: "var(--text-dim)" }} />
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                JPG, PNG, WebP — нажмите или перетащите
              </p>
              <CusButton size="xs" variant="outline" colorPalette="gray" leftIcon={<LuImage size={12} />}>
                Выбрать файл
              </CusButton>
            </div>
          )}
        </div>

        <CusInput
          label="Название"
          placeholder="Название воспоминания..."
          value={form.title}
          onChange={(e) => {
            setForm((p) => ({ ...p, title: e.target.value }));
            if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
          }}
          errorText={errors.title}
          disabled={mut.isPending}
        />

        <CusTextArea
          label="Описание"
          placeholder="Краткое описание события..."
          value={form.description}
          onChange={(e) => {
            setForm((p) => ({ ...p, description: e.target.value }));
            if (errors.description) setErrors((p) => ({ ...p, description: undefined }));
          }}
          errorText={errors.description}
          disabled={mut.isPending}
          rows={3}
        />

        {/* Category */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
            Категория
          </p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_OPTIONS.map((opt) => {
              const isActive = form.category === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setForm((p) => ({ ...p, category: opt.value }))}
                  disabled={mut.isPending}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? opt.color : "var(--bg-hover)",
                    color: isActive ? "#fff" : "var(--text-muted)",
                    border: `1.5px solid ${isActive ? opt.color : "var(--border-default)"}`,
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <CusCalendar
          label="Дата события"
          value={form.date ? [parseDate(form.date)] : []}
          onValueChange={({ value }) => {
            const date = value[0]?.toString() ?? "";
            setForm((p) => ({ ...p, date }));
            if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
          }}
          errorText={errors.date}
          disabled={mut.isPending}
        />

        <CusInput
          label="Количество фото"
          placeholder="0"
          type="number"
          value={form.photo_count}
          onChange={(e) => setForm((p) => ({ ...p, photo_count: e.target.value }))}
          disabled={mut.isPending}
        />
      </div>
    </CusDrawer>
  );
}
