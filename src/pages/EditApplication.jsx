import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const EditApplication = () => {
  const { id } = useParams();
  const { token } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resumeFile: null,
    existingResume: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch single application from /applications/me then find by id
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get("/applications/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const app = (res.data || []).find((a) => a._id === id);
        if (app) {
          setFormData({
            name: app.name || "",
            email: app.email || "",
            resumeFile: null,
            existingResume: app.resume || ""
          });
        } else {
          setError("Application not found");
        }
      } catch (err) {
        console.error("Error loading application:", err);
        setError("Failed to load application");
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchApplication();
  }, [token, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (formData.resumeFile) data.append("resume", formData.resumeFile);

      await api.put(`/applications/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      navigate("/applications");
    } catch (err) {
      console.error("Error updating application:", err);
      setError("Failed to update application");
    }
  };

  if (loading) return <p>Loading application...</p>;

  return (
    <div className="edit-job-container">
      <h2>Edit Application</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {formData.existingResume && (
          <p>
            <strong>Current Resume:</strong>{" "}
            <a href={formData.existingResume} target="_blank" rel="noopener noreferrer">View Uploaded Resume</a>
          </p>
        )}

        <input
          type="file"
          name="resumeFile"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-save">Save Changes</button>
      </form>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <Link to="/applications"><button className="btn btn-edit">Back to Applications</button></Link>
      </div>
    </div>
  );
};

export default EditApplication;
