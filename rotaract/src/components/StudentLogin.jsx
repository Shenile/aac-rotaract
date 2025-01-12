import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useDataContext } from "../contexts/MainDataContext";

export default function StudentLogin() {
  const { studentlogin } = useAuthContext();
  const [formdata, setFormData] = useState({
    roll_no: "",
    password: "",
  });
  const navigate = useNavigate();
  const { loading, setLoading } = useDataContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentlogin(formdata);
      navigate("/student-profile");
    } catch (err) {
      alert("ERROR : ", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, // Corrected to set the value directly
    }));
  };

  return (
    <div className="flex justify-center items-center w-full  pt-8 md:py-4 md:pt-0 h-fit md:h-[510px]">
      <form onSubmit={handleSubmit}>
        {" "}
        {/* Use handleSubmit for form submission */}
        <div className="flex flex-col gap-2 p-6 md:p-8 md:py-8 border border-gray-300 rounded-lg shadow-lg">
          <h1 className="pb-6 text-center font-semibold text-base md:text-lg">
            Student Login
          </h1>
          <div className="text-sm md:text-base">
            <label htmlFor="roll_no" className="block py-2">
              Roll No
            </label>
            <input
              type="text"
              name="roll_no"
              id="roll_no"
              value={formdata.roll_no}
              onChange={handleChange} // Use handleChange for both inputs
              className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="text-sm md:text-base">
            <label htmlFor="password" className="block py-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formdata.password}
              onChange={handleChange} // Use handleChange for both inputs
              className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            className="text-sm md:text-base px-4 py-3 mt-4 mb-2 text-gray-100 font-semibold bg-green-800 hover:bg-green-900 rounded-lg"
          >
            Login
          </button>

          {/* <div className="text-xs md:text-sm">
            <p className="inline mr-2">Haven't registered yet ?</p>
            <Link
              to={"/student-registration"}
              className="text-green-800 hover:text-green-900 hover:underline"
            >
              Register
            </Link>
          </div> */}
        </div>
      </form>
    </div>
  );
}
