import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { mockDefects, formatDate } from "../../utils/mockData";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6", "#ec4899"];

export default function Inspections() {
  const [search, setSearch] = useState("");

  // --- KPIs
  const totalInspections = mockDefects.length;
  const openDefects = mockDefects.filter((d) => d.status === "Open").length;
  const closedDefects = mockDefects.filter((d) => d.status === "Closed").length;
  const criticalDefects = mockDefects.filter((d) => d.severity === "Critical").length;

  // --- Chart Data
  const defectsBySeverity = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.severity] = (map[d.severity] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const defectsByStatus = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.status] = (map[d.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const defectsByDay = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      const day = new Date(d.detectedAt).toLocaleDateString();
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([day, count]) => ({ day, count }));
  }, []);

  // --- Table Filtering
  const filteredDefects = mockDefects.filter(
    (d) =>
      d.defectType.toLowerCase().includes(search.toLowerCase()) ||
      d.machineId.toLowerCase().includes(search.toLowerCase()) ||
      d.severity.toLowerCase().includes(search.toLowerCase()) ||
      d.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Total Inspections</div>
          <div className="text-2xl font-bold">{totalInspections}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Open Defects</div>
          <div className="text-2xl font-bold text-red-600">{openDefects}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Closed Defects</div>
          <div className="text-2xl font-bold text-green-600">{closedDefects}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Critical Defects</div>
          <div className="text-2xl font-bold text-purple-600">{criticalDefects}</div>
        </div>
      </div>

      {/* Search + Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">Inspection History</div>
          {/* <input
            type="text"
            placeholder="Search by type, machine, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          /> */}
        </div>
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left">Timestamp</th>
                <th className="p-2 text-left">Defect ID</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Machine</th>
                <th className="p-2 text-left">Severity</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefects.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{formatDate(d.detectedAt)}</td>
                  <td className="p-2">{d.id}</td>
                  <td className="p-2">{d.defectType}</td>
                  <td className="p-2">{d.machineId}</td>
                  <td className="p-2">
                    {d.severity === "Critical" ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        {d.severity}
                      </span>
                    ) : d.severity === "Major" ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        {d.severity}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {d.severity}
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {d.status === "Open" ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        Open
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Closed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">Defects by Severity</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={defectsBySeverity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" name="Defects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">Defects by Status</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={defectsByStatus}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {defectsByStatus.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">Inspections Over Time</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={defectsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#14b8a6" name="Inspections" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
