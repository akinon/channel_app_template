import { formatString, showNotification, sleep } from "@/helpers";
import { notification } from "@akinon/ui-react";

describe("helpers tests", () => {
  describe("formatString", () => {
    it("should format string with given arguments", () => {
      const result = formatString("Hello, {0} {1}!", "John", "Doe");
      expect(result).toBe("Hello, John Doe!");
    });
  });

  describe("showNotification", () => {
    vi.mock("@akinon/ui-react", () => ({
      notification: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
      },
    }));

    it("should call notification.success with correct parameters", () => {
      showNotification("success", "Test success message");
      expect(notification.success).toHaveBeenCalledWith({
        message: "Test success message",
        placement: "top",
        duration: 5,
      });
    });

    it("should call notification.error with correct parameters", () => {
      showNotification("error", "Test error message");
      expect(notification.error).toHaveBeenCalledWith({
        message: "Test error message",
        placement: "top",
        duration: 5,
      });
    });

    it("should call notification.warning with correct parameters", () => {
      showNotification("warning", "Test warning message");
      expect(notification.warning).toHaveBeenCalledWith({
        message: "Test warning message",
        placement: "top",
        duration: 5,
      });
    });

    it("should call notification.info with correct parameters", () => {
      showNotification("info", "Test info message");
      expect(notification.info).toHaveBeenCalledWith({
        message: "Test info message",
        placement: "top",
        duration: 5,
      });
    });
  });

  describe("sleep", () => {
    it("should resolve after the specified timeout", async () => {
      vi.useFakeTimers();

      const callback = vi.fn();

      const promise = sleep(2000).then(callback);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(2000);
      await promise;

      expect(callback).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });
});
