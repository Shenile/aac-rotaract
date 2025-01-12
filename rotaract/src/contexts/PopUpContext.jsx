import React, { createContext, useContext, useState } from "react";

// Create the PopUp context
const PopUpContext = createContext();

// Custom hook to use PopUp context
export const usePopUp = () => {
  return useContext(PopUpContext);
};

// PopUpContext Provider component
export const PopUpProvider = ({ children }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(null);

  const showPopUp = (msg, msgType = null) => {
    setMessage(msg);
    if(msgType){
      setMsgType(msgType);
    }
    setIsPopUpOpen(true);
  };

  const hidePopUp = () => {
    setIsPopUpOpen(false);
    setMessage("");
  };

  return (
    <PopUpContext.Provider
      value={{ isPopUpOpen, message, showPopUp, hidePopUp, msgType }}
    >
      {children}
    </PopUpContext.Provider>
  );
};
