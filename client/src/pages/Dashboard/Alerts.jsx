import React, { useMemo } from "react";
import { mockAlerts, formatDate } from "../../utils/mockData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function Alerts() {
  const totalAlerts = mockAlerts.length;
  const unacknowledged = mockAlerts.filter((a) => !a.acknowledged).length;
  const criticalAlerts = mockAlerts.filter((a) => a.severity === "Critical").length;
  const todayAlerts = mockAlerts.filter(
    (a) => new Date(a.createdAt).toDateString() === new Date().toDateString()
  ).length;

  // Pie Chart Data
  const pieData = [
    { name: "Acknowledged", value: totalAlerts - unacknowledged },
    { name: "Pending", value: unacknowledged },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  // Bar Chart Data: Alerts per Machine
  const alertsPerMachine = useMemo(() => {
    const map = {};
    mockAlerts.forEach((a) => {
      map[a.machineId] = (map[a.machineId] || 0) + 1;
    });
    return Object.entries(map).map(([machine, count]) => ({ machine, count }));
  }, []);

  // Line Chart Data: Alerts over time
  const alertsOverTime = useMemo(() => {
    const map = {};
    mockAlerts.forEach((a) => {
      const day = new Date(a.createdAt).toISOString().slice(0, 10);
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Alerts & Notifications</h2>
          <p className="text-gray-600">Monitor and manage system alerts in real-time.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Total Alerts</div>
          <div className="text-2xl font-bold mt-1">{totalAlerts}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Unacknowledged</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{unacknowledged}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Critical Alerts</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{criticalAlerts}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500">Today</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{todayAlerts}</div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Alerts</h3>
        <div className="space-y-2">
          {mockAlerts.map((a) => (
            <div
              key={a.id}
              className={`p-3 rounded-lg flex justify-between items-center border ${
                a.acknowledged ? "bg-gray-100 border-gray-200" : "bg-red-50 border-red-300"
              }`}
            >
              <div>
                <div className="font-medium">{a.message}</div>
                <div className="text-xs text-gray-600">
                  {formatDate(a.createdAt)} | Machine: {a.machineId} | Severity:{" "}
                  <span
                    className={`px-1 rounded text-xs font-semibold ${
                      a.severity === "Critical"
                        ? "bg-red-200 text-red-800"
                        : a.severity === "High"
                        ? "bg-orange-200 text-orange-800"
                        : a.severity === "Medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {a.severity}
                  </span>
                </div>
              </div>
              <div>
                {a.acknowledged ? (
                  <span className="text-sm px-2 py-1 bg-green-100 rounded">Acknowledged</span>
                ) : (
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Acknowledged vs Pending</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Alerts per Machine</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={alertsPerMachine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="machine" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Alerts Over Time</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={alertsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Insights</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>
            Machine M-01 generated the most critical alerts this week.
          </li>
          <li>
            Average acknowledgment time: 1.2 hours.
          </li>
          <li>
            80% of high-severity alerts have been acknowledged on time.
          </li>
          <li>
            Recommendation: Check Machine M-02 for recurring medium-severity alerts.
          </li>
        </ul>
      </div>
    </div>
  );
}
