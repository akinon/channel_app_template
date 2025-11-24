import { apiClient } from "./client";

export type FlowStatus = "IN_PROGRESS" | "WAITING" | "PENDING" | "SUCCESS" | "FAILURE";

export interface Flow {
  id: string;
  transaction_id?: string | null;
  flow_name: string;
  flow_author?: string | null;
  created_at: string; // ISO
  started_at?: string | null;
  ended_at?: string | null;
  status: FlowStatus;
}

export interface FlowStep {
  id: string;
  name: string;
  status: FlowStatus;
  start_time?: string | null;
  end_time?: string | null;
  metadata?: Record<string, any> | null; // sku, process, error_code, payload vs.
  step_name?: string; // For backward compatibility
}

export interface StepException {
  id: string;
  created_at: string; // ISO
  message: string;
  details?: Record<string, any> | null;
}

export type FlowQuery = {
  transaction_id?: string;
  id?: string;
  flow_name?: string;
  flow_author?: string;
  status?: FlowStatus | "";
  limit?: number;
  offset?: number;
};

async function getFlows(params: FlowQuery) {
  const res = await apiClient.get("/flows", { params });
  const data = res.data ?? {};
  const items: Flow[] = data.results ?? data.items ?? data ?? [];
  const total: number = data.count ?? data.total ?? items.length ?? 0;
  return { items, total };
}

async function getFlow(flowId: string) {
  const res = await apiClient.get(`/flows/${flowId}`);
  return res.data as Flow;
}

async function getFlowSteps(flowId: string) {
  const res = await apiClient.get(`/flows/${flowId}/steps`);
  const data = res.data ?? {};
  const items: FlowStep[] = Array.isArray(data) ? data : (data.results ?? data.items ?? []);
  return items;
}

async function getStepExceptions(stepId: string) {
  const res = await apiClient.get(`/steps/${stepId}/exceptions`);
  const data = res.data ?? {};
  const items: StepException[] = Array.isArray(data) ? data : (data.results ?? data.items ?? []);
  return items;
}

export {
  getFlows,
  getFlow,
  getFlowSteps,
  getStepExceptions,
};
