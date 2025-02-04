import React, { createContext, useContext, useState, useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Adds smooth scroll effect
    });
  };

  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  function generateYearOptions(startYear, batchDuration) {
    const startYearOptions = [];
    const endYearOptions = [];

    for (let i = startYear; i <= currentYear; i++) {
      startYearOptions.push(startYear);
      endYearOptions.push(startYear + batchDuration);
      startYear++;
    }

    return { startYearOptions, endYearOptions };
  }

  // util function for capitalize
  function capitalize(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  const { startYearOptions, endYearOptions } = generateYearOptions(
    currentYear - 2,
    3
  );

  const getClickEffect = (bgColor) => {
    
    return {
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      transition: "background 0.3s ease", // Smooth transition for background color
  
      // Apply background color change on active (click)
      "&:active": {
        backgroundColor: bgColor,  // Accepts hex, RGB, RGBA, HSL, etc.
        transition: "background 0.2s ease",  // Ensuring a quick background color transition
      },
    };
  };
  

  const deptOptions = [
    "History",
    "Economics",
    "Philosophy",
    "Tamil Literature",
    "English Literature",
    "Physics",
    "Chemistry",
    "Computer Science and Application",
    "Rural Development Science",
    "Information Technology",
    "Food Science and Technology",
    "Physical Education",
    "Business Administration",
    "Commerce with CA",
    "General Commerce",
  ];

  return (
    <DataContext.Provider
      value={{
        startYearOptions,
        endYearOptions,
        deptOptions,
        loading,
        setLoading,
        capitalize,
        scrollToTop,
        getClickEffect
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom Hook to Use Context
export const useDataContext = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }

  return context;
};
