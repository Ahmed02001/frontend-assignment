import { useDispatch } from "react-redux";
import { setQuantity } from "@/redux/cartSlice";

/**
 * Returns a stable handler for dispatching quantity changes on stepper
 * items (cameras/sensors/accessories) — used by ReviewSection's
 * onQuantityChange prop.
 *
 * This exists specifically because of a recurring bug class in this
 * codebase: setQuantity's reducer keys entries by `productId` + `colorId`
 * (via buildVariantKey), and stored cart items carry that color as
 * `item.color` — NOT `item.id` and NOT `item.colorId`. Passing either of
 * those wrong field names makes `colorId` resolve to undefined, silently
 * writing to the wrong cart key instead of the clicked item's own entry
 * (shows up as a "duplicate" row or an item that won't update). Centralizing
 * the payload shape here means every call site gets it right by construction
 * instead of each component having to remember the correct field names.
 *
 * Usage:
 *   const handleQuantityChange = useQuantityChange();
 *   <ReviewSection onQuantityChange={handleQuantityChange} ... />
 */
export function useQuantityChange() {
  const dispatch = useDispatch();

  return (item, quantity) => {
    dispatch(
      setQuantity({
        productId: item.productId ?? item.id,
        colorId: item.color,
        quantity,
        defaults: item,
      }),
    );
  };
}
