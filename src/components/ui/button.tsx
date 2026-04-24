import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400";
  const variants = {
    default: "bg-white text-slate-950 hover:bg-slate-200",
    outline: "border border-slate-700 bg-transparent text-white hover:bg-slate-900"
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
