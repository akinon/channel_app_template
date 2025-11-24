import "@testing-library/jest-dom";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/dom";
import { render } from "@testing-library/react";

vi.mock("@akinon/ui-layout", () => ({
  Layout: Object.assign(vi.fn(({ children }) => <>{children}</>), {
    Content: vi.fn(({ children }) => <>{children}</>),
  }),
  PageHeading: vi.fn(({ title, description }) => (
    <>
      <div data-testid="title">{title}</div>
      <div data-testid="desc">{description}</div>
    </>
  )),
  PageContent: vi.fn(({ children }) => <>{children}</>),
  Row: vi.fn(({ children }) => <div data-testid="row">{children}</div>),
  Col: vi.fn(({ children }) => <div data-testid="col">{children}</div>),
}));

// Simplify ui-react components
vi.mock("@akinon/ui-react", () => ({
  Card: vi.fn(({ children }) => <div data-testid="card">{children}</div>),
  CardMeta: vi.fn(({ title, description }) => (
    <div className="card-meta">
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-desc">{description}</div>
    </div>
  )),
  Col: vi.fn(({ children }) => <div data-testid="col">{children}</div>),
  Layout: Object.assign(vi.fn(({ children }) => <>{children}</>), {
    Content: vi.fn(({ children }) => <>{children}</>),
  }),
  PageContent: vi.fn(({ children }) => <>{children}</>),
  PageHeading: vi.fn(({ title, description }) => (
    <>
      <div data-testid="title">{title}</div>
      <div data-testid="desc">{description}</div>
    </>
  )),
  Result: vi.fn(({ status, title, subTitle }) => (
    <div data-testid="result" data-status={status}>
      <div>{title}</div>
      <div>{subTitle}</div>
    </div>
  )),
  Row: vi.fn(({ children }) => <div data-testid="row">{children}</div>),
  Spin: vi.fn(() => <div role="status">loading-spinner</div>),
  Text: vi.fn(({ children, className }) => (
    <span data-testid="text" className={className}>
      {children}
    </span>
  )),
  Tooltip: vi.fn(({ children, title }) => (
    <span data-tooltip={title}>{children}</span>
  )),
}));

// Mock icons
vi.mock("@akinon/icons", () => ({
  Icon: vi.fn(({ "aria-label": ariaLabel }) => (
    <i data-testid="icon" aria-label={ariaLabel} />
  )),
}));

// Mock translations to just echo keys
vi.mock("@akinon/akilocale/react", () => ({
  useTranslation: vi.fn(() => ({ t: (key: string) => key })),
}));

// Mock API
const mockGetDashboardSummary = vi.fn();
vi.mock("@/api/dashboard", () => ({
  getDashboardSummary: (...args: any[]) => mockGetDashboardSummary(...args),
}));

// Import after mocks so that mocked modules are used
import { PageDashboard } from "@/pages/Dashboard";

describe("pages/Dashboard test suite", () => {
  beforeEach(() => {
    mockGetDashboardSummary.mockReset();
  });

  it("renders heading and shows loading spinner then resolves", async () => {
    mockGetDashboardSummary.mockResolvedValueOnce({
      total_sku: 15,
      total_sku_on_sale: 0,
      total_product_stocks: 300,
      total_stocks: 500,
    });

    render(<PageDashboard />);

    expect(screen.getByTestId("title")).toHaveTextContent("page.dashboard.title");
    expect(screen.getByTestId("desc")).toHaveTextContent("page.dashboard.description");
    expect(screen.getByRole("status")).toHaveTextContent("loading-spinner");

    await waitFor(() => {
      // Cards appear after load
      expect(screen.getAllByTestId("card").length).toBe(4);
    });
  });

  it("renders stats cards after successful load with correct values and footer", async () => {
    mockGetDashboardSummary.mockResolvedValueOnce({
      total_sku: 15,
      total_sku_on_sale: 0,
      total_product_stocks: 300,
      total_stocks: 500,
    });

    render(<PageDashboard />);

    // Wait for cards
  const cards = await screen.findAllByTestId("card");
    expect(cards).toHaveLength(4);

    // Assert one value uses fallback "0"
    const titles = screen.getAllByTestId("card-title").map((n) => n.textContent);
    expect(titles).toContain("0");
    expect(titles).toContain("15");
    expect(titles).toContain("300");
    expect(titles).toContain("500");

    // Labels (descriptions) contain translation keys
    expect(screen.getByText("page.dashboard.stat.total_sku")).toBeInTheDocument();
    expect(
      screen.getByText("page.dashboard.stat.total_sku_on_sale")
    ).toBeInTheDocument();
    expect(
      screen.getByText("page.dashboard.stat.total_product_stocks")
    ).toBeInTheDocument();
    expect(screen.getByText("page.dashboard.stat.total_stocks")).toBeInTheDocument();

    // Footer text (request time) should be present for each card (shared node reused ok)
    const footerTexts = screen.getAllByTestId("text").map((n) => n.textContent);
    // At least one footer includes prefix
    expect(
      footerTexts.some((t) =>
        t?.startsWith("page.dashboard.request_time_prefix:")
      )
    ).toBe(true);

    // Tooltip icons rendered with aria-label pattern
    expect(screen.getAllByTestId("icon").length).toBeGreaterThanOrEqual(4);
  });

  it("shows error result with custom error message from err.message", async () => {
    mockGetDashboardSummary.mockRejectedValueOnce(new Error("Boom failure"));

    render(<PageDashboard />);

    const result = await screen.findByTestId("result");
    expect(within(result).getByText("page.dashboard.error_title")).toBeInTheDocument();
    expect(within(result).getByText("Boom failure")).toBeInTheDocument();
  });

  it("falls back to translated fetch error key when no detail or message provided", async () => {
    // Rejected with empty object
  mockGetDashboardSummary.mockRejectedValueOnce({});

    render(<PageDashboard />);

    const result = await screen.findByTestId("result");
    expect(within(result).getByText("page.dashboard.error_title")).toBeInTheDocument();
    // Fallback translation key used
    expect(
      within(result).getByText("page.dashboard.error_fetch")
    ).toBeInTheDocument();
  });

  it("prefers response detail over generic message", async () => {
    mockGetDashboardSummary.mockRejectedValueOnce({
      response: { data: { detail: "Detaylı Hata" } },
      message: "Some message",
    });

    render(<PageDashboard />);

    const result = await screen.findByTestId("result");
    expect(within(result).getByText("Detaylı Hata")).toBeInTheDocument();
  });
});
