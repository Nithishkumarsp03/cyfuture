import React from "react";
import NextUIButton from "../../components/button/button";

export default function LogoutModal({ onClose, onConfirm }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg"
      >
        <p className="text-lg font-medium mb-6 text-center">
          You are about to signout! Are you sure you want to confirm?
        </p>

        <div className="flex gap-3 justify-end">
          <NextUIButton onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-1 rounded-lg outline-none">
            No, Cancel
          </NextUIButton>
          <NextUIButton onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg outline-none">
            Yes, Confirm
          </NextUIButton>
        </div>
      </div>
    </div>
  );
}
