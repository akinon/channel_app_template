import "@testing-library/jest-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import { TriggerModal } from "@/pages/Trigger/trigger-modal";
import { apiClient } from "@/api";
import { notification } from "@akinon/ui-react";
import { useFieldArray, useForm } from "@akinon/akiform";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { store } from "@/store";
import { triggerTaskURL } from "@/constants/serviceUrls";

const mockTriggerModalProps = {
  name: "test-task",
  args: ["arg1"],
};

const mockTriggerTaskResponse = {
  task_id: "123",
  status: "queued",
};

vi.spyOn(apiClient, "post").mockResolvedValue({
  data: mockTriggerTaskResponse,
});

const server = setupServer(
  http.post(triggerTaskURL, async ({ params }) => {
    if (params) {
      return HttpResponse.json(mockTriggerTaskResponse);
    }

    return HttpResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }),
);

vi.mock("@akinon/akilocale/react", () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

vi.mock("@akinon/akiform", () => ({
  AkinonForm: vi.fn(({ onFinish, children }) => (
    <form
      data-testid="akinon-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (onFinish) onFinish({});
      }}
    >
      {children}
    </form>
  )),
  Akiform: vi.fn(({ onFinish, children }) => (
    <form
      data-testid="akiform"
      onSubmit={(e) => {
        e.preventDefault();
        if (onFinish) onFinish({});
      }}
    >
      {children}
    </form>
  )),
  Select: vi.fn(({ children, ...props }) => (
    <select data-testid="select" {...props}>
      {children}
    </select>
  )),
  Input: vi.fn((props) => <input data-testid="input" {...props} />),
  Label: vi.fn(({ children, ...props }) => (
    <label data-testid="label" {...props}>
      {children}
    </label>
  )),
  Textarea: vi.fn((props) => <textarea data-testid="textarea" {...props} />),
  Button: vi.fn(({ children, type = "default", htmlType, ...props }) => (
    <button
      data-testid={htmlType ? `button-${type}-${htmlType}` : `button-${type}`}
      {...props}
    >
      {children}
    </button>
  )),
  useForm: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn((fn) => (data: any) => fn(data)),
    reset: vi.fn(),
    formState: { errors: {}, isValid: true },
    watch: vi.fn(),
  })),
  useFieldArray: vi.fn(() => ({
    fields: [],
    append: vi.fn(),
    remove: vi.fn(),
  })),
  akivalResolver: vi.fn(() => () => ({
    isValid: true,
    errors: {},
  })),
  FormItem: vi.fn(({ children, label, name, control, ...props }) => (
    <div data-testid="form-item" {...props}>
      {label && <label data-testid="form-label">{label}</label>}
      {children}
    </div>
  )),
}));

vi.mock("@akinon/akival", () => ({
  akival: {
    lazy: vi.fn(() => ({})),
    object: vi.fn(() => ({})),
    array: vi.fn(() => ({
      of: vi.fn(() => ({ required: vi.fn(() => ({})) })),
    })),
    mixed: vi.fn(() => ({
      oneOf: vi.fn(() => ({ required: vi.fn(() => ({})) })),
    })),
    number: vi.fn(() => ({
      required: vi.fn(() => ({ min: vi.fn(() => ({})) })),
      min: vi.fn(() => ({})),
    })),
    string: vi.fn(() => ({ required: vi.fn(() => ({})) })),
  },
}));

vi.mock("@akinon/ui-react", () => ({
  Button: vi.fn(
    ({ children, onClick, type, loading, disabled, htmlType, ...props }) => (
      <button
        data-testid={
          htmlType
            ? `button-${type || "default"}-${htmlType}`
            : `button-${type || "default"}`
        }
        onClick={onClick}
        disabled={loading || disabled}
        type={htmlType}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    ),
  ),
  Flex: vi.fn(({ children, vertical, gap, className, ...props }) => (
    <div
      data-testid="flex"
      className={className}
      style={{
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        gap: gap,
      }}
      {...props}
    >
      {children}
    </div>
  )),
  Input: vi.fn(({ placeholder, size, className, ...props }) => (
    <input
      data-testid="input"
      placeholder={placeholder}
      className={className}
      {...props}
    />
  )),
  InputNumber: vi.fn(({ placeholder, size, className, ...props }) => (
    <input
      data-testid="input-number"
      type="number"
      placeholder={placeholder}
      className={className}
      {...props}
    />
  )),
  Modal: vi.fn(
    ({ children, open, title, onCancel, closable, footer, className }) =>
      open ? (
        <div data-testid="modal" className={className}>
          <div data-testid="modal-title">{title}</div>
          {closable && (
            <button data-testid="modal-close" onClick={onCancel}>
              X
            </button>
          )}
          <div data-testid="modal-content">{children}</div>
          {footer && <div data-testid="modal-footer">{footer}</div>}
        </div>
      ) : null,
  ),
  Select: vi.fn(
    ({ placeholder, options, onChange, rootClassName, ...props }) => (
      <select
        data-testid="select"
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={rootClassName}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  ),
  Space: vi.fn(({ children, size, direction, ...props }) => (
    <div
      data-testid="space"
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        gap: size === "small" ? "8px" : "16px",
      }}
      {...props}
    >
      {children}
    </div>
  )),
  Text: vi.fn(({ children, ...props }) => (
    <span data-testid="text" {...props}>
      {children}
    </span>
  )),
  notification: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@akinon/icons", () => ({
  Icon: vi.fn(({ icon, onClick, color, className }) => (
    <button
      data-testid={`icon-${icon}`}
      onClick={onClick}
      style={{ color }}
      className={className}
    >
      {icon}
    </button>
  )),
}));

