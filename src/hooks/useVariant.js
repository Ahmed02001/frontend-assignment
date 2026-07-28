import { useMemo } from "react";
import { useSelector } from "react-redux";
import { makeSelectVariant } from "@/redux/cartSelectors";

/**
 * Returns the cart entry for one specific product+color variant, e.g. the
 * "wyze-cam-v4::black" entry. Used by ProductCard to read whichever color
 * tab is currently active.
 *
 * Same memoization footgun as useCartCategory — makeSelectVariant(id, color)
 * must be memoized per (productId, colorId) pair, not recreated every
 * render, or the component re-renders on every unrelated cart change.
 *
 * Usage:
 *   const item = useVariant(product.id, activeColor);
 */
export function useVariant(productId, colorId) {
  const selectVariant = useMemo(
    () => makeSelectVariant(productId, colorId),
    [productId, colorId],
  );
  return useSelector(selectVariant);
}
