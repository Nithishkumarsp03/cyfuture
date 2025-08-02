// Dashboard.jsx
import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  Cpu,
  Users,
  ClipboardCheck,
  Sliders,
  Bell,
  FileText,
  Menu,
  X,
} from "lucide-react";

const tabs = [
  { label: "Overview", to: "", icon: LayoutDashboard },
  { label: "Cameras", to: "cameras", icon: Camera },
  { label: "Machines", to: "machines", icon: Cpu },
  { label: "Operators", to: "operators", icon: Users },
  { label: "Inspections", to: "inspections", icon: ClipboardCheck },
  { label: "Thresholds", to: "thresholds", icon: Sliders },
  { label: "Alerts", to: "alerts", icon: Bell },
  { label: "Reports", to: "reports", icon: FileText },
];

const TabButton = ({ to, label, Icon }) => (
  <NavLink
    to={to}
    end={to === ""}
    className={({ isActive }) =>
      `w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center gap-3 ${
        isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

export default function Dashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r p-4 flex flex-col transform transition-transform duration-200 z-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold">Admin Dashboard</div>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tabs.map((t) => (
            <TabButton
              key={t.to || "overview"}
              to={t.to}
              label={t.label}
              Icon={t.icon}
            />
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Path: {location.pathname} • Last updated:{" "}
          {new Date().toLocaleString()}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-3xl font-semibold">
            {location.pathname === "/"
              ? "OVERVIEW"
              : location.pathname.replace("/", "").toUpperCase()}
          </h1>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              Settings
            </button>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
