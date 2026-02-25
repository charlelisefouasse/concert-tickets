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
import { parse, isValid } from 'date-fns'

interface DateInputProps {
  id?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}

export function DateInput({
  id = 'date-input',
  value,
  onChange,
  placeholder = '31/01/2025',
  className,
  onKeyDown,
}: DateInputProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date | undefined>(value)
  const [inputValue, setInputValue] = useState(
    value?.toLocaleDateString() ?? '',
  )
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (value) {
      setInputValue(value.toLocaleDateString())
      setMonth(value)
    } else {
      setInputValue('')
    }
  }, [value])

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <InputGroup className={cn('w-full', className)}>
      <InputGroupInput
        id={id}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => {
          const inputValue = e.target.value
          setInputValue(inputValue)
          const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date())

          console.log({ inputValue, parsedDate })

          if (isValid(parsedDate) && inputValue.length >= 10) {
            console.log('change')
            setMonth(parsedDate)
            onChange?.(parsedDate)
          } else if (inputValue === '') {
            onChange?.(undefined)
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
                  setInputValue(selectedDate.toLocaleDateString())
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
