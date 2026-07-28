/**
 * Small pill badge (e.g. plan.badge "Save 20%") absolutely positioned over
 * its parent. `top`/`left` are passed straight through as inline styles so
 * callers can place it anywhere without a new Tailwind class per position —
 * pass any valid CSS length ("0", "-10px", "50%", etc.).
 */
export default function Badge({ children, top = 0, left = 0 }) {
  return (
    <span
      style={{ top, left }}
      className="
        absolute z-10
        inline-flex items-center justify-center
        w-fit h-4.75 gap-2.5
        opacity-100 rounded-[10px]
        py-0.5 px-1.5
        bg-[#4E2FD2] text-white
        font-['Gilroy-SemiBold'] font-normal text-[12px] leading-none
        box-border rotate-0
      "
    >
      {children}
    </span>
  );
}
