import { Truck } from "lucide-react";

// Renders one "extras" line item (e.g. Fast Shipping) purely from JSON data.
// Nothing here is hardcoded — pass in the object straight from your
// catalog's `extras` array (see wyze_catalog.json), e.g.:
//   { "name": "Fast Shipping", "originalPrice": 5.99, "salePrice": 0.0 }
export default function ExtraLineItem({ item }) {
  const hasDiscount =
    item.originalPrice != null && item.originalPrice > item.salePrice;

  return (
    <div className="flex items-center justify-between py-3 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-10.25 w-10.25 object-contain rounded-[10px] bg-white"
        />
        <span className="text-[16px] font-['Gilroy-Medium'] text-gray-900">
          {item.name}
        </span>
      </div>

      <div className="text-right">
        {hasDiscount && (
          <div className="text-sm text-gray-400 line-through leading-none">
            ${item.originalPrice.toFixed(2)}
          </div>
        )}
        <div className="text-[16px] font-semibold text-[#6d3bff] leading-none">
          {item.salePrice === 0 ? "FREE" : `$${item.salePrice.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}
