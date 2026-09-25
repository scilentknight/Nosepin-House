import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "admin" | "adminOutline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:shadow-soft-lg focus-visible:outline-primary-500",
  secondary:
    "bg-secondary-500 text-white shadow-soft hover:bg-secondary-600 hover:shadow-soft-lg focus-visible:outline-secondary-500",
  outline:
    "border border-primary-300 text-primary-700 hover:border-primary-400 hover:bg-primary-50 focus-visible:outline-primary-500",
  ghost: "text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
  // Neutral slate variants for the admin dashboard, kept visually separate from the storefront's brand orange
  admin: "bg-slate-800 text-white shadow-soft hover:bg-slate-700 hover:shadow-soft-lg focus-visible:outline-slate-700",
  adminOutline:
    "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-slate-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-lg px-3 py-1.5 text-sm",
  md: "rounded-lg px-4 py-2.5 text-sm",
  lg: "rounded-full px-6 py-3 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
