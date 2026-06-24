import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import type React from "react";
import { LuScanBarcode, LuNfc, LuPlug, LuX, LuTriangleAlert } from "react-icons/lu";
import { useHidDevices } from "../hooks/useHidDevices";
import { KeyboardOverlay } from "./KeyboardOverlay";

interface Props {
  onScan: (v: string) => void;
  disabled?: boolean;
}

export interface ScanZoneHandle {
  focus: () => void;
}

export const ScanZone = forwardRef<ScanZoneHandle, Props>(function ScanZone(
  { onScan, disabled },
  ref
) {
  const [value, setValue] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focused, setFocused] = useState(false);
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
      setShowKeyboard(false);
    }
  }

  function handleKeyboardEnter() {
    const v = value.trim();
    if (v) {
      onScan(v);
      setValue("");
      setShowKeyboard(false);
    }
  }

  function openKeyboard() {
    if (disabled) return;
    setShowKeyboard(true);
    // keep scanner input flowing to hidden input
    inputRef.current?.focus();
  }

  const connectedDevices = devices.filter((d) => d.connected);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {/* Device status */}
        {!supported ? (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{
              background: "rgba(217,119,6,0.08)",
              border: "1px solid rgba(217,119,6,0.22)",
              color: "#d97706",
            }}
          >
            <LuTriangleAlert size={13} />
            WebHID qo'llab-quvvatlanmaydi — Chrome ishlatilsin
          </div>
        ) : devices.length === 0 ? (
          <button
            onClick={requestAccess}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium w-fit"
            style={{
              background: "rgba(31,116,214,0.07)",
              border: "1px solid rgba(31,116,214,0.22)",
              color: "#1f74d6",
              touchAction: "manipulation",
            }}
          >
            <LuPlug size={13} />
            Scanner ulash
          </button>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {connectedDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: "rgba(46,163,107,0.07)",
                  border: "1px solid rgba(46,163,107,0.22)",
                  color: "#2ea36b",
                }}
              >
                {device.name.toLowerCase().includes("nfc") ? (
                  <LuNfc size={13} />
                ) : (
                  <LuScanBarcode size={13} />
                )}
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#2ea36b" }}
                />
                <span className="max-w-[120px] truncate">{device.name}</span>
              </div>
            ))}
            <button
              onClick={requestAccess}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs"
              style={{ color: "#4a6580", border: "1px dashed #1c2532" }}
              title="Yangi qurilma"
            >
              <LuPlug size={12} />
            </button>
          </div>
        )}

        {/* Scan area */}
        <div
          className="relative rounded-2xl transition-all duration-200 flex flex-col items-center justify-center"
          style={{
            minHeight: 96,
            border: focused
              ? "2px solid #1f74d6"
              : "2px dashed #1c2532",
            background: focused
              ? "rgba(31,116,214,0.04)"
              : "#0e1521",
            boxShadow: focused
              ? "0 0 0 4px rgba(31,116,214,0.08)"
              : "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
          onClick={openKeyboard}
        >
          {/* Hidden input — absorbs scanner keystrokes */}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            style={{
              position: "absolute",
              opacity: 0,
              width: 1,
              height: 1,
              pointerEvents: "none",
            }}
            readOnly={showKeyboard}
          />

          <LuScanBarcode
            size={30}
            style={{ color: focused ? "#1f74d6" : "#2a3a4e" }}
          />

          {value ? (
            <span
              className="mt-2 text-base font-mono font-semibold"
              style={{ color: "#e8edf5", fontVariantNumeric: "tabular-nums" }}
            >
              {value}
            </span>
          ) : (
            <span className="mt-2 text-sm" style={{ color: "#2a3a4e" }}>
              Skanerlang yoki bosib kiriting...
            </span>
          )}

          {value && (
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                setValue("");
                inputRef.current?.focus();
              }}
              className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-lg"
              style={{
                width: 28,
                height: 28,
                background: "#1c2532",
                color: "#4a6580",
              }}
            >
              <LuX size={14} />
            </button>
          )}
        </div>

        <p className="text-xs text-center" style={{ color: "#2a3a4e" }}>
          Enter bosing yoki scanner avtomatik yuboradi
        </p>
      </div>

      {showKeyboard && (
        <KeyboardOverlay
          value={value}
          onChange={setValue}
          onEnter={handleKeyboardEnter}
          onClose={() => {
            setShowKeyboard(false);
            inputRef.current?.focus();
          }}
        />
      )}
    </>
  );
});
