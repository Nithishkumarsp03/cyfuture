import React, { useMemo } from "react";
import { mockDefects, mockMachines } from "../../utils/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Reports() {
  // --- Quick stats ---
  const totalDefects = mockDefects.length;
  const openDefects = mockDefects.filter((d) => d.status !== "resolved").length;
  const criticalDefects = mockDefects.filter((d) => d.severity === "critical").length;
  const totalMachines = mockMachines.length;

  // --- Charts Data ---
  const defectsByMachine = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.machineId] = (map[d.machineId] || 0) + 1;
    });
    return Object.entries(map).map(([machine, count]) => ({ machine, count }));
  }, []);

  const defectTypeBreakdown = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.defectType] = (map[d.defectType] || 0) + 1;
    });
    return Object.entries(map).map(([type, count]) => ({ name: type, value: count }));
  }, []);

  const PIE_COLORS = ["#3b82f6", "#ef4444", "#fbbf24", "#22c55e", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Export & Reports</h2>
        <p className="text-gray-600">
          Generate and export reports for defects, machine performance, and thresholds.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Total Defects</div>
          <div className="text-2xl font-bold mt-1">{totalDefects}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Open Defects</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{openDefects}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Critical Defects</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{criticalDefects}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Total Machines</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{totalMachines}</div>
        </div>
      </div>

      {/* Export & Saved Views */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Export */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
          <div className="font-medium">Quick Export</div>
          <p className="text-gray-500 text-sm mt-1 mb-2">
            Export reports in CSV, PDF, or Excel format.
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
              Export PDF
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Export Excel
            </button>
          </div>
        </div>

        {/* Saved Views */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="font-medium mb-2">Saved Views / Reports</div>
          <div className="flex flex-col gap-2">
            <div className="p-2 border rounded flex justify-between items-center">
              <div>Critical Open Defects (Last 7d)</div>
              <button className="text-sm text-blue-600 hover:underline">Apply</button>
            </div>
            <div className="p-2 border rounded flex justify-between items-center">
              <div>Machine Hotspots</div>
              <button className="text-sm text-blue-600 hover:underline">Apply</button>
            </div>
            <div className="p-2 border rounded flex justify-between items-center">
              <div>Defect Trend (30 days)</div>
              <button className="text-sm text-blue-600 hover:underline">Apply</button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Defects per Machine */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="font-medium mb-2">Defects per Machine</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={defectsByMachine}>
                <XAxis dataKey="machine" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Defect Type Breakdown */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="font-medium mb-2">Defect Type Breakdown</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={defectTypeBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {defectTypeBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <div className="font-medium mb-2">Recent Reports</div>
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left">Report Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t hover:bg-gray-50">
              <td className="p-2">Critical Open Defects (Last 7d)</td>
              <td className="p-2">CSV</td>
              <td className="p-2">2025-09-23</td>
              <td className="p-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Download
                </button>
              </td>
            </tr>
            <tr className="border-t hover:bg-gray-50">
              <td className="p-2">Machine Hotspots</td>
              <td className="p-2">PDF</td>
              <td className="p-2">2025-09-22</td>
              <td className="p-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
