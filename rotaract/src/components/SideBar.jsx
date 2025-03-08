import React, { Fragment, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useDataContext } from "../contexts/MainDataContext";
import { LogOut, LogIn, Home, NotebookText, Users2, Database, UserSquare2 } from "lucide-react";

export default function SideBar({ setOpenSideBar = null }) {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { loading, setLoading } = useDataContext();

  const activeClassStyles = `text-green-800 border-r-4 border-green-700 font-semibold`;
  const defaultClassStyles = "px-4 py-2 hover:bg-gray-100 transition-all";

  // Define sidebar items
  const baseItems = [
    { link: "/", placeHolder: "Home", icon: <Home size={20}/> },
    { link: "/about", placeHolder: "About", icon: <NotebookText size={20} /> },
    { link: "/members", placeHolder: "Members", icon: <Users2 size={20} /> },
  ];

  // Role-based items
  const roleBasedItems =
    user && user.user_type
      ? user.user_type === "student"
        ? [
            {
              link: "/student-profile",
              placeHolder: "My Profile",
              icon: <UserSquare2 size={20} />,
            },
          ]
        : [{ link: "/records", placeHolder: "Records", icon: <Database size={20} /> }]
      : [];

  const handlelogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      alert("Error : ", err);
    } finally {
      navigate("/");
      setLoading(false);
    }
  };

  // Merge base and role-based items
  const SideBarItems = [...baseItems, ...roleBasedItems];

  const getLinkClass = (path) =>
    location.pathname === path
      ? `${defaultClassStyles} ${activeClassStyles}`
      : defaultClassStyles;

  return (
    <div className="w-full h-full text-sm  flex flex-col justify-between  md:h-[512px] md:pb-8 gap-6 text-gray-900 bg-gray-100 z-50">
      {/* Sidebar Items */}
      <div className="pl-4 pt-4 flex flex-col gap-4">
        {SideBarItems.map((item) => (
          <Link
            to={item.link}
            key={item.link}
            className={getLinkClass(item.link)}
            {...(setOpenSideBar
              ? { onClick: () => setOpenSideBar(false) }
              : {})}
          >
            <div class="flex gap-2 items-center">
              <Fragment>{item.icon}</Fragment>
              <span>{item.placeHolder}</span>
            </div>
            
           
          </Link>
        ))}
      </div>

      {/* Login/Logout Section */}
      {/* Login/Logout Section */}
      <div className="ml-6 mr-4">
        <div class=" my-4"></div>
        {user && user.user_type ? (
          <button
            onClick={handlelogout}
            className="text-left font-semibold block w-full  
             text-red-800 "
          >
            <LogOut size={24} className="inline mr-2" />
            Logout
          </button>
        ) : (
          // If user is null or user.user_type is invalid, show the Login link
          <Link
            onClick={setOpenSideBar ? () => setOpenSideBar(false) : null}
            to="/login"
            className={`font-semibold text-left text-green-800 block w-full 
              `}
          >
            <LogIn size={24} className="inline mr-2" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
