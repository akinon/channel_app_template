import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "./client";
import {
  reportsNotForSaleProductsURL,
  reportsPriceDifferencesURL,
  reportsStockDifferencesURL,
} from "@/constants/serviceUrls";
import type { TaskStatusResponse } from "@/api/trigger";

type ProductResponse = {
  pk: number;
  name: string;
  sku: string;
  created_date: string;
  modified_date: string;
};

type FetchProductsParams = {
  page: number;
  limit: number;
};

type DifferencesParams = {
  params: {
    export?: boolean;
    async_export?: boolean;
  };
};

type DifferencesBody = {
  items: {
    price?: number;
    stock?: number;
    pk: number;
    sku: string;
  }[];
};

export type ExportNotSelectedResponse = {
  product_pk: number;
  product_sku: string;
  price_difference?: number;
  stock_difference?: number;
  updated_at: string;
};

export type ExportResponse = {
  file_path: "string";
};

export type AsyncExportResponse = TaskStatusResponse;

export enum DifferencesTypes {
  Price = "price",
  Stock = "stock",
}

const initialState = {
  data: {
    count: 0,
    results: [] as ProductResponse[],
  },
  loading: false,
  error: null as string | null,
};

export const fetchProducts = createAsyncThunk(
  "report/fetch",
  async (params: FetchProductsParams, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<ProductResponse[]>(
        reportsNotForSaleProductsURL,
        { params },
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "products.fetch.fail");
    }
  },
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.data.results = action.payload;
      state.data.count = action.payload.length;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.detail || "products.fetch.fail";
    });
  },
});

export const getDifferences = async (
  differenceType: DifferencesTypes,
  body: DifferencesBody,
  params: DifferencesParams,
) => {
  try {
    const url =
      differenceType === DifferencesTypes.Price
        ? reportsPriceDifferencesURL
        : reportsStockDifferencesURL;

    const response = await apiClient.post<
      ExportResponse | AsyncExportResponse | ExportNotSelectedResponse[]
    >(url, body, params);

    return response.data;
  } catch (error) {}
};

export const downloadCSV = async (filePath: string) => {
  const response = await apiClient.get<Blob>(
    `${import.meta.env.VITE_MAIN_APP_URL}/${filePath}`,
    {
      responseType: "blob",
    },
  );

  return response.data;
};

export default reportSlice.reducer;
