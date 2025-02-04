import { Fragment, useEffect, useRef, useState } from "react";

import {
  ChevronUp,
  Search,
  FileEdit,
  UserPlus2,
  Printer,
  FilterIcon,
  Eye,
  LucideFileUp,
} from "lucide-react";
import { useDataContext } from "../contexts/MainDataContext";

export default function BottomToolBar({
  isOpen,
  setIsOpen,
  searchQuery,
  handleSearchChange,
  loading,
  handlePrint,
  sortByOptions,
  setSortBy,
  setSelectedBatch,
  setSelectedDept,
  setSelectedGender,
  activeFilterSections,
  setReadMode,
  readMode,
  setCreateModal,
  startCreate,
  setOpenFileModal,
  openFileModal,
  filters
}) {
  const toolbarRef = useRef(null);
  const { startYearOptions, deptOptions } = useDataContext();
  const [showFilters, setShowFilters] = useState(false);
  const [activeButtons, setActiveButtons] = useState([]);

  const openBottomToolbar = () => setIsOpen(true);

  const closeBottomToolbar = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        closeBottomToolbar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   if (filters.gender || filters.department || filters.batch || filters.sortBy) {
  //     setActiveButtons((prev) =>
  //       prev.includes("Filters") ? prev : [...prev, "Filters"]
  //     );
  //   }
  // }, [filters]);


  useEffect(() => {
    setActiveButtons((prev) => {
      if (readMode) {
        return prev.includes("Edit")
          ? prev.filter((btn) => btn !== "Edit")
          : prev;
      } else {
        return prev.includes("Edit") ? prev : [...prev, "Edit"];
      }
    });
  }, [readMode]);

  const toolbarItems = [
    {
      icon: readMode ? <Eye size={24} /> : <FileEdit size={24} />,
      label: readMode ? "Read" : "Edit",
      action: () => {
        setReadMode(!readMode);
        
      },
    },
    {
      icon: <FilterIcon size={24} />,
      label: "Filters",
      action: () => {
        setShowFilters(!showFilters);
        setActiveButtons((prev) =>
          prev.includes("Filters")
            ? prev.filter((btn) => btn !== "Filters")
            : [...prev, "Filters"]
        );
      },
    },
    {
      icon: <Printer size={24} />,
      label: "Print",
      action: () => {
        handlePrint();
      },
    },
    {
      icon: <UserPlus2 size={24} />,
      label: "Add Student",
      action: () => {
        startCreate();
      },
    },
    {
      icon: <LucideFileUp size={24} />,
      label: "Upload",
      action: () => {
        setOpenFileModal(!openFileModal);
        closeBottomToolbar();
      },
    },
  ];

  return (
    <div className="relative md:hidden">
      {/* Bottom Toolbar */}

      <div
        ref={toolbarRef}
        className="fixed bottom-0 left-0 right-0 h-3/4 transition-transform duration-300 transform z-45 bg-white"
        style={{
          transform: isOpen ? "translateY(0%)" : "translateY(80%)",
        }}
      >
        <button
          type="button"
          className="absolute  left-[45%] p-3 -top-5 bg-green-800 text-white rounded-full shadow-inner shadow-green-600 hover:bg-green-800 z-45 "
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronUp
            size={20}
            className={`transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div
          className="h-full text-sm p-4 bg-white 
        rounded-t-xl shadow-inner border border-gray-400 "
        >
          <div className="mt-4 pb-2 px-1 h-full flex flex-col gap-2 overflow-y-auto">
            {/* SEARCH BAR */}
            <div className="group mt-1 w-full md:w-1/2 flex flex-col gap-2 z-10">
              <div className="relative flex items-center w-92 z-10">
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
              </div>
            </div>

            {/* FUNCTIONALITY ICONS */}
            {/* Dynamic Icons with Labels */}
            <div className="my-4 flex gap-4 justify-start flex-wrap items-center">
              {toolbarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="flex flex-col items-center"
                  {...(item.label === "Print" && { disabled: !readMode })}
                >
                  <div
                    className={`text-white p-2 rounded-full border-2 
                     ${
                       activeButtons.includes(item.label) ?
                       `bg-yellow-500 ` : "bg-green-800 "
                     }`}

                     
                  >
                    {item.icon}
                  </div>

                  <p className="text-xs mt-1">{item.label}</p>
                </button>
              ))}
            </div>

            {/* FILTER BAR */}
            {showFilters && (
              <div className="flex flex-col gap-2 justify-start items-start -translate-y-1 ease-in">
                {[
                  {
                    label: "Sort By",
                    options: sortByOptions,
                    onAction: setSortBy,
                    activeSelection: activeFilterSections.sortBy,
                  },
                  {
                    label: "Gender",
                    options: ["Male", "Female", "Other"],
                    onAction: setSelectedGender,
                    activeSelection: activeFilterSections.selectedGender,
                  },
                  {
                    label: "Department",
                    options: deptOptions,
                    onAction: setSelectedDept,
                    activeSelection: activeFilterSections.selectedDept,
                  },
                  {
                    label: "Batch",
                    options: startYearOptions,
                    onAction: setSelectedBatch,
                    activeSelection: activeFilterSections.selectedBatch,
                  },
                ].map((fil, idx) => (
                  <Fragment key={idx}>
                    <Filters
                      label={fil.label}
                      options={fil.options}
                      onAction={fil.onAction}
                      activeSelection={fil.activeSelection}
                    />
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Filters({ label, options, onAction, activeSelection }) {
  return (
    <>
      <p className="text-md font-semibold mt-4">{label}</p>
      <div className="flex items-center justify-start gap-2 flex-wrap">
        <div
          className={`text-sm px-2 py-1 rounded-full border border-gray-300 cursor-pointer 
          ${!activeSelection && "bg-gray-200"} `}
          onClick={() => {
            onAction(""); // Clear selection
          }}
        >
          none
        </div>
        {options.map((option, idx) => (
          <div
            key={idx}
            className={`text-sm px-2 py-1 rounded-full border cursor-pointer
              ${
                activeSelection === option
                  ? "bg-blue-300 bg-opacity-50 border border-blue-400 text-blue-600 "
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
            onClick={() => {
              onAction(option); // Set selected option
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </>
  );
}
