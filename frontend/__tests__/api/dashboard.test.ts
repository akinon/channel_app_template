import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/api/client", () => {
  const get = vi.fn();
  return { apiClient: { get } };
});

import { getDashboardSummary } from "@/api/dashboard";
import { apiClient } from "@/api/client";

describe("api/dashboard getDashboardSummary", () => {
  const mockGet = apiClient.get as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGet.mockReset();
  });

  it("uses default limits when no params passed", async () => {
    mockGet.mockResolvedValueOnce({ data: { total_sku: 1, total_sku_on_sale: 2, total_product_stocks: 3, total_stocks: 4 } });

    const res = await getDashboardSummary();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("/dashboard", {
      params: { total_sku_limit: 9999, total_sku_on_sale_limit: 9999 },
    });
    expect(res).toEqual({ total_sku: 1, total_sku_on_sale: 2, total_product_stocks: 3, total_stocks: 4 });
  });

  it("forwards provided params overriding defaults", async () => {
    mockGet.mockResolvedValueOnce({ data: { total_sku: 10, total_sku_on_sale: 11, total_product_stocks: 12, total_stocks: 13 } });

    const res = await getDashboardSummary({ total_sku_limit: 50, total_sku_on_sale_limit: 60 });

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("/dashboard", {
      params: { total_sku_limit: 50, total_sku_on_sale_limit: 60 },
    });
    expect(res).toEqual({ total_sku: 10, total_sku_on_sale: 11, total_product_stocks: 12, total_stocks: 13 });
  });
});
