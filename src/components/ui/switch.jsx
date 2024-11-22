import * as React from "react";
import PropTypes from "prop-types";

const Switch = React.forwardRef(function Switch(
  { checked, onChange, onCheckedChange, className, disabled = false, id, "aria-label": ariaLabel, ...props },
  ref
) {
  const switchClassName = `relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-gray-500
    ${checked ? "bg-blue-600" : "bg-gray-800"} 
    ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
    ${className || ""}`;

  const toggleClassName = `absolute left-0 inline-block h-5 w-5 rounded-full bg-white transition-transform
    ${checked ? "translate-x-6" : "translate-x-0"}`;

  const handleChange = () => {
    const newCheckedState = !checked;
    if (onChange) onChange(newCheckedState);
    if (onCheckedChange) onCheckedChange(newCheckedState);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleChange}
      className={switchClassName}
      ref={ref}
      id={id}
      {...props}
    >
      <span className={toggleClassName} />
    </button>
  );
});

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  onCheckedChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  "aria-label": PropTypes.string,
};

Switch.displayName = "Switch";

export { Switch };