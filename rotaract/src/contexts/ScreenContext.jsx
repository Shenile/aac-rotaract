import React, { createContext, useContext } from "react";
import { useMediaQuery } from "react-responsive";

export const ScreenContext = createContext();

export const ScreenContextProvider = ({ children }) => {
  const isMobile = useMediaQuery({ minWidth: 360, maxWidth: 550 });
  const isMidScreen = useMediaQuery({ minWidth: 551, maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const screenSizes = {
    isMobile,
    isMidScreen,
    isTablet,
    isDesktop,
  };

  return (
    <ScreenContext.Provider value={screenSizes}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreenContext = () => {
  const context = useContext(ScreenContext);

  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }

  return context;
};
