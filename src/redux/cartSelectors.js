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

// "N selected" counts DISTINCT PRODUCTS, not distinct variants — Red x2 and
// Blue x3 of the same camera still count as 1 selected product, not 2,
// since each variant entry carries the same productId.
export const makeSelectCountByCategory = (category) =>
  createSelector([makeSelectItemsByCategory(category)], (items) => {
    const distinctProductIds = new Set(items.map((item) => item.productId));
    return distinctProductIds.size;
  });

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

// One VARIANT's own entry (product + color combo) — used inside a single
// ProductCard, keyed by whichever color is currently active on that card.
export const makeSelectVariant = (productId, colorId) =>
  createSelector([selectCart], (cart) => {
    const key = colorId ? `${productId}::${colorId}` : productId;
    return cart[key];
  });
