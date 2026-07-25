import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";

import HomePage from "./pages/HomePage.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HomePage />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
