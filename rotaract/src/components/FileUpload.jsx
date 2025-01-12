import React, { useState } from "react";
import { useDataContext } from "../contexts/MainDataContext";
import { uploadFile } from "../../api/api_services";
import { X } from "lucide-react";
import { usePopUp } from "../contexts/PopUpContext";

function FileUpload({ setOpenFileModal, openFileModal, fetchStudentsData }) {
  const [file, setFile] = useState(null);
  const { setLoading } = useDataContext();
  const { showPopUp } = usePopUp();

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
      showPopUp("Error..,")
    } finally {
      setOpenFileModal(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-fit h-fit p-4 bg-white border border-gray-300 flex flex-col gap-4 justify-center items-center rounded-lg shadow-md">
      <div className="w-full h-fit flex justify-end ">
        <button 
        type="button"
        onClick={()=> setOpenFileModal(false)}
        className="rounded-full p-1 border-2 border-gray-600 hover:bg-gray-400">
          <X
            size={16}
            className=" text-gray-700"
          />
        </button>
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        className="rounded-xl p-8 border bg-gray-200"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="mt-4 font-semibold text-green-900 rounded-lg 
      px-3 py-2 border border-green-900 hover:border-0 hover:bg-green-900 hover:text-white"
      >
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
