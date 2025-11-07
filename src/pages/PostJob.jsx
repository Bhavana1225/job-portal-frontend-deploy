import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/style.css";

const PostJob = () => {
  const { token } = useUser();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("Full-time");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Title and description are required");
      return;
    }

    try {
      await axios.post(
        "https://job-portal-backend-deploy.onrender.com/api/jobs",
        {
          title,
          description,
          requirements: requirements
            ? requirements.split(",").map((r) => r.trim())
            : [],
          location,
          company,
          type,
          deadline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="postjob-container">
      <h2>Post a New Job</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Requirements (comma separated)"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button type="submit" className="btn">Post Job</button>
      </form>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <Link to="/dashboard">
          <button className="btn">Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default PostJob;
