import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartTotal,
  selectOriginalTotal,
} from "../../redux/cartSelectors";
import productsData from "@/data/products.json";
import { useCartCategory } from "@/hooks/useCartCategory";
import { useQuantityChange } from "@/hooks/useQuantityChange";
import ReviewSection from "./ReviewSection";
import ExtraLineItem from "../UI/ExtraLineItem";

export default function ReviewPanel() {
  const [showCongrats, setShowCongrats] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleCheckout = () => {
    setShowCongrats(true);
    // Add your checkout submission logic here
  };

  // redux-persist already writes every cart change to localStorage as it
  // happens, so there's technically nothing left to "do" here — the click
  // just gives the shopper visible confirmation that their system really
  // is saved and will be there when they come back.
  const handleSaveForLater = () => {
    setShowSaved(true);
  };

  const cameras = useCartCategory("cameras");
  const sensors = useCartCategory("sensors");
  const accessories = useCartCategory("accessories");
  const plans = useCartCategory("plans");

  const total = useSelector(selectCartTotal);
  const originalTotal = useSelector(selectOriginalTotal);
  const savings = originalTotal - total;

  const handleQuantityChange = useQuantityChange();

  return (
    <div className="w-full xl:w-99.75  rounded-[10px]  border-border bg-[#EDF4FF] pt-3.75">
      <p className="font-['Gilroy-Medium'] text-[12px] font-normal  leading-none tracking-[1.6px] align-middle uppercase text-slate-400 mb-2 px-3.75">
        REVIEW
      </p>
      <div className="flex flex-col md:flex-row md:justify-evenly xl:flex-col p-5 gap-[25px]">
        <div className="md:w-[50%] xl:w-auto">
          <div>
            <h2 className="font-['Gilroy-SemiBold'] text-[22px] font-normal not-italic leading-none tracking-[0.6px] align-middle text-[#1F1F1F] mb-1.25">
              Your security system
            </h2>
            <p className="font-['Gilroy-Medium'] text-[14px] font-normal not-italic leading-[130%] tracking-[0.6px] align-middle text-[#1F1F1F]/75">
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="mt-5 flex flex-col gap-4">
              <ReviewSection
                title="Cameras"
                items={cameras}
                onQuantityChange={handleQuantityChange}
              />
              <ReviewSection
                title="Sensors"
                items={sensors}
                onQuantityChange={handleQuantityChange}
              />
              <ReviewSection
                title="Accessories"
                items={accessories}
                onQuantityChange={handleQuantityChange}
              />
              <ReviewSection
                title="Plans"
                items={plans}
                onQuantityChange={handleQuantityChange}
              />
              <ExtraLineItem item={productsData.extras[0]} />
            </div>
          </div>
        </div>

        <div className=" flex flex-col justify-between md:justify-start xl:justify-between  md:max-w-121.5 md:w-[50%] xl:w-full">
          {/* Seal + financing chip */}
          <div className="flex flex-row md:flex-col xl:flex-row justify-between ">
            <div className="flex flex-row gap-[25px] items-center">
              <div className="h-19.5 w-19.5 md:h-32.75 md:w-32.75 xl:h-19.5 xl:w-19.5">
                <img
                  src="/images/star.png"
                  alt="Star Image"
                  className="h-full w-full"
                />
              </div>
              <div className="w-82.5 md:w-[200px] hidden md:block xl:hidden">
                <p className="align-middle font-['Gilroy-SemiBold'] font-normal text-[18px] leading-[110%] tracking-[0.6px]">
                  30-day hassle-free returns
                  <br />
                  <br />
                  <span className="align-middle block font-['Gilroy-Regular'] font-normal text-[18px] leading-[110%] tracking-[0.6px]">
                    If you're not totally in love with the product, we will
                    refund you 100%.
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-end flex-col md:flex-row xl:flex-col md:justify-between gap-2.5 pt-[10px]">
              <div className="whitespace-nowrap rounded-full bg-indigo-700 px-3 py-1.5 font-['Gilroy-Medium'] font-normal text-[12px]  text-center text-white">
                as low as ${19.19}/mo
              </div>
              <div>
                {originalTotal > total && (
                  <span className="font-['Gilroy-Medium'] font-normal text-[18px] leading-[20px] tracking-[0.0025em] text-center line-through text-[#6F7882] mr-2">
                    ${originalTotal.toFixed(2)}
                  </span>
                )}
                <span className="inline-block text-right align-middle font-['Gilroy-Bold'] font-normal text-[24px] leading-[32px] text-[#4E2FD2]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className=" text-right pt-3">
            {showCongrats && (
              <p className=" mb-1 text-center font-['Gilroy-SemiBold'] font-semibold text-[12px] leading-[18px] text-[#12B76A]">
                Congrats! You're saving ${savings.toFixed(2)} on your security
                bundle!
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              className=" w-full rounded-xl bg-indigo-700 py-4 text-xl font-bold text-white transition-colors hover:bg-indigo-800 active:scale-[0.99]"
            >
              Checkout
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveForLater}
            className=" w-full text-center text-sm italic text-gray-600 underline underline-offset-2 hover:text-gray-800"
          >
            Save my system for later
          </button>
          {showSaved && (
            <p className="mt-1 text-center text-xs font-['Gilroy-Medium'] text-[#12B76A]">
              Saved — come back anytime and your system will be here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
