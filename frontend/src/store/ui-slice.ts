import { createSlice } from "@reduxjs/toolkit";

export interface UIState {
  leftSiderCollapsed: boolean;
  rightSiderCollapsed: boolean;
}

const initialState: UIState = {
  leftSiderCollapsed: false,
  rightSiderCollapsed: true,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleLeftSiderCollapsed: (state) => {
      state.leftSiderCollapsed = !state.leftSiderCollapsed;
    },
    toggleRightSiderCollapsed: (state) => {
      state.rightSiderCollapsed = !state.rightSiderCollapsed;
      // Close the left sider when the right sider is opened.
      // Restore it back.
      if (!state.rightSiderCollapsed) {
        state.leftSiderCollapsed = true;
      } else {
        state.leftSiderCollapsed = false;
      }
    },
  },
});

export const { toggleLeftSiderCollapsed, toggleRightSiderCollapsed } =
  uiSlice.actions;
export default uiSlice.reducer;
