import React from "react";
import { createRoot } from "react-dom/client";
import { SimpleRouterProvider, Link, useRouterState } from "@/lib/simple-router";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import "@/styles.css";

import { Route as AdminLoginRoute } from "@/routes/admin.login";
import { Route as AdminRoute } from "@/routes/admin";
import { Route as AdminUsersRoute } from "@/routes/admin.users";
import { Route as AdminKycRoute } from "@/routes/admin.kyc";
import { Route as AdminRegistrationsRoute } from "@/routes/admin.registrations";
import { Route as AdminComplaintsRoute } from "@/routes/admin.complaints";
import { Route as AdminPostsRoute } from "@/routes/admin.posts";
import { Route as AdminReviewsRoute } from "@/routes/admin.reviews";
import { Route as AdminGalleryRoute } from "@/routes/admin.gallery";
import { Route as AdminUpdatesRoute } from "@/routes/admin.updates";
import { Route as AdminMarketPricesRoute } from "@/routes/admin.market-prices";
import { Route as AdminNoticesRoute } from "@/routes/admin.notices";
import { Route as AdminMobileRequestsRoute } from "@/routes/admin.mobile-requests";
import { Route as AdminCommitteeRoute } from "@/routes/admin.committee";
import { Route as AdminReportsRoute } from "@/routes/admin.reports";
import { Route as AdminAuditRoute } from "@/routes/admin.audit";
import { Route as AdminHelpRoute } from "@/routes/admin.help";
import { Route as AdminChangePasswordRoute } from "@/routes/admin.change-password";

type LocalRoute = {
  options: {
    component?: React.ComponentType;
    head?: () => { meta?: Array<{ title?: string; name?: string; content?: string }> };
  };
};

const ROUTES: Record<string, LocalRoute> = {
  "/": AdminLoginRoute,
  "/login": AdminLoginRoute,
  "/admin": AdminRoute,
  "/admin/login": AdminLoginRoute,
  "/admin/users": AdminUsersRoute,
  "/admin/kyc": AdminKycRoute,
  "/admin/registrations": AdminRegistrationsRoute,
  "/admin/complaints": AdminComplaintsRoute,
  "/admin/posts": AdminPostsRoute,
  "/admin/reviews": AdminReviewsRoute,
  "/admin/gallery": AdminGalleryRoute,
  "/admin/updates": AdminUpdatesRoute,
  "/admin/market-prices": AdminMarketPricesRoute,
  "/admin/notices": AdminNoticesRoute,
  "/admin/mobile-requests": AdminMobileRequestsRoute,
  "/admin/committee": AdminCommitteeRoute,
  "/admin/reports": AdminReportsRoute,
  "/admin/audit": AdminAuditRoute,
  "/admin/help": AdminHelpRoute,
  "/admin/change-password": AdminChangePasswordRoute,
};

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Admin page not found</h2>
        <div className="mt-6">
          <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Admin login
          </Link>
        </div>
      </div>
    </div>
  );
}

function RouteRenderer() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const route = ROUTES[pathname] ?? null;
  const title = route?.options.head?.().meta?.find((item) => item.title)?.title;

  if (title) document.title = title;

  const Component = route?.options.component;
  return Component ? <Component /> : <NotFound />;
}

function AdminHubApp() {
  return (
    <SimpleRouterProvider>
      <I18nProvider>
        <AuthProvider>
          <RouteRenderer />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </I18nProvider>
    </SimpleRouterProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AdminHubApp />
  </React.StrictMode>,
);
