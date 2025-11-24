import { describe, it, expect, vi } from "vitest";

vi.mock("@akinon/ui-layout", () => ({
  Layout: Object.assign(() => null, {
    Content: ({ children }: any) => <>{children}</>,
  }),
  PageHeading: () => null,
  PageContent: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/App", () => {
  const React = require("react");
  const { Outlet } = require("react-router-dom");
  const App = () =>
    React.createElement(React.Fragment, null, React.createElement(Outlet));
  return { App };
});

vi.mock("@/pages/Home", () => ({ PageHome: () => null }));
vi.mock("@/pages/Dashboard", () => ({ PageDashboard: () => null }));
vi.mock("@/pages/Log", () => ({ PageLog: () => null }));
vi.mock("@/pages/Report", () => ({ PageReport: () => null }));
vi.mock("@/pages/Alarm", () => ({ PageAlarm: () => null }));
vi.mock("@/pages/Trigger", () => ({ PageTrigger: () => null }));

describe("routes.tsx", () => {
  it("exports router and all lazy factories; factories resolve", async () => {
    const mod = await import("@/routes");

    expect(mod.router).toBeTruthy();
    expect(typeof mod.router.navigate).toBe("function");

    const results = await Promise.all([
      mod.loadHome(),
      mod.loadDashboard(),
      mod.loadLog(),
      mod.loadReport(),
      mod.loadAlarm(),
      mod.loadTrigger(),
    ]);

    for (const r of results) {
      expect(r).toHaveProperty("default");
      expect(typeof r.default).toBe("function");
    }
  });
});
