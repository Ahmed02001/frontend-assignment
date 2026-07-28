import { useMemo } from "react";
import { useSelector } from "react-redux";
import { makeSelectItemsByCategory } from "@/redux/cartSelectors";

/**
 * Returns all active cart items for a given category (cameras, sensors,
 * accessories, plans). Used in ReviewPanel for each ReviewSection.
 *
 * Wraps the classic factory-selector footgun: calling
 * makeSelectItemsByCategory(category) directly inside useSelector creates a
 * brand-new selector instance every render, throwing away memoization.
 *
 * Usage:
 *   const cameras = useCartCategory(CATEGORIES.CAMERAS);
 */
export function useCartCategory(category) {
  const selectItems = useMemo(
    () => makeSelectItemsByCategory(category),
    [category],
  );
  return useSelector(selectItems);
}
