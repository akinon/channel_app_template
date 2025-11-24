import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { store } from "./store";
import { router } from "./routes";

import "@akinon/fonts-jost-variable";
import "@akinon/ui-utils";
import "./main.scss";

async function bootstrap() {
  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("#root element not found");

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>,
  );
}

bootstrap();
