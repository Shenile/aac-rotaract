import React, { useRef, useState } from "react";
import { useDataContext } from "../contexts/MainDataContext";
import { uploadFile } from "../../api/api_services";
import { X } from "lucide-react";
import { usePopUp } from "../contexts/PopUpContext";
import useClickOutside from "../hooks/useClickOutside";

function FileUpload({ setOpenFileModal, openFileModal, fetchStudentsData }) {
  const [file, setFile] = useState(null);
  const { setLoading, getClickEffect } = useDataContext();
  const { showPopUp } = usePopUp();
  const FileUploadRef = useRef(null);

  useClickOutside(FileUploadRef, () => {
    if (!file) setOpenFileModal(false);
  });

  const allowedFileTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Validate file type
      if (!allowedFileTypes.includes(selectedFile.type)) {
        alert(
          "Invalid file type. Only .xlsx, .xls, and .csv files are allowed."
        );
        setFile(null); // Reset file
        event.target.value = ""; // Clear input field
        return;
      }

      // Optional: Validate file size (e.g., max 5 MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds the limit of 5 MB.");
        setFile(null);
        event.target.value = "";
        return;
      }

      setFile(selectedFile); // Set the file if valid
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!file) {
      alert("Please select a valid file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadFile(file);
      await fetchStudentsData();
      showPopUp("File uploaded and processed successfully..,", "success");
    } catch (err) {
      showPopUp("Error..,");
    } finally {
      setOpenFileModal(false);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex justify-center items-center z-50">
      <div
        ref={FileUploadRef}
        className="text-sm md:text-base w-[90%] md:max-w-screen-sm h-fit p-6 md:p-8 bg-white border border-gray-300 flex flex-col gap-6 justify-center items-center rounded-lg shadow-md"
      >
        <div className="w-full h-fit flex justify-end">
          <button
            type="button"
            onClick={() => setOpenFileModal(false)}
            className="rounded-full p-2 md:hover:bg-gray-300 active:bg-gray-300 "
          >
            <X size={16} className=" text-gray-900" />
          </button>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full rounded-xl p-8 border bg-gray-300"
        />
        <button
          onClick={handleUpload}
          disabled={!file}
          className="mt-4 font-semibold text-green-900 rounded-full 
      px-3 py-2 border border-green-900 md:hover:border-0 md:hover:bg-green-900 md:hover:text-white active:bg-green-900 active:text-white"
        >
          Upload
        </button>

    
      </div>
    </div>
  );
}

export default FileUpload;
