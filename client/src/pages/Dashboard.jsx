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
import { useNavigate } from "react-router-dom";
import LogoutModal from "./Dashboard/LogoutModal";
import DemoVideoPrompt from "./VideoPreview";

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
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login', { replace: true });
  }

  return (
    <div className="flex h-full min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`absolute md:fixed top-0 left-0 h-screen w-64 bg-white border-r p-4 flex flex-col transform transition-transform duration-200
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${
          // On mobile, high z-index so it overlays; on desktop, lower so charts aren't covered
          sidebarOpen ? "z-50" : "md:z-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold">Dashboard</div>
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
        <div className="mt-4 flex items-center gap-3" onClick={() => setLogout(true)}>
          {/* Profile Circle */}
          <div className="flex justify-center items-center border border-gray-400 bg-gray-100 w-12 h-12 rounded-full text-lg font-semibold text-gray-700">
            {localStorage.getItem("name")?.[0]?.toUpperCase()}
          </div>

          {/* User Info */}
          <div className="max-w-[150px]">
            <div
              className="text-sm font-medium text-gray-900 truncate"
              title={localStorage.getItem("name")}
            >
              {localStorage.getItem("name")}
            </div>
            <div
              className="text-xs text-gray-500 truncate"
              title={localStorage.getItem("email")}
            >
              {localStorage.getItem("email")}
            </div>
            <div className="text-tiny font-semibold text-red-600 cursor-pointer">Logout</div>
          </div>
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

          {/* <h1 className="text-3xl font-semibold">
            {location.pathname === "/"
              ? "OVERVIEW"
              : location.pathname.replace("/", "").toUpperCase()}
          </h1> */}

          {/* <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              Settings
            </button>
          </div> */}
        </div>

        <Outlet />
      </main>
      {logout && <LogoutModal onClose={() => setLogout(false)} onConfirm={handleLogout}/>}
      <DemoVideoPrompt />
    </div>
  );
}
