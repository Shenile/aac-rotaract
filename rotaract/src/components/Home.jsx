import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-green-100 md:flex md:justify-center">
      <header className="py-8 relative md:w-[1200px] md:h-[515px] flex items-center justify-center bg-green-100">
        {/* Container for Hero Content */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between px-4 md:px-16 space-y-8 md:space-y-0 w-full">
          {/* Text Content */}
          <div className="text-center md:text-left max-w-xl z-10">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-black">
              Empowering Youth for a Better Tomorrow
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700">
              Join the Rotaract Club of Arul Anandar College and make a
              difference in society while developing leadership and global
              citizenship skills.
            </p>
            <div className="mt-6 space-x-4">
              <button
                className="bg-green-800 hover:bg-green-900 text-gray-100 px-4 py-3 md:py-3 md:px-6 
                rounded-lg shadow-lg font-semibold text-sm md:text-base"
                onClick={() => navigate("/login")}
              >
                Join Us Today
              </button>
              <button className="bg-transparent border border-green-800 text-green-800 hover:text-gray-100 hover:bg-green-800 
              px-4 py-3 md:py-3 md:px-6 py-3 px-6 rounded-lg shadow-lg font-semibold text-sm md:text-base"
              onClick={()=> navigate("/about")}>
                Learn More
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <img
              src="/hero.png" // Replace with your image path
              alt="Empowering Youth"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeroSection;
