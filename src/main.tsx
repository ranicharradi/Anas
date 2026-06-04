import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fonts bundled for offline / defense-day reliability — never link Google Fonts.
import "@fontsource-variable/fraunces/index.css";
import "@fontsource-variable/inter/index.css";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
