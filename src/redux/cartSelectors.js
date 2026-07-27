import { createSelector } from "@reduxjs/toolkit";

// Base selector — the raw cart slice
const selectCart = (state) => state.cart;

// An item "counts" if it has a positive quantity (stepper-based items:
// cameras, sensors, accessories) OR it's a single-pick selected item with
// no quantity concept at all (plans). Falls back quantity to 1 for the
// latter so totals/price math downstream doesn't need to special-case it.
function isActiveItem(item) {
  // Plans are select-one, never a stepper item — decide purely on
  // `selected`, and ignore `quantity` even if it's present (e.g. because
  // the plan's catalog object happens to share a shape with
  // cameras/accessories and carries a leftover default like `quantity: 1`).
  // Without this branch, deselecting a plan (selected -> false) wouldn't
  // remove it from Review if quantity was ever truthy — it would look
  // "stuck" selected no matter what you picked afterward.
  if (item.category === "plans") return item.selected === true;
  return item.quantity > 0 || item.selected === true;
}
function effectiveQuantity(item) {
  if (item.category === "plans") return item.selected ? 1 : 0;
  return item.quantity ?? (item.selected ? 1 : 0);
}

// Shallow array-of-items equality: same length, same item refs, in order.
// Cart items are always *replaced* (never mutated) on update, so reference
// equality per-slot is sufficient — we don't need a deep compare.
function shallowArrayEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Factory: returns a memoized selector for "all selected items in a category".
//
// IMPORTANT (factory selector usage): this creates a NEW selector instance
// each time it's called. Do not call it inline inside useSelector — that
// throws away memoization on every render:
//   ❌ useSelector(makeSelectItemsByCategory("cameras"))
//   ✅ const selectCameras = useMemo(() => makeSelectItemsByCategory("cameras"), []);
//      useSelector(selectCameras)
//
// Also uses a resultEqualityCheck: Object.values(cart).filter(...) builds a
// brand-new array every time `cart` changes, even if nothing in THIS
// category changed. Without the equality check, every category selector
// (and every component consuming it) would recompute/re-render on any cart
// mutation, not just ones affecting its category.
export const makeSelectItemsByCategory = (category) =>
  createSelector(
    [selectCart],
    (cart) =>
      Object.values(cart).filter(
        (item) => item.category === category && isActiveItem(item),
      ),
    { memoizeOptions: { resultEqualityCheck: shallowArrayEqual } },
  );

// "N selected" counts DISTINCT PRODUCTS, not distinct variants — Red x2 and
// Blue x3 of the same camera still count as 1 selected product, not 2,
// since each variant entry carries the same productId.
// Returns a primitive number, so no equality-check trick needed here —
// value equality is automatic.
export const makeSelectCountByCategory = (category) =>
  createSelector([makeSelectItemsByCategory(category)], (items) => {
    const distinctProductIds = new Set(items.map((item) => item.productId));
    return distinctProductIds.size;
  });

export const selectCartTotal = createSelector([selectCart], (cart) =>
  Object.values(cart).reduce(
    (sum, item) => sum + (item.price ?? 0) * effectiveQuantity(item),
    0,
  ),
);

export const selectOriginalTotal = createSelector([selectCart], (cart) =>
  Object.values(cart).reduce(
    (sum, item) =>
      sum + (item.originalPrice ?? item.price ?? 0) * effectiveQuantity(item),
    0,
  ),
);

// One VARIANT's own entry (product + color combo) — used inside a single
// ProductCard, keyed by whichever color is currently active on that card.
// NOTE: assumes productId never contains the "::" substring; if that's not
// guaranteed elsewhere in the codebase, prefer an array/tuple key or a
// character that can't appear in an id (e.g. a control character or a
// dedicated separator constant shared with wherever `cart` keys are written).
export const makeSelectVariant = (productId, colorId) =>
  createSelector([selectCart], (cart) => {
    const key = colorId ? `${productId}::${colorId}` : productId;
    return cart[key];
  });

// Whether a given plan is the currently selected one — mirrors the
// `cart[plan.id]?.selected` check PlanCard/BuilderSteps do inline, so
// components can pull it from the store instead of repeating that logic.
export const makeSelectPlan = (planId) =>
  createSelector([selectCart], (cart) => Boolean(cart[planId]?.selected));

// Returns the single currently-selected plan's cart entry (or undefined if
// none selected yet). Plans are mutually exclusive, so there's at most one.
// `find` returns the actual stored item reference (not a derived copy), so
// this is already stable across recomputes when the selected plan is
// unchanged — no extra equality check needed.
export const selectSelectedPlan = createSelector([selectCart], (cart) =>
  Object.values(cart).find(
    (item) => item.category === "plans" && item.selected === true,
  ),
);
