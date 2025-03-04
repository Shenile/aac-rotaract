import React, { useState } from 'react';

export default function UploadType({ handlePrint, setGenModal }) {
  const [selectedFileType, setSelectedFileType] = useState(null);

  const handleCheckboxChange = (event) => {
    const { id } = event.target;
    setSelectedFileType(prevState => (prevState === id ? null : id));  // Toggle between null and selected id
  };

  const handleGenerateFiles = () => {
    if (!selectedFileType) {
      alert("Please select a file type.");
      return;
    }

    const fileType = selectedFileType === 'pdf' ? 'pdf' : 'xlsx';
    handlePrint(fileType);
    setGenModal(false);
  };

  return (
    <div className="text-sm md:text-md flex flex-col justify-start gap-4 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h3 className="text-md md:text-sm font-semibold text-gray-700 mb-4">Select File Type to Generate</h3>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="pdf"
          name="upload-file-type"
          checked={selectedFileType === 'pdf'}
          onChange={handleCheckboxChange}
          className="form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="pdf" className="text-gray-700">PDF</label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="excel"
          name="upload-file-type"
          checked={selectedFileType === 'excel'}
          onChange={handleCheckboxChange}
          className="form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="excel" className="text-gray-700">Excel (.xlsx)</label>
      </div>

      <button
        onClick={handleGenerateFiles}
        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Generate Selected File
      </button>
    </div>
  );
}
