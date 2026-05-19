import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import "../styles/animations.css";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [confirmStatus, setConfirmStatus] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/all");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/status/${id}`, {
        status: newStatus,
      });

      fetchComplaints();
      setOpenDropdownId(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      c.name?.toLowerCase().includes(searchText) ||
      c.phone?.includes(searchText) ||
      c.category?.toLowerCase().includes(searchText) ||
      c.department?.toLowerCase().includes(searchText) ||
      c.description?.toLowerCase().includes(searchText) ||
      c.address?.toLowerCase().includes(searchText) ||
      c.complaintNumber?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "priority") {
      return (b.priority || 0) - (a.priority || 0);
    }
    if (sortBy === "department") {
      return (a.department || "").localeCompare(b.department || "");
    }
    return 0;
  });

  const maxPriority = Math.max(
    ...complaints.map((c) => Number(c.priority) || 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {!id && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-3 mb-5 flex-wrap">
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-1/3 border px-4 py-2 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border px-4 py-2 rounded-lg"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="In Progress">In Progress</option>
            </select>

            <select
              className="border px-4 py-2 rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority (High → Low)</option>
              <option value="department">Department (A → Z)</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left">Complaint No.</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Priority</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {sortedComplaints.map((c) => {
                  const priority = Number(c.priority) || 0;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-gray-50 ${
                        priority === maxPriority ? "priority-highlight" : ""
                      }`}
                    >
                      <td
                        onClick={() => navigate(`/admindashboard/${c.id}`)}
                        className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
                      >
                        {c.complaintNumber}
                      </td>

                      <td className="px-6 py-4">{c.name}</td>
                      <td className="px-6 py-4">{c.phone}</td>
                      <td className="px-6 py-4">{c.category}</td>
                      <td className="px-6 py-4">{c.department}</td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold
                          ${priority >= 9
                            ? "bg-red-100 text-red-700"
                            : priority >= 7
                            ? "bg-orange-100 text-orange-700"
                            : priority >= 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"}
                        `}>
                          {priority}
                        </span>
                      </td>


                      <td className="px-6 py-4">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.target.getBoundingClientRect();

                            setOpenDropdownId(c.id);
                            setDropdownPosition({
                              top: rect.bottom + 5,
                              left: rect.left,
                            });
                          }}
                          className={`px-3 py-1 text-xs rounded-full font-semibold cursor-pointer
                            ${c.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : c.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"}
                          `}
                        >
                          {c.status}
                        </span>

                        {openDropdownId === c.id && (
                          <div
                            className="fixed w-32 bg-white border rounded shadow z-50"
                            style={{
                              top: dropdownPosition.top,
                              left: dropdownPosition.left,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {["Pending", "In Progress", "Resolved"].map((status) => (
                              <div
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmStatus({ id: c.id, status });
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {status}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/*  STATUS CONFIRM MODAL */}
      {confirmStatus && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Change status to "{confirmStatus.status}"?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  updateStatus(confirmStatus.id, confirmStatus.status);
                  setConfirmStatus(null);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Yes
              </button>

              <button
                onClick={() => setConfirmStatus(null)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL  */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  window.location.href = "/";
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}