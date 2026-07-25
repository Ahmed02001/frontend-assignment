import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // { [id]: { id, category, quantity, color, image, price, originalPrice, selected } }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setQuantity: (state, action) => {
      const { id, quantity, defaults } = action.payload;
      const existing = state[id] ?? defaults;
      const min = existing.minQuantity ?? 0;
      const max = existing.maxQuantity ?? 10;
      const clamped = Math.min(max, Math.max(min, quantity));
      state[id] = { ...existing, quantity: clamped };
      // Immer (built into Redux Toolkit) lets us "mutate" state directly here —
      // it's actually producing an immutable update behind the scenes.
    },

    setColor: (state, action) => {
      const { id, color, image } = action.payload;
      if (!state[id]) return;
      state[id].color = color;
      // store the color-specific image too, so ReviewPanel (and anywhere
      // else) can show the exact selected variant without looking back at
      // the catalog to re-resolve it from the color id
      if (image !== undefined) {
        state[id].image = image;
      }
    },

    setPlan: (state, action) => {
      const { id, defaults } = action.payload;
      state[id] = { ...(state[id] ?? defaults), selected: true };
    },

    // Toggles the card's visual "selected" highlight border. Kept as its
    // own field (cardSelected) rather than reusing `selected` above, since
    // `selected` already means something different for plans.
    toggleCardSelected: (state, action) => {
      const { id, defaults } = action.payload;
      const existing = state[id] ?? defaults;
      state[id] = { ...existing, cardSelected: !existing.cardSelected };
    },

    // seed the whole cart at once from your catalog JSON on app load
    hydrate: (state, action) => {
      return action.payload;
    },
  },
});

export const { setQuantity, setColor, setPlan, toggleCardSelected, hydrate } =
  cartSlice.actions;
export default cartSlice.reducer;
