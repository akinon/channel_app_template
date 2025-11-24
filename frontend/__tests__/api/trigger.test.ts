import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTasks, triggerTask, getTaskStatus } from "@/api/trigger";
import { apiClient } from "@/api/client";
import {
  taskListURL,
  triggerTaskURL,
  taskStatusURL,
} from "@/constants/serviceUrls";
import { formatString } from "@/helpers";

const mockTasks = [
  { name: "task1", args: ["a"] },
  { name: "task2", args: ["b"] },
];
const mockTriggerResponse = { task_id: "abc", status: "queued" };
const mockStatusResponse = {
  task_id: "abc",
  status: "SUCCESS",
  result: { file_path: "/tmp/file" },
  error: null,
  ready: true,
};

describe("api/trigger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchTasks", () => {
    it("should return tasks on success", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockTasks });
      const thunk = fetchTasks();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const result = await thunk(dispatch, getState, undefined);
      expect(apiClient.get).toHaveBeenCalledWith(taskListURL);
      expect(result.payload).toEqual(mockTasks);
    });

    it("should handle error", async () => {
      vi.spyOn(apiClient, "get").mockRejectedValue({
        response: { data: { detail: "fail" } },
      });
      const thunk = fetchTasks();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const result = await thunk(dispatch, getState, undefined);
      expect(result.payload).toEqual({ detail: "fail" });
    });
  });

  describe("triggerTask", () => {
    it("should return triggerTask response on success", async () => {
      vi.spyOn(apiClient, "post").mockResolvedValue({
        data: mockTriggerResponse,
      });
      const params = { task_name: "test", params: {} };
      const result = await triggerTask(params);
      expect(apiClient.post).toHaveBeenCalledWith(triggerTaskURL, params);
      expect(result).toEqual(mockTriggerResponse);
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiClient, "post").mockRejectedValue(new Error("fail"));
      const params = { task_name: "test", params: {} };
      await expect(triggerTask(params)).rejects.toThrow("fail");
    });
  });

  describe("getTaskStatus", () => {
    it("should return status on success", async () => {
      vi.spyOn(apiClient, "get").mockResolvedValue({
        data: mockStatusResponse,
      });
      const taskId = "abc";
      const url = formatString(taskStatusURL, taskId);
      const result = await getTaskStatus(taskId);
      expect(apiClient.get).toHaveBeenCalledWith(url);
      expect(result).toEqual(mockStatusResponse);
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiClient, "get").mockRejectedValue(new Error("fail"));
      await expect(getTaskStatus("abc")).rejects.toThrow("fail");
    });
  });
});
