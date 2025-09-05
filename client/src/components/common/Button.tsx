import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "green" | "gray";
}

const baseStyles =
  "text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2";

const variantStyles: Record<string, string> = {
  blue: "bg-primary-default text-white hover:bg-primary-hover focus:ring-primary-focus",
  green: "bg-success-default text-white hover:bg-success-hover focus:ring-success-focus",
  gray: "bg-neutral-default [&&]:text-neutral-text hover:bg-neutral-hover focus:ring-neutral-focus",
};


export const Button: React.FC<ButtonProps> = ({
  variant = "blue",
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </button>
  );
};
