import { Calendar as CalendarIcon } from 'lucide-react'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TicketData } from '@/components/ticket'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

interface TicketFormProps {
  ticketData: TicketData
  updateField: (field: keyof TicketData, value: any) => void
}

export function TicketForm({ ticketData, updateField }: TicketFormProps) {
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  function isValidDate(date: Date | undefined) {
    if (!date) {
      return false
    }
    return !isNaN(date.getTime())
  }

  const formatDate = (date: Date) => date.toLocaleDateString()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    new Date(ticketData.date ?? ''),
  )
  const [month, setMonth] = useState<Date | undefined>(date)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="artist"
          className="uppercase text-xs font-bold text-slate-500"
        >
          Artist
        </Label>
        <Input
          id="artist"
          value={ticketData.artist}
          onChange={(e) => updateField('artist', e.target.value)}
          placeholder="Artist Name"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="supporting"
          className="uppercase text-xs font-bold text-slate-500"
        >
          Supporting Act
        </Label>
        <Input
          id="supporting"
          value={ticketData.supportingArtists}
          onChange={(e) => updateField('supportingArtists', e.target.value)}
          placeholder="Supporting Artist"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <Label className="uppercase text-xs font-bold text-slate-500">
            Date
          </Label>
          <InputGroup className="w-40">
            <InputGroupInput
              id="date-required"
              value={ticketData.date ? formatDate(ticketData.date) : ''}
              placeholder="June 01, 2025"
              onChange={(e) => {
                const date = new Date(e.target.value)
                updateField('date', e.target.value)
                if (isValidDate(date)) {
                  setDate(date)
                  setMonth(date)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setOpen(true)
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  render={
                    <InputGroupButton
                      id="date-picker"
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
                    selected={date}
                    month={month}
                    onMonthChange={setMonth}
                    timeZone={timeZone}
                    weekStartsOn={1}
                    onSelect={(date) => {
                      setDate(date)
                      updateField('date', date ? formatDate(date) : '')
                      setOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="flex gap-2 items-end">
          <div className="space-y-2 max-w-24">
            <Label
              htmlFor="time"
              className="uppercase text-xs font-bold text-slate-500"
            >
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={ticketData.startingHour}
              onChange={(e) => updateField('startingHour', e.target.value)}
              placeholder="08:00"
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          <Select
            value={ticketData.startingHourSuffix}
            onValueChange={(value) => updateField('startingHourSuffix', value)}
          >
            <SelectTrigger className="w-18">
              <SelectValue placeholder="PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
                <SelectItem value="24h">24h</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="venue"
            className="uppercase text-xs font-bold text-slate-500"
          >
            Venue
          </Label>
          <Input
            id="venue"
            value={ticketData.venue}
            onChange={(e) => updateField('venue', e.target.value)}
            placeholder="Venue"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="city"
            className="uppercase text-xs font-bold text-slate-500"
          >
            City
          </Label>
          <Input
            id="city"
            value={ticketData.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="City"
          />
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <Label className="uppercase text-xs font-bold text-slate-500">
            Placement
          </Label>
          <Switch
            id="display-placement"
            checked={ticketData.displayPlacement}
            onCheckedChange={(checked) =>
              updateField('displayPlacement', checked)
            }
          />
        </div>
        {ticketData.displayPlacement && (
          <>
            <RadioGroup
              value={ticketData.placeType}
              onValueChange={(val) =>
                updateField('placeType', val as 'seat' | 'floor')
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="floor" id="floor" />
                <Label htmlFor="floor" className="cursor-pointer">
                  Floor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seat" id="seat" />
                <Label htmlFor="seat" className="cursor-pointer">
                  Seat
                </Label>
              </div>
            </RadioGroup>

            {ticketData.placeType === 'seat' && (
              <div className="grid grid-cols-3 gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="sec"
                    className="uppercase text-[10px] font-bold text-slate-400"
                  >
                    Section
                  </Label>
                  <Input
                    id="sec"
                    placeholder="A"
                    value={ticketData.section}
                    onChange={(e) => updateField('section', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="row"
                    className="uppercase text-[10px] font-bold text-slate-400"
                  >
                    Row
                  </Label>
                  <Input
                    id="row"
                    placeholder="12"
                    value={ticketData.row}
                    onChange={(e) => updateField('row', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="seatNum"
                    className="uppercase text-[10px] font-bold text-slate-400"
                  >
                    Seat
                  </Label>
                  <Input
                    id="seatNum"
                    placeholder="4"
                    value={ticketData.seatNumber}
                    onChange={(e) => updateField('seatNumber', e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div className="space-y-2">
          <Label
            htmlFor="type"
            className="uppercase text-xs font-bold text-slate-500"
          >
            Ticket Type
          </Label>
          <Input
            id="type"
            value={ticketData.ticketType}
            onChange={(e) => updateField('ticketType', e.target.value)}
            placeholder="General Admission"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="price"
            className="uppercase text-xs font-bold text-slate-500"
          >
            Price
          </Label>
          <Input
            id="price"
            value={ticketData.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="$150.00"
          />
        </div>
      </div>
    </div>
  )
}
