export default function NextButton({ label = "", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
    w-67.5 h-9.75 rounded-[7px]
    py-1.25 px-6 border
    border-indigo-600 bg-white text-[18px] font-400 font-['Gilroy-SemiBold'] leading-6 tracking-normal  text-indigo-600
    transition-colors hover:bg-indigo-50 active:scale-[0.98]
  "
    >
      {label}
    </button>
  );
}
