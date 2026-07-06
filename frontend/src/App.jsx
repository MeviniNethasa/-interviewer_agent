import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

// Protected Route Guardrail: Blocks cross-role url bypasses dynamically
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Entry Gateway */}
        <Route path="/login" element={<Login />} />

        {/* Secure Role-Isolated Layout Dashboards */}
        <Route 
          path="/dashboard" 
          element = {
            <ProtectedRoute allowedRole="candidate">
              <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">👤 Candidate Interface</h1>
                  <p className="text-slate-400">Workspace and Interview Panel coming in the next development phase.</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element = {
            <ProtectedRoute allowedRole="admin">
              <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl text-center">
                  <h1 className="text-3xl font-bold text-blue-400 mb-2">📊 HR Executive Dashboard</h1>
                  <p className="text-slate-400">Applicant tracking, scorecard auditing, and recruitment CRUD filters coming next phase.</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Fallback Action */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
