import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar"; 
import "../styles/dashboard.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  const token = localStorage.getItem("token");
  // FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };
    if (token) fetchUser();
  }, [token]);
  // FETCH COMPLAINTS
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/complaints/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComplaints(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Complaint fetch error:", err);
        setComplaints([]);
      }
    };
    if (token) fetchComplaints();
  }, [token]);
  //  WITHDRAW 
  const handleWithdraw = async () => {
    if (!selectedId) {
      console.log("No ID selected");
      return;
    }
    try {
      console.log("Deleting ID:", selectedId);
      const res = await axios.delete(
        `http://localhost:5000/api/complaints/${selectedId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Delete success:", res.data);
      setComplaints(prev =>
        prev.filter(c => c.id !== selectedId)
      );
      setShowConfirm(false);
      setSelectedId(null);
    } catch (err) {
      console.log(
        "Delete error:",
        err.response?.data || err.message
      );
    }
  };
  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-30 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      {location.pathname === "/userdashboard" && (
        <div className="dashboard-container">
          {/* HERO */}
          <div className="hero">
            <div>
              <h2>Welcome back, {user?.name || "User"} 👋</h2>
              <p>Manage and track your complaints easily</p>
            </div>
            <button
              className="primary-btn"
              onClick={() => navigate("file-complaint")}
            >
              + New Complaint
            </button>
          </div>
          {/* STATS */}
          <div className="stats-row">
            <div className="stat-card total">
              <h4>Total</h4>
              <p>{complaints.length}</p>
            </div>
            <div className="stat-card pending">
              <h4>Pending</h4>
              <p>{complaints.filter(c => c.status === "Pending").length}</p>
            </div>
            <div className="stat-card progress">
              <h4>In Progress</h4>
              <p>{complaints.filter(c => c.status === "In Progress").length}</p>
            </div>
            <div className="stat-card resolved">
              <h4>Resolved</h4>
              <p>{complaints.filter(c => c.status === "Resolved").length}</p>
            </div>
          </div>
          {/* ACTION */}
          <div className="card-section">
            <div
              className="card modern primary-card"
              onClick={() => navigate("file-complaint")}
            >
              <h3>📝 FILE COMPLAINT</h3>
              <p>Register a new issue quickly</p>
            </div>
            <div
              className="card modern secondary-card"
              onClick={() => navigate("track-complaint")}
            >
              <h3>📍 TRACK COMPLAINT</h3>
              <p>Check real-time status</p>
            </div>
          </div>
          {/* TABLE */}
          <div className="table-card">
            <div className="table-header">
              <h3>Complaint History</h3>
            </div>
            {complaints.length === 0 ? (
              <div className="empty-state">
                <p>No complaints filed yet 🚀</p>
                <button onClick={() => navigate("file-complaint")}>
                  File Your First Complaint
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Complaint No</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id}>
                      <td>{c.complaintNumber}</td>

                      <td>
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <span className={`status ${
                          c.status === "Pending"
                            ? "pending"
                            : c.status === "In Progress"
                            ? "progress"
                            : "resolved"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="withdraw-btn"
                          disabled={c.status === "Resolved"}
                          onClick={() => {
                            console.log("Clicked ID:", c.id); // 🔍 debug
                            setSelectedId(c.id);
                            setShowConfirm(true);
                          }}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {/*  CONFIRM MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to withdraw this complaint?</p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button onClick={handleWithdraw} className="danger">
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
};
export default UserDashboard;