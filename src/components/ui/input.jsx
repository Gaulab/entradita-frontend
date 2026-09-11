import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 text-sm text-gray-200 rounded-lg",
        "bg-secondary border border-border",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        "hover:bg-secondary transition-colors duration-200",
        "placeholder:text-muted-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

export { Input };