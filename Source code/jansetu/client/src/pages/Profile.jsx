import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const dropdownRef = useRef(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [voterImageFile, setVoterImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
    fetchProfile();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowPhotoOptions(false);
    }
   };

   document.addEventListener("mousedown", handleClickOutside);

   return () => {
    document.removeEventListener("mousedown", handleClickOutside);
   };
   }, []);

   useEffect(() => {
  return () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };
}, [previewImage]);


  const fetchUser = async () => {
    const res = await axios.get("http://localhost:5000/api/users/me", {
      headers: { Authorization: "Bearer " + token }
    });
    setUser(res.data);
  };

  const fetchProfile = async () => {
    const res = await axios.get("http://localhost:5000/api/profile", {
      headers: { Authorization: "Bearer " + token }
    });
    setProfile(res.data.profile || {});
  };

  //  PHONE VALIDATION
  const handlePhone = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) {
      setProfile({ ...profile, phone: val });
    }
  };
  //  VOTER VALIDATION
  const handleVoter = (e) => {
  let val = e.target.value.toUpperCase();

  val = val.replace(/[^A-Z0-9]/g, "");

  if (val.length <= 10) {
    setProfile({ ...profile, voterId: val });
  }
};

  //  SAVE 
    const handleSave = async () => {
    try {
        const formData = new FormData();

        formData.append("phone", profile.phone || "");
        formData.append("gender", profile.gender || "");
        formData.append("location", profile.location || "");
        formData.append("voterId", profile.voterId || "");

        if (profileImageFile) {
        console.log("Uploading profile image...");
        formData.append("profileImage", profileImageFile);
        }

        if (voterImageFile) {
        formData.append("voterImage", voterImageFile);
        }

        await axios.put(
        "http://localhost:5000/api/profile",
        formData,
        {
            headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data"
            }
        }
        );

        alert("Profile updated successfully");

        setEditMode(false);
        fetchProfile();

    } catch (err) {
        console.log(err.response?.data || err);
        alert("Error updating profile");
    }
    };

  // CHANGE PASSWORD
  const handlePasswordUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/profile/change-password",
        passwordData,
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      alert(res.data.message);

      setShowPasswordBox(false);
      setPasswordData({ currentPassword: "", newPassword: "" });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6">
        
{/* PROFILE IMAGE */}
  <div className="mb-6">

  <div className="flex items-center gap-6">
    
    {/* IMAGE */}
    <div className="relative">
      <img
        src={
        previewImage
            ? previewImage
            : `http://localhost:5000/uploads/${
                profile.profileImage || "default-profile.jpg"
            }`
        }
        alt="profile"
        className="w-24 h-24 rounded-full object-cover border"
      />

      {editMode && (
    <>
      {/* + BUTTON */}
      <button
        onClick={() => setShowPhotoOptions(!showPhotoOptions)}
        className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full px-2 cursor-pointer"
      >
        +
      </button>

      {/* POPUP BOX */}
      {showPhotoOptions && (
        <div ref = {dropdownRef}
        className="absolute left-full ml-2 bottom-0 bg-white shadow-lg rounded-md p-2 w-36 z-10">

          {/* EDIT PHOTO */}
          <label className="block px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer">
            Add/Edit Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
            const file = e.target.files[0];
            setProfileImageFile(file);

            if (file) {
                setPreviewImage(URL.createObjectURL(file));
            }
                setShowPhotoOptions(false);
              }}
            />
          </label>

          {/* REMOVE PHOTO */}
          <button
            className="w-full text-left px-2 py-1 text-sm text-red-500 hover:bg-gray-100"
            onClick={() => {
              setProfile((prev) => ({ ...prev, profileImage: "" }));
              setShowPhotoOptions(false);
            }}
          >
            Remove Photo
          </button>

        </div>
      )}
      </>
      )}
    </div>

    {/* USER INFO */}
    <div>
      <p className="text-lg font-semibold">{user?.name}</p>
      <p className="text-gray-500">{user?.email}</p>

      <p className="text-sm text-gray-400">
        Member since{" "}
        {user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit"
            })
          : ""}
      </p>
    </div>

  </div>
</div>

    {/* FORM */}
    <div className="grid grid-cols-2 gap-6">

    {/* LEFT COLUMN */}
    <div className="flex flex-col gap-4">

    {/* PHONE */}
    <div>
      <label className="text-sm text-gray-600">Phone</label>
      <div className="flex">
        <span className="p-2 bg-gray-200">+91</span>
        <input
          type="text"
          value={profile.phone || ""}
          disabled={!editMode}
          onChange={handlePhone}
          className="border p-2 w-full"
        />
      </div>
    </div>

    {/* LOCATION */}
    <div>
      <label className="text-sm text-gray-600">Location</label>
      <input
        type="text"
        value={profile.location || ""}
        disabled={!editMode}
        onChange={(e) =>
          setProfile((prev) => ({ ...prev, location: e.target.value }))
        }
        className="border p-2 rounded w-full"
      />
    </div>

  </div>

  {/* RIGHT COLUMN */}
  <div className="flex flex-col gap-4">

    {/* GENDER */}
    <div>
      <label className="text-sm text-gray-600">Gender</label>
      <select
        disabled={!editMode}
        value={profile.gender || ""}
        onChange={(e) =>
          setProfile((prev) => ({ ...prev, gender: e.target.value }))
        }
        className="border p-2 rounded w-full"
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>

    {/* VOTER ID + IMAGE */}
    <div>
      <label className="text-sm text-gray-600">Voter ID</label>

      <input
        type="text"
        placeholder="ABC1234567"
        value={profile.voterId || ""}
        disabled={!editMode}
        onChange={handleVoter}
        className="border p-2 rounded w-full"
      />
      
       <label className="text-sm text-gray-700 mb-1">Upload Voter ID Image</label>      {editMode && (
        <input
          type="file"
          className="mt-2"
          onChange={(e) => setVoterImageFile(e.target.files[0])}
        />
      )}
    </div>

  </div>

</div>

        {/* PASSWORD */}
        <div className="mt-6">
          <button
            onClick={() => setShowPasswordBox(!showPasswordBox)}
            className="text-blue-600 underline"
          >
            Change Password
          </button>

          {showPasswordBox && (
            <div className="mt-4 space-y-3">

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Current Password"
                  className="border p-2 w-full rounded"
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })
                  }
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="border p-2 w-full rounded"
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })
                  }
                />
              </div>

              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-gray-600"
              >
                👁 Toggle Password
              </button>

              <button
                onClick={handlePasswordUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}