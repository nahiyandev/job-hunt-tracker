// button.tsx — shadcn-style Button. Every button in the app uses this,
// so buttons always look the same. Variants: orange primary, purple secondary.
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles: Record<string, string> = {
    primary: "bg-orange-600 hover:bg-orange-700 text-white",
    secondary: "bg-violet-600 hover:bg-violet-700 text-white",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
