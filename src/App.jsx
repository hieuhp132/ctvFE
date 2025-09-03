import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/login/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/Admin/Dashboard";
import SignUp from "./components/signup/SignUp";
import Navbar from "./components/Navbar";
import ViewProfile from "./components/Profile/ViewProfile";
import MyBrand from "./components/Profile/MyBrand";
import MyCandidates from "./components/Profile/MyCandidates";
import SavedJobs from "./components/Profile/SavedJobs";
import JobDetail from "./components/JobDetail";

function PrivateRoute({ children, role }) {
  const { user, authReady } = useAuth();
  if (!authReady) return null; // or a loader
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function RootRedirect() {
  const { user, authReady } = useAuth();
  if (!authReady) return null;
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />;
}

export default function App() {
  const basename = (import.meta?.env?.BASE_URL || "/").replace(/\/$/, "");
  return (
    <Router basename={basename}>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="CTV">
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/job/:id"
            element={
              <PrivateRoute>
                <JobDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ViewProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-brand"
            element={
              <PrivateRoute>
                <MyBrand />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-candidates"
            element={
              <PrivateRoute>
                <MyCandidates />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-jobs"
            element={
              <PrivateRoute>
                <SavedJobs />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
