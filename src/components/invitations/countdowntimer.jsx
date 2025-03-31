"use client"

import { useState, useEffect } from "react"

function countdowntimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-50 text-3xl font-bold text-purple-800 shadow-md">
          {timeLeft.days}
        </div>
        <span className="mt-2 text-sm font-medium text-purple-600">Días</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-50 text-3xl font-bold text-purple-800 shadow-md">
          {timeLeft.hours}
        </div>
        <span className="mt-2 text-sm font-medium text-purple-600">Horas</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-50 text-3xl font-bold text-purple-800 shadow-md">
          {timeLeft.minutes}
        </div>
        <span className="mt-2 text-sm font-medium text-purple-600">Minutos</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-50 text-3xl font-bold text-purple-800 shadow-md">
          {timeLeft.seconds}
        </div>
        <span className="mt-2 text-sm font-medium text-purple-600">Segundos</span>
      </div>
    </div>
  )
}

export default countdowntimer

