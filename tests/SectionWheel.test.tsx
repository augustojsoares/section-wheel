import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SectionWheel, type SectionWheelSections } from "../src";

const sections: SectionWheelSections<"planning" | "review"> = {
  planning: { label: "Planning", color: "rebeccapurple" },
  review: { label: "Review", color: "rgb(0, 120, 160)", selected: true },
};

describe("SectionWheel", () => {
  it.each([0, 1, 2, 10, 24])(
    "renders %i sections with valid paths",
    (count) => {
      const entries = Object.fromEntries(
        Array.from({ length: count }, (_, index) => [
          `id-${index}`,
          { label: `Section ${index}`, color: "red" },
        ]),
      );
      const { container } = render(
        <SectionWheel sections={entries} callback={() => {}} />,
      );
      expect(screen.queryAllByRole("button")).toHaveLength(count);
      for (const path of container.querySelectorAll("path"))
        expect(path.getAttribute("d")).not.toMatch(/NaN|Infinity/);
    },
  );

  it("emits stable IDs for click, Enter and Space without changing controlled selection", () => {
    const callback = vi.fn();
    render(<SectionWheel sections={sections} callback={callback} />);
    const button = screen.getByRole("button", { name: "Planning" });
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: " " });
    fireEvent.keyDown(button, { key: "Enter", repeat: true });
    expect(callback.mock.calls).toEqual([
      ["planning"],
      ["planning"],
      ["planning"],
    ]);
    expect(button.getAttribute("aria-label")).toBe("Planning");
  });

  it("updates selection when the parent changes the sections prop", () => {
    const { rerender } = render(
      <SectionWheel sections={sections} callback={() => {}} />,
    );
    rerender(
      <SectionWheel
        sections={{
          ...sections,
          planning: { ...sections.planning, selected: true },
        }}
        callback={() => {}}
      />,
    );
    const button = screen.getByRole("button", { name: "Planning, selected" });
    expect(
      button.querySelector(".section-wheel__fill")?.getAttribute("fill"),
    ).toBe("rebeccapurple");
  });

  it("uses the requested hover distance and suppresses it and callbacks in read-only mode", () => {
    const callback = vi.fn();
    const { rerender } = render(
      <SectionWheel sections={sections} callback={callback} hoverOffset={35} />,
    );
    const button = screen.getByRole("button", { name: "Planning" });
    fireEvent.mouseEnter(button);
    expect(button.style.transform).toBe("translate(35px, 0px)");
    rerender(
      <SectionWheel
        sections={sections}
        callback={callback}
        hoverOffset={35}
        readOnly
      />,
    );
    expect(button.style.transform).toBe("translate(0px, 0px)");
    expect(button.getAttribute("tabindex")).toBe("-1");
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    expect(callback).not.toHaveBeenCalled();
  });

  it("supports focus movement and a zero offset", () => {
    const { rerender } = render(
      <SectionWheel sections={sections} callback={() => {}} hoverOffset={20} />,
    );
    const button = screen.getByRole("button", { name: "Planning" });
    fireEvent.focus(button);
    expect(button.style.transform).toBe("translate(20px, 0px)");
    rerender(
      <SectionWheel sections={sections} callback={() => {}} hoverOffset={0} />,
    );
    expect(button.style.transform).toBe("translate(0px, 0px)");
  });

  it("namespaces SVG references across mounted instances", () => {
    const { container } = render(
      <>
        <SectionWheel sections={sections} callback={() => {}} />
        <SectionWheel sections={sections} callback={() => {}} />
      </>,
    );
    const ids = [...container.querySelectorAll("path[id]")].map(
      (path) => path.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
    for (const wheel of screen.getAllByRole("group")) {
      expect(within(wheel).getAllByRole("button")).toHaveLength(2);
      for (const text of wheel.querySelectorAll("textPath")) {
        const id = text.getAttribute("href")!.slice(1);
        expect(
          [...wheel.querySelectorAll("path[id]")].some(
            (path) => path.id === id,
          ),
        ).toBe(true);
      }
    }
  });

  it("expands its view box for large radii and offsets", () => {
    render(
      <SectionWheel
        sections={sections}
        callback={() => {}}
        outerRadius={400}
        hoverOffset={50}
      />,
    );
    expect(screen.getByRole("group").getAttribute("viewBox")).toBe(
      "-474 -474 948 948",
    );
  });
});
