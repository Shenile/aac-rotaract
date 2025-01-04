import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useDataContext } from "../contexts/MainDataContext";

export default function SideBar() {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { loading, setLoading } = useDataContext();

  const activeClassStyles =
    "text-green-800 border-r-4 border-green-800 font-semibold";
  const defaultClassStyles = "px-4 py-2 hover:bg-gray-100 transition-all";



  // Define sidebar items
  const baseItems = [
    { link: "/", placeHolder: "Home" },
    { link: "/about", placeHolder: "About" },
    { link: "/members", placeHolder: "Members" },
  ];

  // Role-based items
  const roleBasedItems =
    user && user.user_type
      ? user.user_type === "student"
        ? [
            {
              link: "/student-profile",
              placeHolder: "My Profile",
            },
          ]
        : [{ link: "/records", placeHolder: "Records" }]
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
    <div className="w-full pb-8 flex flex-col justify-between h-[400px] md:h-[512px] gap-6 text-gray-900 bg-gray-100 ">
      {/* Sidebar Items */}
      <div className="pl-4 pt-4 flex flex-col gap-4">
        {SideBarItems.map((item) => (
          <Link
            to={item.link}
            key={item.link}
            className={getLinkClass(item.link)}
          >
            {item.placeHolder}
          </Link>
        ))}
      </div>

      {/* Login/Logout Section */}
      {/* Login/Logout Section */}
      <div className="ml-6 mr-4">
        {user && user.user_type ? (
          <button
            onClick={handlelogout}
            className="font-semibold text-center block w-full border border-red-800 px-2 py-2 rounded-md text-red-800 hover:text-gray-100 hover:bg-red-800"
          >
            Logout
          </button>
        ) : (
          // If user is null or user.user_type is invalid, show the Login link
          <Link
            to="/login"
            className={`font-semibold text-center text-green-800 block w-full border border-green-800 px-4 py-2 rounded-md hover:text-gray-100 hover:bg-green-900 `}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
