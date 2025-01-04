import React, { useState } from "react";
import { registerStudent } from "../../api/api_services";
import { useScreenContext } from "../contexts/ScreenContext";
import { useDataContext } from "../contexts/MainDataContext";
import SearchableDropdown from "./SearchableDropDown";

export default function StudentRegistration() {
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const [invalidFields, setInvalidFields] = useState([]);

  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    email: "",
    gender: "",
    dept: "",
    startYear: "",
    endYear: "",
    mobileNo: "",
  });

  const { isMobile, isMidScreen, isTablet, isDesktop } = useScreenContext();
  const { startYearOptions, endYearOptions, deptOptions } = useDataContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let invalid = [];

    // Validate fields for exact match from options
    if (!deptOptions.includes(formData.dept)) {
      invalid.push("dept");
    }
    if (!startYearOptions.includes(formData.startYear)) {
      invalid.push("startYear");
    }
    if (!endYearOptions.includes(formData.endYear)) {
      invalid.push("endYear");
    }
    if (!["Male", "Female", "Other"].includes(formData.gender)) {
      invalid.push("gender");
    }

    return invalid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const invalid = validateForm();
    setInvalidFields(invalid); // Set invalid fields

    if (invalid.length > 0) {
      return; // Don't proceed with submission if there are invalid fields
    }

    console.log(formData);
    setLoading(true);

    try {
      const res = await registerStudent(formData);

      console.log("Response from API:", res);
      resetFormData();
      alert(res);
    } catch (err) {
      console.error("Error during submission:", err);
      alert("Error: " + err);
    }
    setLoading(false);
  };

  function resetFormData() {
    setFormData({
      roll_no: "",
      name: "",
      email: "",
      gender: "",
      dept: "",
      startYear: "",
      endYear: "",
      mobileNo: "",
    });
  }

  // Reusable class for input and select fields
  const inputClass =
    "px-4 py-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-800";

  return (
    <div className="relative px-12 sm:px-6 flex justify-center items-center w-full text-sm md:text-base h-fit">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-3/4 md:w-1/2 my-8 flex flex-col gap-6 border border-gray-300 px-8 py-6 rounded-lg"
      >
        <h1 className="text-gray-900 py-2 text-center font-semibold text-base md:text-lg">
          Student Registration Form
        </h1>
        {[
          {
            label: "Roll Number",
            name: "roll_no",
            type: "text",
            placeholder: "Enter your roll number",
          },
          {
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter your name",
          },
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Enter your email",
          },
          {
            label: "Mobile Number",
            name: "mobileNo",
            type: "text",
            placeholder: "Enter your mobile number",
          },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block pb-3">
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              className={` ${inputClass} border-gray-300`}
              // placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {[
          {
            label: "Gender",
            name: "gender",
            options: ["Select Gender", "Male", "Female", "Other"],
          },
          {
            label: "Department",
            name: "dept",
            options: ["Select Department", ...deptOptions],
          },
          {
            label: "Start Year",
            name: "startYear",
            options: ["Select Start Year", ...startYearOptions],
          },
          {
            label: "End Year",
            name: "endYear",
            options: ["Select End Year", ...endYearOptions],
          },
        ].map(({ label, name, options }) => (
          <div key={name}>
            <label htmlFor={name} className="block pb-3">
              {label}
            </label>

            <SearchableDropdown
              options={options}
              intialValue={formData[name]}
              onChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  [name]: value,
                }))
              }
              regFormStyles={`${inputClass} ${
                invalidFields.includes(name)
                  ? "border-red-500"
                  : " border-gray-300"
              }`}
              required
            />
            {invalidFields.includes(name) && (
              <span className="text-red-500 text-xs">
                Please select a valid {label}.
              </span>
            )}
          </div>
        ))}

        <div className="flex justify-center sm:justify-end w-full">
          <button
            type="submit"
            className="font-semibold w-full sm:w-1/2 md:w-1/4 bg-green-800 text-green-800 text-white mt-2 px-4 py-3 rounded-lg hover:bg-green-900 mb-6"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Debug Info
       <div className="mt-4">
        <h3 className="font-bold">Form Data:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div> */}
    </div>
  );
}
