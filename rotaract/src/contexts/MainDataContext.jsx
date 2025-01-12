import React, { createContext, useContext, useState, useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(false);

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
        capitalize
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
