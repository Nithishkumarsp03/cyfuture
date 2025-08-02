import React from "react";
import { mockDefects, formatDate } from "../../utils/mockData";

export default function Inspections() {
  return (
    <div>
      <div className="text-xl font-semibold mb-2">Inspection History</div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
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
            {mockDefects.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{formatDate(d.detectedAt)}</td>
                <td className="p-2">{d.id}</td>
                <td className="p-2">{d.defectType}</td>
                <td className="p-2">{d.machineId}</td>
                <td className="p-2">{d.severity}</td>
                <td className="p-2">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
