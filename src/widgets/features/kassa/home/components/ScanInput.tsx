import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import type React from "react";
import { LuX } from "react-icons/lu";
import { useHidDevices } from "../hooks/useHidDevices";
import { HidDeviceStatus } from "./HidDeviceStatus";

interface ScanInputProps {
  onScan: (value: string) => void;
}

export interface ScanInputHandle {
  focus: () => void;
}

export const ScanInput = forwardRef<ScanInputHandle, ScanInputProps>(
  function ScanInput({ onScan }, ref) {
    const [value, setValue] = useState("");
    const [active, setActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { supported, devices, requestAccess } = useHidDevices();

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter" && value.trim()) {
        onScan(value.trim());
        setValue("");
      }
    }

    function handleClear() {
      setValue("");
      inputRef.current?.focus();
    }

    return (
      <div className="flex flex-col gap-3">
        {/* Scan input area */}
        <div
          className="relative rounded-2xl transition-all duration-200"
          style={{
            border: active
              ? "2px solid var(--color-blue)"
              : "2px dashed var(--border-2)",
            background: active
              ? "color-mix(in srgb, var(--color-blue) 4%, var(--bg-hover))"
              : "var(--bg-hover)",
            boxShadow: active
              ? "0 0 0 4px color-mix(in srgb, var(--color-blue) 12%, transparent)"
              : "none",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            placeholder="Skanerlang yoki qo'lda kiriting..."
            className="w-full bg-transparent outline-none px-4 py-3 pr-10 text-sm"
            style={{
              color: "var(--text-default)",
              caretColor: "var(--color-blue)",
            }}
          />
          {value && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleClear();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full"
              style={{
                color: "var(--text-muted)",
                background: "var(--bg-hover)",
              }}
            >
              <LuX size={13} />
            </button>
          )}
          {active && !value && (
            <div
              className="absolute left-4 right-4 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--color-blue), transparent)",
                animation: "scanLine 1.6s ease-in-out infinite",
                top: "50%",
              }}
            />
          )}
        </div>

        <p className="text-xs text-center" style={{ color: "var(--text-dim)" }}>
          Enter bosing yoki scanner avtomatik yuboradi
        </p>

        <style>{`
        @keyframes scanLine {
          0%   { top: 30%; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { top: 70%; opacity: 0; }
        }
      `}</style>
      </div>
    );
  },
);
