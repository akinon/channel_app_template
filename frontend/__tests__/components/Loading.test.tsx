import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";

import { Loading } from "@/components/Loading";

const SPIN = "SPIN";

vi.mock("@akinon/ui-spin", () => ({
  Spin: vi.fn(() => <>{SPIN}</>),
}));

describe("components/Loading test suite", () => {
  it("should render correctly", () => {
    render(<Loading />);

    expect(screen.getByText(SPIN)).toBeInTheDocument();
  });
});
