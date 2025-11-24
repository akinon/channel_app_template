import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { PageAlarm } from "@/pages/Alarm";

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

describe("pages/Alarm test suite", () => {
  it("should render correctly", () => {
    render(<PageAlarm />);

    expect(screen.getByText("page.alarm.title")).toBeInTheDocument();
    expect(screen.getByText("page.alarm.description")).toBeInTheDocument();
  });
});
