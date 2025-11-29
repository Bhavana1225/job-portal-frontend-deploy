import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const ApplicationForm = ({ jobId }) => {
  const { user, token } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !resume) {
      setError("All fields including resume are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("resume", resume); // name must match multer field

      const response = await axios.post(
        `https://job-portal-backend-deploy.onrender.com/api/applications/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Application submitted successfully");
        setError("");
        setResume(null);
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err.response?.data?.message || "Failed to submit application");
      setSuccess("");
    }
  };

  return (
    <div className="application-form-container">
      <h3>Apply for this Job</h3>

      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="file"
          name="resume" // must match Multer field
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          required
        />

        <button type="submit" className="btn">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
