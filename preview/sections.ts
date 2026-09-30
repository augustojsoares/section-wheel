import type { SectionWheelSections } from "../src";

// Sample data belongs to this demo, not to the generic component.
const examples = [
  ["Chemical", "#B7D771"],
  ["Temperature", "#F38787"],
  ["Gravity", "#3FD1AD"],
  ["Motion", "#ECDE65"],
  ["Mechanical", "#E477A4"],
  ["Electrical", "#EAB94C"],
  ["Pressure", "#7FA6D9"],
  ["Sound", "#86D360"],
  ["Radiation", "#E89746"],
  ["Biological", "#6EC2D8"],
] as const;

export function createSections(
  count: number,
  selectedIds: ReadonlySet<string>,
): SectionWheelSections {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const [label, color] = examples[index % examples.length];
      const id = `section-${index + 1}`;
      return [
        id,
        {
          label:
            index < examples.length
              ? label.toUpperCase()
              : `SECTION ${index + 1}`,
          color,
          icon: `${import.meta.env.BASE_URL}icons/${label.toLowerCase()}.svg`,
          selected: selectedIds.has(id),
        },
      ];
    }),
  );
}
