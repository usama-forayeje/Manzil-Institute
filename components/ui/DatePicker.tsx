"use client"

import * as React from "react"
import { format } from "date-fns"
import { bn } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Bengali numerals converter
function toBengaliNum(n: number): string {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return String(n)
    .split("")
    .map((d) => (/\d/.test(d) ? bn[Number(d)] : d))
    .join("")
}

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল",
  "মে", "জুন", "জুলাই", "আগস্ট",
  "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
]

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
  startYear?: number
  endYear?: number
}

export function DatePicker({
  date,
  setDate,
  placeholder = "তারিখ নির্বাচন করুন",
  startYear = 1950,
  endYear = new Date().getFullYear() + 2,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Format: ১৫ জানুয়ারি ২০২৫
  const formattedDate = date
    ? `${toBengaliNum(date.getDate())} ${BN_MONTHS[date.getMonth()]} ${toBengaliNum(date.getFullYear())}`
    : null

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-11 rounded-xl transition-all shadow-sm px-4 kalpurush-font",
            "bg-background border-input hover:bg-accent hover:text-accent-foreground",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-cyan-500 shrink-0" />
          <span>{formattedDate ?? placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 rounded-2xl border-border shadow-2xl overflow-hidden kalpurush-font"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          captionLayout="dropdown"
          startMonth={new Date(startYear, 0)}
          endMonth={new Date(endYear, 11)}
          className="rounded-2xl kalpurush-font"
          formatters={{
            formatMonthDropdown: (month: Date) => BN_MONTHS[month.getMonth()],
            formatYearDropdown: (year: Date) => toBengaliNum(year.getFullYear()),
          }}
          classNames={{
            // Fix dark mode: ensure selects use theme-aware text & background
            dropdown_root: cn(
              "relative inline-flex items-center rounded-md px-2 py-0.5 kalpurush-font",
              "bg-card text-card-foreground border border-input",
              "[&>select]:bg-card [&>select]:text-card-foreground",
              "[&>select]:text-sm [&>select]:font-semibold",
              "[&>select]:focus:outline-none [&>select]:cursor-pointer",
              "[&>select]:appearance-none [&>select]:pr-4"
            ),
            dropdown: "opacity-100",
            chevron: "fill-cyan-500",
            dropdowns: "flex items-center gap-2 kalpurush-font",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
