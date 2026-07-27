import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Keyed per VARIANT, not per product, so Red and Blue of the same
  // product are tracked with completely independent quantities:
  //   "wyze-cam-v4::white" -> { productId, category, color, quantity, image, price, originalPrice, cardSelected }
  //   "wyze-cam-v4::black" -> { productId, category, color, quantity, image, price, originalPrice, cardSelected }
  // Products with no color options just use the bare productId as the key.
};

// Builds the cart key for a given product + color combo.
function buildVariantKey(productId, colorId) {
  return colorId ? `${productId}::${colorId}` : productId;
}

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

    setPlan: (state, action) => {
      const { productId, defaults } = action.payload;
      const key = buildVariantKey(productId, null);
      state[key] = { ...(state[key] ?? defaults), selected: true };
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

export const { setQuantity, setPlan, toggleCardSelected, hydrate } =
  cartSlice.actions;
export default cartSlice.reducer;
