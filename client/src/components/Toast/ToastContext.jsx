import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // ✅ icons

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col gap-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm min-w-[250px] max-w-sm
              animate-slideIn border-l-4 transition-all duration-500
              ${toast.type === "success"
                ? "bg-gradient-to-r from-green-500 to-green-600 border-green-400"
                : "bg-gradient-to-r from-red-500 to-red-600 border-red-400"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="break-words">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes slideIn {
            0% { opacity: 0; transform: translateX(100%); }
            100% { opacity: 1; transform: translateX(0); }
          }
          .animate-slideIn {
            animation: slideIn 0.4s ease forwards;
          }
        `}
      </style>
    </ToastContext.Provider>
  );
};
