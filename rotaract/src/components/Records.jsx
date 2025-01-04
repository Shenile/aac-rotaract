import React, { useState, useEffect, useRef } from "react";
import {
  SlidersHorizontal,
  Search,
  RotateCw,
  X,
  Printer,
  BookOpen,
  Pen,
} from "lucide-react";

import AdminLogin from "./AdminLogin";
import { useScreenContext } from "../contexts/ScreenContext";
import {
  deleteStudentRecord,
  getStudentRecords,
  updateStudentRecord,
} from "../../api/api_services";
import { useDataContext } from "../contexts/MainDataContext";
import SearchableDropdown from "./SearchableDropDown";

const filterDataBySearch = (data, query) => {
  if (!query) return data;
  return data.filter((data) => {
    return Object.values(data)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
  });
};

export default function Records() {
  const [headers, setHeaders] = useState([]);
  const { isMobile, isDesktop, isMidScreen, isTablet } = useScreenContext();
  const [studentData, setStudentsData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef();
  const [readMode, setReadMode] = useState(true);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const { deptOptions, startYearOptions, loading, setLoading } = useDataContext();

  // Fetch student records
  const fetchStudentsData = async () => {
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



  // Trigger data fetch when component mounts
  useEffect(() => {
    fetchStudentsData();
  }, []);


  useEffect(() => {
    if (readMode) {
      cancelEdit();
    }
  }, [readMode]);

  // Adjust headers based on screen size
  useEffect(() => {
    if (isMobile) {
      setHeaders(["user"]);
    } else if (isMidScreen) {
      setHeaders(["User", "Role", ""]);
    } else if (isTablet) {
      setHeaders(["User", "Role", "Status", ""]);
    } else if (isDesktop) {
      setHeaders([
        "RollNo",
        "Name",
        "Email",
        "Gender",
        "Department",
        "Batch",
        "Mobile.No",
      ]);
    }
  }, [isMobile, isTablet, isDesktop, isMidScreen]);

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

  const handlePrint = () => {
    // Ensure the tableRef is set correctly before accessing the table content
    const printContent = tableRef.current ? tableRef.current.innerHTML : "";
    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Student Records</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              tr:hover {
                background-color: #f1f1f1;
              }
            </style>
          </head>
          <body>
            <table>
              ${printContent}
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert("No table content to print!");
    }
  };

  const startEdit = (index, student) => {
    setEditingRowIndex(index);
    setEditedData(student);
  };

  const cancelEdit = () => {
    setEditingRowIndex(null);
    setEditedData({});
  };

  const saveRow = async () => {
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
    }
  };

  const deleteRow = async (id) => {
    setLoading(true);
    try {
      const res = await deleteStudentRecord(id);
      fetchStudentsData();
      alert(res);
    } catch (err) {
      alert("err :", err);
    } finally {
      setLoading(false);
    }
  };

  const renderRow = (student, idx) => (
    <tr key={student.roll_no} className="hover:bg-gray-100">
      {Object.entries(student).map(([key, value]) => {
        if (idx === editingRowIndex && key !== "id" && key !== "endYear") {
          return (
            <td
              key={`${student.roll_no}-${key}`}
              className="p-2 px-4 text-gray-800"
            >
              {(() => {
                switch (key) {
                  case "gender":
                    return (
                      <SearchableDropdown
                        options={["Male", "Female", "Other"]}
                        intialValue={student.gender}
                        onChange={(value) =>
                          setEditedData((prev) => ({
                            ...prev,
                            [key]: value, // Use the value selected from the dropdown
                          }))
                        }
                      />
                    );

                  case "dept":
                    return (
                      <SearchableDropdown
                        options={deptOptions}
                        intialValue={student.dept}
                        onChange={(value) =>
                          setEditedData((prev) => ({
                            ...prev,
                            [key]: value, // Use the value selected from the dropdown
                          }))
                        }
                      />
                    );

                  case "startYear":
                    return (
                      <SearchableDropdown
                        options={startYearOptions}
                        intialValue={student.startYear}
                        onChange={(value) => {
                          value.parseInt();
                          setEditedData((prev) => ({
                            ...prev,
                            [key]: value, // Use the value selected from the dropdown
                          }));
                        }}
                      />
                    );

                  default:
                    return (
                      <input
                        type="text"
                        value={
                          editedData[key] !== undefined
                            ? editedData[key]
                            : value
                        }
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="border rounded p-1 w-full"
                      />
                    );
                }
              })()}
            </td>
          );
        } else if (key !== "id" && key !== "endYear") {
          // Render normal cells for non-editable rows
          return (
            <td
              key={`${student.roll_no}-${key}`}
              className="p-2 px-4 text-gray-800"
            >
              {value}
            </td>
          );
        }
        return null; // Skip rendering for keys like "id" and "endYear"
      })}

      {!readMode && (
        <td className="print:hidden pr-4">
          <div className="flex gap-2">
            {idx === editingRowIndex ? (
              <>
                <button
                  type="button"
                  className="pr-3 text-green-500"
                  onClick={() => saveRow(idx)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={() => cancelEdit()}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="pr-3 text-blue-500"
                  onClick={() => startEdit(idx, student)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => deleteRow(student.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div>
      <div className="relative">
        <RecordTableNavBar
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
      console.log("No filters applied, returning original data");
      setDisplayData(studentData);
      return;
    }

    console.log("Initial student data:", studentData);

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

    // Debug filtered data
    console.log("Filtered and sorted data:", filteredData);

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
    applyFilters();
  }, [selectedGender, selectedDept, selectedBatch, sortBy]);

  const clearFilters = () => {
    setSelectedGender("");
    setSelectedDept("");
    setSelectedBatch("");
    setDisplayData(studentData);
  };

  // adding a student

  return (
    <div className="text-sm sticky top-0 bg-white flex justify-between items-start h-fit p-4">
      <div className="h-fit flex gap-2 items-center">
        <button
          onClick={() => {
            fetchStudentsData();
          }}
          className="p-2 hover:bg-gray-300 rounded-full"
        >
          <RotateCw size={20} className="text-gray-700 " />
        </button>

        <p className="text-gray-900">
          {recordsCount !== null && `Records ( ${recordsCount} )`}
        </p>
      </div>

      {/* Search Input */}
      <div className="flex flex-col gap-2 w-1/2">
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {/* Filter Icon */}
            <SlidersHorizontal
              size={20}
              className={` ${
                openToolBar ? "text-blue-500" : "text-gray-400"
              } hover:text-blue-500 cursor-pointer`}
            />
          </button>

          {openToolBar && (
            <div
              ref={toolBarRef}
              className="absolute top-12 w-full bg-gray-100 border border-gray-400 p-4 rounded-lg"
            >
              {/* Gender Filter */}
              <div className="mb-4">
                <label className="pb-2 block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => {
                    setSelectedGender(e.target.value);
                  }}
                  className="text-sm mt-1 p-2 block w-full border-gray-300 
                rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 "
                >
                  <option value="">None</option>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                  <option value={"Other"}>Other</option>
                </select>
              </div>

              {/* Department Filter */}
              <div className="mb-4">
                <label className="pb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                  }}
                  className="text-sm mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring focus:ring-blue-500 "
                >
                  <option value="">None</option>
                  {deptOptions.map((dept, index) => (
                    <option value={dept} key={index}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Filter */}
              <div className="mb-4">
                <label className="pb-2 block text-sm font-medium text-gray-700">
                  Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                  }}
                  className="text-sm mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring focus:ring-blue-500 "
                >
                  <option value="">None</option>
                  {startYearOptions.map((dept, index) => (
                    <option value={dept} key={index}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="mb-4">
                <label className="pb-2 block text-sm font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                  }}
                  className="text-sm mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring focus:ring-blue-500 "
                >
                  <option value="" className="p-2">
                    None
                  </option>
                  {sortByOptions.map((option, index) => (
                    <option key={index} value={option} className="p-2">
                      {option}
                    </option>
                  ))}
                </select>
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
            <Pen size={20} className="text-orange-500" />
          )}
          <p>{readMode ? "Read" : "Write"}</p>
        </button>
        <button
          onClick={handlePrint}
          className={`relative flex gap-2 items-center px-3 py-2 rounded-full group 
            border border-gray-400 hover:bg-gray-300`}
          disabled={!readMode || loading}
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
          group-hover:visible border border-gray-300 shadow-xl rounded-full min-w-[250px]"
            >
              printing is not supported in edit mode.
            </p>
          )}
        </button>
      </div>
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
    <div className="px-0">
      <table
        className={`table-auto w-full ${loading && "opacity-25 animate-pulse"}`}
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
          {displayData && displayData.length > 0  ? (
            displayData.map((student, idx) => renderRow(student, idx)) // Correctly pass `index` here
          ) :(
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
