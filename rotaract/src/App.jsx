import { useEffect, useState } from "react";
import CollegeHeader from "./components/CollegeHeader";
import Members from "./components/Members";
import SideBar from "./components/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentRegistration from "./components/StudentRegistration";
import Records from "./components/Records";
import About from "./components/About";
import { useScreenContext } from "./contexts/ScreenContext";
import StudentLogin from "./components/StudentLogin";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import StudentProfile from "./components/Studentprofile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthContext } from "./contexts/AuthContext";
import Home from "./components/Home";
import PopUp from "./components/Popup";
import { ChevronLeft } from "lucide-react";

export default function App() {
  const [openSideBar, setOpenSideBar] = useState(false);
  const { isMobile, isTablet, isDesktop, isMidScreen } = useScreenContext();
  const { user } = useAuthContext();



  const closeSidebar = () => setOpenSideBar(false);

  useEffect(() => {
    if (isMidScreen || isDesktop) {
      setOpenSideBar(false);
    }
  }, [isMobile, isTablet, isDesktop, isMidScreen]);

  return (
    <Router basename="/apr24/19csc120">
      <div className="flex flex-col font-lexend h-screen">
        {/* College Header */}
        <div className="font-spectral sticky top-0 z-30 bg-green-800 text-white">
          <CollegeHeader />
        </div>

        <h1 className="hidden md:block text-sm text-gray-900 sm:text-lg text-center font-bold w-full border-b border-gray-300 py-2 md:py-4 z-30">
          ROTARACT
        </h1>

        {/* Mobile Header with Burger Menu */}
        <div className="md:hidden px-8 flex justify-between items-center w-full border-b border-gray-300 py-2 ">
          {/* Burger Menu */}
          <button
            className="text-lg sm:text-xl transition-transform duration-200 active:scale-90"
            onClick={() => setOpenSideBar(!openSideBar)}
          >
            ☰
          </button>

          <h1 className="text-sm sm:text-md text-center font-semibold">
            ROTARACT
          </h1>

          {/* Empty placeholder for alignment */}
          <div />
        </div>

        {/* Main content container */}
        <div className=" w-full flex flex-grow overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-40 border-r border-gray-300 bg-gray-100">
            <SideBar />
          </div>

          {/* 🔹 Mobile Sidebar with Smooth Animation */}
          <div
            className={` rounded-lg fixed inset-y-0 left-0 w-64 bg-gray-100 border-r border-gray-300 z-50 shadow-lg
                transform ${
                  openSideBar ? "translate-x-0" : "-translate-x-full"
                } 
                transition-transform duration-300 ease-in-out`}
          >
            <button
              className="text-lg p-2 absolute top-2 right-2"
              onClick={closeSidebar}
            >
              <ChevronLeft size={24}/>
            </button>
            <div className="mt-20 h-[80%]">
              <SideBar setOpenSideBar={setOpenSideBar} />
            </div>
          </div>

          {/* 🔹 Overlay for Clicking Outside to Close */}
          {openSideBar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={closeSidebar}
            ></div>
          )}

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto">
            <div className="sm:py-1/4">
              <Routes>
                <Route path="/members" element={<Members />} />
                <Route
                  path="/student-registration"
                  element={<StudentRegistration />}
                />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route
                  path="/student-profile"
                  element={
                    <ProtectedRoute role={"student"}>
                      <StudentProfile
                        studentData={user.user_data?.student || {}}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route
                  path="/records"
                  element={
                    <ProtectedRoute role={"admin"}>
                      <Records />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>

      <PopUp />
    </Router>
  );
}
