import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AuthProxyProvider } from './providers'

const root = ReactDOM.createRoot(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document.getElementById("root")
);

root.render(
  <Provider store={store}>
    <AuthProxyProvider>
      <App />
    </AuthProxyProvider>
  </Provider>
);

reportWebVitals();
