import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import { PageTrigger } from "@/pages/Trigger";
import usePaginationFromQueryParams from "@/hooks/use-pagination-from-query-params";
import { useTranslation } from "@akinon/akilocale/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { taskListURL } from "@/constants/serviceUrls";
import { apiClient } from "@/api/client";

const mockTaskListData = [
  {
    name: "task1",
    args: [],
  },
  {
    name: "task2",
    args: ["arg1", "arg2"],
  },
];

vi.spyOn(apiClient, "get").mockResolvedValue({ data: mockTaskListData });

const server = setupServer(
  http.get(taskListURL, async () => {
    return HttpResponse.json(mockTaskListData);
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

vi.mock("@/pages/Trigger/trigger-modal", () => ({
  TriggerModal: vi.fn(({ name, args }) => (
    <div data-testid="trigger-modal">
      <span data-testid="modal-name">{name}</span>
      <span data-testid="modal-args">{JSON.stringify(args)}</span>
    </div>
  )),
}));

describe("pages/Trigger test suite", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should render page layout correctly", () => {
    render(
      <Provider store={store}>
        <PageTrigger />
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
        <PageTrigger />
      </Provider>,
    );

    expect(mockT).toHaveBeenCalledWith("page.trigger.title");
    expect(mockT).toHaveBeenCalledWith("page.trigger.description");
    expect(screen.getByText("page.trigger.title")).toBeInTheDocument();
    expect(screen.getByText("page.trigger.description")).toBeInTheDocument();
  });

  it("should render Akitable with task data when API returns data", async () => {
    render(
      <Provider store={store}>
        <PageTrigger />
      </Provider>,
    );

    await waitFor(() => {
      const akitableData = screen.getByTestId("akitable-data");
      expect(akitableData).toHaveTextContent(
        JSON.stringify({
          count: mockTaskListData.length,
          results: mockTaskListData,
        }),
      );

      const paginationData = JSON.parse(
        screen.getByTestId("akitable-pagination").textContent || "{}",
      );
      expect(paginationData).toEqual({ page: 1, size: 10 });
    });
  });

  it("should render Akitable with correct props when no data", async () => {
    vi.spyOn(apiClient, "get").mockResolvedValue({ data: [] });

    render(
      <Provider store={store}>
        <PageTrigger />
      </Provider>,
    );

    await waitFor(() => {
      const akitable = screen.getByTestId("akitable");
      expect(akitable).toBeInTheDocument();

      // Empty data check
      expect(screen.getByTestId("akitable-data")).toHaveTextContent("[]");

      // Loading state
      expect(screen.getByTestId("akitable-loading")).toHaveTextContent(
        "not-loading",
      );

      // Header title
      expect(screen.getByTestId("akitable-header")).toHaveTextContent(
        "page.trigger.box_title",
      );

      // Pagination should be undefined - check empty content
      const paginationElement = screen.getByTestId("akitable-pagination");
      expect(paginationElement).toHaveTextContent("");
    });
  });

  it("should render correct table columns", () => {
    render(
      <Provider store={store}>
        <PageTrigger />
      </Provider>,
    );

    expect(screen.getByTestId("column-title-0")).toHaveTextContent(
      "page.common.name",
    );
    expect(screen.getByTestId("column-dataIndex-0")).toHaveTextContent("name");

    expect(screen.getByTestId("column-title-1")).toHaveTextContent(
      "page.trigger.box_title",
    );
    expect(screen.getByTestId("column-dataIndex-1")).toHaveTextContent("name");
  });

  it("should show loading state initially", () => {
    render(
      <Provider store={store}>
        <PageTrigger />
      </Provider>,
    );

    expect(screen.getByTestId("akitable-loading")).toHaveTextContent("loading");
  });

  it("should call translation function for all required keys", () => {
    const mockT = vi.fn((key: string) => key);
    vi.mocked(useTranslation).mockReturnValue({ t: mockT } as any);

    render(
      <Provider store={store}>
        <PageTrigger />
      </Provider>,
    );

    expect(mockT).toHaveBeenCalledWith("page.trigger.title");
    expect(mockT).toHaveBeenCalledWith("page.trigger.description");
    expect(mockT).toHaveBeenCalledWith("page.trigger.box_title");
    expect(mockT).toHaveBeenCalledWith("page.common.name");
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
        <PageTrigger />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("akitable")).toBeInTheDocument();
    });

    const paginationButton = screen.getByTestId("pagination-change-trigger");
    fireEvent.click(paginationButton);

    expect(mockSyncPaginationWithQueryParams).toHaveBeenCalledWith({
      page: 2,
      limit: 20,
    });
  });

  it("should render column render function for TriggerModal", async () => {
    render(
      <Provider store={store}>
        <PageTrigger />
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("akitable")).toBeInTheDocument();
    });

    // Check that the second column has a render function
    const columnRender = screen.getByTestId("column-render-1");
    expect(columnRender).toBeInTheDocument();

    // This should trigger the render function which creates a TriggerModal
    expect(columnRender).toHaveTextContent("Column Render Function");
  });
});
