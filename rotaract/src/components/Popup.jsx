import React, { useEffect } from "react";
import { usePopUp } from "../contexts/PopUpContext";
import { X, Check } from "lucide-react";

const PopUp = () => {
  const { isPopUpOpen, message, hidePopUp, msgType } = usePopUp();

  useEffect(() => {
    if (isPopUpOpen) {
      const timer = setTimeout(() => {
        hidePopUp();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPopUpOpen, hidePopUp]);

  if (!isPopUpOpen) return null;

  const getMessageIcon = (msgType) => {
    switch (msgType) {
      case "success":
        return (
          <div className="bg-green-700 rounded-full w-fit h-fit p-2">
            <Check size={16} className="text-white" />
          </div>
        );
      case "error":
        return (
          <div className="bg-red-700 rounded-full w-fit h-fit p-2">
            <X size={16} className="text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
      <div className="relative w-fit bg-white p-4 pb-6 rounded-md shadow-lg max-w-xs w-full flex flex-col justify-center items-center">
        <div className="w-full h-fit flex justify-end">
          <button
            type="button"
            onClick={() => hidePopUp()}
            className="rounded-full p-1 hover:bg-gray-400"
          >
            <X size={16} className=" text-gray-700" />
          </button>
        </div>
        {msgType && getMessageIcon(msgType)}
        <p className="w-full text-center mt-4">{message}</p>
      </div>
    </div>
  );
};

export default PopUp;
