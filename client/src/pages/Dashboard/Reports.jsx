import React from "react";

export default function Reports() {
  return (
    <div>
      <div className="text-xl font-semibold mb-2">Export & Reports</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-2xl shadow flex flex-col">
          <div className="font-medium">Quick Export</div>
          <div className="mt-2 flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Export CSV</button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded">Export PDF</button>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow">
          <div className="font-medium mb-1">Saved Views</div>
          <div className="flex flex-col gap-2">
            <div className="p-2 border rounded flex justify-between">
              <div>Critical Open Defects (Last 7d)</div>
              <button className="text-sm text-blue-600">Apply</button>
            </div>
            <div className="p-2 border rounded flex justify-between">
              <div>Machine Hotspots</div>
              <button className="text-sm text-blue-600">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
