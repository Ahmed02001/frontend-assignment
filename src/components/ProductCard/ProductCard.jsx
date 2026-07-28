import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { makeSelectVariant } from "@/redux/cartSelectors";
import { setQuantity, toggleCardSelected } from "@/redux/cartSlice";
import ColorSelector from "../UI/ColorSelector";
import Badge from "../UI/Badge";

export default function ProductCard({ product, category }) {
  const dispatch = useDispatch();

  // Which color TAB is currently showing on this card. Local, session-only
  // UI state — per spec, selecting a color just changes which variant's
  // stepper is currently displayed, it doesn't need to survive a refresh.
  const [activeColor, setActiveColor] = useState(
    product.defaultColor ?? product.colors?.[0]?.id ?? "",
  );

  // Stable selector instance per product+color combo (a fresh selector
  // every render would break memoization)
  const selectVariant = useMemo(
    () => makeSelectVariant(product.id, activeColor),
    [product.id, activeColor],
  );
  const item = useSelector(selectVariant);

  const minQty = product.minQuantity ?? 0;
  const maxQty = product.maxQuantity ?? 99;

  // Read from the store for THIS SPECIFIC variant only — switching color
  // shows a different variant's own quantity, never mixing counts between
  // colors (e.g. 2 White ≠ Black's count, which stays 0 until added to).
  const quantity = item?.quantity ?? 0;
  const isCardSelected = quantity > minQty;

  // Resolve current active image/name based on selected color, falling
  // back to the generic product image/name for colorless products.
  const activeColorObj = product.colors?.find((c) => c.id === activeColor);
  const displayName = product.name ?? product.product_name;
  const currentImage = activeColorObj?.image || product.image;

  // Normalize price data ONCE here — handles both the flat-field catalog
  // shape (product.salePrice/originalPrice) and the older nested shape
  // (product.price.sale_price/original_price). Both `defaults` (used when
  // dispatching to the store) and the on-screen price display below reuse
  // these same two values, so there's exactly one place computing the
  // fallback chain instead of two copies that could drift out of sync.
  const currentSalePrice = product.salePrice ?? product.price?.sale_price ?? 0;
  const origPrice =
    product.originalPrice ?? product.price?.original_price ?? null;
  const hasDiscount = origPrice != null && origPrice > currentSalePrice;
  const isFree = product.salePrice === 0.0;

  // Everything the reducer needs the first time this variant is dispatched.
  // `name` includes the color label (e.g. "Wyze Cam v4 (Grey)") whenever
  // this product has color options, so ReviewPanel can tell apart multiple
  // variant lines of the same product instead of showing identical rows.
  const defaults = {
    productId: product.id,
    category,
    name: activeColorObj
      ? `${displayName} (${activeColorObj.label})`
      : displayName,
    // Use THIS variant's own image if it has one, falling back to the
    // generic product image only for colorless products (e.g. Doorbell).
    image: activeColorObj?.image ?? product.mainImage ?? product.image ?? null,
    price: currentSalePrice,
    originalPrice: origPrice,
    minQuantity: minQty,
    maxQuantity: maxQty,
    color: activeColor,
  };

  // Clicking the card body itself toggles: 1st click adds 1, 2nd click
  // removes 1 — alternating each time the card (not the stepper buttons,
  // color swatches, or Learn More link) is clicked.
  const handleCardClick = () => {
    if (isCardSelected) {
      dispatch(
        setQuantity({
          productId: product.id,
          colorId: activeColor,
          quantity: quantity - 1,
          defaults,
        }),
      );
    } else {
      dispatch(
        setQuantity({
          productId: product.id,
          colorId: activeColor,
          quantity: quantity + 1,
          defaults,
        }),
      );
    }
    dispatch(
      toggleCardSelected({
        productId: product.id,
        colorId: activeColor,
        defaults,
      }),
    );
  };

  const decrement = (e) => {
    e.stopPropagation();
    dispatch(
      setQuantity({
        productId: product.id,
        colorId: activeColor,
        quantity: quantity - 1,
        defaults,
      }),
    );
  };

  const increment = (e) => {
    e.stopPropagation();
    dispatch(
      setQuantity({
        productId: product.id,
        colorId: activeColor,
        quantity: quantity + 1,
        defaults,
      }),
    );
  };

  // Switching color is purely local — it does NOT dispatch to the store.
  // It just changes which variant's data this card is currently showing.
  const handleSelectColor = (colorId) => {
    setActiveColor(colorId);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        // Mobile/tablet: fluid card capped at the spec's max width (224.6px),
        // height driven by content so it shrinks/grows with the viewport.
        // Large screens (xl:): switch back to the fixed-height horizontal layout.
        className="flex h-[331.1px] w-[224.6px] flex-col gap-4.75 bg-white cursor-pointer select-none transition-colors rounded-[10px] border-2 py-3.75 px-2.75  xl:w-full xl:max-w-none xl:h-42.75 xl:flex-row xl:gap-4.75 xl:p-2.75"
        style={{
          borderColor: isCardSelected ? "#4E2FD2B2" : "#E5E7EB",
        }}
      >
        {/* Image column: fluid width, aspect-ratio locked to the spec's 202.6:117.39 proportions on mobile/tablet, fixed 101x137 box on xl+ */}
        <div className="relative flex w-full aspect-[202.6/117.394] shrink-0 flex-col items-center justify-center rounded-[5px] overflow-hidden xl:w-25.25 xl:h-34.25 xl:aspect-auto">
          {/* Badge overlaid at top-left */}
          {product.badge && (
            <Badge top={0} left={0}>
              {product.badge}
            </Badge>
          )}

          {/* Product Main Image centered inside */}
          <img
            src={currentImage || product.mainImage}
            alt={displayName}
            className="w-full h-full object-contain transition-all duration-200"
          />
        </div>

        {/* Right: Details Section */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            {/* Title */}
            <h2 className="font-['Gilroy-SemiBold'] font-normal text-[16px] leading-none tracking-[0.6px] text-neutral-900 truncate align-middle mb-1.5">
              {displayName}
            </h2>

            {/* Tagline + Learn More — flow inline together on mobile/tablet,
                Learn More drops to its own line on xl+ */}
            <p className="font-['Gilroy-Medium'] max-h-12 font-normal text-[12px] leading-[130%] tracking-[0.6px] text-neutral-500 align-middle wrap-break-word whitespace-normal">
              {product.tagline}
              {(product.learnMoreUrl || product.learn_more_link) && (
                <>
                  {" "}
                  <a
                    href={
                      typeof product.learnMoreUrl === "string"
                        ? product.learnMoreUrl
                        : "#"
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="font-['Gilroy-Medium'] font-normal text-[12px] leading-[130%] tracking-[0.6px] text-indigo-600 underline decoration-1 underline-offset-1 hover:text-indigo-700 align-middle  xl:mt-1"
                  >
                    Learn More
                  </a>
                </>
              )}
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5 my-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ColorSelector
                colors={product.colors}
                selectedColor={activeColor}
                onSelectColor={handleSelectColor}
              />
            </div>
          )}

          {/* Quantity Controls + Pricing */}
          <div className="flex items-center justify-between w-full h-8.75 ">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2.5">
              {/* Decrement Button - Outlined Rounded Square */}
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= minQty}
                aria-label="Decrease quantity"
                className="flex h-5 w-5 items-center justify-center rounded-sm border border-neutral-200 bg-white text-neutral-400 transition-colors hover:bg-neutral-50 active:scale-95 disabled:opacity-40"
              >
                <Minus className="h-2 w-[9.6px] stroke-[2.5]" />
              </button>

              {/* Quantity Count */}
              <span className="w-4 text-center font-['Gilroy-Medium'] text-[16px] font-400 text-neutral-900">
                {quantity}
              </span>

              {/* Increment Button - Solid Light Gray Rounded Square */}
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= maxQty}
                aria-label="Increase quantity"
                className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#f1f5f9] text-neutral-700 transition-colors hover:bg-neutral-200 active:scale-95 disabled:opacity-40"
              >
                <Plus className="h-2 w-2 stroke-[2.5]" />
              </button>
            </div>

            {/* Pricing Section */}
            <div className="flex sm:flex-row xl:flex-col items-end justify-center text-right ">
              {/* Original Price (Strikethrough Red) */}
              {hasDiscount && (
                <div className="font-['Gilroy-Regular'] text-[16px] font-400 text-[#D9383A] line-through leading-none xl:mb-0.5 md:mr-1.25 xl:mr-0">
                  ${origPrice.toFixed(2)}
                </div>
              )}

              {/* Current Sale Price (Split Styling: Light $ + Bold Number) */}
              <div className="font-['Gilroy-Regular'] text-[16px] leading-none text-[#404040]">
                <span className="font-['Gilroy-Regular'] font-400 text-[16px]">
                  {isFree ? "" : "$"}
                </span>
                {isFree ? "Free" : currentSalePrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
