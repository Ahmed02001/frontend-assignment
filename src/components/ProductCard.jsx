// import { useState } from "react";
// import { Minus, Plus } from "lucide-react";
// import ColorSelector from "./ColorSelector";

// export default function ProductCard({ product }) {
//   const [selectedColor, setSelectedColor] = useState(
//     product.defaultColor || (product.colors?.[0]?.id ?? ""),
//   );
//   const [quantity, setQuantity] = useState(product.defaultQuantity ?? 1);
//   const [isCardSelected, setIsCardSelected] = useState(false);

//   const minQty = product.minQuantity ?? 0;
//   const maxQty = product.maxQuantity ?? 99;

//   const decrement = (e) => {
//     e.stopPropagation();
//     setQuantity((q) => Math.max(minQty, q - 1));
//   };

//   const increment = (e) => {
//     e.stopPropagation();
//     setQuantity((q) => Math.min(maxQty, q + 1));
//   };

//   // Resolve current active image based on selected color or product main image
//   const activeColorObj = product.colors?.find((c) => c.id === selectedColor);
//   const currentImage = activeColorObj?.image || product.image;

//   // Normalize price data handling both direct properties & nested price objects
//   const origPrice = product.originalPrice ?? product.price?.original_price;
//   const currentSalePrice = product.salePrice ?? product.price?.sale_price ?? 0;

