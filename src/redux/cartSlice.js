import { buildVariantKey } from "@/utils/Cartkey";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Keyed per VARIANT, not per product, so Red and Blue of the same
  // product are tracked with completely independent quantities:
  //   "wyze-cam-v4::white" -> { productId, category, color, quantity, image, price, originalPrice, cardSelected }
  //   "wyze-cam-v4::black" -> { productId, category, color, quantity, image, price, originalPrice, cardSelected }
  // Products with no color options just use the bare productId as the key.
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setQuantity: (state, action) => {
      const { productId, colorId, quantity, defaults } = action.payload;
      const key = buildVariantKey(productId, colorId);
      const existing = state[key] ?? defaults;
      const min = existing.minQuantity ?? 0;
      const max = existing.maxQuantity ?? 10;
      const clamped = Math.min(max, Math.max(min, quantity));
      state[key] = { ...existing, quantity: clamped };
      // Immer (built into Redux Toolkit) lets us "mutate" state directly here —
      // it's actually producing an immutable update behind the scenes.
    },

    // setColor was removed: switching color is now just "which variant tab
    // is currently showing" on the card — local useState in ProductCard,
    // not a Redux action. Each variant's own color/image/price already
    // live permanently on its own key (set once via defaults, above), so
    // there's nothing left to "change" on dispatch when a color is picked.

    // setPlan (single-plan, no-exclusivity version) is replaced by
    // selectPlan below. setPlan only ever set `selected: true` on the
    // clicked plan and never touched any other plan's key — so switching
    // plans just kept adding "selected" plans instead of replacing the
    // previous choice. That's exactly why two plans (e.g. "Cam Basic" and
    // "Cam Unlimited") could both show as selected at once.
    //
    // selectPlan takes the *whole* sibling group (`planIds`) so it can
    // deselect every plan except the one just picked — including plans
    // that were selected in a previous click, not just the current one.
    // Callers must pass every plan id in the group, not just the clicked
    // one, or the same bug comes back for whichever plan gets left out.
    //
    // For the plan being selected, `defaults` always wins over whatever
    // was previously stored (`{ ...(state[key] ?? {}), ...defaults }`,
    // defaults last). This matters because catalog data/field names have
    // changed over time (price/originalPrice/billingPeriod were added
    // after some plans were first selected) — without this, a plan
    // selected once under an older `defaults` shape would keep showing
    // stale or missing fields forever, since reusing the old stored
    // object would silently shadow any later fix to `defaults`.
    selectPlan: (state, action) => {
      const { id, planIds, defaults } = action.payload;
      planIds.forEach((planId) => {
        const key = buildVariantKey(planId, null);
        if (planId === id) {
          state[key] = { ...(state[key] ?? {}), ...defaults, selected: true };
          return;
        }
        const existing = state[key];
        if (existing) {
          state[key] = { ...existing, selected: false };
        }
      });
    },

    // Toggles the card's visual "selected" highlight border. Kept as its
    // own field (cardSelected) rather than reusing `selected` above, since
    // `selected` already means something different for plans.
    toggleCardSelected: (state, action) => {
      const { productId, colorId, defaults } = action.payload;
      const key = buildVariantKey(productId, colorId);
      const existing = state[key] ?? defaults;
      state[key] = { ...existing, cardSelected: !existing.cardSelected };
    },

    // seed the whole cart at once from your catalog JSON on app load
    hydrate: (state, action) => {
      return action.payload;
    },
  },
});

export const { setQuantity, selectPlan, toggleCardSelected, hydrate } =
  cartSlice.actions;
export default cartSlice.reducer;
