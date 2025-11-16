import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const ApplicationDashboard = () => {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("https://job-portal-backend-deploy.onrender.com/api/applications/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setApplications(res.data);
      } catch (error) {
        console.log("Error fetching applications", error);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://job-portal-backend-deploy.onrender.com/api/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      setApplications(applications.filter((app) => app._id !== id));
    } catch (error) {
      console.log("Error deleting application", error);
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

            {/* APPLICATION INFO */}
            <div className="application-info">
              <h3>{app.job?.title}</h3>
              <p><strong>Company:</strong> {app.job?.company}</p>
              <p><strong>Applied On:</strong> {new Date(app.createdAt).toDateString()}</p>
            </div>

            {/* BUTTONS */}
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

              {app.resume && (
                <a
                  href={`https://job-portal-backend-deploy.onrender.com/${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn view-btn"
                >
                  View Resume
                </a>
              )}
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationDashboard;
