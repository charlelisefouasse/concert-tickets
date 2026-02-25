import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { KeyboardEventHandler, useEffect, useState } from 'react'
import { parse, isValid, format } from 'date-fns'

interface DateInputProps {
  id?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  dateFormat?: string
}

export function DateInput({
  id = 'date-input',
  value,
  onChange,
  placeholder,
  className,
  onKeyDown,
  dateFormat = 'dd/MM/yyyy',
}: DateInputProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date | undefined>(value)

  const getFormattedDate = (d: Date | undefined) => {
    if (!d) return ''
    try {
      return format(d, dateFormat)
    } catch {
      return d.toLocaleDateString()
    }
  }

  const [inputValue, setInputValue] = useState(getFormattedDate(value))
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)

  const defaultPlaceholder =
    dateFormat === 'MM/dd/yyyy' ? '01/31/2025' : '31/01/2025'

  useEffect(() => {
    if (value) {
      setInputValue(getFormattedDate(value))
      setMonth(value)
    } else {
      setInputValue('')
    }
  }, [value, dateFormat])

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <InputGroup className={cn('w-full', className)}>
      <InputGroupInput
        id={id}
        value={inputValue}
        placeholder={placeholder || defaultPlaceholder}
        onChange={(e) => {
          const inputValue = e.target.value
          setInputValue(inputValue)

          try {
            const parsedDate = parse(inputValue, dateFormat, new Date())

            if (
              isValid(parsedDate) &&
              inputValue.length === dateFormat.length
            ) {
              setMonth(parsedDate)
              onChange?.(parsedDate)
            } else if (inputValue === '') {
              onChange?.(undefined)
            }
          } catch (err) {
            // handle parse err silently
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
          onKeyDown?.(e)
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <InputGroupButton
                id={`${id}-picker`}
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            }
          />
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              month={month}
              onMonthChange={setMonth}
              timeZone={timeZone}
              weekStartsOn={1}
              onSelect={(selectedDate) => {
                onChange?.(selectedDate)
                if (selectedDate) {
                  setInputValue(getFormattedDate(selectedDate))
                } else {
                  setInputValue('')
                }
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}
