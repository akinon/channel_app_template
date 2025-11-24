import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/api/client", () => {
  const get = vi.fn();
  return { apiClient: { get } };
});

import { getFlows, getFlow, getFlowSteps, getStepExceptions } from "@/api/flows";
import { apiClient } from "@/api/client";

const mockGet = apiClient.get as unknown as ReturnType<typeof vi.fn>;

// Helper sample entities
const baseFlow = (over: Partial<any> = {}) => ({
  id: "f1",
  flow_name: "SYNC_PRODUCTS",
  created_at: new Date().toISOString(),
  status: "IN_PROGRESS",
  ...over,
});

const baseStep = (over: Partial<any> = {}) => ({
  id: "s1",
  name: "Fetch",
  status: "SUCCESS",
  ...over,
});

const baseException = (over: Partial<any> = {}) => ({
  id: "e1",
  created_at: new Date().toISOString(),
  message: "Boom",
  ...over,
});

beforeEach(() => {
  mockGet.mockReset();
});

describe("api/flows getFlows", () => {
  it("parses results key shape", async () => {
    mockGet.mockResolvedValueOnce({ data: { results: [baseFlow({ id: "r1" })], count: 10 } });
    const { items, total } = await getFlows({ limit: 5 });
    expect(mockGet).toHaveBeenCalledWith("/flows", { params: { limit: 5 } });
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("r1");
    expect(total).toBe(10);
  });

  it("falls back to items key shape", async () => {
    mockGet.mockResolvedValueOnce({ data: { items: [baseFlow({ id: "i1" })], total: 7 } });
    const { items, total } = await getFlows({});
    expect(items[0].id).toBe("i1");
    expect(total).toBe(7);
  });

  it("handles bare array response", async () => {
    mockGet.mockResolvedValueOnce({ data: [baseFlow({ id: "a1" })] });
    const { items, total } = await getFlows({});
    expect(items[0].id).toBe("a1");
    expect(total).toBe(1);
  });

  it("handles empty no data response", async () => {
    mockGet.mockResolvedValueOnce({ data: undefined });
    const { items, total } = await getFlows({});
    expect(total).toBe(0);
    expect(Array.isArray(items)).toBe(false);
    expect(items && typeof items === "object").toBe(true);
    expect(Object.keys(items as any)).toHaveLength(0);
  });

  it("prefers count over total and length", async () => {
    mockGet.mockResolvedValueOnce({ data: { results: [baseFlow({ id: "c1" })], count: 5, total: 3 } });
    const { items, total } = await getFlows({});
    expect(items).toHaveLength(1);
    expect(total).toBe(5); // count precedence
  });

  it("uses total when count absent", async () => {
    mockGet.mockResolvedValueOnce({ data: { results: [baseFlow({ id: "t1" })], total: 8 } });
    const { total } = await getFlows({});
    expect(total).toBe(8);
  });
});

describe("api/flows getFlow", () => {
  it("returns single flow object", async () => {
    const flow = baseFlow({ id: "single" });
    mockGet.mockResolvedValueOnce({ data: flow });
    const res = await getFlow("single");
    expect(mockGet).toHaveBeenCalledWith("/flows/single");
    expect(res).toEqual(flow);
  });
});

describe("api/flows getFlowSteps", () => {
  it("parses array shape directly", async () => {
    mockGet.mockResolvedValueOnce({ data: [baseStep({ id: "sa1" })] });
    const steps = await getFlowSteps("flow1");
    expect(mockGet).toHaveBeenCalledWith("/flows/flow1/steps");
    expect(steps).toHaveLength(1);
    expect(steps[0].id).toBe("sa1");
  });

  it("parses results shape", async () => {
    mockGet.mockResolvedValueOnce({ data: { results: [baseStep({ id: "sr1" })] } });
    const steps = await getFlowSteps("flow2");
    expect(steps[0].id).toBe("sr1");
  });

  it("parses items shape", async () => {
    mockGet.mockResolvedValueOnce({ data: { items: [baseStep({ id: "si1" })] } });
    const steps = await getFlowSteps("flow3");
    expect(steps[0].id).toBe("si1");
  });

  it("handles empty undefined data", async () => {
    mockGet.mockResolvedValueOnce({ data: undefined });
    const steps = await getFlowSteps("flow4");
    expect(steps).toEqual([]);
  });

  it("handles direct array (alternate branch)", async () => {
    mockGet.mockResolvedValueOnce({ data: [baseStep({ id: "arr1" })] });
    const steps = await getFlowSteps("flow-array");
    expect(steps[0].id).toBe("arr1");
  });
});

describe("api/flows getStepExceptions", () => {
  it("parses array shape directly", async () => {
    mockGet.mockResolvedValueOnce({ data: [baseException({ id: "ea1" })] });
    const ex = await getStepExceptions("step1");
    expect(mockGet).toHaveBeenCalledWith("/steps/step1/exceptions");
    expect(ex[0].id).toBe("ea1");
  });

  it("parses results shape", async () => {
    mockGet.mockResolvedValueOnce({ data: { results: [baseException({ id: "er1" })] } });
    const ex = await getStepExceptions("step2");
    expect(ex[0].id).toBe("er1");
  });

  it("parses items shape", async () => {
    mockGet.mockResolvedValueOnce({ data: { items: [baseException({ id: "ei1" })] } });
    const ex = await getStepExceptions("step3");
    expect(ex[0].id).toBe("ei1");
  });

  it("handles empty undefined data", async () => {
    mockGet.mockResolvedValueOnce({ data: undefined });
    const ex = await getStepExceptions("step4");
    expect(ex).toEqual([]);
  });

  it("handles direct array (alternate branch)", async () => {
    mockGet.mockResolvedValueOnce({ data: [baseException({ id: "earr1" })] });
    const ex = await getStepExceptions("step-array");
    expect(ex[0].id).toBe("earr1");
  });
});
