import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles/style.css"; // keep your existing styles

const ApplicationsDashboard = () => {
  const { user, token } = useUser();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "https://job-portal-backend-deploy.onrender.com/api/applications/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://job-portal-backend-deploy.onrender.com/api/applications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(applications.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return (
    <div className="applications-container">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="application-card">
            <div className="application-info">
              <h3>{app.job?.title}</h3>
              <p><strong>Company:</strong> {app.job?.company}</p>
              <p><strong>Applied On:</strong> {new Date(app.createdAt).toDateString()}</p>
            </div>

            <div className="application-actions">
              <Link to={`/edit-application/${app._id}`} className="btn edit-btn">
                Edit
              </Link>

              <button
                onClick={() => handleDelete(app._id)}
                className="btn delete-btn"
              >
                Delete
              </button>

              
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationsDashboard;
