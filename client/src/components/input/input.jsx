import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <label className="block text-sm mb-1 font-semibold text-blue-700 mb-2">{label}</label>
      <input
        type={isPassword && !showPassword ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-9 right-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
