import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrate } from "@/redux/cartSlice";
import buildDefaultCart from "@/utils/buildDefaultCart";

/**
 * Seeds the cart from products.json's defaultQuantity fields — but only if
 * the (already-rehydrated-from-localStorage, per PersistGate) cart is
 * genuinely empty. This is what makes a brand-new visitor see the review
 * panel pre-populated per the design, while a returning visitor's saved
 * "Save my system for later" state is never overwritten.
 *
 * `seeded` guards against re-seeding if the person later empties their
 * cart back down to zero items during the session — without it, every
 * cart-becomes-empty moment would silently refill it, which is not what
 * "seed the *initial* state" means.
 *
 * Call this once, near the top of the app (e.g. HomePage.jsx).
 */
export function useSeedCart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    if (Object.keys(cart).length === 0) {
      dispatch(hydrate(buildDefaultCart()));
    }
  }, [cart, dispatch]);
}
