"use client";

import { ReactNode } from "react";
import { buffer } from "stream/consumers";

interface ButtonProps {
  variant: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  size: "lg" | "sm";
  children: ReactNode;
}

const sizeClasses = {
  lg: "px-8 py-4 text-lg",
  sm: "px-4 py-2 text-base",
};

const variantClasses = {
  primary:
    " bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
  secondary:
    " bg-white text-purple-700  rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300",
  outline:
    "border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:text-purple-600 transform transition-all duration-300 flex items-center justify-center space-x-2",
};

export const Button = ({
  variant,
  children,
  onClick,
  className,
  size,
}: ButtonProps) => {
  return (
    <button
      className={`${sizeClasses[size]}  ${variantClasses[variant]} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
