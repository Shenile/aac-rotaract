import React, { useState, useEffect } from "react";
import { getStudentRecord, updateStudentRecord } from "../../api/api_services"; // Assuming a function for updating the profile in your API
import SearchableDropdown from "./SearchableDropDown";
import { useDataContext } from "../contexts/MainDataContext";
import { Edit2, Save, X } from "lucide-react";
import { usePopUp } from "../contexts/PopUpContext";
import { useAuthContext } from "../contexts/AuthContext";

export default function StudentProfile({ studentData }) {
  const [student, setStudent] = useState(null);
  const { showPopUp } = usePopUp();
  const { capitalize } = useDataContext();

  const [formData, setFormData] = useState({
    id: student?.id || "",
    roll_no: student?.roll_no || "",
    name: student?.name || "",
    email: student?.email || "",
    gender: student?.gender || "",
    dept: student?.dept || "",
    startYear: student?.startYear || "",
    endYear: student?.endYear || "",
    mobileNo: student?.mobileNo || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const { deptOptions, startYearOptions, endYearOptions, loading, setLoading } =
    useDataContext();

  const fetchStudentData = async () => {
    console.log("fetchStudentData called");
    setLoading(true);
    console.log("Loading state set to true");
    console.log("student : ", studentData);

    try {
      console.log(`Fetching student record for ID: ${studentData.id}`);
      const res = await getStudentRecord(studentData.id);
      console.log("Student record fetched successfully:", res);
      setStudent(res);
      console.log("Student data updated:", res);
    } catch (err) {
      console.error("Error fetching student record:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  useEffect(() => {
    if (studentData && studentData.id) {
      fetchStudentData();
    }
  }, [studentData]);

  useEffect(() => {
    if (student) {
      setFormData({
        id: student.id || "",
        roll_no: student.roll_no || "",
        name: student.name || "",
        email: student.email || "",
        gender: student.gender || "",
        dept: student.dept || "",
        startYear: student.startYear || "",
        endYear: student.endYear || "",
        mobileNo: student.mobileNo || "",
      });
    }
  }, [student]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let invalid = [];

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

  const startEditing = () => {
    setFormData(student);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData(student);
    setIsEditing(false);
    setInvalidFields([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalid = validateForm();
    setInvalidFields(invalid);

    if (invalid.length > 0) return;

    setLoading(true);
    try {
      const res = await updateStudentRecord(formData);
      console.log("respose:", res);
      showPopUp("Profile updated successfully", "success");
      setIsEditing(false);
      await fetchStudentData();
    } catch (err) {
      console.error("Error during update:", err);
      alert("Error: " + err);
    }finally{
      setLoading(false);
      setFormData(student);
    }
    
  };

  return student ? (
    <div className="flex justify-center items-center bg-white p-6">
      <div className="bg-white  rounded-lg max-w-4xl w-full">
        {/* Profile Header */}
        <div className="relative flex items-center p-6 bg-green-800 rounded-lg">
          <div className="flex-shrink-0">
            <img
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white"
              src={`${
                formData.gender.toLowerCase() === "female"
                  ? "/student_profile_female.png"
                  : "/student_profile_male.png"
              }`}
              alt="avatar"
            />
          </div>
          <div className="ml-6 text-white">
            <h2 className="text-base md:text-2xl font-semibold">
              {capitalize(student.name)}
            </h2>
            <p className="text-sm mt-1">{student.dept || "Department"}</p>
            <p className="text-sm mt-1">Batch : {student.startYear}</p>
          </div>

          <div className="absolute right-4 top-4 rounded-full z-50">
            {isEditing ? (
              <div className="flex gap-2">
                <div className="group hover:bg-white p-2 rounded-full">
                  <Save
                    size={20}
                    className="text-white group-hover:text-green-800 font-semibold"
                    onClick={handleSubmit}
                  />
                </div>

                <div className="group hover:bg-white p-2 rounded-full">
                  <X
                    size={20}
                    className="text-white group-hover:text-green-800 font-semibold"
                    onClick={cancelEditing}
                  />
                </div>
              </div>
            ) : (
              <div className="group hover:bg-white p-2 rounded-full">
                <Edit2
                  size={20}
                  className="text-white group-hover:text-green-800 font-semibold"
                  onClick={startEditing}
                />
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <div className="flex flex-col justify-start gap-2">
                  <label className="font-medium text-gray-900" htmlFor="email">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={` text-gray-600 w-full ${
                      isEditing
                        ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                        : "border-none"
                    } ${
                      invalidFields.includes("name") ? "border-red-500" : ""
                    } rounded-lg`}
                  />
                </div>
                <div className="flex flex-col justify-start gap-2">
                  <label className="font-medium text-gray-900" htmlFor="email">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={` text-gray-600 w-full ${
                      isEditing
                        ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                        : "border-none"
                    } ${
                      invalidFields.includes("email") ? "border-red-500" : ""
                    } rounded-lg`}
                  />
                </div>
                <div className="flex flex-col justify-start gap-2">
                  <label
                    className="font-medium text-gray-900"
                    htmlFor="mobileNo"
                  >
                    Mobile:
                  </label>
                  <input
                    type="text"
                    id="mobileNo"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`text-gray-600 w-full ${
                      isEditing
                        ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                        : "border-none"
                    } ${
                      invalidFields.includes("mobileNo") ? "border-red-500" : ""
                    } rounded-lg`}
                  />
                </div>
                <div className="flex flex-col justify-start gap-2">
                  <label className="font-medium text-gray-900" htmlFor="gender">
                    Gender:
                  </label>
                  {isEditing ? (
                    <SearchableDropdown
                      options={["Male", "Female", "Other"]}
                      intialValue={formData.gender}
                      regFormStyles={`text-gray-600 w-full ${
                        isEditing
                          ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                          : "border-none"
                      } ${
                        invalidFields.includes("gender") ? "border-red-500" : ""
                      } rounded-lg`}
                      onChange={(value) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          ["gender"]: value,
                        }))
                      }
                      required
                    />
                  ) : (
                    <p className="text-gray-600">{formData.gender}</p>
                  )}

                  {console.log(formData.gender)}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Academic Information
                </h3>
                <div className="flex flex-col justify-start gap-2">
                  <label className="font-medium text-gray-900" htmlFor="email">
                    Roll No:
                  </label>
                  <input
                    type="text"
                    id="roll_no"
                    name="roll_no"
                    value={formData.roll_no}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={` text-gray-600 w-full ${
                      isEditing
                        ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                        : "border-none"
                    } ${
                      invalidFields.includes("roll_no") ? "border-red-500" : ""
                    } rounded-lg`}
                  />
                </div>

                <div className="flex flex-col justify-start gap-2">
                  <label className="font-medium text-gray-900" htmlFor="dept">
                    Department:
                  </label>
                  {isEditing ? (
                    <SearchableDropdown
                      options={deptOptions}
                      intialValue={formData.dept}
                      regFormStyles={`text-gray-600 w-full ${
                        isEditing
                          ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                          : "border-none"
                      } ${
                        invalidFields.includes("dept") ? "border-red-500" : ""
                      } rounded-lg`}
                      onChange={(value) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          ["dept"]: value,
                        }))
                      }
                      required
                    />
                  ) : (
                    <p className="text-gray-600 ">{formData.dept}</p>
                  )}
                </div>

                <div className="flex flex-col justify-start gap-2">
                  <label
                    className="font-medium text-gray-900"
                    htmlFor="startYear"
                  >
                    Start Year:
                  </label>

                  {isEditing ? (
                    <SearchableDropdown
                      options={startYearOptions}
                      intialValue={formData.startYear}
                      regFormStyles={`text-gray-700 w-full ${
                        isEditing
                          ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                          : "border-none"
                      } ${
                        invalidFields.includes("startYear")
                          ? "border-red-500"
                          : ""
                      } rounded-lg`}
                      onChange={(value) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          ["startYear"]: value,
                        }))
                      }
                      required
                    />
                  ) : (
                    <p className="text-gray-600"> {formData.startYear}</p>
                  )}
                </div>

                <div className="flex flex-col justify-start gap-2">
                  <label
                    className="font-medium text-gray-900"
                    htmlFor="endYear"
                  >
                    End Year:
                  </label>
                  {isEditing ? (
                    <SearchableDropdown
                      options={endYearOptions}
                      intialValue={formData.endYear}
                      regFormStyles={`text-gray-700 w-full ${
                        isEditing
                          ? "px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-green-700"
                          : "border-none"
                      } ${
                        invalidFields.includes("endYear")
                          ? "border-red-500"
                          : ""
                      } rounded-lg`}
                      onChange={(value) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          ["endYear"]: value,
                        }))
                      }
                      required
                    />
                  ) : (
                    <p className="text-gray-600">{formData.endYear}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center pt-8">
      <div className="w-[800px] h-[450px] bg-gray-300 rounded-lg animate-pulse flex justify-center items-center"></div>
    </div>
  );
}
