import React, { createContext, useState, useEffect, useContext } from "react";
import { adminLogin, studentLogin } from "../../api/api_services";

// Create the context
export const AuthContext = createContext();

// AuthContext provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_type: null,
    user_data: null,
  });

  // Debug log for user state initialization
  console.log("user from authcontext:", user);

  // Initialize user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("Found user in localStorage:", storedUser);
      setUser(JSON.parse(storedUser)); // Set user from localStorage if available
    } else {
      console.log("No user found in localStorage.");
    }
  }, []);

  // update user data
  const updateUserData = (field, value) => {
    console.log('I am Triggered..., ');
    console.log('Field : ', field, ' Value : ', value);
    setUser((prevData)=>({
      ...prevData, 
      [field] : value
    }));

    console.log('user value after updation : ', user);
  }

  // Login function
  const adminlogin = async (logindata) => {
    console.log("Attempting to login with data:", logindata);
    try {
      const res = await adminLogin(logindata);
      console.log("Login response:", res);

      const userData = {
        user_type: "admin", // Adjust user_type as per response if needed
        user_data: res.data,
      };
      console.log("Setting user data:", userData);
      setUser(userData); // Set user state with the response data
      localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
      console.log("User data saved to localStorage:", JSON.stringify(userData));
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed. Please try again.");
      throw err;
    }
  };

  const studentlogin = async (logindata) => {
    console.log("Attempting to login with data:", logindata);
    try {
      const res = await studentLogin(logindata);
      console.log("Login response:", res);

      const userData = {
        user_type: "student", // Adjust user_type as per response if needed
        user_data: res.student_data,
      };
      console.log("Setting user data:", userData);
      setUser(userData); // Set user state with the response data
      localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
      console.log("User data saved to localStorage:", JSON.stringify(userData));
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed. Please try again.");
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out...");
    setUser({
      user_data: null,
      user_type: null,
    });
    localStorage.removeItem("user"); // Clear the user from localStorage
    console.log("User cleared from localStorage and state.");
  };

  return (
    <AuthContext.Provider value={{ user, adminlogin, studentlogin, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
