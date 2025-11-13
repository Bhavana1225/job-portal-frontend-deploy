import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const ApplicationsDashboard = () => {
  const { token, user } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load applications");
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await api.delete(`/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        alert("Failed to delete application");
      }
    }
  };

  const handleEdit = (application) => {
    navigate(`/edit-application/${application._id}`, {
      state: { application },
    });
  };

  const handleViewResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      alert("Resume not available");
    }
  };

  if (loading) {
    return <p>Loading applications...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="job-list">
          {applications.map((app) => (
            <div key={app._id} className="job-card">
              <h3>{app.job?.title || "Untitled Job"}</h3>
              <p><strong>Company:</strong> {app.job?.company || "N/A"}</p>
              <p><strong>Cover Letter:</strong> {app.coverLetter || "—"}</p>

              <div className="button-group">
                <button
                  className="btn btn-edit"
                  onClick={() => handleEdit(app)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(app._id)}
                >
                  Delete
                </button>

                <button
                  className="btn btn-view"
                  onClick={() => handleViewResume(app.resume)}
                >
                  View Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/">
          <button className="btn btn-save">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default ApplicationsDashboard;
