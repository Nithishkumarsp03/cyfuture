import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
} from "recharts";
import { mockDefects } from "../../utils/mockData";

// --- KPI Card ---
const SummaryCard = ({ title, value, subtitle, color = "text-gray-800" }) => (
  <div className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition-all duration-200 flex flex-col">
    <div className="text-xs uppercase font-medium text-gray-500">{title}</div>
    <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-md rounded-md p-2 text-sm border border-gray-200">
      <p className="font-semibold text-gray-700">{label}</p>
      {payload.map((p, idx) => (
        <p key={idx} style={{ color: p.color }}>
          {p.name}: <span className="font-medium">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function Overview() {
  const COLORS = {
    trend: "#4f46e5",
    machine: "#2563eb",
    severity: ["#ef4444", "#facc15", "#22c55e"], // critical, major, minor
    pie: ["#6366f1", "#82ca9d", "#f59e0b", "#ec4899", "#14b8a6"],
  };

  // --- Base Metrics ---
  const totalDefects = mockDefects.length;
  const criticalOpen = mockDefects.filter(
    (d) => d.severity === "critical" && d.status === "open"
  ).length;
  const openTickets = mockDefects.filter((d) => d.status !== "resolved").length;
  const resolvedTickets = mockDefects.filter(
    (d) => d.status === "resolved"
  ).length;

  // --- Machine Frequency ---
  const machineFrequency = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.machineId] = (map[d.machineId] || 0) + 1;
    });
    return Object.entries(map).map(([machineId, count]) => ({
      machineId,
      count,
    }));
  }, []);

  const topMachine = useMemo(() => {
    if (!machineFrequency.length) return "-";
    return machineFrequency.reduce(
      (best, curr) => (curr.count > best.count ? curr : best),
      { machineId: "-", count: -Infinity }
    ).machineId;
  }, [machineFrequency]);

  // --- Trend Data ---
  const trendData = useMemo(() => {
    const counts = {};
    mockDefects.forEach((d) => {
      const day = new Date(d.detectedAt).toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, []);

  // --- Severity Breakdown ---
  const severityBreakdown = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.severity] = (map[d.severity] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  // --- Defect Type Breakdown ---
  const defectTypeBreakdown = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.defectType] = (map[d.defectType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="space-y-8">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <SummaryCard title="Total Defects" value={totalDefects} />
        <SummaryCard title="Critical Open" value={criticalOpen} color="text-red-600" />
        <SummaryCard title="Top Machine" value={topMachine} />
        <SummaryCard title="Open Tickets" value={openTickets} color="text-yellow-600" />
        <SummaryCard title="Resolved Tickets" value={resolvedTickets} color="text-green-600" />
        <SummaryCard title="SLA Breaches" value="5" subtitle="Past 30 days" color="text-red-500" />
      </div>

      {/* TREND */}
      <div className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition-all">
        <h2 className="font-semibold text-gray-700 mb-3 border-b pb-1">📈 Defect Trend</h2>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="count"
                stroke={COLORS.trend}
                fill="#c7d2fe"
                name="Defects"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEVERITY + DEFECT TYPE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition-all">
          <h2 className="font-semibold text-gray-700 mb-3 border-b pb-1">🚦 Severity Breakdown</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={severityBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {severityBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS.severity[idx % COLORS.severity.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition-all">
          <h2 className="font-semibold text-gray-700 mb-3 border-b pb-1">🛠 By Defect Type</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={defectTypeBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {defectTypeBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS.pie[idx % COLORS.pie.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MACHINE DEFECTS */}
      <div className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition-all">
        <h2 className="font-semibold text-gray-700 mb-3 border-b pb-1">🏭 Machine-wise Defects</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={machineFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="machineId" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill={COLORS.machine} name="Defects">
                {machineFrequency.map((_, idx) => (
                  <Cell key={idx} fill={COLORS.machine} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
