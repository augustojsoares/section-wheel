import { useId, useState } from "react";
import "./section-wheel.css";
import type { SectionWheelProps, SectionWheelSection } from "./types";
import { arcPath, point, sectorPath, TAU, validateGeometry } from "./geometry";

export default function SectionWheel<Id extends string = string>({
  sections,
  callback,
  readOnly = false,
  innerRadius = 126,
  outerRadius = 252,
  hoverOffset = 12.6,
  ariaLabel = "Section wheel",
}: SectionWheelProps<Id>) {
  const instanceId = useId();
  const [hoveredId, setHoveredId] = useState<Id | null>(null);
  const [focusedId, setFocusedId] = useState<Id | null>(null);
  validateGeometry(innerRadius, outerRadius, hoverOffset);

  const entries = Object.entries(sections) as [Id, SectionWheelSection][];
  // Retain the original default framing; expand it for larger geometry/offsets.
  const extent = Math.max(300, outerRadius + hoverOffset + 24);
  const thickness = outerRadius - innerRadius;
  const labelRadius = innerRadius + thickness * 0.85;
  const iconRadius = innerRadius + thickness * 0.4;
  const angleSize = entries.length ? TAU / entries.length : 0;
  const iconSize = Math.min(
    60,
    thickness * 0.48,
    entries.length > 1 ? 2 * iconRadius * Math.sin(angleSize / 2) * 0.7 : 60,
  );

  return (
    <div className="section-wheel">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${-extent} ${-extent} ${2 * extent} ${2 * extent}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label={ariaLabel}
        className="section-wheel__svg"
      >
        {entries.map(([id, section], index) => {
          const start = index * angleSize - Math.PI / 2;
          const end = start + angleSize;
          const middle = (start + end) / 2;
          const gap =
            entries.length === 1 ? 0 : Math.min(0.003, angleSize * 0.05);
          const active = !readOnly && (hoveredId === id || focusedId === id);
          const [dx, dy] = point(active ? hoverOffset : 0, middle);
          const [iconX, iconY] = point(iconRadius, middle);
          const flipped = middle > 0 && middle < Math.PI;
          const textPathId = `${instanceId}-label-${index}`;
          const selected = section.selected ?? false;
          const activate = () => {
            if (!readOnly) callback(id);
          };

          return (
            <g
              key={id}
              className="section-wheel__section"
              role="button"
              tabIndex={readOnly ? -1 : 0}
              aria-label={`${section.label}${selected ? ", selected" : ""}`}
              aria-disabled={readOnly}
              onClick={activate}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  if (!event.repeat) activate();
                }
              }}
              onMouseEnter={() => {
                if (!readOnly) setHoveredId(id);
              }}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setFocusedId(id)}
              onBlur={() => setFocusedId(null)}
              style={{
                cursor: readOnly ? "default" : "pointer",
                transform: `translate(${dx}px, ${dy}px)`,
              }}
            >
              <defs>
                <path
                  id={textPathId}
                  d={arcPath(
                    labelRadius,
                    flipped ? end : start,
                    flipped ? start : end,
                  )}
                />
              </defs>
              <path
                className="section-wheel__fill"
                d={sectorPath(innerRadius, outerRadius, start + gap, end - gap)}
                fill={selected || active ? section.color : "#C0C7C9"}
                fillOpacity={!selected && active ? 0.3 : 1}
              />
              {section.icon && (
                <image
                  href={section.icon}
                  x={iconX - iconSize / 2}
                  y={iconY - iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  opacity={selected ? 1 : 0.3}
                  className="section-wheel__icon"
                />
              )}
              <text
                fill="black"
                fontSize={Math.min(14, thickness * 0.2)}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="bold"
                textAnchor="middle"
                className="section-wheel__label"
              >
                <textPath
                  href={`#${textPathId}`}
                  startOffset="50%"
                  dominantBaseline="middle"
                >
                  {section.label}
                </textPath>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
