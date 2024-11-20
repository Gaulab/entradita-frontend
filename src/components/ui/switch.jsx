import * as React from "react";
import PropTypes from "prop-types";

const Switch = React.forwardRef(function Switch(
  { checked, onChange, className, disabled = false, ...props },
  ref
) {
  const switchClassName = `relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-white 
    ${checked ? "bg-blue-600" : "bg-gray-800"} 
    ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
    ${className || ""}`;

  const toggleClassName = `absolute left-0 inline-block h-5 w-5 rounded-full bg-white transition-transform
    ${checked ? "translate-x-6" : "translate-x-0"}`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={switchClassName}
      ref={ref}
      {...props}
    >
      <span className={toggleClassName} />
    </button>
  );
});

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

Switch.displayName = "Switch";

export { Switch };