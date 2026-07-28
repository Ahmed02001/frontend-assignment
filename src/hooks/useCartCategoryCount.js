import { useMemo } from "react";
import { useSelector } from "react-redux";
import { makeSelectCountByCategory } from "@/redux/cartSelectors";

/**
 * Returns the count of distinct products selected in a category (used for
 * the "N selected" summary next to each StepAccordion header in
 * BuilderSteps).
 *
 * Usage:
 *   const cameraCount = useCartCategoryCount("cameras");
 */
export function useCartCategoryCount(category) {
  const selectCount = useMemo(
    () => makeSelectCountByCategory(category),
    [category],
  );
  return useSelector(selectCount);
}
