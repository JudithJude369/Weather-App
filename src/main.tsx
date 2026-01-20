import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProviders } from "./AppProviders/AppProviders.tsx";
import { SearchProvider } from "./contexts/search-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <SearchProvider>
        <App />
      </SearchProvider>
    </AppProviders>
  </StrictMode>,
);
