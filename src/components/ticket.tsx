import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { getPatternStyle, PatternType } from './pattern-selector'

export type TicketData = {
  artist: string
  date: Date | undefined
  venue: string
  city: string
  supportingArtists?: string
  startingHour?: string
  placeType: 'seat' | 'floor'
  section?: string
  row?: string
  seatNumber?: string
  price?: string
  ticketType?: string
  displayPlacement: boolean
  displayTime: boolean
  startingHourSuffix?: 'AM' | 'PM' | '24h'
  url?: string
  dateFormat: string
  themeColor?: string
  pattern?: PatternType
}

type TicketProps = {
  data: TicketData
  className?: string
  id?: string
}

export function Ticket({ data, className, id }: TicketProps) {
  const formattedDate = data.date
    ? format(new Date(data.date), data.dateFormat || 'dd/MM/yyyy')
    : 'DATE TBD'

  const isSeat = data.placeType === 'seat'

  return (
    <div
      className={cn(
        'relative flex w-[200mm] h-[56.6mm] overflow-hidden rounded-xl bg-white shrink-0 text-(--theme-color)',
        className,
      )}
      style={
        {
          '--theme-color': data.themeColor || '#171717',
        } as React.CSSProperties
      }
      id={id}
    >
      {/* Background embellishments */}
      <div
        className={cn(
          'z-10 absolute top-0 left-0 w-full h-[2.7mm] bg-(--theme-color)',
        )}
      />

      {/* Main Body (75%) */}
      <div className="relative overflow-hidden flex-[0.75] w-[75%] flex flex-col justify-between p-[5.4mm] shrink-0 min-w-0">
        {/* Pattern overlay */}
        {data.pattern && data.pattern !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={getPatternStyle(
              data.pattern,
              data.themeColor || '#171717',
              false,
            )}
          />
        )}
        <div className="relative z-10 flex flex-col gap-[4mm] w-full items-center h-full justify-center text-center">
          <h1
            className={cn(
              'text-[11mm] leading-[11mm] font-black uppercase tracking-tighter text-wrap text-(--theme-color)',
            )}
          >
            {data.artist || 'ARTIST NAME'}
          </h1>
          {data.supportingArtists && (
            <p className="text-[4mm] leading-[5.4mm] text-neutral-600 font-medium uppercase  text-wrap">
              with {data.supportingArtists}
            </p>
          )}
        </div>

        <div className="relative z-10 gap-[2.7mm] mt-auto flex justify-between">
          <div className="flex gap-[2mm] items-center font-bold text-[4mm] leading-[4.7mm] text-neutral-600 uppercase">
            <span className="truncate">{formattedDate}</span>
            {data.displayTime && (
              <>
                {formattedDate && data.city && <span>•</span>}
                <span className="truncate">
                  {data.startingHour || '--:--'}{' '}
                  {data.startingHourSuffix === '24h'
                    ? ''
                    : data.startingHourSuffix}
                </span>
              </>
            )}
          </div>

          <div className="flex gap-[2mm] items-center font-bold text-[4mm] leading-[4.7mm] text-neutral-600 uppercase">
            <span className="truncate">{data.venue}</span>
            {data.venue && data.city && <span>•</span>}
            <span className="truncate">{data.city}</span>
          </div>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="relative w-[0.7mm] border-l-[0.7mm] border-dashed border-(--theme-color)/25 mt-[2.6mm] shrink-0 flex items-center justify-center" />

      {/* Stub (25%) */}
      <div className="z-5 flex-[0.25] flex flex-col p-[2mm] py-[3mm] bg-(--theme-color)/2 shrink-0 items-center gap-[2.7mm] text-center h-full">
        <div className="w-full flex flex-col justify-evenly h-full">
          {data.ticketType && (
            <p className="text-[3.4mm] leading-[4mm] font-bold uppercase tracking-wider text-neutral-600">
              {data.ticketType}
            </p>
          )}
          {data.price && (
            <p className="text-[4mm] leading-[4.7mm] font-black">
              {data.price}
            </p>
          )}
          <h2
            className={cn(
              'text-[5.4mm] leading-[6.1mm] font-black uppercase tracking-tighter text-wrap text-(--theme-color)',
            )}
          >
            {data.artist || 'ARTIST'}
          </h2>
          <p className="text-[3.4mm] leading-[4mm] text-neutral-600 uppercase font-medium">
            {formattedDate}
          </p>
        </div>

        {data.displayPlacement && (
          <>
            <div className="w-full h-[0.3mm] bg-neutral-200" />
            <div className="w-full">
              {isSeat ? (
                <div className="space-y-[1.3mm]">
                  <div>
                    <p className="text-[2.7mm] leading-[3.4mm] text-neutral-600 uppercase font-bold mb-[0.7mm]">
                      Place
                    </p>
                    <p
                      className={cn(
                        'font-black text-[4.7mm] leading-[5.4mm] tracking-widest uppercase text-(--theme-color)',
                      )}
                    >
                      Seated
                    </p>
                  </div>

                  {(!!data.section || !!data.row || !!data.seatNumber) && (
                    <div className="grid grid-cols-3 gap-[1.3mm]">
                      {data.section && (
                        <div>
                          <p className="text-[2.7mm] leading-[3.4mm] text-neutral-600 uppercase font-bold">
                            Section
                          </p>
                          <p className="font-bold text-[4mm] leading-[4.7mm]">
                            {data.section || '-'}
                          </p>
                        </div>
                      )}
                      {data.row && (
                        <div>
                          <p className="text-[2.7mm] leading-[3.4mm] text-neutral-600 uppercase font-bold">
                            Row
                          </p>
                          <p className="font-bold text-[4mm] leading-[4.7mm]">
                            {data.row || '-'}
                          </p>
                        </div>
                      )}
                      {data.seatNumber && (
                        <div>
                          <p className="text-[2.7mm] leading-[3.4mm] text-neutral-600 uppercase font-bold">
                            Seat
                          </p>
                          <p className="font-bold text-[4mm] leading-[4.7mm]">
                            {data.seatNumber || '-'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-[2.7mm] leading-[3.4mm] text-neutral-600 uppercase font-bold mb-[0.7mm]">
                    Place
                  </p>
                  <p
                    className={cn(
                      'font-black text-[4.7mm] leading-[5.4mm] tracking-widest uppercase text-(--theme-color)',
                    )}
                  >
                    Floor
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
