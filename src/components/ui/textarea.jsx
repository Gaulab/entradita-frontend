import React from 'react';

const Textarea = ({ rows = 3, className = '', ...props }) => {
  return (
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${className}`}
      {...props}
    />
  );
};

export default Textarea;

