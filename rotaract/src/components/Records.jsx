import React, { useState, useEffect, useRef } from "react";
import {
  SlidersHorizontal,
  Search,
  RotateCw,
  X,
  Printer,
  BookOpen,
  Pen,
  UserPlus2,
  LucideFileUp,
  Trash2,
  Filter,
} from "lucide-react";

import { useScreenContext } from "../contexts/ScreenContext";
import {
  deleteAllStudents,
  deleteStudentRecord,
  getStudentRecords,
  registerStudent,
  updateStudentRecord,
} from "../../api/api_services";
import { useDataContext } from "../contexts/MainDataContext";
import FileUpload from "./FileUpload";
import { usePopUp } from "../contexts/PopUpContext";
import { getValidationErrors } from "../validation";
import BottomToolBar from "./BottomToolBar";
import StudentCards from "./StudentCards";
import { set, start } from "nprogress";
import StudentModal from "./StudentModal";
import { generateDocument } from "../../api/api_services";
import UploadType from "./UploadType";
import useClickOutside from "../hooks/useClickOutside";

const filterDataBySearch = (data, query) => {
  if (!query) return data;
  return data.filter((data) => {
    return Object.values(data)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
  });
};

const Headers = [
  "RollNo",
  "Name",
  "Email",
  "Gender",
  "Department",
  "Start Year",
  "End Year",
  "Mobile.No",
];

