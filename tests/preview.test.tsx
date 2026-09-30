import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../preview/App";

it("keeps demo selection and controls in the preview parent", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("spinbutton", { name: "Sections" }), {
    target: { value: "3" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Select all" }));
  expect(screen.getByText(/3 of 3 sections selected/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "CHEMICAL, selected" }));
  expect(screen.getByText(/Last callback: section-1/)).toBeTruthy();
  expect(screen.getByText(/2 of 3 sections selected/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Clear" }));
  expect(screen.getByText(/0 of 3 sections selected/)).toBeTruthy();
});
