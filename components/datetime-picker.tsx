"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { format, parse, isValid } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  value?: string; // ISO string
  onChange: (newDateIso: string) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [time, setTime] = React.useState<string>(() => {
    if (value) {
      const d = new Date(value)
      return isValid(d) ? format(d, "HH:mm:ss") : "00:00:00"
    }
    return "00:00:00"
  })

  // debounce timer
  const debounceRef = React.useRef<NodeJS.Timeout>()

  // sync with external value
  React.useEffect(() => {
    if (value) {
      const d = new Date(value)
      if (isValid(d)) {
        setDate(d)
        setTime(format(d, "HH:mm:ss"))
        emitIsoString(d, time)
      }
    }
  }, [value])

  const emitIsoString = React.useCallback(
    (d: Date | undefined, t: string) => {
      if (!d) return
      const parsed = parse(t, "HH:mm:ss", d)
      if (isValid(parsed)) {
        onChange(parsed.toISOString())
      }
    },
    [onChange]
  )

  const handleDateSelect = (d: Date) => {
    setDate(d)
    setOpen(false)
    if (d) {
      emitIsoString(d, time)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value // "HH:mm[:ss]"
    setTime(t)
    if (date) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        emitIsoString(date, t)
      }, 300)
    }
  }

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-fit justify-between font-normal"
            >
              {date ? format(date, "yyyy-MM-dd") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d) => d && handleDateSelect(d)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}

