import { Download, Share2, Smartphone } from "lucide-react";
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

function isStandalonePwa() {
  return window.matchMedia("(display-mode: standalone)").matches
    || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

function getDismissedUntil() {
  const value = Number(localStorage.getItem("pwa_install_dismissed_until") || 0);
  return Number.isFinite(value) ? value : 0;
}

export function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<ReturnType<typeof detectPlatform>>("other");
  const [standalone, setStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(() => Date.now() < getDismissedUntil());

  useEffect(() => {
    setPlatform(detectPlatform());
    setStandalone(isStandalonePwa());
  }, []);

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

  const canShowManualHelp = platform === "android" || platform === "ios";
  if (standalone || dismissed || (!promptEvent && !canShowManualHelp)) return null;

  const install = async () => {
    if (!promptEvent) {
      if (platform === "android") {
        alert("Chrome menu (⋮) उघडा आणि Install app किंवा Add to Home screen निवडा.");
      }
      return;
    }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    if (choice.outcome === "accepted") {
      handleInstallRecorded();
      setDismissed(true);
    }
  };

  const dismiss = () => {
    localStorage.setItem("pwa_install_dismissed_until", String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setDismissed(true);
  };

  const handleInstallRecorded = () => {
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

  const helpText = promptEvent
    ? "Tap Install to add this portal like an app."
    : platform === "ios"
      ? "iPhone: Share icon tap करा, मग Add to Home Screen निवडा."
      : "Android: Chrome menu (⋮) मधून Install app / Add to Home screen निवडा.";

  return (
    <div className="fixed bottom-24 left-3 right-3 z-50 mx-auto flex max-w-lg items-start gap-3 rounded-lg border border-primary/20 bg-background p-3 shadow-xl sm:left-auto sm:right-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        {platform === "ios" ? <Share2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary-dark">
          <Smartphone className="h-4 w-4" />
          Install Market Yard app
        </div>
        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{helpText}</div>
        {platform === "ios" && (
          <div className="mt-2 rounded-md bg-secondary/60 px-2 py-1.5 text-xs text-primary-dark">
            Safari मध्ये खाली/वरचा Share button → Add to Home Screen → Add.
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        {(promptEvent || platform === "android") && <Button size="sm" className="bg-saffron text-saffron-foreground hover:bg-saffron/90" onClick={install}>Install</Button>}
        <Button size="sm" variant="ghost" onClick={dismiss}>Later</Button>
      </div>
    </div>
  );
}
