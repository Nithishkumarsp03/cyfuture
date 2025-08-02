import React from "react";
import { mockMachines, mockDefects } from "../../utils/mockData";

export default function Machines() {
  return (
    <div>
      <div className="text-xl font-semibold mb-2">Machine-wise Defects</div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Machine</th>
              <th className="p-2 text-left">Line</th>
              <th className="p-2 text-left">Industry</th>
              <th className="p-2 text-left">Total Defects</th>
            </tr>
          </thead>
          <tbody>
            {mockMachines.map((m) => {
              const count = mockDefects.filter((d) => d.machineId === m.id).length;
              return (
                <tr key={m.id} className="border-t">
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{m.line}</td>
                  <td className="p-2">{m.industry}</td>
                  <td className="p-2 font-bold">{count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
