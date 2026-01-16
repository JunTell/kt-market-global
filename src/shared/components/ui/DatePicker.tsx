"use client"

import * as React from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Calendar } from "./Calendar"
import { motion, AnimatePresence } from "framer-motion"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
}

export function DatePicker({
  date,
  setDate,
  label,
  placeholder = "Pick a date",
  className,
  disabled = false,
  error,
  helperText
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (newDate?: Date) => {
    setDate(newDate)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative w-full mb-6", className)} ref={containerRef}>
      {label && (
        <label className="block text-[13px] text-[#86868b] mb-2 font-medium">
          {label}
        </label>
      )}

      <div
        className={cn(
          "w-full p-4 text-base rounded-lg border bg-white flex items-center justify-between cursor-pointer transition-all duration-200 select-none",
          isOpen ? "border-[#4285F4] ring-2 ring-[#4285F4]/10" : "border-[#E5E7EB] hover:border-[#4285F4]",
          error && "border-state-error focus:border-start-error ring-state-error/10",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50",
          className
        )}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen)
          }
        }}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className={cn("w-5 h-5 text-gray-500", date && "text-[#4285F4]")} />
          <span className={cn("block truncate", !date && "text-gray-400")}>
            {date ? format(date, "PPP", { locale: ko }) : <span>{placeholder}</span>}
          </span>
        </div>
      </div>

      {helperText && (
        <p className={cn("mt-1 text-[13px]", error ? "text-state-error" : "text-[#86868b]")}>
          {helperText}
        </p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 p-2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
