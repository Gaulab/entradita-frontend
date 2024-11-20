import * as React from "react"
import PropTypes from "prop-types"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ value, max = 100, className, ...props }, ref) => {
  const percentage = (value / max) * 100

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})

Progress.displayName = "Progress"

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  className: PropTypes.string,
}

export { Progress }