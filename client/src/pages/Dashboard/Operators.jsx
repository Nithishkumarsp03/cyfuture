import React, { useMemo } from "react";
import { mockOperators, mockDefects } from "../../utils/mockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Operators() {
  // Operator Stats Calculation
  const operatorStats = useMemo(() => {
    return mockOperators.map((o) => {
      const related = mockDefects.filter((d) => d.operatorId === o.id);
      const total = related.length;
      const resolved = related.filter((d) => d.status === "resolved").length;
      const open = total - resolved;
      const critical = related.filter((d) => d.severity === "critical").length;

      return {
        ...o,
        total,
        resolved,
        open,
        critical,
        efficiency: total > 0 ? ((resolved / total) * 100).toFixed(1) : 100,
      };
    });
  }, []);

  // For bar chart (defects per operator)
  const chartData = operatorStats.map((o) => ({
    name: o.name,
    Open: o.open,
    Resolved: o.resolved,
  }));

  // Best Performer
  const topPerformer = operatorStats.reduce(
    (best, curr) => (parseFloat(curr.efficiency) > parseFloat(best.efficiency) ? curr : best),
    operatorStats[0] || {}
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-2xl font-bold text-gray-800">Operator Performance</div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500 font-medium">Total Operators</div>
          <div className="text-2xl font-bold mt-1">{mockOperators.length}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500 font-medium">Total Defects Logged</div>
          <div className="text-2xl font-bold mt-1">
            {operatorStats.reduce((sum, o) => sum + o.total, 0)}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500 font-medium">Avg. Efficiency</div>
          <div className="text-2xl font-bold mt-1">
            {(
              operatorStats.reduce((sum, o) => sum + parseFloat(o.efficiency), 0) /
              operatorStats.length
            ).toFixed(1)}
            %
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs uppercase text-gray-500 font-medium">Top Performer</div>
          <div className="text-lg font-bold mt-1 text-green-600">
            {topPerformer?.name || "-"}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">Detailed Operator Metrics</h3>
        <table className="w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 text-left">Operator</th>
              <th className="p-2 text-left">Shift</th>
              <th className="p-2 text-left">Total Defects</th>
              <th className="p-2 text-left">Open</th>
              <th className="p-2 text-left">Resolved</th>
              <th className="p-2 text-left">Critical</th>
              <th className="p-2 text-left">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {operatorStats.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{o.name}</td>
                <td className="p-2">{o.shift}</td>
                <td className="p-2">{o.total}</td>
                <td className="p-2">{o.open}</td>
                <td className="p-2">{o.resolved}</td>
                <td className="p-2 text-red-600">{o.critical}</td>
                <td className="p-2 font-semibold">
                  {o.efficiency}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Defects by Operator</h3>
          <div className="h-[250px]">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Open" fill="#f87171" />
                <Bar dataKey="Resolved" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Trend */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Efficiency Comparison</h3>
          <div className="h-[250px]">
            <ResponsiveContainer>
              <LineChart data={operatorStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#2563eb" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Insights & Recommendations</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>High efficiency operators can be assigned to critical production lines.</li>
          <li>Operators with frequent open defects may require additional training or support.</li>
          <li>Shift-based performance tracking helps identify fatigue or staffing issues.</li>
          <li>Critical defect handling is a key KPI — ensure fair workload distribution.</li>
          <li>Recognize top performers to improve morale and retention.</li>
        </ul>
      </div>
    </div>
  );
}
