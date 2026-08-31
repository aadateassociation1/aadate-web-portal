export function canUseAppBadge() {
  return typeof navigator !== "undefined"
    && "setAppBadge" in navigator
    && "clearAppBadge" in navigator;
}

export async function syncAppBadgeCount(count: number) {
  if (!canUseAppBadge()) return;

  const nextCount = Math.max(0, Number(count || 0));
  try {
    if (nextCount > 0) {
      await navigator.setAppBadge(nextCount);
    } else {
      await navigator.clearAppBadge();
    }
  } catch {
    // Ignore unsupported badge update failures.
  }
}