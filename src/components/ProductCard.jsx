import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import ColorSelector from "./ColorSelector";
import { setQuantity, setColor, toggleCardSelected } from "../redux/cartSlice";
import { makeSelectItem } from "../redux/cartSelectors";

export default function ProductCard({ product, category }) {
  const dispatch = useDispatch();

  // Stable selector instance per product id (a fresh selector every render
  // would break memoization)
  const selectItem = useMemo(() => makeSelectItem(product.id), [product.id]);
  const item = useSelector(selectItem);

  // isCardSelected now lives in the Redux cart slice (persisted via
  // redux-persist), instead of local useState — so the highlighted border
  // survives a page refresh instead of resetting.
  const isCardSelected = (item?.quantity ?? 0) > (product.minQuantity ?? 0);

  const minQty = product.minQuantity ?? 0;
  const maxQty = product.maxQuantity ?? 99;

  // Read from the store; fall back to the product's own defaults if this
  // item hasn't been hydrated into the store yet
  const selectedColor =
    item?.color ?? product.defaultColor ?? product.colors?.[0]?.id ?? "";
  const quantity = item?.quantity ?? product.defaultQuantity ?? 1;

  // Everything the reducer needs the first time this product is dispatched
  const defaults = {
    id: product.id,
    category,
    name: product.name ?? product.product_name,
    image: product.mainImage ?? product.image ?? null,
    price: product.salePrice ?? product.price?.sale_price ?? 0,
    originalPrice:
      product.originalPrice ?? product.price?.original_price ?? null,
    minQuantity: minQty,
    maxQuantity: maxQty,
    color: selectedColor,
  };

  // Clicking the card body itself toggles: 1st click adds 1, 2nd click
  // removes 1 — alternating each time the card (not the stepper buttons,
  // color swatches, or Learn More link) is clicked.
  const handleCardClick = () => {
    if (isCardSelected) {
      dispatch(
        setQuantity({ id: product.id, quantity: quantity - 1, defaults }),
      );
    } else {
      dispatch(
        setQuantity({ id: product.id, quantity: quantity + 1, defaults }),
      );
    }
    dispatch(toggleCardSelected({ id: product.id, defaults }));
  };

  const decrement = (e) => {
    e.stopPropagation();
    dispatch(setQuantity({ id: product.id, quantity: quantity - 1, defaults }));
  };

  const increment = (e) => {
    e.stopPropagation();
    dispatch(setQuantity({ id: product.id, quantity: quantity + 1, defaults }));
  };

  const handleSelectColor = (colorId) => {
    const colorObj = product.colors?.find((c) => c.id === colorId);
    dispatch(
      setColor({ id: product.id, color: colorId, image: colorObj?.image }),
    );
  };

  // Resolve current active image based on selected color or product main image
  const activeColorObj = product.colors?.find((c) => c.id === selectedColor);
  const currentImage = activeColorObj?.image || product.image;

  // Normalize price data handling both direct properties & nested price objects
  const origPrice = product.originalPrice ?? product.price?.original_price;
  const currentSalePrice = product.salePrice ?? product.price?.sale_price ?? 0;

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
        className="flex h-[331.1px] w-[224.6px] flex-col gap-4.75 bg-white cursor-pointer select-none transition-colors rounded-[10px] border-[2px] py-[15px] px-[11px]  xl:w-full xl:max-w-none xl:h-42.75 xl:flex-row xl:gap-4.75 xl:p-2.75"
        style={{
          borderColor: isCardSelected ? "#4E2FD2B2" : "#E5E7EB",
        }}
      >
        {/* Image column: fluid width, aspect-ratio locked to the spec's 202.6:117.39 proportions on mobile/tablet, fixed 101x137 box on xl+ */}
        <div className="relative flex w-full aspect-[202.6/117.394] shrink-0 flex-col items-center justify-center rounded-[5px] overflow-hidden xl:w-25.25 xl:h-34.25 xl:aspect-auto">
          {/* Badge overlaid at top-left */}
          {product.badge && (
            <span
              className="
      absolute top-0 left-0 z-10 
      inline-flex items-center justify-center
      w-[65px] h-[19px] gap-2.5
      opacity-100 rounded-[10px]
      py-[2px] px-1.5
      bg-[#4E2FD2] text-white 
      font-['Gilroy-SemiBold'] font-normal text-[12px] leading-none
      box-border rotate-0
    "
            >
              {product.badge}
            </span>
          )}

          {/* Product Main Image centered inside */}
          <img
            src={currentImage || product.mainImage}
            alt={product.name || product.product_name}
            className="w-full h-full object-contain transition-all duration-200"
          />
        </div>

        {/* Right: Details Section */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            {/* Title */}
            <h2 className="font-['Gilroy-SemiBold'] font-normal text-[16px] leading-none tracking-[0.6px] text-neutral-900 truncate align-middle mb-[6px]">
              {product.product_name || product.name}
            </h2>

            {/* Tagline + Learn More — flow inline together on mobile/tablet,
                Learn More drops to its own line on xl+ */}
            <p className="font-['Gilroy-Medium'] font-normal text-[12px] leading-[130%] tracking-[0.6px] text-neutral-500 align-middle break-words whitespace-normal">
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
              className="flex flex-wrap gap-1.5 my-[10px]"
              onClick={(e) => e.stopPropagation()}
            >
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onSelectColor={handleSelectColor}
              />
            </div>
          )}

          {/* Quantity Controls + Pricing */}
          <div className="flex items-center justify-between w-full h-[35px] ">
            {/* Quantity Selector */}
            <div className="flex items-center gap-[10px]">
              {/* Decrement Button - Outlined Rounded Square */}
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= minQty}
                aria-label="Decrease quantity"
                className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-neutral-200 bg-white text-neutral-400 transition-colors hover:bg-neutral-50 active:scale-95 disabled:opacity-40"
              >
                <Minus className="h-[8px] w-[9.6px] stroke-[2.5]" />
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
                className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] bg-[#f1f5f9] text-neutral-700 transition-colors hover:bg-neutral-200 active:scale-95 disabled:opacity-40"
              >
                <Plus className="h-[8px] w-[8px] stroke-[2.5]" />
              </button>
            </div>

            {/* Pricing Section */}
            <div className="flex sm:flex-row xl:flex-col items-end justify-center text-right ">
              {/* Original Price (Strikethrough Red) */}
              {origPrice && (
                <div className="font-['Gilroy-Regular'] text-[16px] font-400 text-[#D9383A] line-through leading-none xl:mb-[2px]">
                  ${Number(origPrice).toFixed(2)}
                </div>
              )}

              {/* Current Sale Price (Split Styling: Light $ + Bold Number) */}
              <div className="font-['Gilroy-Regular'] text-[16px] leading-none text-[#404040]">
                <span className="font-['Gilroy-Regular'] font-400 text-[16px]">
                  $
                </span>
                {Number(currentSalePrice).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
