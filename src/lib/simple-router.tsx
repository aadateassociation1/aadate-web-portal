import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type RouterContextValue = {
  pathname: string;
  navigate: (options: { to: string } | string) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

function toPath(target: { to: string } | string) {
  return typeof target === "string" ? target : target.to;
}

export function navigateTo(target: { to: string } | string) {
  const path = toPath(target);
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function SimpleRouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const updatePath = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  const value = useMemo<RouterContextValue>(() => ({ pathname, navigate: navigateTo }), [pathname]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useRouter must be used inside SimpleRouterProvider");
  return {
    navigate: router.navigate,
    invalidate: () => undefined,
  };
}

export function useRouterState<T>({ select }: { select: (state: { location: { pathname: string } }) => T }) {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useRouterState must be used inside SimpleRouterProvider");
  return select({ location: { pathname: router.pathname } });
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  activeProps?: { className?: string };
  activeOptions?: { exact?: boolean };
};

export function Link({ to, activeProps, activeOptions, className, onClick, ...props }: LinkProps) {
  const router = useContext(RouterContext);
  const pathname = router?.pathname ?? window.location.pathname;
  const active = activeOptions?.exact ? pathname === to : pathname === to || (to !== "/" && pathname.startsWith(to));
  const resolvedClassName = active && activeProps?.className ? activeProps.className : className;

  return (
    <a
      href={to}
      className={resolvedClassName}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey ||
          props.target
        ) {
          return;
        }
        event.preventDefault();
        navigateTo(to);
      }}
      {...props}
    />
  );
}

export function Outlet() {
  return null;
}

export function createFileRoute(_path: string) {
  return <T extends Record<string, unknown>>(options: T) => ({ options });
}

export function createRootRouteWithContext() {
  return () => <T extends Record<string, unknown>>(options: T) => ({ options, useRouteContext: () => ({}) });
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}
