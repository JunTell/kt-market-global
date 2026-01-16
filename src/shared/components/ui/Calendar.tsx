"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ko } from "date-fns/locale"
import { cn } from "@/shared/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ko}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pt-16 relative", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "absolute left-0 top-2 w-full flex justify-between items-center px-10 py-2 z-50",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors pointer-events-auto cursor-pointer"
        ),
        nav_button_previous: "static",
        nav_button_next: "static",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-12 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-10 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-10 w-12 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 focus:outline-none transition-colors !cursor-pointer [&_*]:!cursor-pointer text-center"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
        day_today: "bg-gray-100 text-gray-900 border border-gray-200",
        day_outside:
          "day-outside text-gray-400 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30",
        day_disabled: "text-gray-400 opacity-50",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
