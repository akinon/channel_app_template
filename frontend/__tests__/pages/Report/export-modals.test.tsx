import "@testing-library/jest-dom";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import { ExportModals } from "@/pages/Report/export-modals";
import { useFieldArray, useForm } from "@akinon/akiform";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { reportsPriceDifferencesURL, taskStatusURL } from "@/constants/serviceUrls";
import { formatString } from "@/helpers";

const mockSelectedCard = {
  key: "price" as const,
  icon: "urunlistesi" as const,
  labelKey: "mock-label",
  descriptionKey: "mock-description",
  triggerModal: true,
};

const mockSelectedStockCard = {
  ...mockSelectedCard,
  key: "stock" as const,
};
const mockFilePath = "path/to/exported/file.csv";
const mockBlob = new Blob(["id,name\n1,Product A\n2,Product B"], {
  type: "text/csv",
});
const mockAsyncExportResult = {
  task_id: "123123213",
  status: "SUCCESS",
  result: { file_path: "path/to/exported/file.csv" },
  error: null,
  ready: true,
};
const mockPriceResponse = [
  {
    product_pk: 123,
    product_sku: "SKU123",
    price_difference: 10,
    updated_at: "2023-01-01",
  },
];
const baseURL = import.meta.env.VITE_MAIN_APP_URL;

const server = setupServer(
  http.get(`${baseURL}/${mockFilePath}`, async () => {
    return new HttpResponse(mockBlob, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
      },
    });
  }),
  http.get(`${baseURL}/api${formatString(taskStatusURL, ":id")}`, async () => {
    return HttpResponse.json(mockAsyncExportResult, {
      status: 200,
    });
  }),
  http.post("*", async ({ request }) => {
    const url = new URL(request.url);

    if (url.toString().includes(reportsPriceDifferencesURL)) {
      const isExport = url.searchParams.get("export");
      const isAsyncExport = url.searchParams.get("async_export");

      if (isExport && !isAsyncExport) {
        return HttpResponse.json({ file_path: mockFilePath });
      }
      if (isExport && isAsyncExport) {
        return HttpResponse.json(mockAsyncExportResult);
      }
      return HttpResponse.json(mockPriceResponse);
    }
  }),
);

