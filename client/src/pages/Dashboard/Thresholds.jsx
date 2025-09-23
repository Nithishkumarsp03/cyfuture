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
import { mockThresholds } from "../../utils/mockData";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6", "#ec4899"];

export default function Thresholds() {
  const [search, setSearch] = useState("");

  // --- KPIs
  const totalRules = mockThresholds.length;
  const activeNotifications = mockThresholds.filter((t) => t.notify).length;
  const mostRestrictive = Math.min(...mockThresholds.map((t) => t.limit));
  const avgThreshold = Math.round(
    mockThresholds.reduce((sum, t) => sum + t.limit, 0) / mockThresholds.length
  );

  // --- Charts Data
  const thresholdsByLine = useMemo(() => {
    const map = {};
    mockThresholds.forEach((t) => {
      map[t.productLine] = (map[t.productLine] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const notifyBreakdown = useMemo(() => {
    const yes = mockThresholds.filter((t) => t.notify).length;
    const no = mockThresholds.length - yes;
    return [
      { name: "Notify Enabled", value: yes },
      { name: "Notify Disabled", value: no },
    ];
  }, []);

  const severityTrends = useMemo(() => {
    const map = {};
    mockThresholds.forEach((t) => {
      map[t.severity] = (map[t.severity] || 0) + t.limit;
    });
    return Object.entries(map).map(([severity, total]) => ({
      severity,
      total,
    }));
  }, []);

  // --- Table Filtering
  const filteredThresholds = mockThresholds.filter(
    (t) =>
      t.productLine.toLowerCase().includes(search.toLowerCase()) ||
      t.defectType.toLowerCase().includes(search.toLowerCase()) ||
      t.severity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Total Rules</div>
          <div className="text-2xl font-bold">{totalRules}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Active Notifications</div>
          <div className="text-2xl font-bold text-green-600">{activeNotifications}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Most Restrictive Limit</div>
          <div className="text-2xl font-bold text-red-600">{mostRestrictive}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Average Threshold</div>
          <div className="text-2xl font-bold text-indigo-600">{avgThreshold}</div>
        </div>
      </div>

      {/* Search + Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">Threshold Rules</div>
          {/* <input
            type="text"
            placeholder="Search by product line, type, severity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          /> */}
        </div>
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left">Product Line</th>
                <th className="p-2 text-left">Defect Type</th>
                <th className="p-2 text-left">Severity</th>
                <th className="p-2 text-left">Limit</th>
                <th className="p-2 text-left">Notify</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredThresholds.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{t.productLine}</td>
                  <td className="p-2">{t.defectType}</td>
                  <td className="p-2">
                    {t.severity === "Critical" ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        {t.severity}
                      </span>
                    ) : t.severity === "Major" ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        {t.severity}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {t.severity}
                      </span>
                    )}
                  </td>
                  <td className="p-2 font-bold">{t.limit}</td>
                  <td className="p-2">
                    {t.notify ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-2 space-x-2">
                    <button className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md">
                      Edit
                    </button>
                    <button className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-md">
                      Delete
                    </button>
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
          <div className="font-semibold mb-2">Rules by Product Line</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={thresholdsByLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" name="Rules" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">Notification Settings</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={notifyBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {notifyBreakdown.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">Severity Threshold Totals</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={severityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  name="Limit Sum"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
