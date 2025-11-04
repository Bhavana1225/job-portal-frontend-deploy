import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const Profile = () => {
  const { user, token, setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setContact(user.contact || "");
      setSkills(user.skills || "");
      setExperience(user.experience || "");
      setEducation(user.education || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        { name, email, contact, skills, experience, education },
        config
      );

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleUpdate}>
        <div className="profile-field">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="profile-field">
          <label>Contact</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
        </div>

        <div className="profile-field">
          <label>Skills</label>
          <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>

        <div className="profile-field">
          <label>Experience</label>
          <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} />
        </div>

        <div className="profile-field">
          <label>Education</label>
          <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} />
        </div>

        <div className="profile-actions">
          <button type="submit" className="btn btn-save">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
