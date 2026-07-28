import { Minus, Plus } from "lucide-react";
import { useProductVariant } from "@/hooks/useProductVariant";
import ColorSelector from "../UI/ColorSelector";
import Badge from "../UI/Badge";

export default function ProductCard({ product, category }) {
  const {
    activeColor,
    setActiveColor,
    quantity,
    isCardSelected,
    minQty,
    maxQty,
    displayName,
    currentImage,
    currentSalePrice,
    origPrice,
    hasDiscount,
    isFree,
    increment,
    decrement,
    handleCardClick,
  } = useProductVariant(product, category);

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
        className="flex h-[331.1px] w-[224.6px] flex-col gap-4.75 bg-white cursor-pointer select-none transition-colors rounded-[10px] border-2 py-3.75 px-2.75  xl:w-full xl:max-w-none xl:h-42.75 xl:flex-row xl:gap-4.75 xl:p-2.75"
        style={{
          borderColor: isCardSelected ? "#4E2FD2B2" : "#E5E7EB",
        }}
      >
        <div className="relative flex w-full aspect-[202.6/117.394] shrink-0 flex-col items-center justify-center rounded-[5px] overflow-hidden xl:w-25.25 xl:h-34.25 xl:aspect-auto">
          {product.badge && (
            <Badge top={0} left={0}>
              {product.badge}
            </Badge>
          )}

          <img
            src={currentImage || product.mainImage}
            alt={displayName}
            className="w-full h-full object-contain transition-all duration-200"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <h2 className="font-['Gilroy-SemiBold'] font-normal text-[16px] leading-none tracking-[0.6px] text-neutral-900 truncate align-middle mb-1.5">
              {displayName}
            </h2>

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

          {product.colors && product.colors.length > 0 && (
            <div
              className="flex flex-wrap gap-1.5 my-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ColorSelector
                colors={product.colors}
                selectedColor={activeColor}
                onSelectColor={setActiveColor}
              />
            </div>
          )}

          <div className="flex items-center justify-between w-full h-8.75 ">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= minQty}
                aria-label="Decrease quantity"
                className="flex h-5 w-5 items-center justify-center rounded-sm border border-neutral-200 bg-white text-neutral-400 transition-colors hover:bg-neutral-50 active:scale-95 disabled:opacity-40"
              >
                <Minus className="h-2 w-[9.6px] stroke-[2.5]" />
              </button>

              <span className="w-4 text-center font-['Gilroy-Medium'] text-[16px] font-400 text-neutral-900">
                {quantity}
              </span>

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

            <div className="flex sm:flex-row xl:flex-col items-end justify-center text-right ">
              {hasDiscount && (
                <div className="font-['Gilroy-Regular'] text-[16px] font-400 text-[#D9383A] line-through leading-none xl:mb-0.5 mr-1.25 xl:mr-0">
                  ${origPrice.toFixed(2)}
                </div>
              )}

              <div className="font-['Gilroy-Regular'] text-[16px] leading-none text-[#404040]">
                <span className="font-['Gilroy-Regular'] font-400 text-[16px]">
                  $
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
