import { useSeedCart } from "@/hooks/useSeedCart";
import BuilderSteps from "@/components/BuilderSteps"; // adjust to your actual import
import ReviewPanel from "@/components/ReviewPanel/Reviewpanel"; // adjust to your actual import

export default function HomePage() {
  // Seeds the cart from products.json defaults on a brand-new visitor's
  // first load only — a no-op for anyone with an existing saved system
  // (PersistGate has already restored it before this ever runs).
  useSeedCart();

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-6">
      <BuilderSteps />
      <ReviewPanel />
    </div>
  );
}
