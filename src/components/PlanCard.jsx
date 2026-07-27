import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Cloud,
  CloudOff,
  ScanFace,
  Infinity as InfinityIcon,
  Headset,
  Check,
} from "lucide-react";
// import { makeSelectPlan } from "../redux/cartSelectors"; // adjust path to your actual file

const iconMap = {
  cloud: <Cloud className="h-6 w-6" strokeWidth={1.75} />,
  "cloud-off": <CloudOff className="h-6 w-6" strokeWidth={1.75} />,
  "scan-face": <ScanFace className="h-6 w-6" strokeWidth={1.75} />,
  infinity: <InfinityIcon className="h-6 w-6" strokeWidth={1.75} />,
  headset: <Headset className="h-6 w-6" strokeWidth={1.75} />,
};

/**
 * Novu-pricing-style plan tile: icon "image" up top, big price, full-width
 * CTA pill, then a bullet feature list. The `featured` plan gets a subtle
 * gradient border + glow to stand out, same idea as Novu's highlighted "Pro"
 * card.
 *
 * `isSelected` now reads straight from Redux (via makeSelectPlan) instead of
 * being passed down as a prop — the parent no longer needs to compute it.
 * `onSelect` stays a prop: it's just "tell the parent which plan id was
 * clicked," and the parent still owns building `planIds`/`defaults` for the
 * dispatch.
 */
export default function PlanCard({ plan, onSelect }) {
  const selectPlanIsSelected = useMemo(
    () => makeSelectPlan(plan.id),
    [plan.id],
  );
  const isSelected = useSelector(selectPlanIsSelected);

  const isFree = plan.salePrice === 0;
  const hasDiscount =
    plan.originalPrice != null && plan.originalPrice > plan.salePrice;

  return (
    <div
      className={`relative rounded-2xl p-[2px] transition-colors ${
        isSelected
          ? "bg-indigo-600"
          : plan.featured
            ? "bg-linear-to-b from-indigo-400 via-indigo-200 to-transparent"
            : "bg-neutral-200"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
          Most popular
        </span>
      )}

      <div
        className={`flex h-full flex-col gap-4 min-w-68 rounded-2xl bg-white p-5 ${
          isSelected || plan.featured ? "shadow-lg shadow-indigo-100" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              plan.featured
                ? "bg-indigo-600 text-white"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {
              <img
                src={plan.image}
                alt={plan.name}
                className="h-full w-full rounded-xl"
              />
            }
          </div>
          {plan.badge && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              {plan.badge}
            </span>
          )}
        </div>

        <div className="flex items-start gap-2.5">
          <span
            className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
              isSelected ? "border-indigo-600" : "border-neutral-300"
            }`}
            aria-hidden="true"
          >
            {isSelected && (
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
            )}
          </span>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{plan.tagline}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {hasDiscount && (
            <span className="text-[16px] text-[#D9383A] line-through">
              ${plan.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-[16px] tracking-tight text-neutral-900">
            {isFree ? "Free" : `$${plan.salePrice.toFixed(2)}`}/mo
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(plan.id)}
          className={`flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors ${
            isSelected
              ? "bg-indigo-600 text-white"
              : plan.featured
                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
          }`}
        >
          {isSelected && <Check className="h-4 w-4" />}
          {isSelected ? "Selected" : "Select plan"}
        </button>

        {plan.features?.length > 0 && (
          <ul className="mt-1 flex flex-col gap-2 border-t border-neutral-100 pt-4">
            {plan.features.map((feature, i) => {
              const isLeadIn =
                i === 0 && feature.toLowerCase().startsWith("everything in");
              return isLeadIn ? (
                <li
                  key={feature}
                  className="text-xs font-semibold text-neutral-400"
                >
                  {feature}
                </li>
              ) : (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  {feature}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
