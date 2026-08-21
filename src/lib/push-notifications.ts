function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
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
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function getPushStatus() {
  if (!canUseWebPush()) return { ok: true, configured: false, activeCount: 0, permission: "unsupported" as NotificationPermission | "unsupported" };
  const response = await fetch("/api/v1/push/status", { credentials: "include" });
  const result = await readApiResponse(response);
  return { ...result, permission: Notification.permission as NotificationPermission };
}

export async function enableWebPush() {
  if (!canUseWebPush()) throw new Error("This browser does not support web push notifications.");

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
    applicationServerKey: urlBase64ToUint8Array(keyPayload.publicKey),
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
  if (!canUseWebPush()) throw new Error("This browser does not support web push notifications.");
  const response = await fetch("/api/v1/push/test", {
    method: "POST",
    credentials: "include",
  });
  return readApiResponse(response);
}
