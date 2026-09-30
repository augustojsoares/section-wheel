/** One equal-sized section. Its stable ID is the key in the sections object. */
export interface SectionWheelSection {
  label: string;
  /** Any valid CSS color. */
  color: string;
  /** Optional image URL; omitted icons leave a text-only section. */
  icon?: string;
  /** Controlled by the parent; clicking does not toggle it internally. */
  selected?: boolean;
}

/** Sections render clockwise in Object.entries order, starting at the top. */
export type SectionWheelSections<Id extends string = string> = Record<
  Id,
  SectionWheelSection
>;

export interface SectionWheelProps<Id extends string = string> {
  sections: SectionWheelSections<Id>;
  callback: (sectionId: Id) => void;
  readOnly?: boolean;
  /** SVG units, not CSS pixels. Finite and >= 0. Default: 126. */
  innerRadius?: number;
  /** SVG units. Finite and > innerRadius. Default: 252. */
  outerRadius?: number;
  /** Outward translation in SVG units on hover/focus. Finite and >= 0. Default: 12.6. */
  hoverOffset?: number;
  /** Accessible name of the wheel. Default: "Section wheel". */
  ariaLabel?: string;
}
