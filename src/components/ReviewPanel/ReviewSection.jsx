import { buildVariantKey } from "@/utils/Cartkey";
import { CATEGORIES } from "@/utils/Constants";
import { Minus, Plus } from "lucide-react";

/** +/- stepper. Greys out and disables when the item is required (fixed qty). */
function QuantityStepper({ quantity, required, onDecrement, onIncrement }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={required}
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={`flex h-5 w-5 items-center justify-center rounded p-1 transition-colors ${
          required
            ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
            : "bg-white text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        <Minus className="h-[8px] w-[9.6px] stroke-[2.5]" />
      </button>
      <span className="w-4 text-center text-sm font-semibold text-neutral-900">
        {quantity}
      </span>
      <button
        type="button"
        disabled={required}
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={`flex h-5 w-5 items-center justify-center rounded p-1 transition-colors ${
          required
            ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
            : "bg-white text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        <Plus className="h-2 w-2 stroke-[2.5]" />
      </button>
    </div>
  );
}

/**
 * Right-aligned price block: grey strikethrough original (optional) + bold
 * indigo current price. `quantity` falls back to 1 for items with no
 * quantity concept (e.g. a selected plan), instead of NaN-ing the math.
 */
function PriceBlock({ price, originalPrice, quantity, billingPeriod }) {
  // Use `||`, not `??` — `??` only replaces null/undefined, so a stray
  // `quantity: 0` (which is what plans end up with, since nothing ever sets
  // a real quantity on a plan's cart entry) would slip through unchanged and
  // silently price everything as "free" (price * 0 = 0). `||` treats 0, NaN,
  // null, and undefined all the same way: fall back to 1.
  const qty = quantity || 1;
  const lineOriginal = originalPrice != null ? originalPrice * qty : null;
  const lineCurrent = price * qty;
  const isFree = lineCurrent === 0;

  return (
    <div className="w-10.25 md:w-25.25 xl:w-10.25 flex flex-col md:flex-row xl:flex-col items-end md:items-center xl:items-end justify-center md:justify-end text-right font-['Gilroy-SemiBold'] font-normal text-[14px] leading-[16px] tracking-[0.005em]">
      {/* Original Price (Gray Strikethrough) */}
      {lineOriginal != null && lineOriginal > lineCurrent && (
        <div className="text-[#6C757D] line-through mb-0.5 md:mb-0 md:mr-1.5 xl:mb-0.5 xl:mr-0">
          ${lineOriginal.toFixed(2)}
          {billingPeriod ? `/${billingPeriod}` : ""}
        </div>
      )}

      {/* Current Price (Purple - Split Dollar Sign & Number) */}
      <div className="text-[#4E2FD2]">
        {isFree ? (
          <span className="font-bold">FREE</span>
        ) : (
          <>
            {/* Lighter/Thinner Dollar Sign */}
            <span className="font-['Gilroy-Regular'] font-normal mr-[1px]">
              $
            </span>

            {/* Bold Price Amount */}
            <span className="font-bold">{lineCurrent.toFixed(2)}</span>

            {/* Billing Period (if present) */}
            {billingPeriod && (
              <span className="font-normal text-[12px] ml-[1px]">
                /{billingPeriod}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Stable per-row key, matching the same scheme buildVariantKey uses in
// cartSlice.js. Cart items don't carry a generic `.id` field — they're
// identified by `productId` (+ optional `color`, per the shape comment in
// cartSlice.js's initialState — NOT `colorId`) — so keying rows by
// `item.id` (or `item.colorId`) produced the same key for every row of a
// given product, breaking React's ability to tell rows apart. Falls back
// to `item.id` only for the rare item shape that might legitimately have
// one and nothing else.
function itemKey(item) {
  if (item.productId) {
    return buildVariantKey(item.productId, item.color);
  }
  return item.id;
}

/**
 * Plan rows get a two-tone name — first word plain dark text, the rest
 * bold indigo (e.g. "Cam" / "Unlimited") — to match the plan-tile styling
 * elsewhere in the flow. Non-plan rows (cameras, sensors, accessories)
 * keep the plain single-color name; splitting "Wyze Cam Pan v3" the same
 * way wouldn't read right.
 */
function ItemName({ item }) {
  if (item.category !== CATEGORIES.PLANS) {
    return (
      <span className="block w-39 whitespace-normal wrap-break-word font-['Gilroy-Medium'] font-normal text-[14px] leading-[16px] tracking-[0.005em] text-gray-900">
        {item.name}
        {item.required && <span className="text-gray-500"> (Required)</span>}
      </span>
    );
  }

  const [firstWord, ...rest] = item.name.split(" ");
  const restText = rest.join(" ");

  return (
    <span className="block whitespace-normal wrap-break-word font-['Gilroy-SemiBold'] text-[16px] leading-[20px] tracking-[0.005em]">
      <span className="text-gray-900">{firstWord}</span>
      {restText && (
        <span className="text-[#4E2FD2] font-bold"> {restText}</span>
      )}
      {item.required && (
        <span className="text-gray-500 font-normal"> (Required)</span>
      )}
    </span>
  );
}

export default function ReviewSection({ title, items, onQuantityChange }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-4">
      {title?.trim().toLowerCase() !== "extras" && (
        <p className="mb-3 font-['Gilroy-Regular'] font-normal text-[12px] leading-4 tracking-[0.03em]  uppercase text-gray-400">
          {title}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={itemKey(item)}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10.25 w-10.25 object-contain rounded-[10px] bg-white"
                />
              }

              <ItemName item={item} />
            </div>

            <div className="flex  items-center gap-4">
              {Boolean(title?.trim()) &&
                !["PLANS", "EXTRAS"].includes(title.trim().toUpperCase()) && (
                  <QuantityStepper
                    quantity={item.quantity}
                    required={item.required}
                    onDecrement={() =>
                      onQuantityChange(
                        item,
                        Math.max(item.required ? 1 : 0, item.quantity - 1),
                      )
                    }
                    onIncrement={() =>
                      onQuantityChange(item, item.quantity + 1)
                    }
                  />
                )}
              <PriceBlock
                price={item.price}
                originalPrice={item.originalPrice}
                quantity={item.quantity}
                billingPeriod={
                  item.category === CATEGORIES.PLANS ? "mo" : item.billingPeriod
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
