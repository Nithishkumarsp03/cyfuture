import React from "react";
import { mockThresholds } from "../../utils/mockData";

export default function Thresholds() {
  return (
    <div>
      <div className="text-xl font-semibold mb-2">Threshold Rules</div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product Line</th>
              <th className="p-2 text-left">Defect Type</th>
              <th className="p-2 text-left">Severity</th>
              <th className="p-2 text-left">Limit</th>
              <th className="p-2 text-left">Notify</th>
            </tr>
          </thead>
          <tbody>
            {mockThresholds.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.productLine}</td>
                <td className="p-2">{t.defectType}</td>
                <td className="p-2">{t.severity}</td>
                <td className="p-2">{t.limit}</td>
                <td className="p-2">{t.notify ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
