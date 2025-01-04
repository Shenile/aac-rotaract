import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ScreenContextProvider } from "./contexts/ScreenContext.jsx";
import { DataContextProvider } from "./contexts/MainDataContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <DataContextProvider>
      
        <ScreenContextProvider>
          <App />
        </ScreenContextProvider>
     
    </DataContextProvider>
    </AuthProvider>
  </StrictMode>
);
