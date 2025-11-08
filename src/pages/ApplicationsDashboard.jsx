import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api"; // using api.js
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const ApplicationsDashboard = () => {
  const { token } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    if (!token) return;

    try {
      const res = await api.get("/applications/me"); // ✅ matches backend route
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="applications-dashboard">
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Applied On</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.job?.title || "N/A"}</td>
                <td>{app.job?.company || "N/A"}</td>
                <td>{app.job?.location || "N/A"}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  {app.resume ? (
                    <a
                      href={`https://job-portal-backend-deploy.onrender.com/uploads/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/">
        <button className="btn" style={{ marginTop: "20px" }}>
          Back to Jobs
        </button>
      </Link>
    </div>
  );
};

export default ApplicationsDashboard;
