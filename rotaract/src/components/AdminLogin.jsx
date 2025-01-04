import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function AdminLogin() {
  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
  });
  const { adminlogin } = useAuthContext();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await adminlogin(loginData); 
      navigate('/records')
      
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center pt-6 md:pt-12 w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border border-gray-300 p-8 md:p-12 rounded-md bg-white shadow-lg"
      >
        <h1 className="font-semibold text-center mb-6 text-base md:text-lg">
          Admin Login
        </h1>

        <label htmlFor="name" className="py-2 text-sm md:text-base">
          Username
        </label>
        <input
          id="name"
          name="name" // Matches the `name` property in loginData
          type="text"
          value={loginData.name}
          onChange={handleOnChange}
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-600"
          required
        />

        <label htmlFor="password" className="py-2 text-sm md:text-base">
          Password
        </label>
        <input
          id="password"
          name="password" // Matches the `password` property in loginData
          type="password"
          value={loginData.password}
          onChange={handleOnChange}
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-600"
          required
        />

        <button
          type="submit"
          className="mt-6 px-4 py-3 bg-green-800 hover:bg-green-900 text-white rounded-md font-semibold text-sm md:text-base"
        >
          Login
        </button>
      </form>
    </div>
  );
}
