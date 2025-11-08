import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../styles/style.css";

// ✅ Use your backend Render URL
const API_URL = "https://job-portal-backend-deploy.onrender.com/api";

const EditJob = () => {
  const { token } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("Full-time");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  // ✅ Load job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${API_URL}/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const job = res.data;
        setTitle(job.title || "");
        setDescription(job.description || "");
        setRequirements(job.requirements?.join(", ") || "");
        setLocation(job.location || "");
        setCompany(job.company || "");
        setType(job.type || "Full-time");
        setDeadline(
          job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : ""
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load job details");
      }
    };

    if (id) fetchJob();
  }, [id, token]);

  // ✅ Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Title and description are required");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/jobs/${id}`,
        {
          title,
          description,
          requirements: requirements
            .split(",")
            .map((r) => r.trim())
            .filter((r) => r.length > 0),
          location,
          company,
          type,
          deadline,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to update job");
    }
  };

  return (
    <div className="edit-job-container">
      <h2>Edit Job</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Requirements (comma separated)"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div>
          <button type="submit" className="btn btn-save">
            Save Changes
          </button>
        </div>
      </form>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <Link to="/dashboard">
          <button className="btn btn-edit">Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default EditJob;
