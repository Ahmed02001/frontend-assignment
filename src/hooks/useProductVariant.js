import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setQuantity, toggleCardSelected } from "@/redux/cartSlice";
import { useVariant } from "./useVariant";

/**
 * Everything ProductCard needs to manage one product's cart state: which
 * color variant is active, that variant's stepper quantity, the
 * increment/decrement/card-click handlers, and normalized price display
 * values. Pulling this out of ProductCard means this exact logic — and the
 * defaults/productId/colorId payload shape it depends on — lives in one
 * place instead of being re-derived (and potentially re-broken) in every
 * component that needs to add a product to the cart.
 *
 * `defaults` is rebuilt on every render from the product prop, matching the
 * original ProductCard behavior: it's what the reducer falls back to the
 * first time this specific variant is dispatched, and it always reflects
 * the *latest* catalog data (name, price, image) rather than a stale
 * snapshot from whenever the card first mounted.
 *
 * Usage (inside ProductCard):
 *   const {
 *     activeColor, setActiveColor, quantity, isCardSelected,
 *     increment, decrement, handleCardClick,
 *     displayName, currentImage, currentSalePrice, origPrice,
 *     hasDiscount, isFree, minQty, maxQty,
 *   } = useProductVariant(product, category);
 */
export function useProductVariant(product, category) {
  const dispatch = useDispatch();

  // Which color TAB is currently showing on this card. Local, session-only
  // UI state — selecting a color just changes which variant's stepper is
  // currently displayed, it doesn't need to survive a refresh.
  const [activeColor, setActiveColor] = useState(
    product.defaultColor ?? product.colors?.[0]?.id ?? "",
  );

  const item = useVariant(product.id, activeColor);

  const minQty = product.minQuantity ?? 0;
  const maxQty = product.maxQuantity ?? 99;

  // Read from the store for THIS SPECIFIC variant only — switching color
  // shows a different variant's own quantity, never mixing counts between
  // colors (e.g. 2 White ≠ Black's count, which stays 0 until added to).
  const quantity = item?.quantity ?? 0;
  const isCardSelected = quantity > minQty;

  const activeColorObj = product.colors?.find((c) => c.id === activeColor);
  const displayName = product.name ?? product.product_name;
  const currentImage = activeColorObj?.image || product.image;

  // Normalize price data ONCE here — handles both the flat-field catalog
  // shape (product.salePrice/originalPrice) and the older nested shape
  // (product.price.sale_price/original_price). Both `defaults` (used when
  // dispatching to the store) and the on-screen price display reuse these
  // same two values, so there's exactly one place computing the fallback
  // chain instead of copies that could drift out of sync.
  const currentSalePrice = product.salePrice ?? product.price?.sale_price ?? 0;
  const origPrice =
    product.originalPrice ?? product.price?.original_price ?? null;
  const hasDiscount = origPrice != null && origPrice > currentSalePrice;
  const isFree = product.salePrice === 0.0;

  // Everything the reducer needs the first time this variant is dispatched.
  // `name` includes the color label (e.g. "Wyze Cam v4 (Grey)") whenever
  // this product has color options, so ReviewPanel can tell apart multiple
  // variant lines of the same product instead of showing identical rows.
  const defaults = useMemo(
    () => ({
      productId: product.id,
      category,
      name: activeColorObj
        ? `${displayName} (${activeColorObj.label})`
        : displayName,
      image:
        activeColorObj?.image ?? product.mainImage ?? product.image ?? null,
      price: currentSalePrice,
      originalPrice: origPrice,
      minQuantity: minQty,
      maxQuantity: maxQty,
      color: activeColor,
    }),
    [
      product.id,
      category,
      activeColorObj,
      displayName,
      product.mainImage,
      product.image,
      currentSalePrice,
      origPrice,
      minQty,
      maxQty,
      activeColor,
    ],
  );

  const decrement = (e) => {
    e?.stopPropagation();
    dispatch(
      setQuantity({
        productId: product.id,
        colorId: activeColor,
        quantity: quantity - 1,
        defaults,
      }),
    );
  };

  const increment = (e) => {
    e?.stopPropagation();
    dispatch(
      setQuantity({
        productId: product.id,
        colorId: activeColor,
        quantity: quantity + 1,
        defaults,
      }),
    );
  };

  // Clicking the card body itself toggles: 1st click adds 1, 2nd click
  // removes 1 — alternating each time the card (not the stepper buttons,
  // color swatches, or Learn More link) is clicked.
  const handleCardClick = () => {
    dispatch(
      setQuantity({
        productId: product.id,
        colorId: activeColor,
        quantity: isCardSelected ? quantity - 1 : quantity + 1,
        defaults,
      }),
    );
    dispatch(
      toggleCardSelected({
        productId: product.id,
        colorId: activeColor,
        defaults,
      }),
    );
  };

  return {
    activeColor,
    setActiveColor,
    activeColorObj,
    quantity,
    isCardSelected,
    minQty,
    maxQty,
    displayName,
    currentImage,
    currentSalePrice,
    origPrice,
    hasDiscount,
    isFree,
    increment,
    decrement,
    handleCardClick,
  };
}
