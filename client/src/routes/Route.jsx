import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Overview from "../pages/Dashboard/Overview";
import Machines from "../pages/Dashboard/Machines";
import Operators from "../pages/Dashboard/Operators";
import Inspections from "../pages/Dashboard/Inspections";
import Thresholds from "../pages/Dashboard/Thresholds";
import Alerts from "../pages/Dashboard/Alerts";
import Reports from "../pages/Dashboard/Reports";
import Cameras from "../pages/Dashboard/Cameras";

export default function RouteNavigation() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/auth/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="machines" element={<Machines />} />
            <Route path="cameras" element={<Cameras />} />
            <Route path="operators" element={<Operators />} />
            <Route path="inspections" element={<Inspections />} />
            <Route path="thresholds" element={<Thresholds />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
