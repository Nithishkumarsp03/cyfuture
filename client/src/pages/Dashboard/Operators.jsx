import React from "react";
import { mockOperators, mockDefects } from "../../utils/mockData";
import { formatDate } from "../../utils/mockData";

export default function Operators() {
  return (
    <div>
      <div className="text-xl font-semibold mb-2">Operator Performance</div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Operator</th>
              <th className="p-2 text-left">Shift</th>
              <th className="p-2 text-left">Total Defects</th>
              <th className="p-2 text-left">Open</th>
              <th className="p-2 text-left">Resolved</th>
            </tr>
          </thead>
          <tbody>
            {mockOperators.map((o) => {
              const related = mockDefects.filter((d) => d.operatorId === o.id);
              return (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.name}</td>
                  <td className="p-2">{o.shift}</td>
                  <td className="p-2">{related.length}</td>
                  <td className="p-2">{related.filter((d) => d.status !== "resolved").length}</td>
                  <td className="p-2">{related.filter((d) => d.status === "resolved").length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
