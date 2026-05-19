import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/complaints/all`
      );

      const found = res.data.find((c) => c.id == id);
      setComplaint(found);
    } catch (err) {
      console.log(err);
    }
  };

  if (!complaint) return <div className="p-6">Loading...</div>;

  // PRIORITY STYLE
  const p = Number(complaint.priority) || 0;

  let label = "Low";
  let style = "bg-green-100 text-green-700 border-green-200";

  if (p >= 9) {
    label = "Critical";
    style = "bg-red-100 text-red-700 border-red-200";
  } else if (p >= 7) {
    label = "High";
    style = "bg-orange-100 text-orange-700 border-orange-200";
  } else if (p >= 5) {
    label = "Medium";
    style = "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admindashboard")}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Complaint Details
      </h1>

      <div className="bg-white p-6 rounded-xl shadow border">

        {/* 🔥 MAIN 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT SIDE (TEXT — NO GAP NOW) */}
          <div>
            <p className="text-lg font-semibold text-blue-700">
              Complaint No: {complaint.complaintNumber}
            </p>

            <p className="mt-2"><b>Name:</b> {complaint.name}</p>
            <p><b>Phone:</b> {complaint.phone}</p>
            <p><b>Address:</b> {complaint.address}</p>
            <p><b>Category:</b> {complaint.category}</p>
            <p><b>Department:</b> {complaint.department}</p>

            <p className="mt-4">
              <b>Description:</b><br />
              {complaint.description}
            </p>

            <p className="mt-4">
              <b>Translated:</b><br />
              {complaint.translatedDescription}
            </p>
          </div>

          {/* RIGHT SIDE (BADGES + IMAGE BELOW) */}
          <div className="flex flex-col justify-start gap-4">

            {/* PRIORITY */}
            <div>
              <b>Priority:</b>{" "}
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${style}`}>
                {p} ({label})
              </span>
            </div>

            {/* STATUS */}
            <div>
              <b>Status:</b>{" "}
              <span className={`px-3 py-1 text-sm font-semibold rounded-full
                ${complaint.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
                }`}>
                {complaint.status}
              </span>
            </div>

            {/* DATE */}
            <div>
              <b>Complaint Filing Date and Time :</b>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </div>

            {/* IMAGE BELOW */}
            {complaint.image && (
              <div className="mt-4">
                <img
                  src={`http://localhost:5000/uploads/${complaint.image}`}
                  alt="complaint"
                  className="w-32 h-32 object-cover rounded border"                />
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}