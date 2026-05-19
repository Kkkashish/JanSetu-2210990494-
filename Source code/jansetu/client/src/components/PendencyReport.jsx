import { useEffect, useState } from "react";
import axios from "axios";

function PendencyReport() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
axios.get("http://localhost:5000/api/complaints/user/1");      
      // filter pending only
      const pending = res.data
        .filter(c => c.status === "pending")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setComplaints(pending);

    } catch (err) {
      console.log(err);
    }
  };

  const handleWithdraw = async (id) => {
    await axios.put(`http://localhost:5000/api/complaints/status/${id}`, {
  status: "withdrawn"
});
    fetchComplaints();
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pendency Report</h2>

      {complaints.length === 0 ? (
        <p>No complaints by you yet</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Category</th>
              <th className="p-2">Description</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.category}</td>
                <td className="p-2">{c.description}</td>
                <td className="p-2">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-yellow-600 font-semibold">
                  {c.status}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleWithdraw(c.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
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
  );
}

export default PendencyReport;