import React, { useEffect, useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setUser(data);

      //  STORE USER ID 
      if (data?.id) {
        localStorage.setItem("userId", data.id);
      }

    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, []);

  // 🏠 DASHBOARD HOME
  const goDashboardHome = () => {
    navigate("/userdashboard");
  };

  // ❌ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between bg-white px-6 py-3 shadow relative">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <FaBars className="text-xl cursor-pointer" onClick={toggleSidebar} />

          <img
            src="/src/assets/logo.png"
            alt="logo"
            className="h-10 cursor-pointer"
            onClick={goDashboardHome}
          />
        </div>

        {/* CENTER HELPLINE */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-700 text-sm font-medium">
          📞 Helpline-111
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-8 pr-6">

          {/* LANGUAGE */}
          <div className="cursor-pointer text-sm text-gray-600">
            EN | ਪੰਜਾਬੀ
          </div>

          {/* USER */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="font-semibold text-blue-700 cursor-pointer"
            >
              👤 {user?.name || "User"}
            </div>

            {/* DROPDOWN */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">

                <div
                  onClick={() => {
                    navigate("/userdashboard/profile");
                    setShowMenu(false); 
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </div>

                <div
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setShowMenu(false); 
                  }}
                  className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/*  LOGOUT MODAL ) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">

            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
              >
                No
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;