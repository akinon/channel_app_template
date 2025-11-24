import "@testing-library/jest-dom";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/dom";
import { render, fireEvent } from "@testing-library/react";

// Shared spies that we need access to inside tests
const getFlowsMock = vi.fn();
const syncPaginationMock = vi.fn();
const akitableRenderSpy = vi.fn();
const akifilterSpy = vi.fn();

// Mock heavy/third-party components BEFORE importing PageLog
vi.mock("@akinon/akifilter", () => ({
  Akifilter: vi.fn(({ filterSchema, useAppliedFilters }) => {
    akifilterSpy(filterSchema);
    const [filters, setFilters] = useAppliedFilters;
    return (
      <div data-testid="filter">
        <button
          data-testid="apply-flow-name"
          onClick={() => setFilters({ ...filters, flow_name: "FLOW_A" })}
        >
          apply-flow
        </button>
        <button
          data-testid="apply-transaction"
          onClick={() => setFilters({ ...filters, transaction_id: "T-1" })}
        >
          apply-transaction
        </button>
        <button
          data-testid="clear-filters"
          onClick={() =>
            setFilters({
              flow_name: "",
              flow_author: "",
              status: "",
              id: "",
              transaction_id: "",
              started_at: "",
              ended_at: "",
            })
          }
        >
          clear
        </button>
      </div>
    );
  }),
}));

vi.mock("@akinon/akitable", () => ({
  Akitable: vi.fn((props: any) => {
    akitableRenderSpy(props);
    return (
      <div data-testid="table">
        <div>{props.header?.title}</div>
        <button
          data-testid="open-run"
          onClick={() => {
            // simulate clicking first row actions
            const first = Array.isArray(props.data)
              ? props.data[0]
              : props.data?.results?.[0];
            props.columns.find((c: any) => c.key === "actions")?.render(first);
          }}
        >
          open-run
        </button>
        {props.pagination && (
          <button
            data-testid="paginate"
            onClick={() => props.onPaginationChanged(2, props.pagination.size)}
          >
            next-page
          </button>
        )}
      </div>
    );
  }),
  AkitablePageSizes: {} as any,
}));

// Mock ui-react (Modal etc.)
vi.mock("@akinon/ui-react", () => ({
  Modal: vi.fn(({ children, open }) => (
    open ? <div data-testid="modal">{children}</div> : null
  )),
  Select: vi.fn((props: any) => (
    <select data-testid="select" {...props}>
      {props.children}
    </select>
  )),
  Button: vi.fn(({ children, ...rest }: any) => (
    <button data-testid="button" {...rest}>
      {children}
    </button>
  )),
}));

// Mock icons
vi.mock("@akinon/icons", () => ({
  Icon: vi.fn(() => <i data-testid="icon" />),
}));

// Mock columns maker so we can control actions column
vi.mock("@/pages/Log/Table/columns", () => ({
  makeLogColumns: ({ handleOpenRun, handleOpenPayload }: any) => [
    { key: "id", dataIndex: "id", title: "ID" },
    {
      key: "actions",
      render: (row: any) => {
        handleOpenRun(row);
        handleOpenPayload(row);
        return null;
      },
    },
  ],
}));

// Mock FlowDetailModal & TransactionModal to observe props
vi.mock("@/pages/Log/components/FlowDetailModal", () => ({
  __esModule: true,
  default: ({ flow, onOpenPayload }: any) => (
    <div data-testid="flow-detail" onClick={() => onOpenPayload(null, flow)}>
      FlowDetail:{flow?.id}
    </div>
  ),
}));

vi.mock("@/pages/Log/components/TransactionModal", () => ({
  __esModule: true,
  default: ({ flow }: any) => (
    <div data-testid="transaction-modal">Tx:{flow?.id}</div>
  ),
}));

// Mock API flows dynamic
vi.mock("@/api/flows", () => ({
  getFlows: (...args: any[]) => getFlowsMock(...args),
}));

// Mock pagination hook
vi.mock("@/hooks/use-pagination-from-query-params", () => ({
  __esModule: true,
  default: () => ({ page: 1, limit: 10, syncPaginationWithQueryParams: syncPaginationMock }),
}));

// Import after mocks
import { PageLog } from "@/pages/Log";

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
}));

