import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

// ✅ Use your backend Render URL
const API_URL = "https://job-portal-backend-deploy.onrender.com/api";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="homepage-container">
      <h2>Available Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs available right now.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Type:</strong> {job.type}</p>
              <p><strong>Deadline:</strong> 
                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}
              </p>

              <Link to={`/jobs/${job._id}`}>
                <button className="btn">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
