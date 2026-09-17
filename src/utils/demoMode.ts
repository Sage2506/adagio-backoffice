export const DEMO_USER_EMAIL = "demo@adagio.com";
export const DEMO_READ_ONLY_MESSAGE = "Demo mode is read-only.";

const DEMO_READ_ONLY_STORAGE_KEY = "adagio.demoReadOnly";

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function setDemoReadOnlyForEmail(email: string | null | undefined) {
  const isDemoUser = email?.toLowerCase() === DEMO_USER_EMAIL;
  if (canUseSessionStorage()) {
    if (isDemoUser) {
      window.sessionStorage.setItem(DEMO_READ_ONLY_STORAGE_KEY, "true");
    } else {
      window.sessionStorage.removeItem(DEMO_READ_ONLY_STORAGE_KEY);
    }
  }
  return isDemoUser;
}

export function clearDemoReadOnly() {
  if (canUseSessionStorage()) {
    window.sessionStorage.removeItem(DEMO_READ_ONLY_STORAGE_KEY);
  }
}

export function isDemoReadOnlySession() {
  if (!canUseSessionStorage()) return false;
  return window.sessionStorage.getItem(DEMO_READ_ONLY_STORAGE_KEY) === "true";
}

export function blockDemoReadOnlyAction(event?: { preventDefault: () => void; stopPropagation: () => void }) {
  if (!isDemoReadOnlySession()) return false;
  event?.preventDefault();
  event?.stopPropagation();
  window.dispatchEvent(new CustomEvent("demo-read-only-blocked"));
  return true;
}