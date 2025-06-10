"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import PropTypes from "prop-types"

export const Slider = ({
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)
  const thumbRef = useRef(null)

  const currentValue = value[0]
  const percentage = ((currentValue - min) / (max - min)) * 100

  const handleMouseDown = (e) => {
    if (disabled) return
    setIsDragging(true)
    updateValue(e)
  }

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || disabled) return
    updateValue(e)
  }, [isDragging, disabled, updateValue])

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateValue = useCallback((e) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const newValue = Math.round((percentage * (max - min) + min) / step) * step
    const clampedValue = Math.max(min, Math.min(max, newValue))

    if (onValueChange && clampedValue !== currentValue) {
      onValueChange([clampedValue])
    }
  }, [sliderRef, min, max, step, onValueChange, currentValue])

  const handleTrackClick = (e) => {
    if (disabled) return
    updateValue(e)
  }

  const handleKeyDown = (e) => {
    if (disabled) return

    let newValue = currentValue

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(min, currentValue - step)
        break
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(max, currentValue + step)
        break
      case "Home":
        newValue = min
        break
      case "End":
        newValue = max
        break
      default:
        return
    }

    e.preventDefault()
    if (onValueChange) {
      onValueChange([newValue])
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleMouseMove)
      document.addEventListener("touchend", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleMouseMove)
        document.removeEventListener("touchend", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Track */}
      <div
        ref={sliderRef}
        className={`relative flex-1 h-2 bg-slate-700 rounded-full cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleTrackClick}
        onTouchStart={handleMouseDown}
      >
        {/* Progress */}
        <div
          className="absolute h-full bg-gradient-to-r from-blue-500/60 to-green-600/60 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          ref={thumbRef}
          className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-grab transition-all duration-150 ${
            isDragging ? "scale-110 cursor-grabbing shadow-xl" : "hover:scale-105"
          } ${disabled ? "cursor-not-allowed" : ""}`}
          style={{ left: `${percentage}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
        />
      </div>
    </div>
  )
}

Slider.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onValueChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}
