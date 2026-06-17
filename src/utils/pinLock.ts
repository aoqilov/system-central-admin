const PIN_KEY = "local_pincode";
const PIN_ENABLED_KEY = "pin_lock_enabled";
const IS_LOCKED_KEY = "app_is_locked";

export function getPin(): string | null {
  return localStorage.getItem(PIN_KEY);
}

export function setPin(pin: string): void {
  localStorage.setItem(PIN_KEY, pin);
  localStorage.setItem(PIN_ENABLED_KEY, "true");
  window.dispatchEvent(new CustomEvent("pin-lock-changed"));
}

export function isPinEnabled(): boolean {
  return localStorage.getItem(PIN_ENABLED_KEY) === "true";
}

export function isLocked(): boolean {
  return localStorage.getItem(IS_LOCKED_KEY) === "true";
}

export function lockApp(): void {
  localStorage.setItem(IS_LOCKED_KEY, "true");
}

export function unlockApp(): void {
  localStorage.removeItem(IS_LOCKED_KEY);
}

export function disablePinLock(): void {
  localStorage.removeItem(PIN_KEY);
  localStorage.removeItem(PIN_ENABLED_KEY);
  localStorage.removeItem(IS_LOCKED_KEY);
  window.dispatchEvent(new CustomEvent("pin-lock-changed"));
}
