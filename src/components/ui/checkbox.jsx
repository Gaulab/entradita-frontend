import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <div className={`inline-flex items-center ${className}`}>
    <input
      type="checkbox"
      ref={ref}
      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
      {...props}
    />
    <div className="absolute pointer-events-none">
      <Check className="h-4 w-4 text-white" />
    </div>
  </div>
));

Checkbox.displayName = 'Checkbox';

export { Checkbox };