vi.mock("@akinon/akilocale/react", () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

vi.mock("@akinon/akiform", () => ({
  Akiform: vi.fn(({ onFinish, children }) => (
    <form
      data-testid="akiform"
      onSubmit={(e) => {
        e.preventDefault();
        if (onFinish)
          onFinish({
            export_type: "export",
            fields: [
              {
                pk: 1,
                price: 2,
                sku: "SKU123",
              },
            ],
          });
      }}
    >
      {children}
    </form>
  )),
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

vi.mock("@akinon/ui-layout", () => ({
  Layout: Object.assign(
    vi.fn(({ children }) => <>{children}</>),
    {
      Content: vi.fn(({ children }) => <>{children}</>),
    },
  ),
  PageHeading: vi.fn(({ title, description }) => (
    <>
      <div data-testid="title">{title}</div>
      <div data-testid="desc">{description}</div>
    </>
  )),
  PageContent: vi.fn(({ children }) => <>{children}</>),
  Flex: vi.fn(({ children, vertical, gap, className, ...props }) => (
    <div data-testid="flex" {...props}>
      {children}
    </div>
  )),
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

const numberChain = {
  required: vi.fn(() => numberChain),
  min: vi.fn(() => numberChain),
  typeError: vi.fn(() => numberChain),
  notRequired: vi.fn(() => numberChain),
};

vi.mock("@akinon/akival", () => ({
  akival: {
    object: vi.fn(() => ({
      shape: vi.fn(() => ({})),
    })),
    array: vi.fn(() => ({
      of: vi.fn(() => ({
        required: vi.fn(() => ({})),
      })),
    })),
    mixed: vi.fn(() => ({
      oneOf: vi.fn(() => ({ required: vi.fn(() => ({})) })),
    })),
    number: vi.fn(() => numberChain),
    string: vi.fn(() => ({ required: vi.fn(() => ({})) })),
  },
}));

vi.mock("@akinon/akitable", () => ({
  Akitable: vi.fn(
    ({
      data,
      columns,
      isLoading,
      header,
      pagination,
      onPaginationChanged,
      ...props
    }) => (
      <div data-testid="akitable" {...props}>
        <div data-testid="akitable-header">{header?.title}</div>
        <div data-testid="akitable-loading">
          {isLoading ? "loading" : "not-loading"}
        </div>
        <div data-testid="akitable-data">{JSON.stringify(data)}</div>
        <div data-testid="akitable-pagination">
          {pagination ? JSON.stringify(pagination) : ""}
        </div>
        {columns?.map((col: any, index: number) => (
          <div key={index} data-testid={`column-${index}`}>
            <span data-testid={`column-title-${index}`}>{col.title}</span>
            <span data-testid={`column-dataIndex-${index}`}>
              {col.dataIndex}
            </span>
            {col.render && (
              <div data-testid={`column-render-${index}`}>
                Column Render Function
              </div>
            )}
          </div>
        ))}
        {onPaginationChanged && (
          <button
            data-testid="pagination-change-trigger"
            onClick={() => onPaginationChanged(2, 20)}
          >
            Change Pagination
          </button>
        )}
      </div>
    ),
  ),
}));

vi.mock("@akinon/akidate", () => ({
  Akidate: vi.fn(({ value }) => <div data-testid="akidate">{value}</div>),
}));

vi.mock("@/hooks/use-pagination-from-query-params", () => ({
  default: vi.fn(() => ({
    page: 1,
    limit: 10,
    syncPaginationWithQueryParams: vi.fn(),
  })),
}));

const mockSetSelectedCard = vi.fn();

describe("pages/ExportModals test suite", () => {
  const createObjectURLMock = vi.fn(() => "blob:url");
  const originalCreateObjectURL = global.URL.createObjectURL;

  beforeAll(() => {
    server.listen();
    global.URL.createObjectURL = createObjectURLMock;
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  beforeEach(() => {
    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        {
          pk: undefined as unknown as number,
          stock: undefined as unknown as number,
          price: undefined as unknown as number,
          sku: "",
        },
      ] as any,
      append: vi.fn(),
      remove: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      prepend: vi.fn(),
      insert: vi.fn(),
      replace: vi.fn(),
      update: vi.fn(),
    });
  });

  it("should render modal when selectedCard is not null", () => {
    render(
      <ExportModals
        selectedCard={mockSelectedCard}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
  });

  it("should hide modal when selectedCard is null", () => {
    render(
      <ExportModals
        selectedCard={null}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    expect(screen.queryByTestId("modal-content")).not.toBeInTheDocument();
  });

  it("should display modal title correctly", () => {
    render(
      <ExportModals
        selectedCard={mockSelectedCard}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    expect(screen.getByText(mockSelectedCard.labelKey)).toBeInTheDocument();
  });

  it("should render stock fields correctly", () => {
    render(
      <ExportModals
        selectedCard={mockSelectedStockCard}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    expect(screen.getByText("page.common.export_type")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("page.common.pk")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("page.common.stock"),
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("page.common.price"),
    ).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("page.common.sku")).toBeInTheDocument();
    expect(screen.getByTestId("icon-plus")).toBeInTheDocument();
    expect(screen.getByText("page.common.export")).toBeInTheDocument();
  });

  it("should render price fields correctly", () => {
    render(
      <ExportModals
        selectedCard={mockSelectedCard}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    expect(screen.getByText("page.common.export_type")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("page.common.pk")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("page.common.price"),
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("page.common.stock"),
    ).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("page.common.sku")).toBeInTheDocument();
    expect(screen.getByTestId("icon-plus")).toBeInTheDocument();
    expect(screen.getByText("page.common.export")).toBeInTheDocument();
  });

  it("should submit form without export type selection and process with result correctly", async () => {
    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(
        (fn) => () =>
          fn({
            export_type: undefined,
            fields: [
              {
                pk: 1,
                price: 2,
                sku: "SKU123",
              },
            ],
          }),
      ),
      reset: vi.fn(),
      formState: { isValid: true },
    } as any);

    render(
      <ExportModals
        selectedCard={mockSelectedCard}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    const submitButton = screen.getByText("page.common.export");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("akitable")).toBeInTheDocument();
    });

    expect(screen.getByText("page.common.pk")).toBeInTheDocument();
    expect(screen.getByText("page.common.sku")).toBeInTheDocument();
    expect(
      screen.getByText("page.report.price_difference"),
    ).toBeInTheDocument();
    expect(screen.getByText("page.common.updated_at")).toBeInTheDocument();
  });

  it("should submit form with 'export' type selection and process with result correctly", async () => {
    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(
        (fn) => () =>
          fn({
            export_type: "export",
            fields: [
              {
                pk: 1,
                price: 2,
                sku: "SKU123",
              },
            ],
          }),
      ),
      reset: vi.fn(),
      formState: { isValid: true },
    } as any);

    const createObjectURLMock = vi.fn(() => "blob:url");
    const originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = createObjectURLMock;

    render(
      <ExportModals
        selectedCard={mockSelectedCard}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    const submitButton = screen.getByText("page.common.export");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    });

    global.URL.createObjectURL = originalCreateObjectURL;
  });

  it("should submit form with 'async_export' type selection and process with result correctly", async () => {
    vi.mocked(useForm).mockReturnValue({
      control: {},
      handleSubmit: vi.fn(
        (fn) => () =>
          fn({
            export_type: "async_export",
            fields: [
              {
                pk: 5,
                price: 2,
                sku: "AKN-001-white001-XL",
              },
            ],
          }),
      ),
      reset: vi.fn(),
      formState: { isValid: true },
    } as any);

    const createObjectURLMock = vi.fn(() => "blob:url");
    const originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = createObjectURLMock;

    render(
      <ExportModals
        selectedCard={mockSelectedCard}
        setSelectedCard={mockSetSelectedCard}
      />,
    );

    const submitButton = screen.getByText("page.common.export");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    });

    global.URL.createObjectURL = originalCreateObjectURL;
  });
});
