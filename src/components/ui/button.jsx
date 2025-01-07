import * as React from "react"
import PropTypes from "prop-types"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        entraditaPrimary: "bg-blue-600 hover:bg-blue-500 text-gray-100 hover:text-white ",
        entraditaSecondary: "bg-gray-900 hover:bg-gray-900 text-gray-300 hover:text-gray-200 border border-gray-800 hover:border-gray-600",
        entraditaTertiary: "bg-gray-800 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-700",
        entraditaSuccess: "bg-green-700 hover:bg-green-800 text-white hover:text-gray-100 border border-green-800 hover:border-gray-900",
        entraditaError: "bg-red-800/50 hover:bg-red-900 text-white hover:text-gray-100 border border-red-800 hover:border-gray-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, to, new: isNew, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const buttonContent = (
    <>
      {isNew && <span className="absolute top-0 right-0 bg-red-300 text-black text-xs px-1 rounded m-1">new</span>}
      {props.children}
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        className={cn(buttonVariants({ variant, size, className }), "relative")}
        {...props}
      >
        {buttonContent}
      </Link>
    )
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), "relative")}
      ref={ref}
      {...props}
    >
      {buttonContent}
    </Comp>
  )
})

Button.displayName = "Button"

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'entraditaPrimary', 'entraditaSecondary', 'entraditaTertiary', 'entraditaSuccess', 'entraditaError']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
  asChild: PropTypes.bool,
  to: PropTypes.string,
  new: PropTypes.bool,
}

export { Button, buttonVariants }