import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-full md:h-[500px] md:flex md:justify-center">
      <header className="relative md:w-[1200px] h-full flex items-center justify-center ">
        {/* Container for Hero Content */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between px-4 md:px-16 space-y-8 md:space-y-0 w-full">
          {/* Text Content */}
          <div className="pt-8 text-center md:text-left max-w-xs md:max-w-sm z-10 ">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black">
              Empowering Youth for a Better Tomorrow
            </h1>
            <p className="mt-4 text-sm sm:text-lg md:text-lg text-gray-700">
              Join the Rotaract Club of Arul Anandar College and make a
              difference in society while developing leadership and global
              citizenship skills.
            </p>
            <div className="mt-6 space-x-4">
              <button
                className="bg-green-800 hover:bg-green-900 text-gray-100 px-3 py-2 sm:px-4 sm:py-3 md:py-3 md:px-6 
                rounded-full shadow-lg font-semibold text-sm md:text-base transform transition duration-300 hover:scale-105"
                onClick={() => navigate("/login")}
              >
                Join Us Today
              </button>
              <button
                className="bg-transparent  text-green-800 hover:underline 
              px-3 py-2 sm:px-4 sm:py-3 md:py-3 md:px-6 rounded-lg font-semibold text-sm md:text-base"
                onClick={() => navigate("/about")}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className=" md:hidden md:w-1/2">
            <img
              src="/hero-mobile.jpg" // Replace with your image path
              alt="Empowering Youth"
              className=""
            />
          </div>
          <div className="hidden md:block overflow-hidden md:w-1/2">
            <img
              src="/hero.jpg" // Replace with your image path
              alt="Empowering Youth"
              className="w-auto h-auto object-cover mix-blend-darken"
            />
          </div>
        </div>
      </header>

      <div className="hidden md:block absolute top-0 right-0 -z-5 rounded-bl-full p-10 md:p-16 bg-green-700"></div>
      <div className="hidden md:block absolute top-0 right-0 -z-10 rounded-bl-full p-10 md:p-20 bg-green-600"></div>
      

      <div className="hidden md:block absolute md:top-12 md:left-12 -z-20 rounded-full p-6 md:p-20 bg-green-500"></div>
      <div className="hidden md:block absolute md:top-6 md:left-6 -z-20 rounded-full p-8 md:p-12 bg-green-700"></div>

      <div className="hidden md:block absolute bottom-[13%] left-[45%] -z-5 rounded-full p-10 md:p-6 border  border-green-700">
        <div className="rounded-full p-4 border border-dashed border-green-700">
        </div>
      </div>
      
    </div>
  );
};

export default HeroSection;
