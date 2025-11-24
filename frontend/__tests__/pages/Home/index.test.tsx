import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

vi.mock("@akinon/ui-react", () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
  NavCard: ({ title }: any) => <div data-testid="navcard">{title}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  Col: ({ children }: any) => <div>{children}</div>,
  Row: ({ children }: any) => <div>{children}</div>,
}));

// 3) i18n: t(key) => key
vi.mock("@akinon/akilocale/react", () => ({
  useTranslation: vi.fn(() => ({ t: (key: string) => key })),
}));

describe("pages/Home", () => {
  it("renders heading and home cards", async () => {
    const { PageHome } = await import("@/pages/Home");
    const { PAGES } = await import("@/pageMeta");

    render(<PageHome />);

    expect(screen.getByTestId("title")).toHaveTextContent("page.home.title");
    expect(screen.getByTestId("desc")).toHaveTextContent(
      "page.home.description",
    );

    const expected = PAGES.filter((p) => p.showOnHome).length;
    expect(screen.getAllByTestId("navcard")).toHaveLength(expected);
  });
});
