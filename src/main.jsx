import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import HomePage from "./pages/home/home-page.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
