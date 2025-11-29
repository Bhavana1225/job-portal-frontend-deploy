import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const API_URL = "https://job-portal-backend-deploy.onrender.com/api";

const EditApplication = () => {
  const { id } = useParams(); // application _id
  const { token } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null,
    existingResume: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`${API_URL}/applications/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const app = res.data.find((a) => a._id === id);

        if (app) {
          setFormData({
            name: app.name,
            email: app.email,
            resume: null,
            existingResume: app.resume // <-- fix: use full URL from MongoDB
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading application:", err);
        setError("Failed to load application");
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

      if (formData.resume) data.append("resume", formData.resume);

      await axios.put(`${API_URL}/applications/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
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

        

        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-save">
          Save Changes
        </button>
      </form>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <Link to="/applications">
          <button className="btn btn-edit">Back to Applications</button>
        </Link>
      </div>
    </div>
  );
};

export default EditApplication;
