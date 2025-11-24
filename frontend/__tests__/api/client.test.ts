import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("axios", () => {
  const created: any[] = [];
  const create = vi.fn((cfg: any) => {
    const inst: any = {
      __config: cfg,
      interceptors: {
        request: {
          use: vi.fn((fn: any) => {
            inst.__req = fn; // attachToken
          }),
        },
        response: {
          use: vi.fn((onFulfilled: any, onRejected: any) => {
            inst.__resF = onFulfilled;
            inst.__resR = onRejected; // error handler
          }),
        },
      },
    };
    created.push(inst);
    return inst;
  });
  return {
    default: { create },
    __getCreated: () => created,
  };
});

const removeItemSpy = vi.spyOn(window.localStorage.__proto__, "removeItem");

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs?.();
});

describe("api/client", () => {
  it("sets correct baseURLs and attaches token in request interceptor", async () => {
    vi.stubEnv("VITE_MAIN_APP_URL", "http://localhost:8000");
    vi.stubEnv("VITE_OMNI_TOKEN", "secrettoken");

    const axiosMod: any = await import("axios");

    await import("@/api/client");

    const created = axiosMod.__getCreated();
    expect(created).toHaveLength(2);

    const apiClient = created[0];
    const omnitronClient = created[1];

    expect(apiClient.__config.baseURL).toBe("http://localhost:8000/api");
    expect(omnitronClient.__config.baseURL).toBe("/omnitronApi");

    const cfg1 = await apiClient.__req({});
    expect(cfg1.headers.Authorization).toBe("Token secrettoken");
    expect(cfg1.headers.token).toBe("secrettoken");

    const cfg2 = await omnitronClient.__req({ headers: { foo: "bar" } });
    expect(cfg2.headers.foo).toBe("bar");
    expect(cfg2.headers.Authorization).toBe("Token secrettoken");
    expect(cfg2.headers.token).toBe("secrettoken");
  });

  it("response interceptor removes token from localStorage on 401/403 and not otherwise", async () => {
    vi.stubEnv("VITE_MAIN_APP_URL", "http://localhost:8000");
    vi.stubEnv("VITE_OMNI_TOKEN", "secrettoken");

    const axiosMod: any = await import("axios");
    await import("@/api/client");

    const [apiClient] = axiosMod.__getCreated();
    const onError = apiClient.__resR;

    await expect(onError({ response: { status: 401 } })).rejects.toBeTruthy();
    await expect(onError({ response: { status: 403 } })).rejects.toBeTruthy();

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(removeItemSpy).toHaveBeenCalledWith("token");

    removeItemSpy.mockClear();
    await expect(onError({ response: { status: 500 } })).rejects.toBeTruthy();
    expect(removeItemSpy).not.toHaveBeenCalled();

    const onOk = apiClient.__resF;
    const res = { data: 1 };
    expect(onOk(res)).toBe(res);
  });
});
