import { LuNfc, LuScanBarcode, LuUsb, LuTriangleAlert, LuPlug } from "react-icons/lu";
import type { HidDevice } from "../hooks/useHidDevices";

interface Props {
  supported: boolean;
  devices: HidDevice[];
  requestAccess: () => void;
}

export function HidDeviceStatus({ supported, devices, requestAccess }: Props) {
  if (!supported) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{
          background: "color-mix(in srgb, var(--color-yellow) 10%, transparent)",
          border: "1px solid color-mix(in srgb, var(--color-yellow) 25%, transparent)",
          color: "var(--color-yellow)",
        }}
      >
        <LuTriangleAlert size={13} />
        WebHID qo'llab-quvvatlanmaydi — Chrome brauzeri ishlatilsin
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <button
        onClick={requestAccess}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-fit"
        style={{
          background: "color-mix(in srgb, var(--color-blue) 8%, transparent)",
          border: "1px solid color-mix(in srgb, var(--color-blue) 25%, transparent)",
          color: "var(--color-blue)",
        }}
      >
        <LuPlug size={13} />
        Qurilmalarni ulash
        <LuUsb size={11} style={{ opacity: 0.6 }} />
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {devices.map((device) => (
        <div
          key={device.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium"
          style={{
            background: device.connected
              ? "color-mix(in srgb, var(--color-green) 8%, transparent)"
              : "var(--bg-hover)",
            borderColor: device.connected
              ? "color-mix(in srgb, var(--color-green) 25%, transparent)"
              : "var(--border-default)",
            color: device.connected ? "var(--color-green)" : "var(--text-muted)",
          }}
        >
          {device.vendorId === 0x072f || device.name.toLowerCase().includes("nfc") ? (
            <LuNfc size={13} />
          ) : (
            <LuScanBarcode size={13} />
          )}
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: device.connected ? "var(--color-green)" : "var(--text-dim)",
            }}
          />
          {device.name}
          <LuUsb size={11} style={{ opacity: 0.5 }} />
        </div>
      ))}
      <button
        onClick={requestAccess}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors"
        style={{ color: "var(--text-muted)", border: "1px dashed var(--border-default)" }}
        title="Yangi qurilma qo'shish"
      >
        <LuPlug size={12} />
      </button>
    </div>
  );
}
