import { createSelector } from "@reduxjs/toolkit";

// Base selector — the raw cart slice
const selectCart = (state) => state.cart;

// Factory: returns a memoized selector for "all selected items in a category"
// Memoized with createSelector so it only recomputes when `cart` actually
// changes, and components using it only re-render when the RETURNED ARRAY
// is a new reference (i.e. something in that category actually changed).
export const makeSelectItemsByCategory = (category) =>
  createSelector([selectCart], (cart) =>
    Object.values(cart).filter(
      (item) => item.category === category && item.quantity > 0,
    ),
  );

export const makeSelectCountByCategory = (category) =>
  createSelector(
    [makeSelectItemsByCategory(category)],
    (items) => items.length,
  );

export const selectCartTotal = createSelector([selectCart], (cart) =>
  Object.values(cart).reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0,
  ),
);

export const selectOriginalTotal = createSelector([selectCart], (cart) =>
  Object.values(cart).reduce(
    (sum, item) =>
      sum + (item.originalPrice ?? item.price ?? 0) * (item.quantity ?? 0),
    0,
  ),
);

// One item's own entry — used inside a single ProductCard
export const makeSelectItem = (id) =>
  createSelector([selectCart], (cart) => cart[id]);
