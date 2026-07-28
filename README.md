# Wyze Security System Builder

An interactive, multi-step product builder for assembling a personalized Wyze home security bundle. Users pick cameras, sensors, accessories, and a subscription plan, then review their configured system and check out — all with a persisted cart that survives refreshes and return visits.

Built with **React 19**, **Vite**, **Redux Toolkit**, **redux-persist**, and **Tailwind CSS v4**.

## Features

- **Guided builder flow** — an accordion of steps (Cameras → Sensors → Accessories → Plans) that walks the user through building a complete system.
- **Per-variant cart** — each product color/variant is tracked independently in Redux, so White and Grey of the same camera keep separate quantities.
- **Color-aware product cards** — selecting a color swaps the displayed variant image, name, and stepper without dispatching to the store (purely local UI state).
- **Single-select plans** — choosing a plan deselects any previously selected plan in the same group, preventing two plans from being active at once.
- **Live review panel** — a running summary of the configured system with per-line quantity steppers, original/sale pricing, savings, and a total.
- **Persistent cart** — the cart is persisted to `localStorage` via `redux-persist`, so a returning visitor's saved system is restored on load. New visitors get a sensible default cart seeded from `products.json`.
- **Free-product detection** — zero-priced products render as "Free" in both the card and the review panel.
- **Accessible interactions** — cards are keyboard-activatable (Enter/Space) while nested controls (stepper, color swatches, Learn More link) preserve their native behavior.

## Tech Stack

| Concern      | Library                               |
| ------------ | ------------------------------------- |
| UI framework | React 19                              |
| Build tool   | Vite 8                                |
| State        | Redux Toolkit + react-redux           |
| Persistence  | redux-persist (localStorage)          |
| Styling      | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons        | lucide-react                          |
| Linting      | ESLint + eslint-plugin-react-hooks    |

## Getting Started

### Prerequisites

- Node.js (a recent LTS version is recommended)
- npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

The app serves with Vite's HMR. Open the printed local URL in your browser.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

> Note: Vite and ESLint configs live under `config/` (not the project root), so the npm scripts pass `--config config/...` explicitly.

## Project Structure

```
.
├── config/
│   ├── eslint.config.js
│   └── vite.config.js          # path aliases (@/, @components, @hooks, ...)
├── public/
│   ├── fonts/
│   └── images/                 # cameras, sensors, accessories, plans
├── src/
│   ├── main.jsx                # Provider + PersistGate bootstrap
│   ├── globals.css             # Tailwind entry + global styles
│   ├── pages/
│   │   └── HomePage.jsx        # seeds cart, renders BuilderSteps + ReviewPanel
│   ├── components/
│   │   ├── BuilderSteps.jsx    # accordion of builder steps
│   │   ├── ProductCard/        # variant-aware product card
│   │   ├── ReviewPanel/        # review summary + checkout
│   │   ├── StepAccordion/      # collapsible step container
│   │   └── UI/                 # Badge, ColorSelector, NextButton, PlanCard, ...
│   ├── redux/
│   │   ├── store.js            # configureStore + redux-persist
│   │   ├── cartSlice.js        # setQuantity, selectPlan, toggleCardSelected, hydrate
│   │   └── cartSelectors.js    # memoized per-category + total selectors
│   ├── hooks/                  # useSeedCart, useSelectPlan, useVariant, ...
│   ├── data/
│   │   └── products.json       # catalog source of truth
│   ├── utils/                  # Cartkey, Constants, formatCurrency, buildDefaultCart
│   └── services/               # (reserved for future API integrations)
└── package.json
```

## How It Works

### Cart model

The cart slice is keyed **per variant**, not per product, using `buildVariantKey(productId, colorId)`:

```
"wyze-cam-v4::white" -> { productId, category, color, quantity, image, price, ... }
"wyze-cam-v4::grey"  -> { ... }   // independent quantity
```

Colorless products use the bare `productId` as the key. Quantities are clamped to each variant's `minQuantity`/`maxQuantity` on every dispatch.

### Seeding vs. persistence

On load, `PersistGate` restores any saved cart from `localStorage` before the app renders. `useSeedCart` then seeds a default cart from `products.json` **only if** the restored cart is empty — so first-time visitors see a pre-populated review panel, while returning visitors keep their saved system. A `seeded` ref guard prevents re-seeding if the user later empties their cart mid-session.

### Catalog shapes

The product card normalizes two historical catalog shapes into one set of values:

- Flat: `product.salePrice` / `product.originalPrice`
- Nested: `product.price.sale_price` / `product.price.original_price`

The same normalized values feed both the on-screen price display and the `defaults` dispatched to the store, so the card and review panel never drift out of sync.

### Image fallback chain

A single shared chain is used by the card render and the dispatched `defaults` (so the review panel shows the identical image):

```
active color image → product.image → product.mainImage
```

### Checkout

`ReviewPanel`'s checkout handler is async and gates the congratulatory "you're saving $X" message behind a successful checkout operation. The success UI stays hidden while a checkout is pending or if it fails. The actual submission endpoint is a clearly-marked placeholder ready to be wired to a real API or route navigation.

## Path Aliases

Configured in `config/vite.config.js`:

| Alias         | Resolves to      |
| ------------- | ---------------- |
| `@`           | `src`            |
| `@components` | `src/components` |
| `@hooks`      | `src/hooks`      |
| `@pages`      | `src/pages`      |
| `@data`       | `src/data`       |
| `@utils`      | `src/utils`      |
| `@services`   | `src/services`   |
| `@assets`     | `src/assets`     |
| `@lib`        | `src/lib`        |

## Notes

- The `@` alias covers all of `src`, so the more specific aliases are convenience shortcuts — both styles work.
- `redux-persist`'s storage engine is resolved defensively in `store.js` to work around Vite's occasional double-wrapping of the CJS `localStorage` adapter's default export.
- React Compiler is **not** enabled (kept off the template for dev/build performance). See the [React Compiler docs](https://react.dev/learn/react-compiler/installation) if you want to opt in.
