import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FileComplaint = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    category: "",
    description: "",
    image: null,
  });
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [liveText, setLiveText] = useState("");
  const token = localStorage.getItem("token");
  let recognitionRef = null;
  let silenceTimer = null;
  const departmentMap = {
    Medical: "Health Department",
    Crime: "Police",
    Electricity: "Electricity Board",
    Water: "Municipal Department",
    Sanitation: "Municipal Department",
    Roads: "Municipal Department",
    Others: "General",
  };
  // INPUT 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "category") {
      setDepartment(departmentMap[value] || "");
    }
  };
  // IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  //   VOICE 
  const startVoice = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef = recognition;
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    setIsListening(true);
    setActiveField(field);
    setLiveText("");
    const resetSilence = () => {
      clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        recognition.stop();
      }, 2000);
    };
    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      text = text.replace(/\.$/, "");
      setLiveText(text);
      setFormData((prev) => ({
        ...prev,
        [field]: text, 
      }));
      resetSilence();
    };
    recognition.onerror = () => stopVoice();
    recognition.onend = () => stopVoice();
    recognition.start();
  };
  // STOP 
  const stopVoice = () => {
    if (recognitionRef) {
      recognitionRef.stop();
    }
    clearTimeout(silenceTimer);
    setIsListening(false);
    setActiveField("");
  };
  // SUBMIT 
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("department", department);
      if (formData.image) {
        data.append("image", formData.image);
      }
      const res = await axios.post(
        "http://localhost:5000/api/complaints/create",
        data,
          {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate(
        `/userdashboard/file-complaint/complaint-success/${res.data.complaint.complaintNumber}`
      );
    } catch (error) {
      console.error("Submit Error:", error.response?.data || error.message);
      alert("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* VOICE OVERLAY */}
      {isListening && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl text-white px-8 py-6 rounded-2xl w-[90%] max-w-md text-center">
            <div className="text-xl font-semibold animate-pulse">
              🎤 Speak now
            </div>
            <div className="text-sm mt-1 opacity-80">
              Recording ({activeField})
            </div>
            <div className="mt-4 text-sm min-h-[40px]">
              {liveText || "Listening..."}
            </div>
            <button
              onClick={stopVoice}
              className="mt-5 px-4 py-2 bg-red-500 rounded"
            >
              Stop
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">
          File a Complaint
        </h2>
        {/* NAME */}
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <button type="button" onClick={() => startVoice("name")} className="px-3 bg-gray-200 rounded">
              🎤
            </button>
          </div>
        </div>
        {/* PHONE */}
        <div>
          <label className="block font-semibold mb-1">Phone Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <button type="button" onClick={() => startVoice("phone")} className="px-3 bg-gray-200 rounded">
              🎤
            </button>
          </div>
        </div>
        {/* ADDRESS */}
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <div className="flex gap-2">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <button type="button" onClick={() => startVoice("address")} className="px-3 bg-gray-200 rounded">
              🎤
            </button>
          </div>
        </div>
        {/* CATEGORY */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              !formData.category ? "text-gray-400" : "text-black"
            }`}
            required
          >
            <option value="" disabled hidden>
              Select Category
            </option>
            <option>Medical</option>
            <option>Crime</option>
            <option>Electricity</option>
            <option>Water</option>
            <option>Sanitation</option>
            <option>Roads</option>
            <option>Others</option>
          </select>
        </div>
        {/* DEPARTMENT */}
        <div>
          <label className="block font-semibold mb-1">Department</label>
          <input
            type="text"
            value={department}
            readOnly
            placeholder="Auto-filled based on category"
            className="w-full border p-2 rounded bg-gray-100 text-gray-700 placeholder-gray-400"
          />
        </div>
        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold mb-1">
            Describe Your Issue
          </label>
          <div className="flex gap-2">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <button type="button" onClick={() => startVoice("description")} className="px-3 bg-gray-200 rounded">
              🎤
            </button>
          </div>
        </div>
        {/* IMAGE */}
        <div>
          <label className="block font-semibold mb-2">Upload Image</label>
          <div className="flex items-center gap-4">
            <input type="file" onChange={handleImage} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded border"
              />
            )}
          </div>
        </div>
        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};
export default FileComplaint;