//   return (
//     <div className="flex items-center justify-center">
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={() => setIsCardSelected((s) => !s)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") {
//             e.preventDefault();
//             setIsCardSelected((s) => !s);
//           }
//         }}
//         className="flex bg-white cursor-pointer select-none transition-colors"
//         style={{
//           width: "100%",
//           height: "159px",
//           gap: "19px",
//           borderRadius: "10px",
//           borderWidth: "2px",
//           borderStyle: "solid",
//           borderColor: isCardSelected ? "#4E2FD2B2" : "#E5E7EB",
//           padding: "11px",
//         }}
//       >
//         {/* Left Column: Outer container fixed to 101x137 */}
//         <div className="relative flex w-25.25 h-34.25 shrink-0 flex-col items-center justify-center rounded-[5px] overflow-hidden">
//           {/* Badge overlaid at top-left */}
//           {product.badge && (
//             <span
//               className="
//       absolute top-0 left-0 z-10
//       inline-flex items-center justify-center
//       w-[65px] h-[19px] gap-2.5
//       opacity-100 rounded-[10px]
//       py-[2px] px-1.5
//       bg-[#4E2FD2] text-white
//       font-['Gilroy-SemiBold'] font-normal text-[12px] leading-none
//       box-border rotate-0
//     "
//             >
//               {product.badge}
//             </span>
//           )}

//           {/* Product Main Image centered inside */}
//           <img
//             src={currentImage || product.mainImage}
//             alt={product.name || product.product_name}
//             className="w-full h-full object-contain transition-all duration-200"
//           />
//         </div>

//         {/* Right: Details Section */}
//         <div className="flex flex-1 flex-col justify-between min-w-0">
//           <div>
//             {/* Title */}
//             <h2 className="font-['Gilroy-SemiBold'] font-normal text-[16px] leading-none tracking-[0.6px] text-neutral-900 truncate align-middle mb-[6px]">
//               {product.product_name || product.name}
//             </h2>

//             {/* Tagline */}
//             <p className="font-['Gilroy-Medium'] font-normal text-[12px] leading-[130%] tracking-[0.6px] text-neutral-500 align-middle truncate">
//               {product.tagline}
//             </p>

//             {/* Learn More Link */}
//             {(product.learnMoreUrl || product.learn_more_link) && (
//               <a
//                 href={
//                   typeof product.learnMoreUrl === "string"
//                     ? product.learnMoreUrl
//                     : "#"
//                 }
//                 onClick={(e) => e.stopPropagation()}
//                 className="font-['Gilroy-Medium'] font-normal text-[12px] leading-[130%] tracking-[0.6px] text-indigo-600 underline decoration-1 underline-offset-1 hover:text-indigo-700 align-middle inline-block"
//               >
//                 Learn More
//               </a>
//             )}
//           </div>

//           {/* Color Selector */}
//           {product.colors && product.colors.length > 0 && (
//             <div
//               className="flex gap-1.5 my-[10px]"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <ColorSelector
//                 colors={product.colors}
//                 selectedColor={selectedColor}
//                 onSelectColor={setSelectedColor}
//               />
//             </div>
//           )}

//           {/* Quantity Controls + Pricing */}
//           <div className="flex items-center justify-between w-full h-[35px] ">
//             {/* Quantity Selector */}
//             <div className="flex items-center gap-[10px]">
//               {/* Decrement Button - Outlined Rounded Square */}
//               <button
//                 type="button"
//                 onClick={decrement}
//                 aria-label="Decrease quantity"
//                 className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-neutral-200 bg-white text-neutral-400 transition-colors hover:bg-neutral-50 active:scale-95"
//               >
//                 <Minus className="h-[8px] w-[9.6px] stroke-[2.5]" />
//               </button>

//               {/* Quantity Count */}
//               <span className="w-4 text-center font-['Gilroy-Medium'] text-[16px] font-400 text-neutral-900">
//                 {quantity}
//               </span>

//               {/* Increment Button - Solid Light Gray Rounded Square */}
//               <button
//                 type="button"
//                 onClick={increment}
//                 aria-label="Increase quantity"
//                 className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] bg-[#f1f5f9] text-neutral-700 transition-colors hover:bg-neutral-200 active:scale-95"
//               >
//                 <Plus className="h-[8px] w-[8px] stroke-[2.5]" />
//               </button>
//             </div>

//             {/* Pricing Section */}
//             <div className="flex flex-col items-end justify-center text-right">
//               {/* Original Price (Strikethrough Red) */}
//               {origPrice && (
//                 <div className="font-['Gilroy-Regular'] text-[16px] font-400 text-[#D9383A] line-through leading-none mb-[2px]">
//                   ${Number(origPrice).toFixed(2)}
//                 </div>
//               )}

//               {/* Current Sale Price (Split Styling: Light $ + Bold Number) */}
//               <div className="font-['Gilroy-Regular'] text-[16px] leading-none text-[#404040]">
//                 <span className="font-['Gilroy-Regular'] font-400 text-[16px]">
//                   $
//                 </span>
//                 {Number(currentSalePrice).toFixed(2)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import ColorSelector from "./ColorSelector";

export default function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(
    product.defaultColor || (product.colors?.[0]?.id ?? ""),
  );
  const [quantity, setQuantity] = useState(product.defaultQuantity ?? 1);
  const [isCardSelected, setIsCardSelected] = useState(false);

  const minQty = product.minQuantity ?? 0;
  const maxQty = product.maxQuantity ?? 99;

  const decrement = (e) => {
    e.stopPropagation();
    setQuantity((q) => Math.max(minQty, q - 1));
  };

  const increment = (e) => {
    e.stopPropagation();
    setQuantity((q) => Math.min(maxQty, q + 1));
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
        onClick={() => setIsCardSelected((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsCardSelected((s) => !s);
          }
        }}
        // Mobile/tablet: fluid card capped at the spec's max width (224.6px),
        // height driven by content so it shrinks/grows with the viewport.
        // Large screens (lg:): switch back to the fixed-height horizontal layout.
        className="flex h-[331.1px] w-[224.6px] flex-col gap-[19px] bg-white cursor-pointer select-none transition-colors rounded-[10px] border-[2px] py-[15px] px-[11px]  lg:w-full lg:max-w-none lg:h-[159px] lg:flex-row lg:gap-[19px] lg:p-[11px]"
        style={{
          borderColor: isCardSelected ? "#4E2FD2B2" : "#E5E7EB",
        }}
      >
        {/* Image column: fluid width, aspect-ratio locked to the spec's 202.6:117.39 proportions on mobile/tablet, fixed 101x137 box on lg+ */}
        <div className="relative flex w-full aspect-[202.6/117.394] shrink-0 flex-col items-center justify-center rounded-[5px] overflow-hidden lg:w-25.25 lg:h-34.25 lg:aspect-auto">
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
                Learn More drops to its own line on lg+ */}
            <p className="font-['Gilroy-Medium'] font-normal text-[12px] leading-[130%] tracking-[0.6px] text-neutral-500 align-middle lg:truncate">
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
                    className="font-['Gilroy-Medium'] font-normal text-[12px] leading-[130%] tracking-[0.6px] text-indigo-600 underline decoration-1 underline-offset-1 hover:text-indigo-700 align-middle inline lg:block lg:mt-1"
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
                onSelectColor={setSelectedColor}
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
                aria-label="Decrease quantity"
                className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border border-neutral-200 bg-white text-neutral-400 transition-colors hover:bg-neutral-50 active:scale-95"
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
                aria-label="Increase quantity"
                className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] bg-[#f1f5f9] text-neutral-700 transition-colors hover:bg-neutral-200 active:scale-95"
              >
                <Plus className="h-[8px] w-[8px] stroke-[2.5]" />
              </button>
            </div>

            {/* Pricing Section */}
            <div className="flex sm:flex-row lg:flex-col items-end justify-center text-right ">
              {/* Original Price (Strikethrough Red) */}
              {origPrice && (
                <div className="font-['Gilroy-Regular'] text-[16px] font-400 text-[#D9383A] line-through leading-none lg:mb-[2px]">
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
