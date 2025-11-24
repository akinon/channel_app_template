import {
  fetchProducts,
  getDifferences,
  downloadCSV,
  DifferencesTypes,
} from "@/api/report";
import { apiClient } from "@/api/client";
import {
  reportsNotForSaleProductsURL,
  reportsPriceDifferencesURL,
  reportsStockDifferencesURL,
} from "@/constants/serviceUrls";
import type { ExportResponse } from "@/api/report";
import { vi } from "vitest";

describe("report api", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchProducts", () => {
    it("should fetch products successfully", async () => {
      const mockData = [
        {
          pk: 1,
          name: "Test",
          sku: "SKU1",
          created_date: "2023-01-01",
          modified_date: "2023-01-02",
        },
      ];
      vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: mockData });
      const thunk = fetchProducts({ page: 1, limit: 10 });
      const dispatch = vi.fn();
      const getState = vi.fn();
      const result = await thunk(dispatch, getState, undefined);
      expect(apiClient.get).toHaveBeenCalledWith(reportsNotForSaleProductsURL, {
        params: { page: 1, limit: 10 },
      });
      expect(result.payload).toEqual(mockData);
    });

    it("should handle fetch error", async () => {
      vi.spyOn(apiClient, "get").mockRejectedValueOnce({
        response: { data: "error" },
      });
      const thunk = fetchProducts({ page: 1, limit: 10 });
      const dispatch = vi.fn();
      const getState = vi.fn();
      const result = await thunk(dispatch, getState, undefined);
      expect(result.payload).toBe("error");
      expect(result.type).toContain("rejected");
    });
  });

  describe("getDifferences", () => {
    it("should call reportsPriceDifferencesURL for price", async () => {
      const mockResponse: ExportResponse = { file_path: "string" };
      vi.spyOn(apiClient, "post").mockResolvedValueOnce({ data: mockResponse });
      const body = { items: [{ pk: 1, sku: "SKU1", price: 10 }] };
      const params = { params: { export: true } };
      const result = await getDifferences(DifferencesTypes.Price, body, params);
      expect(apiClient.post).toHaveBeenCalledWith(
        reportsPriceDifferencesURL,
        body,
        params,
      );
      expect(result).toEqual(mockResponse);
    });

    it("should call reportsStockDifferencesURL for stock", async () => {
      const mockResponse: ExportResponse = { file_path: "string" };
      vi.spyOn(apiClient, "post").mockResolvedValueOnce({ data: mockResponse });
      const body = { items: [{ pk: 2, sku: "SKU2", stock: 5 }] };
      const params = { params: { export: false } };
      const result = await getDifferences(DifferencesTypes.Stock, body, params);
      expect(apiClient.post).toHaveBeenCalledWith(
        reportsStockDifferencesURL,
        body,
        params,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("downloadCSV", () => {
    it("should download CSV file", async () => {
      const filePath = "files/test.csv";
      const mockBlob = new Blob(["test"], { type: "text/csv" });
      vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockBlob);
      const result = await downloadCSV(filePath);
      expect(apiClient.get).toHaveBeenCalledWith(
        `${import.meta.env.VITE_MAIN_APP_URL}/${filePath}`,
      );
      expect(result).toBe(mockBlob);
    });
  });
});
