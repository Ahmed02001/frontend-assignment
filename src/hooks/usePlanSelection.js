import { useMemo } from "react";
import { useSelector } from "react-redux";
import { makeSelectPlan } from "@/redux/cartSelectors";

/**
 * Whether a given plan is the currently selected one. Used by PlanCard.
 *
 * Usage:
 *   const isSelected = usePlanSelection(plan.id);
 */
export function usePlanSelection(planId) {
  const selectIsSelected = useMemo(() => makeSelectPlan(planId), [planId]);
  return useSelector(selectIsSelected);
}
