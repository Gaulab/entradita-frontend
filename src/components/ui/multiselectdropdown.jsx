import * as React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Check } from 'lucide-react';

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder = 'Seleccionar opciones', className = '', disabled = false, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((value) => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 py-2 text-left rounded-lg flex items-center justify-between
          bg-gray-700 border border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          hover:bg-gray-600 transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && setIsOpen(!isOpen);
          }
        }}
        {...props}
      >
        <span className={`block truncate ${selectedValues.length === 0 ? 'text-gray-400' : 'text-gray-200'}`}>
          {selectedValues.length === 0 ? placeholder : selectedValues.map((v) => v.name).join(', ')}
        </span>
        <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => toggleOption(option)}
                className={`px-4 py-2 cursor-pointer flex justify-between items-center text-gray-200 
                  hover:bg-gray-600 transition-colors ${selectedValues.includes(option) ? 'bg-gray-600' : ''}`}
              >
                {option.name}
                {selectedValues.includes(option) && <Check className="h-4 w-4 text-blue-500" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

MultiSelectDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export { MultiSelectDropdown };
