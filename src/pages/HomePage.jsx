import React from "react";

import BuilderSteps from "@/components/BuilderSteps.jsx";
import ReviewPanel from "@/components/Reviewpanel.jsx";

function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row lg:gap-6 items-stretch lg:items-start justify-center lg:p-6">
      <BuilderSteps />
      <ReviewPanel />
    </div>
  );
}
export default HomePage;
