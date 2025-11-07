import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, setUser, setToken, loading } = useUser();
  const navigate = useNavigate();

  if (loading) return null;

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ padding: "1rem", background: "#004466", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "1rem", color: "#fff" }}>
        Home
      </Link>

      <Link to="/jobs" style={{ marginRight: "1rem", color: "#fff" }}>
        Jobs
      </Link>

      {!user && (
        <Link to="/login" style={{ marginRight: "1rem", color: "#fff" }}>
          Login
        </Link>
      )}

      {!user && (
        <Link to="/register" style={{ marginRight: "1rem", color: "#fff" }}>
          Register
        </Link>
      )}

      {user && (
        <Link to="/profile" style={{ marginRight: "1rem", color: "#fff" }}>
          Profile
        </Link>
      )}

      {user?.role === "employer" && (
        <Link to="/dashboard" style={{ marginRight: "1rem", color: "#fff" }}>
          Dashboard
        </Link>
      )}

      {user?.role === "jobseeker" && (
        <Link to="/applications" style={{ marginRight: "1rem", color: "#fff" }}>
          My Applications
        </Link>
      )}

      {user && (
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}
