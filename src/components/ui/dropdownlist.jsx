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

  const selectedOption = options.find(option => option.name === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 py-2 text-left rounded-lg 
          flex items-center justify-between
          bg-gray-700 border border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          hover:bg-gray-600 transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            !disabled && setIsOpen(!isOpen)
          }
        }}
        ref={ref}
        {...props}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-200'}`}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown 
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onChange(option.name)
                  setIsOpen(false)
                }}
                className={`px-4 py-2 cursor-pointer text-gray-200 hover:bg-gray-600 transition-colors
                  ${option.name === value ? 'bg-gray-600' : ''}`}
              >
                {option.name}
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
      id: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
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