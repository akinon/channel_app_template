import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    inc: (s) => {
      s.value += 1;
    },
  },
});
const { inc } = counterSlice.actions;

function Demo() {
  const v = useAppSelector((s: any) => s.counter.value);
  const dispatch = useAppDispatch();
  return (
    <button onClick={() => dispatch(inc())} aria-label="btn">
      {v}
    </button>
  );
}

describe("store hooks", () => {
  it("useAppSelector & useAppDispatch work", () => {
    const store = configureStore({
      reducer: { counter: counterSlice.reducer },
    });
    render(
      <Provider store={store}>
        <Demo />
      </Provider>,
    );
    expect(screen.getByRole("button", { name: "btn" })).toHaveTextContent("0");
    fireEvent.click(screen.getByLabelText("btn"));
    expect(screen.getByRole("button", { name: "btn" })).toHaveTextContent("1");
  });
});
