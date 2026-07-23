import React from "react";

export default function ReviewPanel() {
  return (
    <div className="w-full lg:w-99.75 h-213.75 rounded-[10px]  border-border bg-[#EDF4FF] pt-3.75">
      <p className="font-['Gilroy-Medium'] text-[12px] font-normal  leading-none tracking-[1.6px] align-middle uppercase text-slate-400 mb-2 px-3.75">
        REVIEW
      </p>
      <div className="flex sm:flex-col md:flex-row lg:flex-col p-5 ">
        <div className="">
          <div>
            <h2 className="font-['Gilroy-SemiBold'] text-[22px] font-normal not-italic leading-none tracking-[0.6px] align-middle text-[#1F1F1F]">
              Your security system
            </h2>
            <p className="font-['Gilroy-Medium'] text-[14px] font-normal not-italic leading-[130%] tracking-[0.6px] align-middle text-[#1F1F1F]/75">
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>
          </div>
          <div className="flex flex-col gap-2.5"></div>
        </div>

        <div className=""></div>
      </div>
    </div>
  );
}
