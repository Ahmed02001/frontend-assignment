import React, { useEffect } from "react";

import BuilderSteps from "@/components/BuilderSteps.jsx";
import ReviewPanel from "@/components/Reviewpanel.jsx";
import productsData from "@/data/products.json";
import { useDispatch, useSelector } from "react-redux";
import { hydrate } from "@/redux/cartSlice";

function buildInitialCart(productsData) {
  const cart = {};

  const addCategory = (items, category) => {
    items.forEach((product) => {
      cart[product.id] = {
        id: product.id,
        category,
        name: product.name,
        image: product.mainImage ?? null,
        quantity: product.defaultQuantity ?? 0,
        minQuantity: product.minQuantity ?? 0,
        maxQuantity: product.maxQuantity ?? 10,
        color: product.defaultColor ?? null,
        price: product.salePrice ?? product.originalPrice ?? 0,
        required: product.required ?? false,
        billingPeriod: product.billingPeriod ?? null,
      };
    });
  };

  addCategory(productsData.cameras, "cameras");
  addCategory(productsData.sensors, "sensors");
  addCategory(productsData.accessories, "accessories");
  addCategory(productsData.plans, "plans");
  addCategory(productsData.extras, "extras");

  return cart;
}
function HomePage() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const cartIsEmpty = Object.keys(cart).length === 0;
    if (cartIsEmpty) {
      dispatch(hydrate(buildInitialCart(productsData)));
    }
  }, [dispatch, cart]);

  return (
    <div className="flex flex-col xl:flex-row lg:gap-6 items-stretch lg:items-start justify-center lg:p-6">
      <BuilderSteps />
      <ReviewPanel />
    </div>
  );
}
export default HomePage;
