import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";

const API_URL = "https://job-portal-backend-deploy.onrender.com/api";

const ApplicationsDashboard = () => {
  const { token } = useUser();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_URL}/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err.response?.data || err.message);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchApplications();
  }, [token]);

  // ✅ Delete application
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await axios.delete(`${API_URL}/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Error deleting application:", err.response?.data || err.message);
      setError("Failed to delete application");
    }
  };

  // ✅ Edit application (redirects properly)
  const handleEdit = (jobId, appId) => {
    if (jobId && appId) {
      navigate(`/edit-application/${appId}`);
    } else {
      alert("Job or Application not found");
    }
  };

  // ✅ View Resume (handles both local and remote URLs)
  const getResumeLink = (resumePath) => {
    if (!resumePath) return "";
    if (resumePath.startsWith("http")) return resumePath;
    return `${API_URL.replace("/api", "")}/${resumePath}`;
  };

  if (loading) return <p>Loading your applications...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>You haven’t applied for any jobs yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <h3>{app.job?.title || "Job Title Unavailable"}</h3>
              <p><strong>Company:</strong> {app.job?.company || "N/A"}</p>
              <p><strong>Location:</strong> {app.job?.location || "N/A"}</p>
              <p><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>

              <div className="application-actions">
                {/* ✅ View Resume */}
                {app.resume ? (
                  <a
                    href={getResumeLink(app.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-view"
                  >
                    View Resume
                  </a>
                ) : (
                  <p>No Resume Uploaded</p>
                )}

                {/* ✅ Edit Application */}
                <button
                  onClick={() => handleEdit(app.job?._id, app._id)}
                  className="btn btn-edit"
                >
                  Edit
                </button>

                {/* ✅ Delete Application */}
                <button
                  onClick={() => handleDelete(app._id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsDashboard;
