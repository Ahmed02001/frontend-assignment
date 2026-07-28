import { useState, useMemo } from "react";
import StepAccordion from "@/components/StepAccordion/StepAccordion.jsx";
import productsData from "@/data/products.json";
import ProductCard from "./ProductCard/ProductCard";
import NextButton from "@/components/UI/NextButton.jsx";
import { makeSelectCountByCategory } from "@/redux/cartSelectors";
import { useDispatch, useSelector } from "react-redux";
import PlanCard from "./UI/PlanCard";
import { selectPlan } from "@/redux/cartSlice";

export default function BuilderSteps() {
  const [openStep, setOpenStep] = useState(1);

  const toggleStep = (stepNumber) => {
    setOpenStep((current) => (current === stepNumber ? null : stepNumber));
  };

  const selectCameraCount = useMemo(
    () => makeSelectCountByCategory("cameras"),
    [],
  );
  const selectPlanCount = useMemo(() => makeSelectCountByCategory("plans"), []);
  const selectSensorCount = useMemo(
    () => makeSelectCountByCategory("sensors"),
    [],
  );
  const selectaccessoriesCount = useMemo(
    () => makeSelectCountByCategory("accessories"),
    [],
  );

  ////////////////////

  const dispatch = useDispatch();

  // selectPlan needs the full sibling group (planIds) so it can clear
  // `selected` on whichever plan was previously chosen — PlanCard itself
  // only reports *which* id was clicked, it doesn't know about its
  // siblings, so that has to be assembled here.
  const PLAN_IDS = productsData.plans.map((plan) => plan.id);
  const handleSelectPlan = (id) => {
    const plan = productsData.plans.find((p) => p.id === id);
    const defaults = { ...plan, price: plan.salePrice, billingPeriod: "mo" };
    dispatch(selectPlan({ id, planIds: PLAN_IDS, defaults }));
  };
  ////////////////////

  const cameraCount = useSelector(selectCameraCount);
  const planCount = useSelector(selectPlanCount);
  const sensorCount = useSelector(selectSensorCount);
  const accessoriesCount = useSelector(selectaccessoriesCount);
  return (
    <div className="w-full xl:w-3xl  rounded-[10px]  border-[#1F1F1F] bg-[#EDF4FF]">
      <StepAccordion
        stepNumber={1}
        title="Choose your cameras"
        icon={
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_68_9780)">
              <path
                d="M8.6665 24.9166V20.5833"
                stroke="#6F7882"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.3335 24.9166V20.5833"
                stroke="#6F7882"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.75 24.9167L3.25 24.9167"
                stroke="#6F7882"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13 5.14581C15.2436 5.14581 17.0625 6.96473 17.0625 9.20831C17.0625 11.4519 15.2436 13.2708 13 13.2708C10.7564 13.2708 8.9375 11.4519 8.9375 9.20831C8.9375 6.96473 10.7564 5.14581 13 5.14581Z"
                stroke="#6F7882"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.9731 16.25C12.7489 16.25 12.5669 16.432 12.5669 16.6562C12.5669 16.8805 12.7489 17.0625 12.9731 17.0625C13.1974 17.0625 13.3794 16.8805 13.3794 16.6562C13.3794 16.432 13.1974 16.25 12.9731 16.25Z"
                fill="#6F7882"
                stroke="#6F7882"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <rect
                x="3.1875"
                y="0.75"
                width="19.625"
                height="19.625"
                rx="3.25"
                stroke="#6F7882"
                stroke-width="1.5"
              />
            </g>
            <defs>
              <clipPath id="clip0_68_9780">
                <rect width="26" height="26" fill="white" />
              </clipPath>
            </defs>
          </svg>
        }
        isOpen={openStep === 1}
        selectedSummary={`${cameraCount} selected`}
        onToggle={() => toggleStep(1)}
      >
        <div className="flex gap-3.75 overflow-auto scrollbar-none pb-2 xl:grid xl:grid-cols-2 xl:overflow-visible px-3.75">
          {productsData.cameras.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category="cameras"
            />
          ))}
        </div>
        <div className="pt-3.75 pb-5 flex justify-center">
          <NextButton
            label="Next: Choose your plan"
            onClick={() => toggleStep(2)}
          />
        </div>
      </StepAccordion>
      <StepAccordion
        stepNumber={2}
        title="Choose your plan"
        icon={
          <svg
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.22186 5.25454C4.22186 5.25454 2.86035 5.49907 2.86035 6.64875V15.0139C2.86035 19.4874 9.42646 24.4657 11.6584 25.9445C12.1032 26.2419 12.6787 26.2419 13.1234 25.9445C15.3554 24.4657 21.9215 19.4874 21.9215 15.0139V6.64875C21.9215 5.49907 20.56 5.25454 20.56 5.25454L13.1811 2.92959C12.6665 2.76745 12.1154 2.76745 11.6008 2.92959L4.22186 5.25454Z"
              fill="#F0F0F0"
            />
            <path
              d="M5.87139 4.26114C5.89408 4.25692 5.9165 4.25134 5.93852 4.2444L13.3175 1.91943C13.7209 1.79232 14.153 1.79232 14.5565 1.91943L21.9354 4.2444C21.9574 4.25134 21.9798 4.25692 22.0025 4.26114C22.0034 4.26131 22.0044 4.26147 22.0053 4.26165L22.0049 4.26157L22.0042 4.26144L22.0031 4.26124L22.0059 4.26182C22.0105 4.26278 22.0195 4.26471 22.0321 4.26774C22.0575 4.27383 22.0969 4.28417 22.1455 4.29975C22.2449 4.33156 22.3716 4.38175 22.4933 4.45499C22.7361 4.60112 22.893 4.78996 22.893 5.08273V13.4479C22.893 14.4251 22.5326 15.4715 21.9116 16.5397C21.2926 17.6046 20.4356 18.655 19.4948 19.6291C17.6126 21.578 15.4492 23.1663 14.355 23.8913L14.3529 23.8927C14.1002 24.0617 13.7737 24.0617 13.521 23.8927L13.5189 23.8913C12.4247 23.1663 10.2613 21.578 8.37912 19.6291C7.43837 18.655 6.58128 17.6046 5.9623 16.5397C5.3413 15.4715 4.98096 14.4251 4.98096 13.4479V5.08273C4.98096 4.78996 5.13776 4.60112 5.38057 4.45499C5.50228 4.38175 5.62907 4.33156 5.72837 4.29975C5.77699 4.28417 5.8164 4.27383 5.84178 4.26774C5.85441 4.26471 5.86336 4.26278 5.86802 4.26182L5.87139 4.26114ZM5.86901 4.26157L5.86896 4.26158C5.86899 4.26157 5.86903 4.26157 5.86906 4.26157L5.86901 4.26157Z"
              stroke="#6F7882"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        isOpen={openStep === 2}
        selectedSummary={`${planCount} selected`}
        onToggle={() => toggleStep(2)}
      >
        <div className="flex gap-3.75 overflow-auto scrollbar-none pb-2 xl:grid xl:grid-cols-2 xl:overflow-visible px-3.75">
          {productsData.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
          ))}
        </div>
        <div className="pt-3.75 pb-5 flex justify-center">
          <NextButton
            label="Next: Choose your sensors"
            onClick={() => toggleStep(3)}
          />
        </div>
      </StepAccordion>
      <StepAccordion
        stepNumber={3}
        title="Choose your sensors"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5526 7.13056C19.5526 7.82389 19.0904 8.28611 18.3971 8.28611H9.15263C8.45929 8.28611 7.99707 7.82389 7.99707 7.13056V1.93058C7.99707 1.23725 8.45929 0.775024 9.15263 0.775024H18.3971C19.0904 0.775024 19.5526 1.23725 19.5526 1.93058V7.13056Z"
              stroke="#6F7882"
              stroke-width="1.55"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.8101 4.2417V4.81948"
              stroke="#6F7882"
              stroke-width="1.55"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.855 4.2417V4.81948"
              stroke="#6F7882"
              stroke-width="1.55"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19.1625 13.5441C16.2346 16.4329 11.3156 16.4329 8.3877 13.5441"
              stroke="#6F7882"
              stroke-width="1.55"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22.9104 17.2419C17.8744 22.2108 9.67617 22.2108 4.64014 17.2419"
              stroke="#6F7882"
              stroke-width="1.55"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M26.7749 21.6328C19.5136 28.5661 8.03616 28.4505 0.774902 21.5172"
              stroke="#6F7882"
              stroke-width="1.55"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        isOpen={openStep === 3}
        selectedSummary={`${sensorCount} selected`}
        onToggle={() => toggleStep(3)}
      >
        <div className="flex gap-3.75 overflow-auto scrollbar-none pb-2 xl:grid xl:grid-cols-2 xl:overflow-visible px-3.75">
          {productsData.sensors.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category="sensors"
            />
          ))}
        </div>
        <div className="pt-3.75 pb-5 flex justify-center">
          <NextButton
            label="Next: Add extra protection"
            onClick={() => toggleStep(4)}
          />
        </div>
      </StepAccordion>
      <StepAccordion
        stepNumber={4}
        title="Add Extra protection"
        icon={
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.478 6.47826L12.9997 3L9.52148 6.47826"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.07204 10.174C8.07204 10.5776 7.91171 10.9646 7.62633 11.25C7.34095 11.5354 6.95389 11.6957 6.5503 11.6957H5.53639C5.1328 11.6957 4.74574 11.5354 4.46036 11.25C4.17497 10.9646 4.01465 10.5776 4.01465 10.174C4.01465 9.77037 4.17497 9.38331 4.46036 9.09793C4.74574 8.81255 5.1328 8.65222 5.53639 8.65222H6.5503C6.95389 8.65222 7.34095 8.81255 7.62633 9.09793C7.91171 9.38331 8.07204 9.77037 8.07204 10.174Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.0286 10.174C15.0286 10.5776 14.8683 10.9646 14.5829 11.25C14.2975 11.5354 13.9104 11.6957 13.5068 11.6957H12.4929C12.0893 11.6957 11.7023 11.5354 11.4169 11.25C11.1315 10.9646 10.9712 10.5776 10.9712 10.174C10.9712 9.77037 11.1315 9.38331 11.4169 9.09793C11.7023 8.81255 12.0893 8.65222 12.4929 8.65222H13.5068C13.9104 8.65222 14.2975 8.81255 14.5829 9.09793C14.8683 9.38331 15.0286 9.77037 15.0286 10.174Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.9851 10.174C21.9851 10.5776 21.8248 10.9646 21.5394 11.25C21.254 11.5354 20.867 11.6957 20.4634 11.6957H19.4495C19.0459 11.6957 18.6588 11.5354 18.3734 11.25C18.0881 10.9646 17.9277 10.5776 17.9277 10.174C17.9277 9.77037 18.0881 9.38331 18.3734 9.09793C18.6588 8.81255 19.0459 8.65222 19.4495 8.65222H20.4634C20.867 8.65222 21.254 8.81255 21.5394 9.09793C21.8248 9.38331 21.9851 9.77037 21.9851 10.174Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.07204 15.8261C8.07204 16.2297 7.91171 16.6167 7.62633 16.9021C7.34095 17.1875 6.95389 17.3478 6.5503 17.3478H5.53639C5.1328 17.3478 4.74574 17.1875 4.46036 16.9021C4.17497 16.6167 4.01465 16.2297 4.01465 15.8261C4.01465 15.4225 4.17497 15.0354 4.46036 14.75C4.74574 14.4646 5.1328 14.3043 5.53639 14.3043H6.5503C6.95389 14.3043 7.34095 14.4646 7.62633 14.75C7.91171 15.0354 8.07204 15.4225 8.07204 15.8261Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.0286 15.8261C15.0286 16.2297 14.8683 16.6167 14.5829 16.9021C14.2975 17.1875 13.9104 17.3478 13.5068 17.3478H12.4929C12.0893 17.3478 11.7023 17.1875 11.4169 16.9021C11.1315 16.6167 10.9712 16.2297 10.9712 15.8261C10.9712 15.4225 11.1315 15.0354 11.4169 14.75C11.7023 14.4646 12.0893 14.3043 12.4929 14.3043H13.5068C13.9104 14.3043 14.2975 14.4646 14.5829 14.75C14.8683 15.0354 15.0286 15.4225 15.0286 15.8261Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.9851 15.8261C21.9851 16.2297 21.8248 16.6167 21.5394 16.9021C21.254 17.1875 20.867 17.3478 20.4634 17.3478H19.4495C19.0459 17.3478 18.6588 17.1875 18.3734 16.9021C18.0881 16.6167 17.9277 16.2297 17.9277 15.8261C17.9277 15.4225 18.0881 15.0354 18.3734 14.75C18.6588 14.4646 19.0459 14.3043 19.4495 14.3043H20.4634C20.867 14.3043 21.254 14.4646 21.5394 14.75C21.8248 15.0354 21.9851 15.4225 21.9851 15.8261Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.07204 21.4783C8.07204 21.8819 7.91171 22.2689 7.62633 22.5543C7.34095 22.8397 6.95389 23 6.5503 23H5.53639C5.1328 23 4.74574 22.8397 4.46036 22.5543C4.17497 22.2689 4.01465 21.8819 4.01465 21.4783C4.01465 21.0747 4.17497 20.6876 4.46036 20.4023C4.74574 20.1169 5.1328 19.9565 5.53639 19.9565H6.5503C6.95389 19.9565 7.34095 20.1169 7.62633 20.4023C7.91171 20.6876 8.07204 21.0747 8.07204 21.4783Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.0286 21.4783C15.0286 21.8819 14.8683 22.2689 14.5829 22.5543C14.2975 22.8397 13.9104 23 13.5068 23H12.4929C12.0893 23 11.7023 22.8397 11.4169 22.5543C11.1315 22.2689 10.9712 21.8819 10.9712 21.4783C10.9712 21.0747 11.1315 20.6876 11.4169 20.4023C11.7023 20.1169 12.0893 19.9565 12.4929 19.9565H13.5068C13.9104 19.9565 14.2975 20.1169 14.5829 20.4023C14.8683 20.6876 15.0286 21.0747 15.0286 21.4783Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21.9851 21.4783C21.9851 21.8819 21.8248 22.2689 21.5394 22.5543C21.254 22.8397 20.867 23 20.4634 23H19.4495C19.0459 23 18.6588 22.8397 18.3734 22.5543C18.0881 22.2689 17.9277 21.8819 17.9277 21.4783C17.9277 21.0747 18.0881 20.6876 18.3734 20.4023C18.6588 20.1169 19.0459 19.9565 19.4495 19.9565H20.4634C20.867 19.9565 21.254 20.1169 21.5394 20.4023C21.8248 20.6876 21.9851 21.0747 21.9851 21.4783Z"
              stroke="#6F7882"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        isOpen={openStep === 4}
        selectedSummary={`${accessoriesCount} selected`}
        onToggle={() => toggleStep(4)}
      >
        <div className="flex gap-3.75 overflow-auto scrollbar-none pb-2 xl:grid xl:grid-cols-2 xl:overflow-visible px-3.75">
          {productsData.accessories.map((accessor) => (
            <ProductCard
              key={accessor.id}
              product={accessor}
              category="accessories"
            />
          ))}
        </div>
        <div className="pt-3.75 pb-5 flex justify-center">
          <NextButton
            label="Next: Choose your plan"
            onClick={() => toggleStep(1)}
          />
        </div>
      </StepAccordion>
    </div>
  );
}
