import React from "react";
import { Link } from "react-router-dom";
import { PiGraduationCap } from "react-icons/pi";
import { GraduationCap } from "lucide-react";

export default function Login() {
  
  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-12 h-[510px]">
      <Link 
      to={'/student-login'}
      className="relative w-52 h-52 border border-gray-300 rounded-lg group shadow-lg hover:scale-105 hover:border-green-900 transition-all">
        <img src="/student.png" className="w-full h-full rounded-lg " alt="" />
        <div className="p-2 pr-3 absolute left-0 bottom-0 bg-green-800 shadow-inner shadow-green-600 rounded-bl-lg rounded-tr-2xl w-fit h-fit">
          <p className="text-xs font-semibold text-gray-100">Student Login</p>
        </div>
      </Link>

      <Link 
      to={'/admin-login'}
      className="relative w-52 h-52 border border-gray-300 rounded-lg group shadow-lg hover:scale-105 hover:border-green-900 transition-all">
        <img
          src="/professor.png"
          className="w-full h-full rounded-lg"
          alt=""
        />
        <div className="p-2 pr-3 absolute left-0 bottom-0 bg-green-800 shadow-inner shadow-green-600 rounded-bl-lg rounded-tr-2xl w-fit h-fit">
          <p className="text-xs font-semibold text-gray-100">Admin Login</p>
        </div>
      </Link>
    </div>
  );
}
