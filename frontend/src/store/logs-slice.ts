import { createSlice } from "@reduxjs/toolkit";

export type LogMessageType = "info" | "warning" | "error" | "success";

export interface LogMessage {
  id: string;
  message: string;
  type: LogMessageType;
  createdAt?: string;
}

export interface LogsState {
  logs: LogMessage[];
}

const initialState: LogsState = {
  logs: [],
};

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addLog: (state, action) => {
      state.logs.unshift(action.payload);
    },
    removeLog: (state, action) => {
      state.logs = state.logs.filter((log) => log.id !== action.payload);
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addLog, removeLog, clearLogs } = logsSlice.actions;
export default logsSlice.reducer;
