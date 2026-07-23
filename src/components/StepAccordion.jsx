export default function StepAccordion({
  stepNumber,
  totalSteps = 4,
  title,
  icon,
  isOpen,
  selectedSummary,
  onToggle,
  children,
}) {
  return (
    <div
      className={`rounded-t-[10px]  ${isOpen ? "bg-[#EDF4FF]" : "bg-white"}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left pt-5 pb-4"
      >
        <span className="block font-['Gilroy-Medium'] px-3.75 font-normal text-[12px] leading-[100%] tracking-[1.6px] align-middle uppercase text-[#484848] mb-2">
          Step {stepNumber} of {totalSteps}
        </span>

        <span className="flex items-center justify-between  px-3.75 py-5 border-y border-[#1F1F1F]">
          <span className="flex items-center gap-3">
            <span>{icon}</span>
            <span className="text-[22px] font-medium text-gray-900">
              {title}
            </span>
          </span>

          <span className="flex items-center gap-2">
            {isOpen && selectedSummary ? (
              <span className="text-[15px] font-medium text-[#6d3bff]">
                {selectedSummary}
              </span>
            ) : null}
            {isOpen ? (
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.12248 0.209382C4.32189 -0.0697919 4.7368 -0.0697896 4.93621 0.209386L8.96458 5.84915C9.20096 6.18009 8.96439 6.63977 8.55771 6.63977L0.500897 6.63977C0.09421 6.63977 -0.142352 6.18008 0.0940317 5.84915L4.12248 0.209382Z"
                  fill="#4E2FD2"
                />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.40682 9.43039C6.20741 9.70956 5.7925 9.70956 5.59309 9.43038L1.56472 3.79062C1.32834 3.45968 1.5649 3 1.97159 3L10.0284 3C10.4351 3 10.6716 3.45969 10.4353 3.79062L6.40682 9.43039Z"
                  fill="#4E2FD2"
                />
              </svg>
            )}
          </span>
        </span>
      </button>

      {isOpen ? <div>{children}</div> : null}
    </div>
  );
}
