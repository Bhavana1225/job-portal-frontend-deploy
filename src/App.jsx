import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import ApplicationForm from "./pages/ApplicationForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import EditJob from "./pages/EditJob";
import ApplicationsDashboard from "./pages/ApplicationsDashboard";
import Navbar from "./components/Navbar";
import { useUser } from "./context/UserContext";

function App() {
  const { user } = useUser();

  return (
    <div>
      <header>
        <Navbar />
      </header>

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/apply/:id" element={<ApplicationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile route */}
          <Route path="/profile" element={user ? <Profile /> : <Login />} />

          {/* Employer routes */}
          {user?.role === "employer" && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/edit-job/:id" element={<EditJob />} />
            </>
          )}

          {/* Jobseeker routes */}
          {user?.role === "jobseeker" && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applications" element={<ApplicationsDashboard />} />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Homepage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
