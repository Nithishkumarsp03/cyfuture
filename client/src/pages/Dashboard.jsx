// Dashboard.jsx
import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

const tabs = [
  { label: "Overview", to: "" },
  { label: "Cameras", to: "cameras" },
  { label: "Machines", to: "machines" },
  { label: "Operators", to: "operators" },
  { label: "Inspections", to: "inspections" },
  { label: "Thresholds", to: "thresholds" },
  { label: "Alerts", to: "alerts" },
  { label: "Reports", to: "reports" },
];

const TabButton = ({ to, label }) => (
  <NavLink
    to={to}
    end={to === ""}
    className={({ isActive }) =>
      `w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center justify-between ${
        isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    <span>{label}</span>
  </NavLink>
);

export default function Dashboard({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-full min-h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r flex-shrink-0 p-4 flex flex-col">
        <div className="text-2xl font-bold mb-6">Admin Dashboard</div>
        <div className="flex-1 overflow-y-auto">
          {tabs.map((t) => (
            <TabButton key={t.to || "overview"} to={t.to} label={t.label} />
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Path: {location.pathname} • Last updated: {new Date().toLocaleString()}
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">
            {location.pathname === "/" ? "Overview" : location.pathname.replace("/", "").toUpperCase()}
          </h1>
          <div className="flex gap-2">
            <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => window.location.reload()}
                >
                Refresh
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Settings</button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
