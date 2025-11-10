import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
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
      const res = await api.get("/applications/me");
      setApplications(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await api.delete(`/applications/${id}`);
      setApplications(applications.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete application");
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.job?.title}</td>
                <td>{app.job?.company}</td>
                <td>{app.job?.location}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  {app.resume ? (
                    <a href={app.resume} target="_blank" rel="noreferrer">
                      View Resume
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-small delete-btn"
                    onClick={() => handleDelete(app._id)}
                    style={{ background: "red" }}
                  >
                    Delete
                  </button>
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
