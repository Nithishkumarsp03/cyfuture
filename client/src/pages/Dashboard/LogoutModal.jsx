import React from "react";
import NextUIButton from "../../components/button/button";
import { LogOut, AlertTriangle, XCircle } from "lucide-react";

export default function LogoutModal({ onClose, onConfirm }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg"
      >
        {/* Header with Icon */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          <p className="text-lg font-semibold text-gray-800">Confirm Sign Out</p>
        </div>

        {/* Warning Message */}
        <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
          You are about to <span className="font-medium text-gray-900">end your session</span>.  
          <br />
          <span className="font-medium text-red-600">Any unsaved work will be lost. </span>  
          Please ensure you’ve saved your changes before signing out.  
          <br />
          You may need to re-authenticate when logging back in.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <NextUIButton
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg outline-none"
          >
            <XCircle className="w-4 h-4" />
            Stay Logged In
          </NextUIButton>
          <NextUIButton
            onClick={onConfirm}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg outline-none"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </NextUIButton>
        </div>
      </div>
    </div>
  );
}
