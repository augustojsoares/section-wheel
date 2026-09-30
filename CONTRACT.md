# SectionWheel contract

`SectionWheel` is a controlled React 18+ SVG component. It displays one equal-sized slice per entry in `sections`, starting at the top and proceeding clockwise. It has no form-context, energy-category, or utility-CSS dependency.

```tsx
interface SectionWheelSection {
  label: string;
  color: string; // Any valid CSS color
  icon?: string; // Image URL
  selected?: boolean; // Defaults to false; controlled by the parent
}

type SectionWheelSections<Id extends string = string> = Record<
  Id,
  SectionWheelSection
>;

interface SectionWheelProps<Id extends string = string> {
  sections: SectionWheelSections<Id>;
  callback: (sectionId: Id) => void;
  readOnly?: boolean; // Default false
  innerRadius?: number; // Default 126
  outerRadius?: number; // Default 252
  hoverOffset?: number; // Default 12.6
  ariaLabel?: string; // Default "Section wheel"
}
```

**Example**

```tsx
import SectionWheel, { type SectionWheelSections } from "./src";

const sections: SectionWheelSections<"planning" | "delivery" | "review"> = {
  planning: { label: "Planning", color: "#6EC2D8", selected: true },
  delivery: { label: "Delivery", color: "#B7D771" },
  review: { label: "Review", color: "#EAB94C" },
};

<SectionWheel
  sections={sections}
  innerRadius={100}
  outerRadius={240}
  hoverOffset={18}
  callback={(sectionId) => console.log(sectionId)}
/>;
```

**Semantics**

- Object keys are stable section IDs. Display order follows JavaScript `Object.entries` order. Use non-integer keys when insertion order matters: integer-like keys are numerically ordered by JavaScript.
- Any count is accepted, including zero (an empty square), one (a full ring), and two (two half-rings). Sections have equal angles; weights are not supported.
- `selected` controls the category color and icon opacity. A click emits the ID but does not alter selection. The parent must update `sections` to change selected states.
- Radii and offset are finite numbers in SVG coordinate units, not CSS pixels. `0 <= innerRadius < outerRadius`; `hoverOffset >= 0`. Invalid geometry throws a descriptive `RangeError`. An inner radius of zero produces a pie.
- Hover/focus translates a slice outward along its midpoint angle. It does not enlarge the slice. For a single section, that direction is down because its midpoint is opposite the start at the top.
- The default view box is 600 × 600. It expands when `outerRadius + hoverOffset + 24` exceeds 300, reserving space for the full translation. The component fills its parent's width at a square aspect ratio. At a rendered width W and view-box width V, one SVG unit equals W/V CSS pixels.
- `readOnly` blocks click and keyboard callbacks, removes sections from sequential keyboard focus, and disables hover/focus translation. Enter and Space activate editable sections.
- Labels and icons scale with the wheel. Very large section counts or very thin rings can make them too small; choose suitable labels and container sizes. This contract does not promise readable labels at arbitrary counts or widths.
- Icon URLs must be trusted application assets or validated URLs supplied by the parent. The component does not fetch or validate section data itself.
- Loading is owned by the parent; the generic component has no loading context dependency.

**Migration**

Import the component and types from `src/index.ts`. Move the old status boolean into each section's `selected` field. The callback name remains `callback`, but IDs are generic rather than energy-specific. The legacy EnergyWheel wrapper and incomplete form-context integration have been removed. Sample energy categories and icons belong only to `preview/`.

When consuming the built package, import `section-wheel/styles.css` once alongside the component. Importing the source entry loads its component stylesheet automatically.
