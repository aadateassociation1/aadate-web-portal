import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function getPwaDeviceId() {
  const storageKey = "pwa_install_device_id";
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(storageKey, id);
  return id;
}

function detectPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("android")) return "android";
  if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
  if (/windows|macintosh|linux|cros/.test(userAgent)) return "desktop";
  return "other";
}

export function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("pwa_install_dismissed") === "true");

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const handleInstalled = () => {
      fetch("/api/analytics/pwa-install", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: getPwaDeviceId(),
          platform: detectPlatform(),
        }),
      }).catch(() => undefined);
    };

    window.addEventListener("appinstalled", handleInstalled);
    return () => window.removeEventListener("appinstalled", handleInstalled);
  }, []);

  if (!promptEvent || dismissed) return null;

  const install = async () => {
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  const dismiss = () => {
    localStorage.setItem("pwa_install_dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-md border bg-background p-3 shadow-lg sm:left-auto sm:right-5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-primary">
        <Download className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-primary-dark">Install Market Yard app</div>
        {/* iOS Safari requires manual "Add to Home Screen"; no auto-prompt is possible there. */}
        <div className="text-xs text-muted-foreground">Install this portal for faster app-style access.</div>
      </div>
      <Button size="sm" className="bg-primary" onClick={install}>Install</Button>
      <Button size="sm" variant="ghost" onClick={dismiss}>Later</Button>
    </div>
  );
}
