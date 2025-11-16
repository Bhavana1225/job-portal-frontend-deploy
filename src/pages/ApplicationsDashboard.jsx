import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const ApplicationsDashboard = () => {
  const { token } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data || []);
      } catch (err) {
        console.error("Fetch applications:", err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchApplications();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await api.delete(`/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete application error:", err);
      alert("Failed to delete application");
    }
  };

  const handleEdit = (application) => {
    navigate(`/edit-application/${application._id}`, { state: { application } });
  };

  const handleViewResume = (resume) => {
    if (!resume) {
      alert("Resume not available");
      return;
    }
    // resume is a full URL from Cloudinary — open directly
    window.open(resume, "_blank");
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="applications-container">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="application-card">
            <div className="application-info">
              <h3>{app.job?.title || "Untitled Job"}</h3>
              <p><strong>Company:</strong> {app.job?.company || "N/A"}</p>
              <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="application-actions">
              <button className="btn edit-btn" onClick={() => handleEdit(app)}>
                Edit
              </button>

              <button className="btn delete-btn" onClick={() => handleDelete(app._id)}>
                Delete
              </button>

              <button className="btn view-btn" onClick={() => handleViewResume(app.resume)}>
                View Resume
              </button>
            </div>
          </div>
        ))
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/"><button className="btn btn-save">Back to Home</button></Link>
      </div>
    </div>
  );
};

export default ApplicationsDashboard;
