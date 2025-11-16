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
        const res = await axios.get(
          `http://localhost:5000/api/applications/user/${user._id}`
        );
        setApplications(res.data);
      } catch (error) {
        console.log("Error fetching applications", error);
      }
    };
    fetchApplications();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`);
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
            <div className="application-info">
              <h3>{app.jobTitle}</h3>
              <p><strong>Company:</strong> {app.companyName}</p>
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

              {app.resumeUrl && (
                <a
                  href={app.resumeUrl}
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
