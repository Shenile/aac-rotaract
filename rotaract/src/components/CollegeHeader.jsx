import React, { useState } from "react";

export default function CollegeHeader() {
  
  return (
    <div className="px-2 md:px-4 py-4 flex gap-4 justify-center items-center border-b border-gray-300">

      <div>
      <img className="w-16 sm:w-18 md:w-20" src="https://erp.aactni.edu.in/img/site_logo/aac-logo.png" alt="AAC Logo"/>
      </div>

      

      <div className="flex flex-col justify-start md:justify-center md:items-center font-semibold">
        <h1 className="tracking-wide text-md sm:text-lg md:text-2xl font-bold">ARUL ANANDAR COLLEGE (AUTONOMOUS)</h1>
        <p className="text-xs sm:text-md md:text-lg">(AFFILIATED TO MADURAI KAMARAJ UNIVERSITY)</p>
        <p className="text-xs sm:text-md md:text-lg">KARUMATHUR - 625 514, MADURAI</p>
      </div>

      
    </div>
  );
}
