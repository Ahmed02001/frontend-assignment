import React, { useEffect } from "react";

import BuilderSteps from "@/components/BuilderSteps.jsx";
import ReviewPanel from "@/components/ReviewPanel/Reviewpanel.jsx";
import productsData from "@/data/products.json";
import { useDispatch, useSelector } from "react-redux";
import { hydrate } from "@/redux/cartSlice";
import { buildVariantKey } from "@/utils/Cartkey";
import { CATEGORIES } from "@/utils/Constants";

// Builds the initial cart entries using the SAME key/field shape the rest
// of the app expects: keys via buildVariantKey(productId, colorId) — not
// the bare product.id — and a `productId` field on each entry — not `id`.
// Previously this seeded `cart[product.id] = { id: product.id, ... }`,
// which mismatched what cartSlice/cartSelectors/ProductCard all read
// (`productId`, keyed by `productId::color`). That meant the very first
// render, before any user interaction, already had entries in a shape
// nothing else in the app was looking for.
function buildInitialCart(productsData) {
  const cart = {};

  const addCategory = (items, category) => {
    items.forEach((product) => {
      const colorId = product.defaultColor ?? null;
      const key = buildVariantKey(product.id, colorId);

      cart[key] = {
        productId: product.id,
        category,
        name: product.name,
        image: product.mainImage ?? null,
        quantity: product.defaultQuantity ?? 0,
        minQuantity: product.minQuantity ?? 0,
        maxQuantity: product.maxQuantity ?? 10,
        color: colorId,
        price: product.salePrice ?? product.originalPrice ?? 0,
        originalPrice: product.originalPrice ?? null,
        required: product.required ?? false,
        billingPeriod: product.billingPeriod ?? null,
      };
    });
  };

  addCategory(productsData.cameras, CATEGORIES.CAMERAS);
  addCategory(productsData.sensors, CATEGORIES.SENSORS);
  addCategory(productsData.accessories, CATEGORIES.ACCESSORIES);
  addCategory(productsData.plans, CATEGORIES.PLANS);
  addCategory(productsData.extras, CATEGORIES.EXTRAS);

  return cart;
}

function HomePage() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const cartIsEmpty = Object.keys(cart).length === 0;
    if (cartIsEmpty) {
      dispatch(hydrate(buildInitialCart(productsData)));
    }
  }, [dispatch, cart]);

  return (
    <div className="flex flex-col xl:flex-row lg:gap-6 items-stretch lg:items-start justify-center lg:p-6">
      <BuilderSteps />
      <ReviewPanel />
    </div>
  );
}
export default HomePage;