describe("TriggerModal Component", () => {
  const mockNotification = vi.mocked(notification);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should make request without opening modal when args prop has no length", async () => {
    const propsWithEmptyArgs = { ...mockTriggerModalProps, args: [] };
    render(
      <Provider store={store}>
        <TriggerModal {...propsWithEmptyArgs} />
      </Provider>,
    );

    const button = screen.getByTestId("button-primary");
    fireEvent.click(button);

    // Modal should not open
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockNotification.success).toHaveBeenCalled();
    });
  });

  it("should open modal when args prop has length", () => {
    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    const button = screen.getByTestId("button-primary");
    fireEvent.click(button);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should show name prop in modal title and description", () => {
    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "page.trigger.box_title - test-task",
    );
    expect(screen.getByTestId("text")).toHaveTextContent(
      "page.trigger.trigger_modal_desc",
    );
  });

  it("should show only export type field initially when modal opens", () => {
    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    // Export type select should be visible
    expect(screen.getByTestId("select")).toBeInTheDocument();

    // Initially there should be only 1 form item (export type)
    const formItems = screen.getAllByTestId("form-item");
    expect(formItems).toHaveLength(1);
  });

  it("should render Stock-related fields when Stock export type is selected", () => {
    // Mock useFieldArray to return fields for Stock
    vi.mocked(useFieldArray).mockReturnValue({
      fields: [{ id: "1" }] as any,
      append: vi.fn(),
      remove: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      prepend: vi.fn(),
      insert: vi.fn(),
      replace: vi.fn(),
      update: vi.fn(),
    });

    // Mock useForm watch to return Stock export type
    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn((fn) => (data: any) => fn(data)),
      reset: vi.fn(),
      formState: { errors: {}, isValid: true },
      watch: vi.fn((field) => {
        if (field === "export_type") return 1; // Stock
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const select = screen.getByTestId("select");
    fireEvent.change(select, { target: { value: "1" } });

    // Stock fields should be rendered: export_type + pk + stock + sku = 4
    const formItems = screen.getAllByTestId("form-item");
    expect(formItems.length).toBeGreaterThanOrEqual(4);

    // Should have Stock placeholder
    expect(
      screen.getByPlaceholderText("page.common.stock"),
    ).toBeInTheDocument();
  });

  it("should render Price-related fields when Price export type is selected", () => {
    // Mock useFieldArray to return fields for Price
    vi.mocked(useFieldArray).mockReturnValue({
      fields: [{ id: "1" }] as any,
      append: vi.fn(),
      remove: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      prepend: vi.fn(),
      insert: vi.fn(),
      replace: vi.fn(),
      update: vi.fn(),
    });

    // Mock useForm watch to return Price export type
    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn((fn) => (data: any) => fn(data)),
      reset: vi.fn(),
      formState: { errors: {}, isValid: true },
      watch: vi.fn((field) => {
        if (field === "export_type") return 2; // Price
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const select = screen.getByTestId("select");
    fireEvent.change(select, { target: { value: "2" } });

    // Price fields should be rendered: export_type + pk + price + sku = 4
    const formItems = screen.getAllByTestId("form-item");
    expect(formItems.length).toBeGreaterThanOrEqual(4);

    expect(
      screen.getByPlaceholderText("page.common.price"),
    ).toBeInTheDocument();
  });

  it("should make correct POST request when Price fields are filled and submitted", async () => {
    const mockHandleSubmit = vi.fn(
      (fn) => () =>
        fn({
          export_type: 2,
          fields: [
            {
              pk: 123,
              sku: "TEST-SKU",
              price: 99.99,
            },
          ],
        }),
    );

    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: mockHandleSubmit,
      reset: vi.fn(),
      formState: { errors: {}, isValid: true },
      watch: vi.fn((field) => {
        if (field === "export_type") return 2;
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const form = screen.getByTestId("akiform");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockNotification.success).toHaveBeenCalled();
    });
  });

  it("should disable run button when Stock fields are not filled", () => {
    vi.mocked(useFieldArray).mockReturnValue({
      fields: [{ id: "1" }] as any,
      append: vi.fn(),
      remove: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      prepend: vi.fn(),
      insert: vi.fn(),
      replace: vi.fn(),
      update: vi.fn(),
    });

    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(),
      reset: vi.fn(),
      formState: { errors: { fields: [{ sku: "required" }] }, isValid: false }, // Form invalid due to empty fields
      watch: vi.fn((field) => {
        if (field === "export_type") return 1; // Stock selected
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const submitButton = screen.getByTestId("button-primary-submit");
    expect(submitButton).toBeDisabled();
  });

  it("should show correct export type options when modal opens", () => {
    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    // Stock and Price options should be visible
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("should switch from Price fields to Stock fields when export type is changed", () => {
    const mockReset = vi.fn();

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [{ id: "1" }] as any,
      append: vi.fn(),
      remove: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      prepend: vi.fn(),
      insert: vi.fn(),
      replace: vi.fn(),
      update: vi.fn(),
    });

    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(),
      reset: mockReset,
      formState: { errors: {}, isValid: true },
      watch: vi.fn((field) => {
        if (field === "export_type") return 1; // Return Stock after change
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const select = screen.getByTestId("select");

    // Change export type to Stock
    fireEvent.change(select, { target: { value: "1" } });

    // Reset should be called with Stock configuration
    expect(mockReset).toHaveBeenCalledWith(
      expect.objectContaining({
        export_type: 1,
        fields: expect.any(Array),
      }),
    );
  });

  it("should show error notification when POST request fails", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue(new Error("POST failed"));

    const mockHandleSubmit = vi.fn((fn) => () => fn({}));

    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: mockHandleSubmit,
      reset: vi.fn(),
      formState: { errors: {}, isValid: true },
      watch: vi.fn(() => undefined),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const form = screen.getByTestId("akiform");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockNotification.error).toHaveBeenCalled();
    });
  });

  it("should close modal when close button is clicked", () => {
    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("modal-close"));
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("should show loading state on button during POST request", async () => {
    const mockHandleSubmit = vi.fn(
      (fn) => () =>
        fn({
          export_type: 1,
          fields: [{ pk: 123, sku: "TEST-SKU", stock: 10 }],
        }),
    );

    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: mockHandleSubmit,
      reset: vi.fn(),
      formState: { errors: {}, isValid: true },
      watch: vi.fn((field) => {
        if (field === "export_type") return 1;
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const form = screen.getByTestId("akiform");
    fireEvent.submit(form);

    const submitButton = screen.getByTestId("button-primary-submit");
    expect(submitButton).toHaveTextContent("Loading...");
    expect(submitButton).toBeDisabled();
  });

  it("should handle reset form on close modal", () => {
    const mockReset = vi.fn();

    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(),
      reset: mockReset,
      formState: { errors: {}, isValid: true },
      watch: vi.fn((field) => {
        if (field === "export_type") return 1;
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));
    fireEvent.click(screen.getByTestId("modal-close"));

    expect(mockReset).toHaveBeenCalledWith({
      export_type: undefined,
      fields: [],
    });
  });

  it("should disable submit button when form is not valid", () => {
    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(),
      reset: vi.fn(),
      formState: {
        errors: {
          fields: [{ pk: { message: "Required field" } }],
        },
        isValid: false,
      },
      watch: vi.fn((field) => {
        if (field === "export_type") return 1;
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const submitButton = screen.getByTestId("button-primary-submit");
    expect(submitButton).toBeDisabled();
  });

  it("should handle export type change to price correctly", () => {
    const mockReset = vi.fn();

    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(),
      reset: mockReset,
      formState: { errors: {}, isValid: true },
      watch: vi.fn((field) => {
        if (field === "export_type") return 2;
        return undefined;
      }),
    } as any);

    render(
      <Provider store={store}>
        <TriggerModal {...mockTriggerModalProps} />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("button-primary"));

    const select = screen.getByTestId("select");
    fireEvent.change(select, { target: { value: "2" } });

    expect(mockReset).toHaveBeenCalledWith({
      export_type: 2,
      fields: [
        {
          pk: undefined,
          price: undefined,
          sku: "",
        },
      ],
    });
  });
});
