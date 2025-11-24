import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSearchParams } from "react-router-dom";
import usePaginationFromQueryParams from "@/hooks/use-pagination-from-query-params";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useSearchParams: vi.fn(),
}));

describe("usePaginationFromQueryParams", () => {
  let mockSearchParams: Map<string, string>;
  let mockSetSearchParams: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSearchParams = new Map();
    mockSetSearchParams = vi.fn();

    const mockURLSearchParams = {
      get: vi.fn((key: string) => mockSearchParams.get(key) || null),
      set: vi.fn((key: string, value: string) =>
        mockSearchParams.set(key, value),
      ),
      delete: vi.fn((key: string) => mockSearchParams.delete(key)),
      has: vi.fn((key: string) => mockSearchParams.has(key)),
      keys: vi.fn(() => mockSearchParams.keys()),
      values: vi.fn(() => mockSearchParams.values()),
      entries: vi.fn(() => mockSearchParams.entries()),
    };

    vi.mocked(useSearchParams).mockReturnValue([
      mockURLSearchParams as any,
      mockSetSearchParams,
    ]);
  });

  it("should return default limit and page when no query params exist", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(20);
    expect(result.current.page).toBe(1);
  });

  it("should parse limit from query params correctly", () => {
    mockSearchParams.set("limit", "50");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(50);
    expect(result.current.page).toBe(1); // default
  });

  it("should parse page from query params correctly", () => {
    mockSearchParams.set("page", "3");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(20); // default
    expect(result.current.page).toBe(3);
  });

  it("should parse both limit and page from query params", () => {
    mockSearchParams.set("limit", "25");
    mockSearchParams.set("page", "5");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(25);
    expect(result.current.page).toBe(5);
  });

  it("should handle invalid limit values gracefully", () => {
    mockSearchParams.set("limit", "invalid");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBeNaN(); // parseInt('invalid') returns NaN
    expect(result.current.page).toBe(1);
  });

  it("should handle invalid page values gracefully", () => {
    mockSearchParams.set("page", "invalid");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(20);
    expect(result.current.page).toBeNaN(); // parseInt('invalid') returns NaN
  });

  it("should handle zero values correctly", () => {
    mockSearchParams.set("limit", "0");
    mockSearchParams.set("page", "0");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(0);
    expect(result.current.page).toBe(0);
  });

  it("should handle negative values correctly", () => {
    mockSearchParams.set("limit", "-10");
    mockSearchParams.set("page", "-2");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(-10);
    expect(result.current.page).toBe(-2);
  });

  it("should set query params when values are different from defaults", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    act(() => {
      result.current.syncPaginationWithQueryParams({
        limit: 50,
        page: 3,
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      limit: "50",
      page: "3",
    });
  });

  it("should not set limit query param when it equals default", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    act(() => {
      result.current.syncPaginationWithQueryParams({
        limit: 20, // default value
        page: 3,
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      page: "3",
    });
  });

  it("should not set page query param when it equals default", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    act(() => {
      result.current.syncPaginationWithQueryParams({
        limit: 50,
        page: 1, // default value
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      limit: "50",
    });
  });

  it("should set empty query params when both values equal defaults", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    act(() => {
      result.current.syncPaginationWithQueryParams({
        limit: 20, // default value
        page: 1, // default value
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({});
  });

  it("should convert numbers to strings correctly", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    act(() => {
      result.current.syncPaginationWithQueryParams({
        limit: 100,
        page: 10,
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      limit: "100",
      page: "10",
    });
  });

  it("should handle zero values in sync function", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    act(() => {
      result.current.syncPaginationWithQueryParams({
        limit: 0,
        page: 0,
      });
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      limit: "0",
      page: "0",
    });
  });

  it("should maintain consistent behavior across multiple renders", () => {
    mockSearchParams.set("limit", "30");
    mockSearchParams.set("page", "2");

    const { result, rerender } = renderHook(() =>
      usePaginationFromQueryParams(),
    );

    expect(result.current.limit).toBe(30);
    expect(result.current.page).toBe(2);

    rerender();

    expect(result.current.limit).toBe(30);
    expect(result.current.page).toBe(2);
  });

  it("should provide function that may change between renders", () => {
    const { result, rerender } = renderHook(() =>
      usePaginationFromQueryParams(),
    );

    const firstSyncFunction = result.current.syncPaginationWithQueryParams;

    rerender();

    const secondSyncFunction = result.current.syncPaginationWithQueryParams;

    // Function is not memoized so it creates new instance on each render
    expect(typeof firstSyncFunction).toBe("function");
    expect(typeof secondSyncFunction).toBe("function");
    expect(firstSyncFunction).not.toBe(secondSyncFunction);
  });

  it("should handle very large numbers", () => {
    mockSearchParams.set("limit", "999999");
    mockSearchParams.set("page", "888888");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(999999);
    expect(result.current.page).toBe(888888);
  });

  it("should handle decimal numbers by parsing as integer", () => {
    mockSearchParams.set("limit", "25.7");
    mockSearchParams.set("page", "3.9");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current.limit).toBe(25);
    expect(result.current.page).toBe(3);
  });

  it("should handle empty string values", () => {
    mockSearchParams.set("limit", "");
    mockSearchParams.set("page", "");

    const { result } = renderHook(() => usePaginationFromQueryParams());

    // Empty string is falsy for the ternary operator, so falls back to defaults
    expect(result.current.limit).toBe(20);
    expect(result.current.page).toBe(1);
  });

  it("should return correct object structure", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    expect(result.current).toHaveProperty("limit");
    expect(result.current).toHaveProperty("page");
    expect(result.current).toHaveProperty("syncPaginationWithQueryParams");

    expect(typeof result.current.limit).toBe("number");
    expect(typeof result.current.page).toBe("number");
    expect(typeof result.current.syncPaginationWithQueryParams).toBe(
      "function",
    );
  });

  it("should have syncPaginationWithQueryParams function with correct signature", () => {
    const { result } = renderHook(() => usePaginationFromQueryParams());

    // Function should accept pagination params and return void
    expect(() => {
      result.current.syncPaginationWithQueryParams({
        limit: 10,
        page: 2,
      });
    }).not.toThrow();
  });
});
