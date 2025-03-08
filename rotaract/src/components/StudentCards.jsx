import React, { useRef } from "react";
import { Edit, Trash2, Save, CircleOff } from "lucide-react";
import useClickOutside from "../hooks/useClickOutside";
import StudentModal from "./StudentModal";

export default function StudentCards({
  displayData,
  readMode,
  openCreateModal,
  actions,
}) {
  const modalRef = useRef(null);

  // useClickOutside(modalRef, actions.cancelEdit);
  return (
    <div className="md:hidden text-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-4 pb-36">
      <p className="font-semibold text-base border-b pb-4 border-gray-300 text-gray-900 text-center">Rotaract Students Details</p>
      {/* CARDS */}
      {displayData.map((student, index) => (
        <div
          key={index}
          className="flex flex-col bg-white border-b px-2 border-gray-200 overflow-hidden 
         "
        >
          {!readMode && (
            <div className="flex justify-between items-center p-4 text-white border-b border-gray-300">
              <p className="text-gray-900 font-semibold">Actions</p>

              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="p-1 text-yellow-600"
                  onClick={() => {
                    actions.startEdit(index, student);
                  }}
                >
                  <Edit size={20} />
                </button>
                <button
                  type="button"
                  className="p-1 text-red-700"
                  onClick={() => {
                    actions.deleteRow(student.id);
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4">
            <h1 className="text-base  font-semibold text-gray-900">
              {student.name}
            </h1>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Roll No:</strong> {student.roll_no}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {student.email}
              </p>
              <p className="text-gray-600">
                <strong>Mobile:</strong> {student.mobileNo}
              </p>
              <p className="text-gray-600">
                <strong>Start Year:</strong> {student.startYear}
              </p>
              <p className="text-gray-600">
                <strong>Gender:</strong> {student.gender}
              </p>
              <p className="text-gray-600">
                <strong>Department:</strong> {student.dept}
              </p>
            </div>
          </div>
        </div>
      ))}

      {!displayData ||
        (displayData.length === 0 && <div className="text-gray-700 h-full w-full flex justify-center items-center">No records Available</div>)}
    </div>
  );
}
