import React, { useState, useEffect, useRef } from "react";

const SearchableDropdown = ({ options, onChange, intialValue, regFormStyles = null, placeholder = null }) => {
  const [searchText, setSearchText] = useState(intialValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    setSearchText(intialValue || "");
  }, [intialValue]);
  

  const filteredOptions = options.filter((option) =>
    String(option).toLowerCase().includes(String(searchText).toLowerCase())
  );

  const handleSelect = (value) => {
    setSearchText(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="relative w-full " ref={dropdownRef}>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className={`${regFormStyles ? regFormStyles : "border rounded px-2 py-1 w-full focus:outline-none focus:border-2 focus:border-green-800"}`}
        placeholder= {placeholder ? placeholder : ''}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && searchText && (
        <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-1 hover:bg-green-800 hover:text-gray-100 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
