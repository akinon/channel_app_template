import { describe, it, expect } from "vitest";
import reducer, {
  toggleLeftSiderCollapsed,
  toggleRightSiderCollapsed,
  type UIState,
} from "@/store/ui-slice";

describe("ui-slice", () => {
  it("initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" }) as UIState;
    expect(state.leftSiderCollapsed).toBe(false);
    expect(state.rightSiderCollapsed).toBe(true);
  });

  it("toggleLeftSiderCollapsed", () => {
    const s1 = reducer(undefined, toggleLeftSiderCollapsed()) as UIState;
    expect(s1.leftSiderCollapsed).toBe(true);
    const s2 = reducer(s1, toggleLeftSiderCollapsed()) as UIState;
    expect(s2.leftSiderCollapsed).toBe(false);
  });

  it("toggleRightSiderCollapsed covers both branches", () => {
    // initial right = true
    const s1 = reducer(undefined, toggleRightSiderCollapsed()) as UIState;
    // right: true -> false, branch: if (!right) => left = true
    expect(s1.rightSiderCollapsed).toBe(false);
    expect(s1.leftSiderCollapsed).toBe(true);

    const s2 = reducer(s1, toggleRightSiderCollapsed()) as UIState;
    // right: false -> true, else branch => left = false
    expect(s2.rightSiderCollapsed).toBe(true);
    expect(s2.leftSiderCollapsed).toBe(false);
  });
});
