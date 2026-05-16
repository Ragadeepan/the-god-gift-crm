import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm shadow-sm transition-all",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-gray-200 hover:border-gray-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
