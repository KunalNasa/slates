"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "primary-blue" | "primary-green" | "primary-pink";
}

export const Button = ({ children, className, variant = "primary" }: ButtonProps) => {
  const isTertiary = variant === "tertiary";

  return (
    <button
      className={clsx(
        isTertiary
          ? "p-2 rounded-md hover:cursor-pointer text-gray-700 bg-gray-200 "
          : "relative px-8 hover:cursor-pointer py-4 text-lg rounded-md border border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200",
        variant === "primary-pink" && "bg-pink-500/80 text-white",
        variant === "primary-blue" && "bg-blue-500/80 text-white border-2",
        variant === "primary-green" && "bg-yellow-500/80 text-white border-2 border-gray-500",
        variant === "secondary" && "px-1 py-1 bg-white text-black hover:shadow-none hover:bg-black hover:text-white",
        className // Ensures user-provided styles take the highest priority
      )}
    >
      {children}
    </button>
  );
};
