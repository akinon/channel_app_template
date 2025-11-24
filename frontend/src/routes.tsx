import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { App } from "@/App";
import { PAGES } from "@/pageMeta";

export const loadHome = () =>
  import("@/pages/Home").then((m) => ({ default: m.PageHome }));
export const loadDashboard = () =>
  import("@/pages/Dashboard").then((m) => ({ default: m.PageDashboard }));
export const loadLog = () =>
  import("@/pages/Log").then((m) => ({ default: m.PageLog }));
export const loadReport = () =>
  import("@/pages/Report").then((m) => ({ default: m.PageReport }));
export const loadAlarm = () =>
  import("@/pages/Alarm").then((m) => ({ default: m.PageAlarm }));
export const loadTrigger = () =>
  import("@/pages/Trigger").then((m) => ({ default: m.PageTrigger }));
export const loadProductsNotInSale = () =>
  import("@/pages/Report/products-not-in-sales").then((m) => ({
    default: m.PageProductsNotInSale,
  }));

const PageHome = lazy(loadHome);
const PageDashboard = lazy(loadDashboard);
const PageLog = lazy(loadLog);
const PageReport = lazy(loadReport);
const PageAlarm = lazy(loadAlarm);
const PageTrigger = lazy(loadTrigger);
const PageListProductsNotReflectedInSales = lazy(loadProductsNotInSale);

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(
    createRoutesFromElements(
      <Route element={<App />}>
        {/* Home route */}
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <PageHome />
            </Suspense>
          }
        />

        {PAGES.filter((p) => p.key !== "home").map((p) => {
          const elementMap: Record<string, JSX.Element> = {
            dashboard: <PageDashboard />,
            log: <PageLog />,
            report: <PageReport />,
            alarm: <PageAlarm />,
            trigger: <PageTrigger />,
            list_products_not_reflected_in_sales: <PageListProductsNotReflectedInSales />,
          };
          return (
            <Route
              key={p.key}
              path={p.path}
              element={<Suspense fallback={null}>{elementMap[p.key]}</Suspense>}
            />
          );
        })}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>,
    ),
  );
