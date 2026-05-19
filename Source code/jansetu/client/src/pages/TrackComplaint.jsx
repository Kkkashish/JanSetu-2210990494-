import { useState } from "react";
import axios from "axios";
export default function TrackComplaint() {
  const [complaintNumber, setComplaintNumber] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    if (!complaintNumber.trim()) {
      setError("Please enter a complaint number");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setComplaint(null);

      const res = await axios.get(
        "http://localhost:5000/api/complaints/all"
      );
      const found = res.data.find(
        (c) =>
          c.complaintNumber.toLowerCase() ===
          complaintNumber.toLowerCase()
      );
      if (!found) {
        setError("No complaint found with this number");
      } else {
        setComplaint(found);
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Track Your Complaint
        </h1>
        <p className="text-gray-500 mt-2">
          Enter your complaint number to view its current status and details
        </p>
      </div>
      {/* SEARCH BOX */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Complaint Number..."
            value={complaintNumber}
            onChange={(e) => setComplaintNumber(e.target.value)}
            className="flex-1 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Track
          </button>
        </div>
        {error && (
          <p className="text-red-500 mt-3 text-sm">{error}</p>
        )}
        {loading && (
          <p className="text-gray-500 mt-3 text-sm">
            Searching...
          </p>
        )}
      </div>
      {/* RESULT */}
      {complaint && (
        <div className="max-w-5xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-xl border">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Complaint Details
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {/* LEFT */}
            <div>
              <p className="text-lg font-semibold mb-2">
                Complaint No: {complaint.complaintNumber}
              </p>
              <p><b>Name:</b> {complaint.name}</p>
              <p><b>Phone:</b> {complaint.phone}</p>
              <p><b>Address:</b> {complaint.address}</p>
              <p><b>Category:</b> {complaint.category}</p>
              <p><b>Department:</b> {complaint.department}</p>
              <p className="mt-4">
                <b>Description:</b><br />
                {complaint.description}
              </p>
              {complaint.translatedDescription && (
                <p className="mt-4">
                  <b>Translated:</b><br />
                  {complaint.translatedDescription}
                </p>
              )}
            </div>
            {/* RIGHT */}
            <div className="flex flex-col gap-4">
              {/* STATUS */}
              <div>
                <b>Status:</b>{" "}
                <span className={`px-3 py-1 text-sm rounded-full font-semibold
                  ${complaint.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : complaint.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"}
                `}>
                  {complaint.status}
                </span>
              </div>
              {/* DATE */}
              <div>
                <b>Filed On:</b>{" "}
                {new Date(complaint.createdAt).toLocaleString()}
              </div>
              {/* IMAGE */}
              {complaint.image && (
                <div className="mt-4">
                  <img
                    src={`http://localhost:5000/uploads/${complaint.image}`}
                    alt="complaint"
                    className="w-40 h-40 object-cover rounded-lg border shadow"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}