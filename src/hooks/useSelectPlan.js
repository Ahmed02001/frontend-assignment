import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { selectPlan } from "@/redux/cartSlice";

/**
 * Returns a handler for selecting a plan, given the full list of plans in
 * the group. Used wherever PlanCards are rendered (e.g. BuilderSteps).
 *
 * selectPlan's reducer needs the *entire* sibling group (planIds) to
 * correctly deselect whichever plan was previously chosen — PlanCard itself
 * only reports which id was clicked, it doesn't know about its siblings, so
 * that has to be assembled by the caller. Centralizing it here means every
 * call site passes a complete planIds list by construction, instead of
 * risking a partial list that leaves a stale plan stuck as "selected"
 * forever (a bug this codebase has hit more than once).
 *
 * `defaults` is built by spreading the whole plan object (`...plan`) so
 * every field on the catalog entry (originalPrice, features, image, badge,
 * tagline...) survives into the cart entry, then normalizing the two fields
 * that don't match the cart's naming convention: `salePrice` -> `price`,
 * and adding `billingPeriod: "mo"` so ReviewSection can render it.
 *
 * Usage:
 *   const handleSelectPlan = useSelectPlan(productsData.plans);
 *   <PlanCard plan={plan} onSelect={handleSelectPlan} />
 */
export function useSelectPlan(plans) {
  const dispatch = useDispatch();
  const planIds = useMemo(() => plans.map((plan) => plan.id), [plans]);

  return (id) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    const defaults = { ...plan, price: plan.salePrice, billingPeriod: "mo" };
    dispatch(selectPlan({ id, planIds, defaults }));
  };
}
