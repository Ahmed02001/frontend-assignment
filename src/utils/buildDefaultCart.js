import productsData from "@/data/products.json";
import { buildVariantKey } from "@/utils/Cartkey";
import { CATEGORIES } from "@/utils/Constants";

// Any catalog entry (camera/sensor/accessory/plan) with defaultQuantity > 0
// gets seeded into the cart on first-ever load — this is what makes the
// review panel show up pre-populated instead of empty, per the take-home
// spec ("Seed the initial state so the app loads looking exactly like the
// design"). Entries with defaultQuantity 0 or missing are skipped entirely.
export default function buildDefaultCart() {
  const cart = {};

  [CATEGORIES.CAMERAS, CATEGORIES.SENSORS, CATEGORIES.ACCESSORIES].forEach(
    (category) => {
      (productsData[category] ?? []).forEach((product) => {
        if (!product.defaultQuantity) return;

        const color = product.defaultColor ?? product.colors?.[0]?.id ?? null;
        const colorObj = product.colors?.find((c) => c.id === color);
        const key = buildVariantKey(product.id, color);

        cart[key] = {
          productId: product.id,
          category,
          name: colorObj ? `${product.name} (${colorObj.label})` : product.name,
          image: colorObj?.image ?? product.mainImage ?? null,
          color,
          quantity: product.defaultQuantity,
          price: product.salePrice,
          originalPrice: product.originalPrice,
          minQuantity: product.minQuantity ?? 0,
          maxQuantity: product.maxQuantity ?? 10,
        };
      });
    },
  );

  (productsData.plans ?? []).forEach((plan) => {
    if (!plan.defaultQuantity) return;
    // Spread the whole plan object so originalPrice/features/image/badge
    // all survive, then normalize the two fields the cart's naming
    // convention needs (same pattern as useSelectPlan).
    cart[plan.id] = {
      ...plan,
      productId: plan.id,
      category: CATEGORIES.PLANS,
      price: plan.salePrice,
      billingPeriod: "mo",
      selected: true,
    };
  });

  return cart;
}
