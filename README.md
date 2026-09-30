# Section Wheel

A controlled React component that renders an object of equal-sized sections as an interactive SVG wheel. The parent owns selection. Geometry, hover distance, icons, labels, and colors are configurable. See [CONTRACT.md](./CONTRACT.md) for the full prop contract.

## Layout

```text
src/                    Reusable component, geometry, types, and scoped CSS
preview/                Separate demo app, controls, sample data, and icons
  public/icons/         Demo assets; not included in the component library
tests/                 React interaction, geometry, and preview tests
```

The preview imports `../src`. The component never imports preview code, energy-category constants, or a form context. No runtime CDN or source-rewriting scripts are required.

## Run locally

Use Node.js 22+ and pnpm.

```sh
pnpm install
pnpm dev
```

Open http://127.0.0.1:5173. The preview supports 0–24 sections through its controls; this demo limit is not a component limit.

## Verify and build

```sh
pnpm check          # Formatting, types, tests, library and preview builds
pnpm build          # Library JS, CSS and declarations in dist/
pnpm build:preview  # Standalone static preview in preview-dist/
```

The library externalizes React and excludes preview assets. The preview bundles its own React runtime. Both builds use [Vite](https://vite.dev/guide/build.html#library-mode). Dependency versions are recorded in `pnpm-lock.yaml`.

## Use the component

```tsx
import { SectionWheel } from "section-wheel";
import "section-wheel/styles.css";

const sections = {
  planning: { label: "Planning", color: "#6EC2D8", selected: true },
  delivery: { label: "Delivery", color: "#B7D771" },
};

<SectionWheel
  sections={sections}
  callback={(id) => console.log(id)}
  innerRadius={126}
  outerRadius={252}
  hoverOffset={12.6}
/>;
```

For local source integration, import from `src/index.ts`; its stylesheet is included automatically. This is a private package and has not been published.

## Cleanup from the original extraction

The incomplete EnergyWheel/context wrapper, its loading skeleton, old category types, usage excerpt, and extraction manifest were removed. Energy icons are now demo-only assets. The generic prop API is unchanged. A full pre-cleanup backup was saved outside this project before replacement.
