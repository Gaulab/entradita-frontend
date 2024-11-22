import * as React from "react"
import PropTypes from "prop-types"
import { ChevronDown } from 'lucide-react'

const Dropdown = React.forwardRef(function Dropdown(
  { 
    options, 
    value, 
    onChange, 
    placeholder = "Seleccionar opción", 
    className = "", 
    disabled = false,
    ...props 
  }, 
  ref
) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 text-left rounded-lg 
          flex items-center justify-between focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}`}
        ref={ref}
        {...props}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-200'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`px-4 py-2 cursor-pointer text-gray-200 hover:bg-[#323845] transition-colors
                  ${option.value === value ? 'bg-[#323845]' : ''}`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
})

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

Dropdown.displayName = "Dropdown"

export { Dropdown }