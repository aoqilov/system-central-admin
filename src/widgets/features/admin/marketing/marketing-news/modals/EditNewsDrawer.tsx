import { useEffect, useRef, useState } from "react";
import { Drawer } from "@chakra-ui/react";
import { LuImage, LuX, LuUpload, LuPencil, LuInfo } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseDate } from "@internationalized/date";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { updateNews } from "../api/marketingNewsApi";
import type { NewsItem, NewsStatus } from "../marketing-news.types";

interface Props {
  open: boolean;
  onClose: () => void;
  item: NewsItem | null;
}

interface FormState {
  title: string;
  paragraph: string;
  expired_at: string;
  status: NewsStatus;
  imageFile: File | null;
  imagePreview: string | null;
}

const STATUS_OPTIONS: { value: NewsStatus; label: string; color: string; bg: string }[] = [
  { value: "planned",  label: "Планируется", color: "#6366f1", bg: "#eef2ff" },
  { value: "active",   label: "Активна",     color: "#22c55e", bg: "#f0fdf4" },
  { value: "archived", label: "Архив",        color: "#6b7280", bg: "#f3f4f6" },
];

export function EditNewsDrawer({ open, onClose, item }: Props) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    paragraph: "",
    expired_at: "",
    status: "active",
    imageFile: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (open && item) {
      setForm({
        title: item.title,
        paragraph: item.paragraph,
        expired_at: item.expired_at.slice(0, 10),
        status: item.status,
        imageFile: null,
        imagePreview: item.main_image,
      });
      setErrors({});
    }
  }, [open, item]);

  const mut = useMutation({
    mutationFn: () =>
      updateNews(item!.id, {
        title: form.title.trim(),
        paragraph: form.paragraph.trim(),
        expired_at: form.expired_at,
        status: form.status,
        ...(form.imageFile ? { main_image: form.imageFile } : {}),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["marketing-news"] });
      onClose();
    },
  });

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Заголовок не может быть пустым";
    if (!form.paragraph.trim()) errs.paragraph = "Описание не может быть пустым";
    if (!form.expired_at) errs.expired_at = "Укажите дату окончания";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    mut.mutate();
  }

  function handleFileSelect(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    setForm((p) => ({ ...p, imageFile: file, imagePreview: URL.createObjectURL(file) }));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0] ?? null);
  }

  function removeImage() {
    setForm((p) => ({ ...p, imageFile: null, imagePreview: null }));
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Изменить новость"
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
            onClick={handleSubmit}
          >
            Сохранить
          </CusButton>
        </>
      }
    >
      <div className="space-y-5">
        {/* Image upload */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
            Главное изображение
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
          {form.imagePreview ? (
            <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg"
                style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
              >
                <LuX size={14} />
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
              >
                Изменить
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2 rounded-xl cursor-pointer transition-colors"
              style={{
                border: `1.5px dashed ${isDragging ? "var(--border-2)" : "var(--border-default)"}`,
                background: isDragging ? "var(--bg-hover)" : "transparent",
                aspectRatio: "16/9",
                justifyContent: "center",
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--bg-hover)" }}
              >
                <LuUpload size={20} style={{ color: "var(--text-dim)" }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
                  Загрузите изображение
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  JPG, PNG, WebP — нажмите или перетащите
                </p>
              </div>
              <CusButton size="sm" variant="outline" colorPalette="gray" leftIcon={<LuImage size={13} />}>
                Выбрать файл
              </CusButton>
            </div>
          )}

          {/* Tips */}
          <div
            className="flex flex-col gap-1.5 rounded-xl p-3 mt-2"
            style={{ background: "var(--bg-hover)", border: "1px solid var(--border-default)" }}
          >
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-2)" }}>
              <LuInfo size={12} />
              Советы по изображению
            </p>
            <ul className="space-y-1">
              {[
                "Размер: 1200 × 675 пикселей (формат 16:9)",
                "Яркий и чёткий фон — привлекает больше внимания",
                "Меньше текста на картинке — он плохо читается на карточке",
                "Избегайте тёмных и размытых фотографий",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span style={{ color: "#3b82f6", flexShrink: 0 }}>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CusInput
          label="Заголовок"
          placeholder="Заголовок новости..."
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
          placeholder="Краткое описание новости..."
          value={form.paragraph}
          onChange={(e) => {
            setForm((p) => ({ ...p, paragraph: e.target.value }));
            if (errors.paragraph) setErrors((p) => ({ ...p, paragraph: undefined }));
          }}
          errorText={errors.paragraph}
          disabled={mut.isPending}
          rows={4}
        />

        {/* Status */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
            Статус
          </p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = form.status === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setForm((p) => ({ ...p, status: opt.value }))}
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
          label="Дата окончания"
          value={form.expired_at ? [parseDate(form.expired_at)] : []}
          onValueChange={({ value }) => {
            const date = value[0]?.toString() ?? "";
            setForm((p) => ({ ...p, expired_at: date }));
            if (errors.expired_at) setErrors((p) => ({ ...p, expired_at: undefined }));
          }}
          errorText={errors.expired_at}
          disabled={mut.isPending}
        />
      </div>
    </CusDrawer>
  );
}
