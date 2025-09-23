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
} from "recharts";
import { mockMachines, mockDefects } from "../../utils/mockData";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6", "#ec4899"];

export default function Machines() {
  const [search, setSearch] = useState("");

  // --- Machine defect counts
  const machineDefects = useMemo(() => {
    return mockMachines.map((m) => {
      const count = mockDefects.filter((d) => d.machineId === m.id).length;
      return { ...m, defects: count };
    });
  }, []);

  // --- KPIs
  const totalMachines = machineDefects.length;
  const machinesWithDefects = machineDefects.filter((m) => m.defects > 0).length;
  const topMachine = machineDefects.reduce(
    (best, curr) => (curr.defects > best.defects ? curr : best),
    { name: "-", defects: -Infinity }
  );
  const avgDefects = (
    machineDefects.reduce((sum, m) => sum + m.defects, 0) / totalMachines
  ).toFixed(1);

  // --- Chart Data
  const defectsByIndustry = useMemo(() => {
    const map = {};
    machineDefects.forEach((m) => {
      map[m.industry] = (map[m.industry] || 0) + m.defects;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [machineDefects]);

  const filteredMachines = machineDefects.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Total Machines</div>
          <div className="text-2xl font-bold">{totalMachines}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Machines with Defects</div>
          <div className="text-2xl font-bold text-yellow-600">{machinesWithDefects}</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Top Machine</div>
          <div className="text-lg font-bold">{topMachine.name}</div>
          <div className="text-sm text-gray-500">{topMachine.defects} defects</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="text-xs uppercase text-gray-500">Avg Defects / Machine</div>
          <div className="text-2xl font-bold">{avgDefects}</div>
        </div>
      </div>

      {/* Search + Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-semibold">Machine-wise Defects</div>
          {/* <input
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          /> */}
        </div>
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 text-left">Machine</th>
                <th className="p-2 text-left">Line</th>
                <th className="p-2 text-left">Industry</th>
                <th className="p-2 text-left">Total Defects</th>
                <th className="p-2 text-left">Health</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{m.line}</td>
                  <td className="p-2">{m.industry}</td>
                  <td className="p-2 font-bold">{m.defects}</td>
                  <td className="p-2">
                    {m.defects === 0 ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Healthy
                      </span>
                    ) : m.defects < 5 ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        Warning
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        Critical
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">📊 Defects per Machine</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={machineDefects.sort((a, b) => b.defects - a.defects)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="defects" fill="#6366f1" name="Defects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-semibold mb-2">🏭 Defects by Industry</div>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={defectsByIndustry}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {defectsByIndustry.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
