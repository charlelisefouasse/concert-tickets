import { getConcertDetails, ConcertSearchResult } from '@/server/setlistfm'
import { DateInput } from '@/components/ui/date-input'
import { ConcertSearch } from './concert-search'
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

import { isValid } from 'date-fns'
import { buttonVariants } from '@/components/ui/button'

interface TicketFormProps {
  ticketData: TicketData
  updateField: (field: keyof TicketData, value: any) => void
}

export function TicketForm({ ticketData, updateField }: TicketFormProps) {
  const handleSelectConcert = async (concert: ConcertSearchResult) => {
    updateField('artist', concert.artist)
    updateField('venue', concert.venue)
    updateField('city', concert.city)

    if (concert.url) updateField('url', concert.url)

    if (concert.date) {
      const newDate = new Date(concert.date)
      if (isValid(newDate)) {
        updateField('date', newDate)
      }
    }

    try {
      const details = await getConcertDetails({
        data: {
          venueId: concert.venueId,
          dateStr: concert.dateStr,
          headlinerId: concert.artistId,
        },
      })
      if (details) {
        console.log(details)
        if (details.openers && details.openers.length > 0) {
          updateField('supportingArtists', details.openers.join(', '))
        } else {
          updateField('supportingArtists', '')
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-6">
      <div className="mb-4">
        <div className="mb-4 flex  gap-2 flex-col">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="artist"
              className="uppercase text-xs font-bold text-neutral-500"
            >
              Prefill information
            </Label>
            {ticketData.url && (
              <a
                href={ticketData.url}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'link', size: 'xs' })}
              >
                View on Setlist.fm
              </a>
            )}
          </div>
          <ConcertSearch onSelect={handleSelectConcert} />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="artist"
          className="uppercase text-xs font-bold text-neutral-500"
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
          className="uppercase text-xs font-bold text-neutral-500"
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
          <Label className="uppercase text-xs font-bold text-neutral-500">
            Date
          </Label>
          <DateInput
            id="date-required"
            value={ticketData.date}
            onChange={(newDate) => {
              updateField('date', newDate)
            }}
            className="w-40"
          />
        </div>
        <div className="flex gap-2 items-end">
          <div className="space-y-2 max-w-24">
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="time"
                className="uppercase text-xs font-bold text-neutral-500"
              >
                Time
              </Label>
              <Switch
                id="display-time"
                checked={ticketData.displayTime}
                onCheckedChange={(checked) =>
                  updateField('displayTime', checked)
                }
              />
            </div>

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
            className="uppercase text-xs font-bold text-neutral-500"
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
            className="uppercase text-xs font-bold text-neutral-500"
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

      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex items-center space-x-2">
          <Label className="uppercase text-xs font-bold text-neutral-500">
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
                <Label htmlFor="floor" className="">
                  Floor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seat" id="seat" />
                <Label htmlFor="seat" className="">
                  Seat
                </Label>
              </div>
            </RadioGroup>

            {ticketData.placeType === 'seat' && (
              <div className="grid grid-cols-3 gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="sec"
                    className="uppercase text-[10px] font-bold text-neutral-400"
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
                    className="uppercase text-[10px] font-bold text-neutral-400"
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
                    className="uppercase text-[10px] font-bold text-neutral-400"
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

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
        <div className="space-y-2">
          <Label
            htmlFor="type"
            className="uppercase text-xs font-bold text-neutral-500"
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
            className="uppercase text-xs font-bold text-neutral-500"
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
