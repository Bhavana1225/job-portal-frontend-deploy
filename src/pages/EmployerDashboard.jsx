import React, { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

// ✅ Use your backend Render URL
const API_URL = "https://job-portal-backend-deploy.onrender.com/api";

const Dashboard = () => {
  const { user, token } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchJobs = async () => {
    if (!user || !token) return;
    try {
      const res = await axios.get(`${API_URL}/jobs/employer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  const handleToggleFilled = async (id) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `${API_URL}/jobs/${id}/filled`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map((job) => (job._id === id ? res.data : job)));
    } catch (err) {
      console.error(err);
      alert("Failed to update job status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading your jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Employer Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/post-job">
          <button className="btn">Post New Job</button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Type:</strong> {job.type}</p>
              <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</p>
              <p><strong>Status:</strong> {job.filled ? "Closed" : "Open"}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "10px" }}>
                <Link to={`/edit-job/${job._id}`}>
                  <button className="btn btn-edit">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="btn"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleToggleFilled(job._id)}
                  className="btn"
                  disabled={updatingId === job._id}
                >
                  {job.filled ? "Mark Open" : "Mark Closed"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
