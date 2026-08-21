import { SimpleRouterProvider, Link, useRouterState } from "@/lib/simple-router";
import { useEffect } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { PwaInstallPrompt } from "@/components/public/PwaInstallPrompt";
import { translateToMarathi } from "@/lib/marathi";

import { Route as HomeRoute } from "@/routes/index";
import { Route as AboutRoute } from "@/routes/about";
import { Route as ChairmanRoute } from "@/routes/chairman";
import { Route as UpdatesRoute } from "@/routes/updates";
import { Route as NoticesRoute } from "@/routes/notices";
import { Route as GalleryRoute } from "@/routes/gallery";
import { Route as MarketPricesRoute } from "@/routes/market-prices";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as LoginRoute } from "@/routes/login";
import { Route as ForgotPasswordRoute } from "@/routes/forgot-password";
import { Route as RegisterRoute } from "@/routes/register";
import { Route as PublicTraderProfileRoute } from "@/routes/trader-public-profile";
import { Route as OwnerRoute } from "@/routes/owner";
import { Route as OwnerProfileRoute } from "@/routes/owner.profile";
import { Route as OwnerGalaRoute } from "@/routes/owner.gala";
import { Route as OwnerUpdatesRoute } from "@/routes/owner.updates";
import { Route as OwnerMarketPricesRoute } from "@/routes/owner.market-prices";
import { Route as TraderMarketPricesRoute } from "@/routes/trader.market-prices";
import { Route as OwnerNoticesRoute } from "@/routes/owner.notices";
import { Route as OwnerComplaintsRoute } from "@/routes/owner.complaints";
import { Route as OwnerNewComplaintRoute } from "@/routes/owner.new-complaint";
import { Route as OwnerKycRoute } from "@/routes/owner.kyc";
import { Route as OwnerPostRoute } from "@/routes/owner.post";
import { Route as OwnerSharedPostsRoute } from "@/routes/owner.shared-posts";
import { Route as OwnerRatingsRoute } from "@/routes/owner.ratings";
import { Route as OwnerMobileChangeRoute } from "@/routes/owner.mobile-change";
import { Route as OwnerNotificationsRoute } from "@/routes/owner.notifications";
import { Route as OwnerHelpRoute } from "@/routes/owner.help";
import { Route as OwnerChangePasswordRoute } from "@/routes/owner.change-password";
import { Route as AdminRoute } from "@/routes/admin";
import { Route as AdminLoginRoute } from "@/routes/admin.login";
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
  "/": HomeRoute,
  "/about": AboutRoute,
  "/chairman": ChairmanRoute,
  "/updates": UpdatesRoute,
  "/notices": NoticesRoute,
  "/gallery": GalleryRoute,
  "/market-prices": MarketPricesRoute,
  "/contact": ContactRoute,
  "/login": LoginRoute,
  "/forgot-password": ForgotPasswordRoute,
  "/register": RegisterRoute,
  "/traders/:id": PublicTraderProfileRoute,
  "/member": OwnerRoute,
  "/member/profile": OwnerProfileRoute,
  "/member/gala": OwnerGalaRoute,
  "/member/updates": OwnerUpdatesRoute,
  "/member/market-prices": OwnerMarketPricesRoute,
  "/member/notices": OwnerNoticesRoute,
  "/member/complaints": OwnerComplaintsRoute,
  "/member/new-complaint": OwnerNewComplaintRoute,
  "/member/kyc": OwnerKycRoute,
  "/member/post": OwnerPostRoute,
  "/member/shared-posts": OwnerSharedPostsRoute,
  "/member/ratings": OwnerRatingsRoute,
  "/member/mobile-change": OwnerMobileChangeRoute,
  "/member/notifications": OwnerNotificationsRoute,
  "/member/help": OwnerHelpRoute,
  "/member/change-password": OwnerChangePasswordRoute,
  "/trader": OwnerRoute,
  "/trader/profile": OwnerProfileRoute,
  "/trader/gala": OwnerGalaRoute,
  "/trader/updates": OwnerUpdatesRoute,
  "/trader/market-prices": TraderMarketPricesRoute,
  "/trader/notices": OwnerNoticesRoute,
  "/trader/complaints": OwnerComplaintsRoute,
  "/trader/new-complaint": OwnerNewComplaintRoute,
  "/trader/kyc": OwnerKycRoute,
  "/trader/post": OwnerPostRoute,
  "/trader/shared-posts": OwnerSharedPostsRoute,
  "/trader/ratings": OwnerRatingsRoute,
  "/trader/mobile-change": OwnerMobileChangeRoute,
  "/trader/notifications": OwnerNotificationsRoute,
  "/trader/help": OwnerHelpRoute,
  "/trader/change-password": OwnerChangePasswordRoute,
  "/owner": OwnerRoute,
  "/owner/profile": OwnerProfileRoute,
  "/owner/gala": OwnerGalaRoute,
  "/owner/updates": OwnerUpdatesRoute,
  "/owner/market-prices": OwnerMarketPricesRoute,
  "/owner/notices": OwnerNoticesRoute,
  "/owner/complaints": OwnerComplaintsRoute,
  "/owner/new-complaint": OwnerNewComplaintRoute,
  "/owner/kyc": OwnerKycRoute,
  "/owner/post": OwnerPostRoute,
  "/owner/shared-posts": OwnerSharedPostsRoute,
  "/owner/ratings": OwnerRatingsRoute,
  "/owner/mobile-change": OwnerMobileChangeRoute,
  "/owner/notifications": OwnerNotificationsRoute,
  "/owner/help": OwnerHelpRoute,
  "/owner/change-password": OwnerChangePasswordRoute,
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
  const { lang } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const canonicalPathname = pathname.replace(/^\/trader(?=\/|$)/, "/member");
  useEffect(() => {
    if (canonicalPathname !== pathname) {
      window.history.replaceState({}, "", canonicalPathname);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [canonicalPathname, pathname]);
  const route = ROUTES[canonicalPathname] ?? (/^\/traders\/\d+$/.test(canonicalPathname) ? ROUTES["/traders/:id"] : null);
  const title = route?.options.head?.().meta?.find((item) => item.title)?.title;

  if (title) document.title = lang === "mr" ? translateToMarathi(title) : title;

  const Component = route?.options.component;
  return Component ? <Component /> : <NotFound />;
}

export default function App() {
  return (
    <SimpleRouterProvider>
      <I18nProvider>
        <AuthProvider>
          <RouteRenderer />
          {!import.meta.env.DEV && <PwaInstallPrompt />}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </I18nProvider>
    </SimpleRouterProvider>
  );
}
