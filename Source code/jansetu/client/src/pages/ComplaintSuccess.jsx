import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ComplaintSuccess = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);


  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      
      <h1 style={{ color: "green" }}>
        ✅ Complaint Submitted Successfully
      </h1>

      <h3 style={{ marginTop: "20px" }}>
        Your Complaint Number:
      </h3>

      <h1 style={{ fontSize: "40px", color: "#007bff" }}>
        {id}
      </h1>

      <p style={{ marginTop: "10px" }}>
        Please save this ID to track your complaint.
      </p>

      {/* COPY BUTTON */}
      <button
        onClick={() => {
            navigator.clipboard.writeText(id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }}
        style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer"
        }}
>
  {copied ? "Copied ✅" : "Copy Complaint ID"}
</button>

      <br /><br />

      {/* TRACK BUTTON */}
      <button
        onClick={() => navigate("/userdashboard/track-complaint")}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Track Complaint
      </button>

    </div>
  );
};

export default ComplaintSuccess;
