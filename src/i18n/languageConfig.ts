import { useState, useEffect } from "react";
import ru from "./ru.json";
import uz from "./uz.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Lang = "ru" | "uz";

const LANGUAGE_KEY = "app_language";
const HAS_CHANGED_KEY = "has_changed_language";

// ─── Translations ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Lang, any> = { ru, uz };

// ─── Global State ─────────────────────────────────────────────────────────────

let currentLang: Lang = "ru";
const subscribers = new Set<() => void>();

function notifyAll() {
  subscribers.forEach((cb) => cb());
}

// ─── Initial Lang ─────────────────────────────────────────────────────────────

function getInitialLang(): Lang {
  const hasChanged = localStorage.getItem(HAS_CHANGED_KEY) === "true";
  const saved = localStorage.getItem(LANGUAGE_KEY) as Lang | null;
  if (hasChanged && saved && (saved === "ru" || saved === "uz")) return saved;
  return saved === "uz" ? "uz" : "ru";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function initLanguage() {
  currentLang = getInitialLang();
}

export function changeLanguage(lang: Lang) {
  currentLang = lang;
  localStorage.setItem(LANGUAGE_KEY, lang);
  localStorage.setItem(HAS_CHANGED_KEY, "true");
  notifyAll();
}

export function getCurrentLang(): Lang {
  return currentLang;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key]?.toString() ?? `{${key}}`);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation(prefix = "") {
  const [, rerender] = useState(0);

  useEffect(() => {
    const trigger = () => rerender((n) => n + 1);
    subscribers.add(trigger);
    return () => { subscribers.delete(trigger); };
  }, []);

  function t(key: string, params?: Record<string, string | number>): string {
    const fullKey = prefix + key;
    const text =
      getNestedValue(translations[currentLang], fullKey) ??
      getNestedValue(translations["ru"], fullKey) ??
      fullKey;
    return interpolate(text, params);
  }

  return { t, lang: currentLang, changeLanguage };
}
