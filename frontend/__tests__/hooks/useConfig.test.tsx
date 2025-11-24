import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConfig } from "@/hooks";
import { config as actualRootConfig } from "@/config";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("useConfig hook", () => {
  it("returns rootConfig and a merged config with navigation", () => {
    const { result } = renderHook(() => useConfig());
    expect(result.current.rootConfig).toBe(actualRootConfig);
    expect(result.current.config).not.toBe(actualRootConfig);
    expect(typeof result.current.config.navigation?.navigate).toBe("function");
  });

  it("navigation.navigate delegates to react-router navigate with given path", () => {
    mockNavigate.mockClear();
    const { result } = renderHook(() => useConfig());

    act(() => {
      result.current.config.navigation!.navigate({ path: "/dashboard" });
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
