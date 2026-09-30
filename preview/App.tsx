import { useState } from "react";
import { SectionWheel } from "../src";
import RangeControl from "./RangeControl";
import { createSections } from "./sections";

export default function App() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [readOnly, setReadOnly] = useState(false);
  const [count, setCount] = useState(10);
  const [width, setWidth] = useState(600);
  const [innerRadius, setInnerRadius] = useState(126);
  const [outerRadius, setOuterRadius] = useState(252);
  const [hoverOffset, setHoverOffset] = useState(12.6);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const sections = createSections(count, selectedIds);
  const selectedCount = Object.values(sections).filter(
    (section) => section.selected,
  ).length;

  function toggleSection(id: string) {
    setLastSelectedId(id);
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function changeOuterRadius(radius: number) {
    setOuterRadius(radius);
    setInnerRadius((inner) => Math.min(inner, radius - 10));
  }

  return (
    <main className="preview">
      <header>
        <span className="eyebrow">COMPONENT PREVIEW</span>
        <h1>Section Wheel</h1>
        <p>
          Variable sections, configurable geometry, and outward hover movement.
        </p>
      </header>
      <div className="preview-layout">
        <section className="preview-stage" aria-label="Wheel preview">
          <div className="wheel-container" style={{ width }}>
            <SectionWheel
              sections={sections}
              callback={toggleSection}
              readOnly={readOnly}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              hoverOffset={hoverOffset}
            />
          </div>
        </section>
        <aside className="preview-controls">
          <h2>Preview controls</h2>
          <label className="field">
            Sections
            <input
              type="number"
              min={0}
              max={24}
              value={count}
              onChange={(event) =>
                setCount(
                  Math.max(
                    0,
                    Math.min(24, Math.floor(Number(event.target.value) || 0)),
                  ),
                )
              }
            />
          </label>
          <RangeControl
            id="inner"
            label="Inner radius"
            value={innerRadius}
            min={0}
            max={outerRadius - 10}
            onChange={setInnerRadius}
          />
          <RangeControl
            id="outer"
            label="Outer radius"
            value={outerRadius}
            min={40}
            max={400}
            onChange={changeOuterRadius}
          />
          <RangeControl
            id="offset"
            label="Hover offset"
            value={hoverOffset}
            min={0}
            max={60}
            step={0.1}
            onChange={setHoverOffset}
          />
          <RangeControl
            id="width"
            label="Container width"
            value={width}
            min={240}
            max={600}
            step={20}
            onChange={setWidth}
          />
          <label className="field">
            Read-only
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(event) => setReadOnly(event.target.checked)}
            />
          </label>
          <div className="actions">
            <button
              onClick={() => setSelectedIds(new Set(Object.keys(sections)))}
            >
              Select all
            </button>
            <button
              onClick={() => {
                setSelectedIds(new Set());
                setLastSelectedId(null);
              }}
            >
              Clear
            </button>
          </div>
          <div className="status" aria-live="polite">
            {lastSelectedId
              ? `Last callback: ${lastSelectedId}`
              : "Click or focus a section to try it."}
            <br />
            {selectedCount} of {count} sections selected
          </div>
          <p className="hint">
            Radii and offset use SVG units. This demo owns selection; the
            component only emits the section ID.
          </p>
        </aside>
      </div>
      <footer>Reusable component · Separate preview app</footer>
    </main>
  );
}
