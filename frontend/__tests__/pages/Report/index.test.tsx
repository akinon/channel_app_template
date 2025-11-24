import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { PageReport } from "@/pages/Report";

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
  Row: vi.fn(({ children }) => <div data-testid="row">{children}</div>),
  Col: vi.fn(({ children }) => <div data-testid="col">{children}</div>),
  Flex: vi.fn(({ children, vertical, gap, className, ...props }) => (
    <div data-testid="flex" className={className} {...props}>
      {children}
    </div>
  )),
}));

vi.mock("@akinon/akilocale/react", () => ({
  useTranslation: vi.fn(() => ({ t: (key: string) => key })),
}));

vi.mock("@akinon/akiform", () => ({
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
  Text: vi.fn(({ children, ...props }) => (
    <span data-testid="text" {...props}>
      {children}
    </span>
  )),
  Link: vi.fn(({ children, ...props }) => (
    <a data-testid="link" {...props}>
      {children}
    </a>
  )),
  NavCard: vi.fn(({ icon, title, description, variant, ...props }) => (
    <div data-testid="nav-card" {...props}>
      <div data-testid="nav-card-icon">{icon}</div>
      <div data-testid="nav-card-title">{title}</div>
      <div data-testid="nav-card-description">{description}</div>
      <div data-testid="nav-card-variant">{variant}</div>
    </div>
  )),
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

describe("pages/Report test suite", () => {
  it("should render correctly", () => {
    render(<PageReport />);

    expect(screen.getByText("page.report.title")).toBeInTheDocument();
    expect(screen.getByText("page.report.description")).toBeInTheDocument();
  });

  it("should render report cards correctly", () => {
    render(<PageReport />);

    expect(
      screen.getByText("page.report.list_products_not_reflected_in_sales"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("page.report.list_products_with_price_difference"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("page.report.list_stock_difference"),
    ).toBeInTheDocument();
  });

  it("should List Products not Reflected in Sales card has a href attribute", () => {
    render(<PageReport />);

    const cardTitle = screen.getByText(
      "page.report.list_products_not_reflected_in_sales",
    );

    const link = cardTitle.closest("a");

    expect(link).toHaveAttribute(
      "href",
      "/list-products-not-reflected-in-sales",
    );
  });

  it("should List of Products with Price Difference card opens modal when clicked", () => {
    render(<PageReport />);

    const cardTitle = screen.getByText(
      "page.report.list_products_with_price_difference",
    );

    const link = cardTitle.closest("a");
    fireEvent.click(link!);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should List of Stock Difference card opens modal when clicked", () => {
    render(<PageReport />);

    const cardTitle = screen.getByText("page.report.list_stock_difference");

    const link = cardTitle.closest("a");
    fireEvent.click(link!);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });
});
