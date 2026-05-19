import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  //  FETCH REAL USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();
        setUser(data);

      } catch (err) {
        console.log("User fetch error:", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* PROFILE */}
      <div className="sidebar-profile">
        <div className="avatar">
          {user?.name ? user.name[0].toUpperCase() : "U"}
        </div>
        <h4>{user?.name || "User"}</h4>
      </div>

      {/* MAIN NAV */}
      <div className="sidebar-section">
        <p className="section-title">Main</p>

        <button onClick={() => navigate("/userdashboard")}>
          🏠 Home Page 
        </button>

        <button onClick={() => navigate("file-complaint")}>
          📝 File Complaint
        </button>

        <button onClick={() => navigate("track-complaint")}>
          📍 Track Complaint
        </button>
      </div>

      {/* QUICK */}
      <div className="sidebar-section">
        <p className="section-title">Quick Actions</p>

        <button onClick={() => navigate("file-complaint")}>
          ⚡ New Complaint
        </button>

        <button onClick={() => navigate("track-complaint")}>
          🔎 Check Status
        </button>
      </div>

      {/* 🔥 SUPPORT */}
      <div className="sidebar-section support-box">
        <p className="section-title">Support</p>

        <div className="support-item">
          📧 <span>jansetu_gov@gmail.com</span>
        </div>

        <div className="support-item">
          📞 <span>Helpline: 111</span>
        </div>

        <p className="support-msg">
          We're here to assist you with your concerns anytime.
        </p>
      </div>

      {/* 🔥 LOGOUT */}
      <div className="sidebar-bottom">
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;