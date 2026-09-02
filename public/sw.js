const CACHE_NAME = "vpp-market-yard-v12";
const APP_SHELL = [
  "/",
  "/index.html",
  "/favicon.png",
  "/icons/favicon.png",
  "/manifest.json",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match("/"));

      if (event.request.mode === "navigate") {
        return networkFetch.catch(() => caches.match("/"));
      }

      return cached || networkFetch;
    }),
  );
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const title = data.title || "Market Yard";
  const badgeCount = Number(data.badgeCount ?? data.unreadCount ?? data.notificationCount ?? 0);
  const options = {
    body: data.body || "A new update is available.",
    icon: "/icons/favicon.png",
    badge: "/icons/favicon.png",
    sound: data.sound || "/sounds/notification-alert.mp3",
    tag: data.type && data.entityId ? `${data.type}-${data.entityId}` : "market-yard-notification",
    silent: false,
    renotify: true,
    requireInteraction: data.priority === "critical" || data.type === "payment_risk",
    vibrate: data.priority === "critical" || data.type === "payment_risk"
      ? [900, 250, 900, 250, 1200, 300, 1200]
      : [400, 150, 400],
    data: {
      url: data.url || "/member/notifications",
      type: data.type || "notification",
      entityId: data.entityId || null,
    },
    actions: [
      {
        action: "open",
        title: "Open",
      },
    ],
  };

  event.waitUntil((async () => {
    if (self.navigator && "setAppBadge" in self.navigator) {
      try {
        if (badgeCount > 0) {
          await self.navigator.setAppBadge(badgeCount);
        } else {
          await self.navigator.setAppBadge();
        }
      } catch {
        // Ignore unsupported badge update failures.
      }
    }

    await self.registration.showNotification(title, options);

    const clientList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientList) {
      client.postMessage({ type: "push-notification-received", payload: data, badgeCount });
    }
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/member/notifications";
  const targetUrl = new URL(target, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          if ("navigate" in client) client.navigate(targetUrl);
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    }),
  );
});