function DeleteAllConfirmationModel({ deleteAll, setDeleteAllModel }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex justify-center items-center z-40">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-bold text-yellow-600">⚠️ Warning</h2>
        <p className="mt-4 text-gray-800">
          You are about to delete{" "}
          <span className="font-semibold">all records</span> from the database.
          This action is{" "}
          <span className="text-red-600 font-semibold">irreversible</span>, and
          all data will be permanently lost.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Please confirm to proceed or cancel to abort.
        </p>

        <div className="mt-8 flex justify-end space-x-4 text-sm">
          <button
            onClick={() => setDeleteAllModel(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={deleteAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete All Records
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Records() {
  const [headers, setHeaders] = useState(Headers);
  const { isMobile, isDesktop, isMidScreen, isTablet } = useScreenContext();
  const [studentData, setStudentsData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef();
  const [readMode, setReadMode] = useState(true);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const {
    deptOptions,
    startYearOptions,
    endYearOptions,
    loading,
    setLoading,
    scrollToTop,
  } = useDataContext();
  const [createNewRecord, setCreateNewRecord] = useState(false);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [deleteAllModel, setDeleteAllModel] = useState(true);
  const { showPopUp } = usePopUp();
  const [validationErrors, setValidationErrors] = useState({});
  const [openCreateModal, setCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    gender: "",
    dept: "",
    batch: "",
    sortBy: "",
  });

  // Fetch student records
  const fetchStudentsData = async () => {
    await cleanUp();
    setLoading(true);
    try {
      const data = await getStudentRecords();
      setStudentsData(data);
      setDisplayData(data);
    } catch (err) {
      alert("Error fetching student data: " + err);
    } finally {
      setLoading(false);
    }
  };

  // clean up's when page reloads
  const cleanUp = () => {
    setCreateNewRecord(false);
    setEditingRowIndex(null);
    setEditedData(null);
    setValidationErrors({});
    setOpenFileModal(false);
    setDeleteAllModel(false);
    setCreateModal(false);
  };

  // Trigger data fetch when component mounts
  useEffect(() => {
    fetchStudentsData();
    setHeaders(Headers);
    cleanUp();
  }, []);

  useEffect(() => {
    if (readMode) cancelEdit();
    if (!createNewRecord) setEditingRowIndex(null);
  }, [readMode, createNewRecord]);

  useEffect(() => {
    if (readMode) {
      cancelEdit();
    }

    if (!createNewRecord) {
      setEditingRowIndex(null);
    }
  }, [readMode, createNewRecord]);

  // Adjust headers based on screen size
  // useEffect(() => {
  //   if (isMobile) {
  //     setHeaders(["user"]);
  //   } else if (isMidScreen) {
  //     setHeaders(["User", "Role", ""]);
  //   } else if (isTablet) {
  //     setHeaders(["User", "Role", "Status", ""]);
  //   } else if (isDesktop) {
  //     setHeaders([
  //       "RollNo",
  //       "Name",
  //       "Email",
  //       "Gender",
  //       "Department",
  //       "Batch",
  //       "Mobile.No",
  //     ]);
  //   }

  // }, [
  //   isMobile,
  //   isTablet,
  //   isDesktop,
  //   isMidScreen,

  // ]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filteredData = filterDataBySearch(studentData, query);
    setDisplayData(filteredData);
  };

  // Handle column sorting
  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);
    const sortedData = sortStudentsByColumn(displayData, column, order);
    setDisplayData(sortedData);
  };

  const handlePrint = async (file_type) => {
    if (!displayData) {
      console.warn("⚠️ No data available to generate the document.");
      return;
    }

    const data = {
      dataset: displayData,
      filters: filters,
      file_type: file_type,
    };

    console.log("📤 Sending request to generate document with:", data);

    try {
      const response = await generateDocument(data);

      // ✅ Use response.headers instead of response.ok
      const contentType = response.headers["content-type"];
      console.log("📥 Response Content-Type:", contentType);

      let fileExtension = "";
      if (contentType.includes("pdf")) {
        fileExtension = ".pdf";
      } else if (contentType.includes("spreadsheet")) {
        fileExtension = ".xlsx";
      } else {
        console.error("❌ Unsupported file type received:", contentType);
        throw new Error("Unsupported file type received.");
      }

      // ✅ No need for `.blob()`, axios already provides response.data as Blob
      const blob = response.data;
      console.log("🔍 Blob received:", blob);

      const fileName = `Rotaract_Students${fileExtension}`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      document.body.appendChild(link);
      console.log(`📂 Initiating download: ${fileName}`);

      link.click();
      document.body.removeChild(link);
      console.log("✅ Download completed and cleanup done.");
    } catch (err) {
      console.error("🚨 Error generating document:", err);
    }

    
  };

  const startEdit = async (index, student) => {
    await cleanUp();
    setEditingRowIndex(index);
    setEditedData(student);
  };

  const cancelEdit = async () => {
    await cleanUp();
  };

  const saveRow = async () => {
    const errors = await getValidationErrors(
      editedData,
      deptOptions,
      startYearOptions,
      endYearOptions
    );
    console.log("founded errors : ", errors);
    if (errors) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      setLoading(true);
      try {
        if (editedData) {
          const res = await updateStudentRecord(editedData);
          cancelEdit();
          fetchStudentsData();
          console.log("response ", res);
        }
      } catch (err) {
        console.error("error : something wrong happened", err);
      } finally {
        setLoading(false);
        cleanUp();
      }
    }
  };

  const deleteRow = async (id) => {
    setLoading(true);
    try {
      const res = await deleteStudentRecord(id);
      fetchStudentsData();
      showPopUp("deleted successfully", "success");
    } catch (err) {
      alert("err :", err);
    } finally {
      setLoading(false);
      cleanUp();
    }
  };

  // adding a student
  const addNewData = () => {
    scrollToTop();
    if (editingRowIndex !== null || createNewRecord) {
      alert("Complete or cancel current action before adding a new record.");
      return;
    }
    setCreateNewRecord(true);
    const emptyRecord = {
      roll_no: "",
      name: "",
      email: "",
      gender: "",
      dept: "",
      startYear: "",
      endYear: "",
      mobileNo: "",
    };
    setDisplayData((prev) => [emptyRecord, ...prev]);
    setEditingRowIndex(0);
    setEditedData(emptyRecord);
  };

  const startCreate = () => {
    scrollToTop();
    if (editingRowIndex !== null || openCreateModal) {
      alert("Complete or cancel current action before adding a new record.");
      return;
    }
    setCreateModal(true);
    const emptyRecord = {
      roll_no: "",
      name: "",
      email: "",
      gender: "",
      dept: "",
      startYear: "",
      endYear: "",
      mobileNo: "",
    };
    setEditedData(emptyRecord);
  };

  const createStudent = () => {};

  const handleAddData = async () => {
    if (!editedData || Object.values(editedData).some((val) => val === "")) {
      console.log(editedData);
      alert("All fields must be filled before saving.");
      return;
    }

    const errors = await getValidationErrors(
      editedData,
      deptOptions,
      startYearOptions,
      endYearOptions
    );

    if (errors) {
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
      setLoading(true);
      try {
        await registerStudent(editedData);
        await fetchStudentsData();
        cancelEdit();
        setCreateNewRecord(false);
        showPopUp("Student record created successfully", "success");
      } catch (err) {
        alert("Error adding new record: " + err.errors);
      } finally {
        setLoading(false);
        cleanUp();
      }
    }
  };

  const updateField = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value, // Update the specific field
    }));
  };

  // deleting all records
  const deleteAll = async () => {
    setLoading(true);
    try {
      const res = await deleteAllStudents();
      await fetchStudentsData();
      showPopUp("Deleted Successfully", "success");
    } catch (err) {
      showPopUp(`Error : ${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderRow = (student, idx) => {
    const isEditing = idx === editingRowIndex;
    const commonDropdownProps = (key, options, intialValue) => ({
      options,
      intialValue: intialValue,
      onChange: (value) =>
        setEditedData((prev) => ({
          ...prev,
          [key]:
            key === "startYear" || key === "endYear"
              ? parseInt(value, 10) || ""
              : value,
        })),
    });

    // OLD WORKING CODE
    // const renderCellContent = (key, value) => {
    //   switch (key) {
    //     case "gender":
    //       return (
    //         <SearchableDropdown
    //           {...commonDropdownProps(key, ["Male", "Female", "Other"], value)}
    //         />
    //       );
    //     case "dept":
    //       return (
    //         <SearchableDropdown
    //           {...commonDropdownProps(key, deptOptions, value)}
    //         />
    //       );
    //     case "startYear":
    //       return (
    //         <SearchableDropdown
    //           {...commonDropdownProps(key, startYearOptions, value)}
    //         />
    //       );
    //     case "endYear":
    //       return (
    //         <SearchableDropdown
    //           {...commonDropdownProps(key, endYearOptions, value)}
    //         />
    //       );
    //     default:
    //       return (
    //         <input
    //           type="text"
    //           value={editedData[key] !== undefined ? editedData[key] : value}
    //           onChange={(e) =>
    //             setEditedData((prev) => ({
    //               ...prev,
    //               [key]: e.target.value,
    //             }))
    //           }
    //           className="border focus:border-2 focus:outline-none focus:border-green-700 rounded p-1 w-full"
    //         />
    //       );
    //   }
    // };

    // const renderCellContent = (key, value) => {
    //   const error = validationErrors[key] || "";

    //   const isDropdown = ["gender", "dept", "startYear", "endYear"].includes(
    //     key
    //   );

    //   if (isDropdown) {
    //     const options =
    //       key === "gender"
    //         ? ["Male", "Female", "Other"]
    //         : key === "dept"
    //         ? deptOptions
    //         : key === "startYear"
    //         ? startYearOptions
    //         : endYearOptions;

    //     return (
    //       <div>
    //         <SearchableDropdown {...commonDropdownProps(key, options, value)} />
    //         {error && (
    //           <p className="text-red-500 text-xs mt-1 font-light">{error}</p>
    //         )}
    //       </div>
    //     );
    //   }

    //   return (
    //     <div>
    //       <input
    //         type="text"
    //         value={editedData[key] !== undefined ? editedData[key] : value}
    //         onChange={(e) =>
    //           setEditedData((prev) => ({
    //             ...prev,
    //             [key]: e.target.value,
    //           }))
    //         }
    //         className="border focus:border-2 focus:outline-none focus:border-green-700 rounded p-1 w-full "
    //       />
    //       {error && (
    //         <p className="text-red-500 text-xs mt-1 font-light">{error}</p>
    //       )}
    //     </div>
    //   );
    // };

    // OLD WORKING CODE
    // const renderCell = (key, value) => {
    //   if (key === "id") return null; // Skip rendering for specific keys
    //   if (isEditing) {
    //     return (
    //       <td
    //         key={`${student.roll_no}-${key}`}
    //         className="p-2 px-4 text-gray-800"
    //       >
    //         {renderCellContent(key, value)}
    //       </td>
    //     );
    //   }
    //   return (
    //     <td
    //       key={`${student.roll_no}-${key}`}
    //       className="p-2 px-4 text-gray-800"
    //     >
    //       {value}
    //     </td>
    //   );
    // };

    const renderCell = (key, value) => {
      if (key === "id") return null; // Skip rendering for specific keys
      // if (isEditing) {
      //   return (
      //     <td
      //       key={`${student.roll_no}-${key}`}
      //       className="p-2 px-4 text-gray-800 h-fit "
      //     >
      //       {renderCellContent(key, value)}
      //     </td>
      //   );
      // }
      return (
        <td
          key={`${student.roll_no}-${key}`}
          className="p-2 px-4 text-gray-800"
        >
          {value}
        </td>
      );
    };

    const renderActionButtons = () => {
      if (isEditing && createNewRecord) {
        return (
          <>
            <button
              type="button"
              className="pr-3 text-green-500"
              onClick={() => handleAddData(editedData)}
              disabled={loading}
            >
              Add
            </button>
            <button
              type="button"
              className="text-gray-500"
              onClick={() => {
                setDisplayData((prevData) => prevData.slice(1));
                setCreateNewRecord(false);
                cancelEdit();
              }}
              disabled={loading}
            >
              Discard
            </button>
          </>
        );
      }
      if (isEditing && !createNewRecord) {
        return (
          <>
            <button
              type="button"
              className="pr-3 text-green-700"
              onClick={() => saveRow(idx)}
              disabled={loading}
            >
              Save
            </button>
            <button
              type="button"
              className="text-gray-700"
              onClick={() => cancelEdit()}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        );
      }

      return (
        <>
          <button
            type="button"
            className="px-3 py-1 my-2 bg-blue-300 bg-opacity-25 text-blue-500 rounded-full
            hover:bg-blue-500 hover:text-white "
            onClick={() => startEdit(idx, student)}
            disabled={loading}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-red-70 px-3 py-1 my-2 bg-red-300 bg-opacity-25 text-red-500 rounded-full
            hover:bg-red-500 hover:text-white "
            onClick={() => deleteRow(student.id)}
            disabled={loading}
          >
            Delete
          </button>
        </>
      );
    };

    return (
      <tr
        key={student.roll_no}
        className={`hover:bg-gray-100 hover:border hover:border-gray-300 hover:shadow-md
      ${isEditing && "border border-gray-300 bg-gray-100 shadow-md"}`}
      >
        {Object.entries(student).map(([key, value]) => renderCell(key, value))}
        {!readMode && (
          <td className="print:hidden pr-4">
            <div className="flex gap-2">{renderActionButtons()}</div>
          </td>
        )}
      </tr>
    );
  };

  return (
    <div>
      <div className="relative">
        <RecordTableNavBar
          filters={filters}
          setFilters={setFilters}
          startCreate={startCreate}
          setCreateModal={setCreateModal}
          handleSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          setDisplayData={setDisplayData}
          studentData={studentData}
          displayData={displayData}
          fetchStudentsData={fetchStudentsData}
          handlePrint={handlePrint}
          readMode={readMode}
          setReadMode={setReadMode}
          loading={loading}
          addNewData={addNewData}
          setOpenFileModal={setOpenFileModal}
          openFileModal={openFileModal}
          deleteAllModel={deleteAllModel}
          setDeleteAllModel={setDeleteAllModel}
        />

        <RecordsTable
          headers={headers}
          displayData={displayData}
          renderRow={renderRow}
          handleSort={handleSort}
          tableRef={tableRef}
          loading={loading}
        />
      </div>
      {openFileModal && (
        <FileUpload
          openFileModal={openFileModal}
          setOpenFileModal={setOpenFileModal}
          fetchStudentsData={fetchStudentsData}
        />
      )}

      {deleteAllModel && (
        <DeleteAllConfirmationModel
          deleteAll={deleteAll}
          setDeleteAllModel={setDeleteAllModel}
        />
      )}

      <StudentCards
        displayData={displayData}
        readMode={readMode}
        openCreateModal={openCreateModal}
        setCreateModal={setCreateModal}
        actions={{
          saveRow: saveRow,
          deleteRow: deleteRow,
          startEdit: startEdit,
          setEditedData: setEditedData,
          cancelEdit: cancelEdit,
          editingRowIndex: editingRowIndex,
          updateField: updateField,
          editedData: editedData,
          filterDataBySearch: filterDataBySearch,
          handleAddData: handleAddData,
        }}
      />

      {openCreateModal && (
        <StudentModal
          mode="create"
          studentData={{}}
          actions={{
            updateField: updateField,
            cancelEdit: cancelEdit,
            editedData: editedData,
            createRow: handleAddData,
          }}
        />
      )}

      {editingRowIndex !== null && editedData && (
        <StudentModal
          mode="edit"
          studentData={displayData[editingRowIndex]}
          actions={{
            updateField: updateField,
            cancelEdit: cancelEdit,
            editedData: editedData,
            saveRow: saveRow,
          }}
        />
      )}
    </div>
  );
}

function RecordTableNavBar({
  searchQuery,
  handleSearchChange,
  setDisplayData,
  studentData,
  fetchStudentsData,
  handlePrint,
  displayData,
  readMode,
  setReadMode,
  loading,
  addNewData,
  setOpenFileModal,
  openFileModal,
  setDeleteAllModel,
  deleteAllModel,
  setCreateModal,
  startCreate,
  setFilters,
  filters,
}) {
  const [openToolBar, setToolBar] = useState(false);
  const toolBarRef = useRef(null);
  const toolBarToggleRef = useRef(null);
  const [sortBy, setSortBy] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const { startYearOptions, deptOptions } = useDataContext();
  const sortByOptions = ["name", "roll_no", "email", "dept", "batch"];
  const [recordsCount, setRecordsCount] = useState(null);
  const [openBtmToolBar, setBtmToolBar] = useState(false);
  const [genModal, setGenModal] = useState(false);
  const genModalRef = useRef(null);

  useClickOutside(genModalRef, () => setGenModal(false));

  const handleClickOutside = (event) => {
    // Check if click is outside the toolbar and the toggle button
    if (
      toolBarRef.current &&
      !toolBarRef.current.contains(event.target) &&
      toolBarToggleRef.current &&
      !toolBarToggleRef.current.contains(event.target)
    ) {
      setToolBar(false); // Close the toolbar if clicked outside
    }
  };

  useEffect(() => {
    setRecordsCount(displayData?.length || 0);
  }, [displayData]);

  useEffect(() => {
    if (displayData) {
      setRecordsCount(displayData.length);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const applyFilters = () => {
    if (!selectedGender && !selectedBatch && !selectedDept && !sortBy) {
      setDisplayData(studentData);
      return;
    }

    // Apply filters for gender, batch, and department
    let filteredData = studentData.filter((data) => {
      return (
        (selectedGender ? data.gender === selectedGender : true) &&
        (selectedBatch ? data.startYear === Number(selectedBatch) : true) &&
        (selectedDept ? data.dept === selectedDept : true)
      );
    });

    // Apply sorting
    if (sortBy) {
      filteredData = filteredData.sort((a, b) => {
        const key = sortBy.toLowerCase() === "batch" ? "startYear" : sortBy;

        // Extract values for sorting
        const aValue = a[key] || ""; // Fallback to empty string if key is missing
        const bValue = b[key] || "";

        // Numerical comparison for batch/startYear
        if (key === "startYear" || key === "roll_no") {
          return Number(aValue) - Number(bValue);
        }

        // String comparison for other fields
        const aStr = aValue.toString().toLowerCase();
        const bStr = bValue.toString().toLowerCase();

        if (aStr < bStr) return -1;
        if (aStr > bStr) return 1;
        return 0;
      });
    }

    // Update display data
    setDisplayData(filteredData);

    // Updating the records count
    setRecordsCount(filteredData.length);
  };

  const removeFilter = (val) => {
    if (val === selectedBatch) {
      setSelectedBatch("");
    } else if (val === selectedDept) {
      setSelectedDept("");
    } else {
      setSelectedGender("");
    }
  };

  useEffect(() => {
    // Set filter values, defaulting to "None" if not selected
    setFilters({
      gender: selectedGender || "",
      dept: selectedDept || "",
      batch: selectedBatch || "",
      sortBy: sortBy || "",
    });

    // Apply filters after updating the state
    applyFilters();
  }, [selectedGender, selectedDept, selectedBatch, sortBy]);

  const clearFilters = () => {
    setSelectedGender("");
    setSelectedDept("");
    setSelectedBatch("");
    setDisplayData(studentData);
  };

  const getFilterStyles = (isSelectedElement) => {
    const filterStyles = isSelectedElement
      ? "text-blue-600 font-semibold transition-all hover:-translate-y-0.5 ease-in hover:font-semibold"
      : "text-gray-600 hover:text-gray-800 transition-all hover:font-semibold hover:-translate-y-0.5 ease-in";

    return filterStyles;
  };

  return (
    <div>
      <div className="hidden md:flex sticky text-sm  top-0 bg-white justify-center gap-4 md:justify-between items-start h-fit p-4 w-full">
        {/* REFRESH AND RECORDS COUNT */}
        <div className="h-fit flex gap-1 items-center">
          <button
            onClick={() => {
              fetchStudentsData();
            }}
            className="p-2 hover:bg-gray-300 rounded-full"
          >
            <RotateCw size={20} className="text-gray-700 " />
          </button>

          <p className="text-gray-900 font-semibold">
            <span className="text-gray-700 font-normal">total : </span>
            {recordsCount !== null && `${recordsCount}`}
          </p>
        </div>
        {/* ---------------------------------------------- */}

        {/* SEARCH AND FILTER BAR */}
        <div className="w-1/2 md:flex flex-col gap-2 ">
          <div className="relative flex items-center group w-92">
            {/* Search Icon */}
            <Search
              className="absolute left-3 text-gray-400 group-focus-within:text-blue-500"
              size={20}
            />

            {/* Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="search records..."
              disabled={loading}
              className="w-full pl-10 pr-12 py-2 border border-gray-400 rounded-full bg-gray-100 focus:border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            <button
              ref={toolBarToggleRef}
              onClick={() => setToolBar(!openToolBar)}
              disabled={loading}
              className="hidden md:block absolute right-3 top-1/2 transform -translate-y-1/2 "
            >
              {/* Filter Icon */}
              <SlidersHorizontal
                size={20}
                className={` ${
                  openToolBar ? "text-blue-500" : "text-gray-400"
                } hover:text-blue-500 cursor-pointer`}
              />
            </button>

            {/* FILTER OPTIONS : component */}
            {openToolBar && (
              <div
                ref={toolBarRef}
                className="absolute top-12 w-full bg-gray-100 border border-gray-400 p-4 rounded-lg"
              >
                <div className="w-full flex justify-start gap-8 items-start">
                  {/* Sort By Filter*/}
                  <div className="mb-4 flex flex-col items-start gap-1">
                    <p className="font-semibold text-gray-900 mb-1">Sort By</p>
                    <button
                      className={getFilterStyles(sortBy === "")}
                      onClick={() => setSortBy("")}
                    >
                      none
                    </button>
                    {sortByOptions.map((option, index) => (
                      <button
                        key={index}
                        className={getFilterStyles(sortBy === option)}
                        onClick={() => setSortBy(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Gender Filter */}
                  <div className="mb-4 flex flex-col items-start  gap-1">
                    <p className="font-semibold text-gray-900 mb-1">Gender</p>
                    <button
                      className={getFilterStyles(selectedGender === "")}
                      onClick={() => setSelectedGender("")}
                    >
                      none
                    </button>
                    {["Male", "Female", "Other"].map((option, index) => (
                      <button
                        key={index}
                        className={getFilterStyles(selectedGender === option)}
                        onClick={() => setSelectedGender(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Department Filter */}
                  <div className="mb-4 flex flex-col items-start gap-1 w-fit h-fit overflow-hidden ">
                    <div className="mb-1">
                      <p className="font-semibold text-gray-900">Department</p>
                    </div>
                    <div className="flex flex-col gap-1 items-start overflow-y-auto max-h-[250px] pr-3">
                      <button
                        className={getFilterStyles(selectedDept === "")}
                        onClick={() => setSelectedDept("")}
                      >
                        none
                      </button>
                      {deptOptions.map((option, index) => (
                        <button
                          key={index}
                          className={getFilterStyles(selectedDept === option)}
                          onClick={() => setSelectedDept(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Batch Filter */}
                  <div className="mb-4 flex flex-col items-start  gap-1">
                    <p className="font-semibold text-gray-900 mb-1">Batch</p>
                    <button
                      className={getFilterStyles(selectedBatch === "")}
                      onClick={() => setSelectedBatch("")}
                    >
                      none
                    </button>
                    {startYearOptions.map((option, index) => (
                      <button
                        key={index}
                        className={getFilterStyles(selectedBatch === option)}
                        onClick={() => setSelectedBatch(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {(selectedBatch || selectedDept || selectedGender) && (
            <div className="text-sm flex flex-wrap gap-2 items-center px-4 py-2 bg-gray-100 rounded-lg">
              <p className="text-gray-700">Applied filters :</p>
              {selectedBatch ? (
                <span className="filter-badge p-2 rounded-full bg-blue-300 bg-opacity-25 text-blue-500 flex items-center">
                  <p className="inline">{selectedBatch}</p>
                  <button
                    className="mx-1 p-1 rounded-full text-gray-700 bg-white hover:bg-blue-500 hover:text-gray-100"
                    onClick={() => {
                      removeFilter(selectedBatch);
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ) : null}
              {selectedDept ? (
                <span className="filter-badge p-2 rounded-full bg-blue-300 bg-opacity-25 text-blue-500 flex items-center">
                  <p className="inline">{selectedDept}</p>
                  <button
                    className="mx-1 p-1 rounded-full text-gray-700 bg-white hover:bg-blue-500 hover:text-gray-100"
                    onClick={() => {
                      removeFilter(selectedDept);
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ) : null}
              {selectedGender ? (
                <span className="filter-badge p-2 rounded-full bg-blue-300 bg-opacity-25 text-blue-500 flex items-center">
                  <p className="inline">{selectedGender}</p>
                  <button
                    className="mx-1 p-1 rounded-full text-gray-700 bg-white hover:bg-blue-500 hover:text-gray-100"
                    onClick={() => {
                      removeFilter(selectedGender);
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ) : null}

              {
                <button
                  onClick={() => {
                    clearFilters();
                  }}
                  className="cursor-pointer p-2 rounded-full bg-red-300 hover:bg-red-400 bg-opacity-25 text-red-500 hover:text-white flex items-center"
                >
                  <p className="inline">Clear All</p>
                </button>
              }
            </div>
          )}
        </div>
        {/* ---------------------------------------------- */}

        {/* BUTTONS */}
        <div className="flex gap-2 items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setReadMode(!readMode);
            }}
            disabled={loading}
            className="flex gap-2 p-2 items-center border border-gray-400 rounded-full hover:bg-gray-300 focus:outline-none"
          >
            {readMode ? (
              <BookOpen size={16} className="text-blue-500" />
            ) : (
              <Pen size={16} className="text-orange-700" />
            )}
            <p>{readMode ? "Read" : "Write"}</p>
          </button>

          <div className="relative">
            <button
              onClick={() => setGenModal(!genModal)}
              className={`flex gap-2 items-center px-3 py-2 rounded-full group 
            border border-gray-400 hover:bg-gray-300`}
              disabled={!readMode || loading }
            >
              <Printer
                size={20}
                className={`text-orange-700 ${!readMode && "text-opacity-50"} `}
              />
              <p className={`text-gray-900 ${!readMode && "text-opacity-50"}`}>
                Print
              </p>

              {!readMode && (
                <p
                  className="p-0 py-1 bg-gray-200 bg-opacity-100 text-xs absolute top-11 right-1/4 invisible 
          group-hover:visible border border-gray-400 shadow-md rounded-full min-w-[250px]"
                >
                  printing is not supported in edit mode.
                </p>
              )}
            </button>

            {genModal && (
              <div
                className="hidden md:block absolute top-12 right-1/4 min-w-[250px] border border-gray-300 rounded-md"
                ref={genModalRef}
              >
                <UploadType handlePrint={handlePrint} setGenModal={setGenModal}/>
              </div>
            )}
          </div>

          {!readMode && (
            <button
              type="button"
              className="group relative flex gap-1 items-center px-2 py-2 rounded-full  hover:bg-gray-300 hover:border hover:border-gray-400"
              onClick={() => {
                startCreate();
                // addNewData();
              }}
            >
              <UserPlus2 size={20} className="text-gray-700" />
              <p
                className="absolute top-12 right-1 border border-gray-400 shadow-md bg-gray-200 rounded-full 
            w-24 px-0 py-1 text-xs invisible group-hover:visible"
              >
                Add student
              </p>
            </button>
          )}

          {!readMode && (
            <button
              type="button"
              onClick={() => setOpenFileModal(!openFileModal)}
              className="group relative flex items-center gap-1 px-2 py-2 rounded-full  hover:bg-gray-300 hover:border hover:border-gray-400"
            >
              <LucideFileUp size={20} className="text-gray-700" />
              <p
                className="absolute top-12 right-1 border border-gray-400 shadow-md bg-gray-200 rounded-full 
            w-24 px-0 py-1 text-xs invisible group-hover:visible"
              >
                Upload file
              </p>
            </button>
          )}

          {!readMode && (
            <button
              type="button"
              onClick={() => setDeleteAllModel(!deleteAllModel)}
              className="group relative flex items-center gap-1 px-2 py-2 rounded-full  hover:bg-gray-300 hover:border hover:border-gray-400"
            >
              <Trash2 size={20} className="text-gray-700" />
              <p
                className="absolute top-12 right-1 border border-gray-400 shadow-md bg-gray-200 rounded-full 
          w-32 px-0 py-1 text-xs invisible group-hover:visible"
              >
                delete all records
              </p>
            </button>
          )}
        </div>
        {/* ---------------------------------------------- */}

        {/* ---------------------------------------------- */}
      </div>

      {/* MOBILE NAV BAR */}
      <BottomToolBar
        genModal={genModal}
        setGenModal={setGenModal}
        filters={filters}
        setOpenFileModal={setOpenFileModal}
        openFileModal={openFileModal}
        startCreate={startCreate}
        setCreateModal={setCreateModal}
        isOpen={openBtmToolBar}
        setIsOpen={setBtmToolBar}
        loading={loading}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        handlePrint={handlePrint}
        sortByOptions={sortByOptions}
        setSortBy={setSortBy}
        setSelectedBatch={setSelectedBatch}
        setSelectedDept={setSelectedDept}
        setSelectedGender={setSelectedGender}
        activeFilterSections={{
          sortBy: sortBy,
          selectedBatch: selectedBatch,
          selectedDept: selectedDept,
          selectedGender: selectedGender,
        }}
        setReadMode={setReadMode}
        readMode={readMode}
      />
    </div>
  );
}

// Table component for displaying records
function RecordsTable({
  headers,
  displayData,
  renderRow,
  tableRef,
  loading,
  readMode,
}) {
  return (
    <div className="hidden md:block px-0 overflow-hidden">
      <table
        className={`table-auto overflow-hidden md:w-full ${
          loading && "opacity-25 animate-pulse"
        }`}
        ref={tableRef}
      >
        <thead className="text-left text-sm border-b border-gray-300">
          {headers.map((header, index) => (
            <th key={index} className="p-2 px-4 font-semibold text-gray-900">
              {header}
            </th>
          ))}
        </thead>
        <tbody className="text-sm">
          {displayData && displayData.length > 0 ? (
            displayData.map((student, idx) => renderRow(student, idx)) // Correctly pass `index` here
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="p-2 py-8 text-sm text-gray-700 text-center"
              >
                No Records Available..,
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
