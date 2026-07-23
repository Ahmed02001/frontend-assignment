import React from "react";

export default function ColorSelector({
  colors = [],
  selectedColor,
  onSelectColor,
}) {
  // if (!colors || colors.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {colors.map((color) => {
        const isSelected = selectedColor === color.id;

        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelectColor(color.id)}
            className={`
              inline-flex items-center justify-between
              w-16.25 h-6.5 opacity-100 rounded-xs 
              py-px px-0.75  border-[0.5px] 
              transition-all cursor-pointer
              ${
                isSelected
                  ? "border-[#00a884] bg-[#f4fbf8] ring-[0.5px] ring-[#00a884]"
                  : "border-[#cccccc] bg-white hover:border-slate-400"
              }
            `}
          >
            {/* Color Thumbnail Image */}
            {color.image && (
              <img
                src={color.image}
                alt={color.label}
                className="w-7 h-6.75 object-contain rounded-[5px] shrink-0"
              />
            )}

            {/* Label styled with Gilroy-Medium 12px */}
            <span className="font-['Gilroy-Medium'] font-400 text-[10px] leading-[130%] tracking-[0.6px] text-neutral-900 align-middle">
              {color.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
