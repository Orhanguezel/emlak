import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "@/styles/sidebar.css";
import "@/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <div data-app>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </div>
  </React.StrictMode>
);

// (Varsa) prerender event’in kalsın
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.dispatchEvent(new Event("render-event"));
    }, 2000);
  });
}
