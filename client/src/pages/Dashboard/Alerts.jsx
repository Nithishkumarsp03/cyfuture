import React from "react";
import { mockAlerts, formatDate } from "../../utils/mockData";

export default function Alerts() {
  return (
    <div>
      <div className="text-xl font-semibold mb-2">Alerts & Notifications</div>
      <div className="space-y-2">
        {mockAlerts.map((a) => (
          <div
            key={a.id}
            className={`p-3 rounded-lg flex justify-between items-center border ${
              a.acknowledged ? "bg-gray-100" : "bg-red-50 border-red-300"
            }`}
          >
            <div>
              <div className="font-medium">{a.message}</div>
              <div className="text-xs text-gray-600">{formatDate(a.createdAt)}</div>
            </div>
            <div>
              {a.acknowledged ? (
                <span className="text-sm px-2 py-1 bg-green-100 rounded">Acknowledged</span>
              ) : (
                <button className="px-3 py-1 bg-yellow-500 text-white rounded">Acknowledge</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
