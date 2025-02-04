import React, { useRef } from "react";
import AutoCompleteInput from "./AutoCompleteInput";
import { useDataContext } from "../contexts/MainDataContext";
import useClickOutside from "../hooks/useClickOutside";

export default function StudentModal({ mode, studentData, actions }) {
  const { deptOptions, startYearOptions, endYearOptions } = useDataContext();
  const modalRef = useRef(null);

  useClickOutside(modalRef, actions.cancelEdit);

  const isEditMode = mode === "edit";

  return (
    <div className="text-sm fixed z-50 bg-gray-900 bg-opacity-50 inset-0">
      <div
        className="absolute right-0 w-3/4 md:w-[30%] h-full bg-white p-8 rounded-lg transform translate-x-full opacity-0 animate-slide-in"
        ref={modalRef}
      >
        <h1 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          {isEditMode ? "Edit Student" : "Create Student"}
        </h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Name"
            value={actions.editedData.name || studentData?.name || ""}
            onChange={(e) => actions.updateField("name", e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Roll No"
            value={actions.editedData.roll_no || studentData?.roll_no || ""}
            onChange={(e) => actions.updateField("roll_no", e.target.value)}
          />
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Email"
            value={actions.editedData.email || studentData?.email || ""}
            onChange={(e) => actions.updateField("email", e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Mobile No"
            value={actions.editedData.mobileNo || studentData?.mobileNo || ""}
            onChange={(e) => actions.updateField("mobileNo", e.target.value)}
          />

          <AutoCompleteInput
            value={actions.editedData.gender || studentData?.gender || ""}
            options={["Male", "Female", "Other"]}
            onChange={(selectedValue) =>
              actions.updateField("gender", selectedValue)
            }
            placeholder={"Gender"}
          />
          <AutoCompleteInput
            value={actions.editedData.dept || studentData?.dept || ""}
            options={deptOptions}
            onChange={(selectedValue) =>
              actions.updateField("dept", selectedValue)
            }
            placeholder={"Department"}
          />

          <AutoCompleteInput
            value={actions.editedData.startYear || studentData?.startYear || ""}
            options={startYearOptions}
            onChange={(selectedValue) =>
              actions.updateField("startYear", selectedValue)
            }
            placeholder={"Start Year"}
          />
          <AutoCompleteInput
            value={actions.editedData.endYear || studentData?.endYear || ""}
            options={endYearOptions}
            onChange={(selectedValue) =>
              actions.updateField("endYear", selectedValue)
            }
            placeholder={"End Year"}
          />

          <div className="flex gap-2 items-center justify-end mt-4">
            <button
              type="button"
              className="p-2 px-3 bg-gray-300 rounded-full text-gray-900 transition active:scale-95
              active:bg-gray-500"
              onClick={actions.cancelEdit}
            >
              Discard
            </button>
            <button
              type="button"
              className="p-2 px-3 bg-green-700 rounded-full text-white transition active:scale-95
              active:bg-green-900"
              onClick={isEditMode ? actions.saveRow : actions.createRow}
            >
              {isEditMode ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
