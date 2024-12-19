import React, { useState, useRef, useEffect } from 'react';

const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      {React.Children.map(children, (child) => {
        if (child.type === PopoverTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type === PopoverContent) {
          return isOpen && child;
        }
        return child;
      })}
    </div>
  );
};

const PopoverTrigger = ({ children, ...props }) => {
  return React.cloneElement(children, props);
};

const PopoverContent = ({ children }) => {
  return (
    <div className="absolute z-10 w-64 p-4 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg">
      {children}
    </div>
  );
};

export { Popover, PopoverTrigger, PopoverContent };

