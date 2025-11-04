import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles/style.css";

const ApplicationsDashboard = () => {
  const { user, token } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingApp, setEditingApp] = useState(null);
  const [newResume, setNewResume] = useState(null);

  // Fetch user's applications
  const fetchApplications = async () => {
    if (!user || !token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/applications/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  }, [user, token]);

  // Delete application
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Error deleting application:", err);
      alert(err.response?.data?.message || "Failed to delete application");
    }
  };

  // Edit application
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      const formData = new FormData();
      formData.append("name", editingApp.name.trim());
      formData.append("email", editingApp.email.trim());
      if (newResume) formData.append("resume", newResume);

      const res = await axios.put(
        `http://localhost:5000/api/applications/${editingApp._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setApplications(applications.map((app) =>
        app._id === editingApp._id ? res.data.application : app
      ));
      setEditingApp(null);
      setNewResume(null);
    } catch (err) {
      console.error("Error updating application:", err);
      alert(err.response?.data?.message || "Failed to update application");
    }
  };

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
                <td>{app.job?.title || "N/A"}</td>
                <td>{app.job?.company || "N/A"}</td>
                <td>{app.job?.location || "N/A"}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  {app.resume ? (
                    <a
                      href={`http://localhost:5000/uploads/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : "N/A"}
                </td>
                <td>
                  <button onClick={() => setEditingApp(app)} className="btn">Edit</button>
                  <button onClick={() => handleDelete(app._id)} className="btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Application Modal / Form */}
      {editingApp && (
        <div className="edit-application-form" style={{ marginTop: "20px" }}>
          <h3>Edit Application for: {editingApp.job?.title}</h3>
          <form onSubmit={handleEditSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>Name</label>
              <input
                type="text"
                value={editingApp.name}
                onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Email</label>
              <input
                type="email"
                value={editingApp.email}
                onChange={(e) => setEditingApp({ ...editingApp, email: e.target.value })}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Update Resume (optional)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setNewResume(e.target.files[0])}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <button type="submit" className="btn" style={{ marginRight: "10px" }}>Update</button>
            <button type="button" onClick={() => setEditingApp(null)} className="btn">Cancel</button>
          </form>
        </div>
      )}

      <Link to="/">
        <button className="btn" style={{ marginTop: "20px" }}>Back to Jobs</button>
      </Link>
    </div>
  );
};

export default ApplicationsDashboard;
