import { describe, it, expect } from "vitest";
import reducer, {
  addLog,
  removeLog,
  clearLogs,
  type LogsState,
} from "@/store/logs-slice";

describe("logs-slice", () => {
  it("initial state", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect((state as LogsState).logs).toEqual([]);
  });

  it("addLog unshift to top", () => {
    const first = reducer(
      undefined,
      addLog({ id: "1", message: "m1", type: "info" }),
    );
    const second = reducer(
      first,
      addLog({ id: "2", message: "m2", type: "success" }),
    );
    expect(second.logs.map((l) => l.id)).toEqual(["2", "1"]);
  });

  it("removeLog by id", () => {
    const pre = {
      logs: [{ id: "1", message: "m1", type: "info" }],
    } as LogsState;
    const next = reducer(pre, removeLog("1"));
    expect(next.logs).toEqual([]);
  });

  it("clearLogs", () => {
    const pre = {
      logs: [{ id: "1", message: "m1", type: "info" }],
    } as LogsState;
    const next = reducer(pre, clearLogs());
    expect(next.logs).toEqual([]);
  });
});
