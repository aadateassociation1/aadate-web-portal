import { SimpleRouterProvider, Link, useRouterState } from "@/lib/simple-router";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

import { Route as HomeRoute } from "@/routes/index";
import { Route as AboutRoute } from "@/routes/about";
import { Route as ChairmanRoute } from "@/routes/chairman";
import { Route as UpdatesRoute } from "@/routes/updates";
import { Route as NoticesRoute } from "@/routes/notices";
import { Route as GalleryRoute } from "@/routes/gallery";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as LoginRoute } from "@/routes/login";
import { Route as RegisterRoute } from "@/routes/register";
import { Route as OwnerRoute } from "@/routes/owner";
import { Route as OwnerProfileRoute } from "@/routes/owner.profile";
import { Route as OwnerGalaRoute } from "@/routes/owner.gala";
import { Route as OwnerUpdatesRoute } from "@/routes/owner.updates";
import { Route as OwnerNoticesRoute } from "@/routes/owner.notices";
import { Route as OwnerComplaintsRoute } from "@/routes/owner.complaints";
import { Route as OwnerNewComplaintRoute } from "@/routes/owner.new-complaint";
import { Route as OwnerPostRoute } from "@/routes/owner.post";
import { Route as OwnerSharedPostsRoute } from "@/routes/owner.shared-posts";
import { Route as OwnerMobileChangeRoute } from "@/routes/owner.mobile-change";
import { Route as OwnerNotificationsRoute } from "@/routes/owner.notifications";
import { Route as OwnerHelpRoute } from "@/routes/owner.help";
import { Route as OwnerChangePasswordRoute } from "@/routes/owner.change-password";
import { Route as AdminRoute } from "@/routes/admin";
import { Route as AdminUsersRoute } from "@/routes/admin.users";
import { Route as AdminRegistrationsRoute } from "@/routes/admin.registrations";
import { Route as AdminComplaintsRoute } from "@/routes/admin.complaints";
import { Route as AdminPostsRoute } from "@/routes/admin.posts";
import { Route as AdminGalleryRoute } from "@/routes/admin.gallery";
import { Route as AdminUpdatesRoute } from "@/routes/admin.updates";
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
  "/": HomeRoute,
  "/about": AboutRoute,
  "/chairman": ChairmanRoute,
  "/updates": UpdatesRoute,
  "/notices": NoticesRoute,
  "/gallery": GalleryRoute,
  "/contact": ContactRoute,
  "/login": LoginRoute,
  "/register": RegisterRoute,
  "/owner": OwnerRoute,
  "/owner/profile": OwnerProfileRoute,
  "/owner/gala": OwnerGalaRoute,
  "/owner/updates": OwnerUpdatesRoute,
  "/owner/notices": OwnerNoticesRoute,
  "/owner/complaints": OwnerComplaintsRoute,
  "/owner/new-complaint": OwnerNewComplaintRoute,
  "/owner/post": OwnerPostRoute,
  "/owner/shared-posts": OwnerSharedPostsRoute,
  "/owner/mobile-change": OwnerMobileChangeRoute,
  "/owner/notifications": OwnerNotificationsRoute,
  "/owner/help": OwnerHelpRoute,
  "/owner/change-password": OwnerChangePasswordRoute,
  "/admin": AdminRoute,
  "/admin/users": AdminUsersRoute,
  "/admin/registrations": AdminRegistrationsRoute,
  "/admin/complaints": AdminComplaintsRoute,
  "/admin/posts": AdminPostsRoute,
  "/admin/gallery": AdminGalleryRoute,
  "/admin/updates": AdminUpdatesRoute,
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
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

export default function App() {
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
