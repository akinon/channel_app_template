import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "./client";
import {
  taskListURL,
  taskStatusURL,
  triggerTaskURL,
} from "@/constants/serviceUrls";
import { formatString } from "@/helpers";

export type TaskResponse = {
  name: string;
  args: string[];
};

enum TaskStatus {
  PENDING = "PENDING",
  STARTED = "STARTED",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  RETRY = "RETRY",
  REVOKED = "REVOKED",
}

export type TaskStatusResponse = {
  task_id: string;
  status: TaskStatus;
  result: null | { file_path: string };
  error: string | null;
  ready: boolean;
};

type BaseTriggerFields = {
  pk: number;
  sku: string;
};

export type PriceTriggerFields = BaseTriggerFields & {
  price: number;
};

export type StockTriggerFields = BaseTriggerFields & {
  stock: number;
};

export enum ExportType {
  EXPORT = 1,
  ASYNC_EXPORT = 2,
}

type Params = {
  task_name: string;
  params: {
    export_type?: ExportType;
    products?: StockTriggerFields[] | PriceTriggerFields[];
  };
};

type TriggerTaskResponse = {
  task_id: string;
  status: "queued";
};

const initialState = {
  data: {
    count: 0,
    results: [] as TaskResponse[],
  },
  loading: false,
  error: null as string | null,
};

export const fetchTasks = createAsyncThunk(
  "task-list/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get<TaskResponse[]>(taskListURL);
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Fetch task-list failed");
    }
  },
);

const triggerSlice = createSlice({
  name: "trigger",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.data.results = action.payload;
      state.data.count = action.payload.length;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as any)?.detail || "Fetch task-list failed";
    });
  },
});

export const triggerTask = async (params: Params) => {
  const response = await apiClient.post<TriggerTaskResponse>(
    triggerTaskURL,
    params,
  );
  return response.data;
};

export const getTaskStatus = async (taskId: string) => {
  const response = await apiClient.get<TaskStatusResponse>(
    formatString(taskStatusURL, taskId),
  );
  return response.data;
};

export default triggerSlice.reducer;
