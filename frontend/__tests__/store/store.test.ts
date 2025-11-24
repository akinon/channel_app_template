import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock redux-persist completely
vi.mock("redux-persist", () => ({
  FLUSH: "FLUSH",
  REHYDRATE: "REHYDRATE",
  PAUSE: "PAUSE",
  PERSIST: "PERSIST",
  PURGE: "PURGE",
  REGISTER: "REGISTER",
  persistReducer: (_cfg: any, reducer: any) => reducer, // passthrough
  persistStore: (_store: any) => ({ purge: vi.fn() }), // stub
}));

vi.mock("redux-persist/lib/storage", () => ({ default: {} }));

const createLoggerMock = vi.fn(() => {
  return () => (next: any) => (action: any) => next(action);
});
vi.mock("redux-logger", () => ({ createLogger: createLoggerMock }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs?.();
});

describe("store.ts env branches", () => {
  it("non-production: attaches logger", async () => {
    // default MODE in vitest is 'test' => non-production
    const mod = await import("@/store/store");
    expect(createLoggerMock).toHaveBeenCalledTimes(1);

    mod.store.dispatch({ type: "@@dummy" });
    expect(typeof mod.store.getState).toBe("function");
    expect(typeof mod.persistor).toBe("object");
  });

  it("production: does not attach logger", async () => {
    vi.stubEnv?.("MODE", "production");
    vi.resetModules();
    const mod = await import("@/store/store");
    expect(createLoggerMock).not.toHaveBeenCalled();

    mod.store.dispatch({ type: "@@dummy" });
    expect(typeof mod.store.getState).toBe("function");
  });
});
