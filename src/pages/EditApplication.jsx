import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../context/UserContext";
import "../styles/style.css";

const EditApplication = () => {
  const { id } = useParams();
  const { token } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // Try to get data from navigation state first
        if (location.state?.application) {
          const app = location.state.application;
          setFormData({
            coverLetter: app.coverLetter || "",
            resume: app.resume || "",
          });
          setLoading(false);
        } else {
          // Otherwise fetch from backend
          const res = await api.get(`/applications/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFormData({
            coverLetter: res.data.coverLetter || "",
            resume: res.data.resume || "",
          });
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load application");
        setLoading(false);
      }
    };

    if (id && token) fetchApplication();
  }, [id, token, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(
        `/applications/${id}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/applications");
    } catch (err) {
      setError("Failed to update application");
    }
  };

  if (loading) return <p>Loading application...</p>;

  return (
    <div className="edit-job-container">
      <h2>Edit Application</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            name="coverLetter"
            placeholder="Cover Letter"
            value={formData.coverLetter}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="resume"
            placeholder="Resume URL or file path"
            value={formData.resume}
            onChange={handleChange}
          />
        </div>

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
