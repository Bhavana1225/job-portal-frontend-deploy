import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, loading: userLoading } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user || !token) return; // wait until user & token are ready

      try {
        const res = await axios.get("http://localhost:5000/api/jobs/employer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) fetchJobs(); // only fetch after context finishes loading
  }, [user, token, userLoading]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
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
        `http://localhost:5000/api/jobs/${id}/filled`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map((job) => (job._id === id ? res.data : job)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (userLoading || loading) return <p>Loading your jobs...</p>;
  if (!user || !token) return <p>Please login to access your dashboard</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Employer Dashboard</h2>
      <Link to="/post-job">
        <button className="btn">Post New Job</button>
      </Link>

      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.type}</td>
                <td>{job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</td>
                <td>{job.filled ? "Closed" : "Open"}</td>
                <td>
                  <button className="btn" onClick={() => navigate(`/edit-job/${job._id}`)}>
                    Edit
                  </button>
                  <button className="btn" onClick={() => handleDelete(job._id)}>
                    Delete
                  </button>
                  <button
                    className="btn"
                    disabled={updatingId === job._id}
                    onClick={() => handleToggleFilled(job._id)}
                  >
                    {job.filled ? "Mark Open" : "Mark Closed"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
