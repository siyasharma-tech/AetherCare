import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./styles/main.css";
import App from "./App";
import { store } from "./store/store";

// <Provider> makes the Redux store available to every component below it.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
