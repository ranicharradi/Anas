import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fonts bundled for reliability, same as the deck. Never link Google Fonts.
import "@fontsource-variable/fraunces/index.css";
import "@fontsource-variable/inter/index.css";

import "@/index.css";
import SiteApp from "./SiteApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SiteApp />
  </StrictMode>,
);
