import { Minus, Plus, Truck, ShieldCheck } from "lucide-react";

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
        <Plus className="h-[8px] w-[8px] stroke-[2.5]" />
      </button>
    </div>
  );
}

// export default QuantityStepper;
/** Right-aligned price block: grey strikethrough original (optional) + bold indigo current price. */
function PriceBlock({ price, originalPrice, quantity, billingPeriod }) {
  const lineOriginal = originalPrice != null ? originalPrice * quantity : null;
  const lineCurrent = price * quantity;
  const isFree = lineCurrent === 0;

  return (
    <div className="w-[41px] md:w-[101px] xl:w-[41px] flex flex-col md:flex-row xl:flex-col items-end md:items-center xl:items-end justify-center md:justify-end text-right font-['Gilroy-SemiBold'] font-normal text-[14px] leading-[16px] tracking-[0.005em]">
      {/* Original Price (Gray Strikethrough) */}
      {lineOriginal != null && lineOriginal > lineCurrent && (
        <div className="text-[#6C757D] line-through mb-[2px] md:mb-0 md:mr-1.5 xl:mb-[2px] xl:mr-0">
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
            key={item.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[41px] w-[41px]  rounded-[5px] bg-white object-contain"
                />
              )}

              <span className="block w-[156px] whitespace-normal break-words font-['Gilroy-Medium'] font-normal text-[14px] leading-[16px] tracking-[0.005em] text-gray-900">
                {item.name}
                {item.required && (
                  <span className="text-gray-500"> (Required)</span>
                )}
              </span>
            </div>

            <div className="flex  items-center gap-4">
              {Boolean(title?.trim()) &&
                !["PLAN", "EXTRAS"].includes(title.trim().toUpperCase()) && (
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
                billingPeriod={item.billingPeriod}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
