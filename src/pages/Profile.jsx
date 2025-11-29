import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const API_URL = "https://job-portal-backend-deploy.onrender.com/api";

const Profile = () => {
  const { user, token, setUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    skills: "",
    experience: "",
    education: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contact: user.contact || "",
        skills: user.skills || "",
        experience: user.experience || "",
        education: user.education || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.put(`${API_URL}/users/profile`, formData, config);

      // ✅ Fix: preserve all fields including skills
      const updatedUser = {
        name: data.name || formData.name,
        email: data.email || formData.email,
        contact: data.contact || formData.contact,
        skills: data.skills !== undefined ? data.skills : formData.skills,
        experience: data.experience || formData.experience,
        education: data.education || formData.education
      };

      // Update context and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setFormData(updatedUser); // update form so fields are not blank
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleUpdate}>
        {["name", "email", "contact", "skills", "experience", "education"].map((field) => (
          <div className="profile-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field === "name" || field === "email"}
            />
          </div>
        ))}

        <div className="profile-actions">
          <button type="submit" className="btn btn-save">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
