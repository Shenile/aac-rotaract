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

  

  // Initialize user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      
      setUser(JSON.parse(storedUser)); // Set user from localStorage if available
    } 
  }, []);

  // update user data
  const updateUserData = (field, value) => {
    
    setUser((prevData)=>({
      ...prevData, 
      [field] : value
    }));

    
  }

  // Login function
  const adminlogin = async (logindata) => {
   
    try {
      const res = await adminLogin(logindata);
     

      const userData = {
        user_type: "admin", // Adjust user_type as per response if needed
        user_data: res.data,
      };
    
      setUser(userData); // Set user state with the response data
      localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
     
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed. Please try again.");
      throw err;
    }
  };

  const studentlogin = async (logindata) => {
   
    try {
      const res = await studentLogin(logindata);
    

      const userData = {
        user_type: "student", // Adjust user_type as per response if needed
        user_data: res.student_data,
      };
    
      setUser(userData); // Set user state with the response data
      localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
   
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed. Please try again.");
      throw err;
    }
  };

  // Logout function
  const logout = () => {
 
    setUser({
      user_data: null,
      user_type: null,
    });
    localStorage.removeItem("user"); // Clear the user from localStorage
   
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
