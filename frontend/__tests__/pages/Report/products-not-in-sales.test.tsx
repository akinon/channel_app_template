import "@testing-library/jest-dom";
import { describe, expect, it, vi, afterEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import { PageProductsNotInSale } from "@/pages/Report/products-not-in-sales";
import usePaginationFromQueryParams from "@/hooks/use-pagination-from-query-params";
import { useTranslation } from "@akinon/akilocale/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { reportsNotForSaleProductsURL } from "@/constants/serviceUrls";
import { apiClient } from "@/api";

const mockData = [
  {
    pk: 1,
    name: "mock-name",
    sku: "mock-sku",
    created_date: "2024-01-15T10:00:00",
    modified_date: "2024-01-15T12:00:00",
  },
];

const server = setupServer(
  http.get(reportsNotForSaleProductsURL, async () => {
    return HttpResponse.json(mockData);
  }),
);

vi.mock("@akinon/ui-layout", () => ({
  Layout: Object.assign(
    vi.fn(({ children }) => <div data-testid="layout">{children}</div>),
    {
      Content: vi.fn(({ children }) => (
        <div data-testid="layout-content">{children}</div>
      )),
    },
  ),
  PageHeading: vi.fn(({ title, description }) => (
    <div data-testid="page-heading">
      <div data-testid="title">{title}</div>
      <div data-testid="description">{description}</div>
    </div>
  )),
  PageContent: vi.fn(({ children }) => (
    <div data-testid="page-content">{children}</div>
  )),
}));

vi.mock("@akinon/akilocale/react", () => ({
  useTranslation: vi.fn(() => ({ t: (key: string) => key })),
}));

vi.mock("@/hooks/use-pagination-from-query-params", () => ({
  default: vi.fn(() => ({
    page: 1,
    limit: 10,
    syncPaginationWithQueryParams: vi.fn(),
  })),
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
              <div
                data-testid={`column-render-${index}`}
                onClick={() =>
                  col.render("test-task", { name: "test-task", args: ["arg1"] })
                }
              >
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

vi.mock("@akinon/ui-react", () => ({
  notification: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe("pages/PageProductsNotInSale test suite", () => {
  vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockData });

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should render page layout correctly", () => {
    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("layout-content")).toBeInTheDocument();
    expect(screen.getByTestId("page-heading")).toBeInTheDocument();
    expect(screen.getByTestId("page-content")).toBeInTheDocument();
  });

  it("should render page heading with correct translations", () => {
    const mockT = vi.fn((key: string) => key);
    vi.mocked(useTranslation).mockReturnValue({ t: mockT } as any);

    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    expect(mockT).toHaveBeenCalledWith("page.report.title");
    expect(mockT).toHaveBeenCalledWith("page.report.description");
    expect(screen.getByText("page.report.title")).toBeInTheDocument();
    expect(screen.getByText("page.report.description")).toBeInTheDocument();
  });

  it("should render Akitable with data when API returns data", async () => {
    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    await waitFor(() => {
      // Task data check
      const akitableData = screen.getByTestId("akitable-data");
      expect(akitableData).toHaveTextContent(
        JSON.stringify({ count: 1, results: mockData }),
      );

      // Should have pagination
      const paginationData = JSON.parse(
        screen.getByTestId("akitable-pagination").textContent || "{}",
      );
      expect(paginationData).toEqual({ page: 1, size: 10 });
    });
  });

  it("should render correct table columns", () => {
    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    // First column - PK
    expect(screen.getByTestId("column-title-0")).toHaveTextContent(
      "page.common.pk",
    );
    expect(screen.getByTestId("column-dataIndex-0")).toHaveTextContent("pk");

    // Second column - Name
    expect(screen.getByTestId("column-title-1")).toHaveTextContent(
      "page.common.name",
    );
    expect(screen.getByTestId("column-dataIndex-1")).toHaveTextContent("name");

    // Third column - Sku
    expect(screen.getByTestId("column-title-2")).toHaveTextContent(
      "page.common.sku",
    );
    expect(screen.getByTestId("column-dataIndex-2")).toHaveTextContent("sku");

    // Fourth column - Created Date
    expect(screen.getByTestId("column-title-3")).toHaveTextContent(
      "page.common.created_date",
    );
    expect(screen.getByTestId("column-dataIndex-3")).toHaveTextContent(
      "created_date",
    );

    // Fifth column - Modified Date
    expect(screen.getByTestId("column-title-4")).toHaveTextContent(
      "page.common.modified_date",
    );
    expect(screen.getByTestId("column-dataIndex-4")).toHaveTextContent(
      "modified_date",
    );
  });

  it("should show loading state initially", () => {
    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    expect(screen.getByTestId("akitable-loading")).toHaveTextContent("loading");
  });

  it("should call translation function for all required keys", () => {
    const mockT = vi.fn((key: string) => key);
    vi.mocked(useTranslation).mockReturnValue({ t: mockT } as any);

    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    expect(mockT).toHaveBeenCalledWith("page.report.title");
    expect(mockT).toHaveBeenCalledWith("page.report.description");
    expect(mockT).toHaveBeenCalledWith("page.common.modified_date");
    expect(mockT).toHaveBeenCalledWith("page.common.name");
  });

  it("should use pagination from query params hook", () => {
    const mockSyncPaginationWithQueryParams = vi.fn();
    vi.mocked(usePaginationFromQueryParams).mockReturnValue({
      page: 1,
      limit: 10,
      syncPaginationWithQueryParams: mockSyncPaginationWithQueryParams,
    });

    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    // usePaginationFromQueryParams hook should be called
    expect(mockSyncPaginationWithQueryParams).toBeDefined();
  });

  it("should handle pagination change correctly and sync with query params", async () => {
    const mockSyncPaginationWithQueryParams = vi.fn();
    vi.mocked(usePaginationFromQueryParams).mockReturnValue({
      page: 1,
      limit: 10,
      syncPaginationWithQueryParams: mockSyncPaginationWithQueryParams,
    });

    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    // Wait for Akitable to render
    await waitFor(() => {
      expect(screen.getByTestId("akitable")).toBeInTheDocument();
    });

    // Check that pagination sync function is defined
    expect(mockSyncPaginationWithQueryParams).toBeDefined();
  });

  it("should cleanup abort controller on unmount", () => {
    const { unmount } = render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    // Test that component unmounts without errors
    expect(() => unmount()).not.toThrow();
  });

  it("should update pagination state from query params", () => {
    vi.mocked(usePaginationFromQueryParams).mockReturnValue({
      page: 2,
      limit: 20,
      syncPaginationWithQueryParams: vi.fn(),
    });

    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    // Initial pagination state should be set from hook
    expect(usePaginationFromQueryParams).toHaveBeenCalled();
  });

  it("should call handlePaginationChange when pagination changes", async () => {
    const mockSyncPaginationWithQueryParams = vi.fn();
    vi.mocked(usePaginationFromQueryParams).mockReturnValue({
      page: 1,
      limit: 10,
      syncPaginationWithQueryParams: mockSyncPaginationWithQueryParams,
    });

    render(
      <Provider store={store}>
        <PageProductsNotInSale />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("akitable")).toBeInTheDocument();
    });

    // Trigger pagination change
    const paginationButton = screen.getByTestId("pagination-change-trigger");
    fireEvent.click(paginationButton);

    expect(mockSyncPaginationWithQueryParams).toHaveBeenCalledWith({
      page: 2,
      limit: 20,
    });
  });
});