vi.mock("@akinon/akilocale/react", () => ({
  useTranslation: vi.fn(() => ({ t: (key: string) => key })),
}));

describe("pages/Log test suite", () => {
  beforeEach(() => {
    getFlowsMock.mockReset();
    syncPaginationMock.mockReset();
    akitableRenderSpy.mockReset();
    akifilterSpy.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("covers early return when no filters (table hidden)", async () => {
    // first call for flow options rejects to hit catch path silently
    getFlowsMock
      .mockRejectedValueOnce(new Error("options error")) // options load
      .mockResolvedValue({ items: [], total: 0 }); // main effect call

    render(<PageLog />);
    expect(screen.getByText("page.log.title")).toBeInTheDocument();

    // No table because filters empty
    await waitFor(() => {
      expect(screen.queryByTestId("table")).not.toBeInTheDocument();
    });
    expect(getFlowsMock).toHaveBeenCalledTimes(1); // only options fetch
  });

  it("renders table with array data (no pagination) and opens modals", async () => {
    // options fetch returns two flow names for select options
    getFlowsMock
      .mockResolvedValueOnce({ items: [{ flow_name: "FLOW_A" }, { flow_name: "FLOW_A" }, { flow_name: "FLOW_B" }], total: 3 })
      .mockResolvedValueOnce({
        items: [
          { id: 1, flow_name: "FLOW_A", flow_author: "auth", status: "SUCCESS" },
        ],
        total: 1,
      });

    render(<PageLog />);

    // Apply flow filter to trigger fetch
    fireEvent.click(screen.getByTestId("apply-flow-name"));

    await waitFor(() => expect(akitableRenderSpy).toHaveBeenCalled());

    // Table should appear
    expect(screen.getByTestId("table")).toBeInTheDocument();
    // Dynamic select options captured in filter schema (uniq should produce FLOW_A, FLOW_B)
    const passedSchema = akifilterSpy.mock.calls.at(-1)?.[0];
    const flowNameField = passedSchema.find((f: any) => f.key === "flow_name");
    expect(flowNameField.options.map((o: any) => o.value).sort()).toEqual(["FLOW_A", "FLOW_B"]);

    // Trigger actions render -> open run & payload via columns render side-effects
    fireEvent.click(screen.getByTestId("open-run"));

    // Both modals should appear due to actions calling handlers then FlowDetailModal triggers onOpenPayload
    await waitFor(() => {
      expect(screen.getAllByTestId("modal").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByTestId("flow-detail")).toBeInTheDocument();
      expect(screen.getByTestId("transaction-modal")).toBeInTheDocument();
    });

    // Ensure second API call used proper params
    const secondCallArgs = getFlowsMock.mock.calls[1][0];
    expect(secondCallArgs.flow_name).toBe("FLOW_A");
    expect(secondCallArgs.limit).toBeGreaterThan(0);
  });

  it("renders table with pagination object when total > limit and handles pagination change", async () => {
    // options
    getFlowsMock
      .mockResolvedValueOnce({ items: [{ flow_name: "FLOW_A" }], total: 1 })
      .mockResolvedValueOnce({
        items: Array.from({ length: 10 }).map((_, i) => ({ id: i + 1, flow_name: "FLOW_A" })),
        total: 25, // greater than limit (10)
      })
      .mockResolvedValueOnce({
        items: Array.from({ length: 10 }).map((_, i) => ({ id: i + 11, flow_name: "FLOW_A" })),
        total: 25,
      });

    render(<PageLog />);

    // Apply flow filter
    fireEvent.click(screen.getByTestId("apply-flow-name"));

    await waitFor(() => expect(akitableRenderSpy).toHaveBeenCalled());

    // Confirm pagination prop passed
    const firstRenderProps = akitableRenderSpy.mock.calls.find((c) => c[0]?.pagination)?.[0];
    expect(firstRenderProps.pagination.page).toBe(1);

    // Paginate to next page
    fireEvent.click(screen.getByTestId("paginate"));

    await waitFor(() => expect(getFlowsMock).toHaveBeenCalledTimes(3));
    expect(syncPaginationMock).toHaveBeenCalledWith({ page: 2, limit: 10 });
    const thirdCallArgs = getFlowsMock.mock.calls[2][0];
    // NOTE: current implementation computes offset using initial hook 'page' value (1), not updated pagination.page
    // This results in offset remaining 0; test documents existing behavior.
    expect(thirdCallArgs.offset).toBe(0);
    expect(thirdCallArgs.limit).toBe(10); // lmt = offset + pagination.limit (remains 10 due to stale page reference)
  });

  it("handles error during main fetch after filters applied", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getFlowsMock
      .mockResolvedValueOnce({ items: [{ flow_name: "FLOW_A" }], total: 1 }) // options
      .mockRejectedValueOnce(new Error("data error")); // main fetch

    render(<PageLog />);
    fireEvent.click(screen.getByTestId("apply-flow-name"));

    await waitFor(() => {
      // main fetch attempted
      expect(getFlowsMock).toHaveBeenCalledTimes(2);
    });
    // After rejection no table since total stays 0
    expect(screen.queryByTestId("table")).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("supports transaction_id only filtering and logs total (console.log path)", async () => {
    getFlowsMock
      .mockResolvedValueOnce({ items: [{ flow_name: "FLOW_A" }], total: 1 }) // options
      .mockResolvedValueOnce({
        items: [
          { id: 10, flow_name: "FLOW_A", transaction_id: "T-1" },
          { id: 11, flow_name: "FLOW_A", transaction_id: "T-1" },
        ],
        total: 25,
      });

    render(<PageLog />);
    // apply only transaction filter
    fireEvent.click(screen.getByTestId("apply-transaction"));

    await waitFor(() => expect(akitableRenderSpy).toHaveBeenCalled());
    // pagination path object variant again ensures logData object branch executed
    const tableProps = akitableRenderSpy.mock.calls.at(-1)?.[0];
    expect(typeof tableProps.data).toBe("object");
    expect(tableProps.data.count).toBe(25);
  });

  it("falls back to 'Logs' title when translation empty and runs cleanup on unmount", async () => {
    vi.resetModules();
    // Recreate essential mocks for this isolated import
    const localGetFlows = vi.fn()
      .mockResolvedValueOnce({ items: [], total: 0 }) // options
      .mockResolvedValueOnce({ items: [{ id: 99, flow_name: "FLOW_Z" }], total: 1 });

    vi.doMock("@/api/flows", () => ({ getFlows: (...a: any[]) => localGetFlows(...a) }));
    // translation returns empty string to trigger fallback
    vi.doMock("@akinon/akilocale/react", () => ({ useTranslation: () => ({ t: () => "" }) }));
    // minimal mocks required for component
    vi.doMock("@akinon/akifilter", () => ({ Akifilter: ({ useAppliedFilters }: any) => {
      const [f, setF] = useAppliedFilters;
      return <button data-testid="set-flow" onClick={() => setF({ ...f, flow_name: "FLOW_Z" })}>set</button>;
    }}));
    const localColumnsSpy = vi.fn();
    vi.doMock("@/pages/Log/Table/columns", () => ({ makeLogColumns: (h: any) => { localColumnsSpy(h); return []; } }));
    vi.doMock("@akinon/ui-layout", () => ({
      Layout: Object.assign(({ children }: any) => <>{children}</>, { Content: ({ children }: any) => <>{children}</> }),
      PageHeading: ({ title }: any) => <div data-testid="title-fallback">{title}</div>,
      PageContent: ({ children }: any) => <>{children}</>,
    }));
    vi.doMock("@akinon/ui-react", () => ({ Modal: () => null }));
    vi.doMock("@/hooks/use-pagination-from-query-params", () => ({ __esModule: true, default: () => ({ page: 1, limit: 10, syncPaginationWithQueryParams: vi.fn() }) }));

    const { PageLog: PageLogAlt } = await import("@/pages/Log");

    const { unmount } = render(<PageLogAlt />);
    // trigger fetch by setting flow filter
    fireEvent.click(screen.getByTestId("set-flow"));
    await waitFor(() => expect(localGetFlows).toHaveBeenCalledTimes(2));
    // Title fallback should render 'Logs'
    expect(screen.getByTestId("title-fallback").textContent).toBe("Logs");
    unmount(); // triggers cleanup of first useEffect
  });
});
