function sanitizePushKey(value: string) {
  return String(value || "").trim().replace(/^['"]+|['"]+$/g, "").replace(/\s+/g, "");
}

function isIosDevice() {
  const ua = window.navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandaloneWebApp() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function hasPushPrimitives() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function getWebPushSupportError() {
  if (!hasPushPrimitives()) return "This browser does not support web push notifications.";
  if (isIosDevice() && !isStandaloneWebApp()) {
    return "On iPhone, install this portal to the Home Screen first, then open the app and enable notifications there.";
  }
  return null;
}

function urlBase64ToUint8Array(value: string) {
  const cleanValue = sanitizePushKey(value);
  const padding = "=".repeat((4 - (cleanValue.length % 4)) % 4);
  const base64 = `${cleanValue}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function getValidApplicationServerKey(value: string) {
  try {
    const key = urlBase64ToUint8Array(value);
    if (key.length !== 65 || key[0] !== 4) {
      throw new Error("Invalid VAPID public key.");
    }
    if (window.crypto?.subtle) {
      await window.crypto.subtle.importKey(
        "raw",
        key,
        { name: "ECDH", namedCurve: "P-256" },
        false,
        [],
      );
    }
    return key;
  } catch {
    throw new Error("Phone notifications server key is invalid. Update VAPID_PUBLIC_KEY on the VPS, restart the API, and refresh this app.");
  }
}

async function readApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");
  if (!response.ok) {
    const message = typeof body === "string"
      ? body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : body?.message || body?.error;
    throw new Error(message || `Request failed with status ${response.status}.`);
  }
  return body;
}

export function canUseWebPush() {
  return getWebPushSupportError() === null;
}

export function getWebPushSupportMessage() {
  return getWebPushSupportError();
}

export async function getPushStatus() {
  if (!canUseWebPush()) return { ok: true, configured: false, activeCount: 0, permission: "unsupported" as NotificationPermission | "unsupported" };
  const response = await fetch("/api/v1/push/status", { credentials: "include" });
  const result = await readApiResponse(response);
  return { ...result, permission: Notification.permission as NotificationPermission };
}

export async function enableWebPush() {
  const supportError = getWebPushSupportError();
  if (supportError) throw new Error(supportError);

  const keyResponse = await fetch("/api/v1/push/public-key", { credentials: "include" });
  const keyPayload = await readApiResponse(keyResponse);
  if (!keyPayload?.configured || !keyPayload.publicKey) {
    throw new Error("Push notifications are not configured on the server.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(permission === "denied"
      ? "Notifications are blocked. Enable them from your browser site settings."
      : "Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription = existing || await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: await getValidApplicationServerKey(keyPayload.publicKey),
  });

  const response = await fetch("/api/v1/push/subscribe", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  return readApiResponse(response);
}

export async function sendTestWebPush() {
  const supportError = getWebPushSupportError();
  if (supportError) throw new Error(supportError);
  const response = await fetch("/api/v1/push/test", {
    method: "POST",
    credentials: "include",
  });
  return readApiResponse(response);
}
