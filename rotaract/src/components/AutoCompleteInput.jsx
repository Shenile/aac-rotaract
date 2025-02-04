import React, { useState, useRef } from "react";
import useClickOutside from "../hooks/useClickOutside"; // Custom hook for closing dropdown

const AutoCompleteInput = ({ placeholder, value, options, onChange, customStyle = "" }) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setShowSuggestions(false)); // Hide on click outside

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    if (query) {
      const matches = options
        .map((option) => option.toString()) // Convert all to strings
        .filter((option) => option.toLowerCase().includes(query))
        .slice(0, 3);
      setFilteredOptions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    onChange(e.target.value);
  };

  const handleSelectOption = (option) => {
    onChange(option);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        className={`${customStyle ? customStyle : "p-2 border border-gray-300 rounded"} w-full `}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-50"
        >
          {filteredOptions.map((option, index) => (
            <p
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteInput;
