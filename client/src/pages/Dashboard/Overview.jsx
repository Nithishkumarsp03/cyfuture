import React, { useMemo } from "react";
import {
  LineChart,
  Line,
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
} from "recharts";
import { mockDefects, formatDate, mockMachines } from "../../utils/mockData";

const SummaryCard = ({ title, value, subtitle }) => (
  <div className="p-4 bg-white rounded-2xl shadow flex flex-col">
    <div className="text-xs uppercase font-medium text-gray-500">{title}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
    {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
  </div>
);

export default function Overview() {
  const totalDefects = mockDefects.length;
  const criticalOpen = mockDefects.filter((d) => d.severity === "critical" && d.status === "open").length;
  const openTickets = mockDefects.filter((d) => d.status !== "resolved").length;
  const PIE_CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

  const machineFrequency = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.machineId] = (map[d.machineId] || 0) + 1;
    });
    return Object.entries(map).map(([machineId, count]) => ({ machineId, count }));
  }, []);

  const topMachine = useMemo(() => {
    if (!machineFrequency.length) return "-";
    return machineFrequency.reduce((best, curr) => (curr.count > best.count ? curr : best), {
      machineId: "-",
      count: -Infinity,
    }).machineId;
  }, [machineFrequency]);

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

  const defectTypeBreakdown = useMemo(() => {
    const map = {};
    mockDefects.forEach((d) => {
      map[d.defectType] = (map[d.defectType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Defects" value={totalDefects} />
        <SummaryCard title="Critical Open" value={criticalOpen} />
        <SummaryCard title="Top Machine" value={topMachine} />
        <SummaryCard title="Open Tickets" value={openTickets} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">Defect Trend</div>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3">
          <div className="p-4 bg-white rounded-2xl shadow flex-1">
            <div className="font-semibold mb-2">By Defect Type</div>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={defectTypeBreakdown} dataKey="value" nameKey="name" outerRadius={70} label>
                    {defectTypeBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={PIE_CHART_COLORS[idx % PIE_CHART_COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow flex-1">
            <div className="font-semibold mb-2">Machine-wise Defects</div>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={machineFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="machineId" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb">
                    {machineFrequency.map((entry, idx) => (
                      <Cell key={idx} fill="#2563eb"/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
