"use client";

import React from "react";
import { Button } from "@nextui-org/react";

export default function NextUIButton({
  children,
  onClick,
  type = "button",
  isLoading = false,
  disabled = false,
  className = "w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors overflow-hidden",
  color = "primary",
  variant = "solid",
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      isLoading={isLoading}
      isDisabled={disabled}
      className={className}
      color={color}
      variant={variant}
      fullWidth
    >
      {children}
    </Button>
  );
}
