import { apiClient } from "@/api/client";

export type DashboardSummary = {
  total_sku: number;
  total_sku_on_sale: number;
  total_product_stocks: number;
  total_stocks: number;
};

export async function getDashboardSummary(params?: {
  total_sku_limit?: number;
  total_sku_on_sale_limit?: number;
}) {
  const { total_sku_limit = 9999, total_sku_on_sale_limit = 9999 } = params ?? {};
  const { data } = await apiClient.get<DashboardSummary>("/dashboard", {
    params: { total_sku_limit, total_sku_on_sale_limit },
  });
  return data;
}
