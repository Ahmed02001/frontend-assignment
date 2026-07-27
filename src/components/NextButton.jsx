export default function NextButton({ label = "", onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`
        flex min-w-67.5 w-auto h-9.75 items-center justify-center gap-2
        rounded-[7px] py-1.25 px-6 border
        text-[18px] font-400 font-['Gilroy-SemiBold'] leading-6 tracking-normal
        transition-colors active:scale-[0.98]
        ${
          disabled
            ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
            : "border-indigo-600 bg-white text-indigo-600 hover:bg-indigo-50"
        }
      `}
    >
      {label}
    </button>
  );
}
