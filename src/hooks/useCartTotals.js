import { useSelector } from "react-redux";
import { selectCartTotal, selectOriginalTotal } from "@/redux/cartSelectors";

/**
 * Returns the cart's current total, original (pre-discount) total, and the
 * savings between them. Used in ReviewPanel's total/savings display.
 *
 * Usage:
 *   const { total, originalTotal, savings } = useCartTotals();
 */
export function useCartTotals() {
  const total = useSelector(selectCartTotal);
  const originalTotal = useSelector(selectOriginalTotal);
  return { total, originalTotal, savings: originalTotal - total };
}
