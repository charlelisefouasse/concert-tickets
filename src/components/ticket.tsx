import { cn } from '@/lib/utils'

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
  startingHourSuffix?: 'AM' | 'PM' | '24h'
}

type TicketProps = {
  data: TicketData
  className?: string
  id?: string
}

export function Ticket({ data, className, id }: TicketProps) {
  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString()
    : 'DATE TBD'

  const isSeat = data.placeType === 'seat'

  return (
    <div
      className={cn(
        'relative flex w-[200mm] h-[56.6mm] overflow-hidden rounded-xl bg-white shadow-2xl text-neutral-900  shrink-0',
        className,
      )}
      id={id}
    >
      {/* Background embellishments */}
      <div className="absolute top-0 left-0 w-full h-[2.7mm] bg-neutral-900" />

      {/* Main Body (75%) */}
      <div className="flex-[0.75] w-[75%] flex flex-col justify-between p-[5.4mm] shrink-0 min-w-0">
        <div className="flex flex-col gap-[4mm] w-full items-center h-full justify-center text-center">
          <h1 className="text-[11mm] leading-[11mm] font-black uppercase tracking-tighter text-wrap text-neutral-900">
            {data.artist || 'ARTIST NAME'}
          </h1>
          {data.supportingArtists && (
            <p className="text-[4mm] leading-[5.4mm] text-neutral-600 font-medium uppercase  text-wrap">
              with {data.supportingArtists}
            </p>
          )}
        </div>

        <div className="gap-[2.7mm] mt-auto flex justify-between">
          <div className="flex gap-[2mm] items-center font-bold text-[4mm] leading-[4.7mm] text-neutral-800 uppercase">
            <span className="truncate">{formattedDate}</span>
            {formattedDate && data.city && <span>•</span>}
            <span className="truncate">
              {data.startingHour}{' '}
              {data.startingHourSuffix === '24h' ? '' : data.startingHourSuffix}
            </span>
          </div>

          <div className="flex gap-[2mm] items-center font-bold text-[4mm] leading-[4.7mm] text-neutral-800 uppercase">
            <span className="truncate">{data.venue}</span>
            {data.venue && data.city && <span>•</span>}
            <span className="truncate">{data.city}</span>
          </div>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="relative w-[0.7mm] border-l-[0.7mm] border-dashed border-neutral-300 mt-[2.6mm] shrink-0 flex items-center justify-center" />

      {/* Stub (25%) */}
      <div className="flex-[0.25] w-[25%] flex flex-col p-[5.4mm] bg-neutral-50 shrink-0 items-center gap-[2.7mm] text-center h-full">
        <div className="w-full flex flex-col justify-evenly h-full">
          {data.ticketType && (
            <p className="text-[3.4mm] leading-[4mm] font-bold uppercase tracking-wider text-neutral-600">
              {data.ticketType}
            </p>
          )}
          {data.price && (
            <p className="text-[4mm] leading-[4.7mm] font-black mt-[1.3mm]">
              {data.price}
            </p>
          )}
          <h2 className="text-[5.4mm] leading-[6.1mm] font-black uppercase text-neutral-900 text-wrap mt-[2.7mm]">
            {data.artist || 'ARTIST'}
          </h2>
          <p className="text-[3.4mm] leading-[4mm] text-neutral-500 uppercase font-medium mt-[0.7mm]">
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
                    <p className="text-[2.7mm] leading-[3.4mm] text-neutral-500 uppercase font-bold mb-[0.7mm]">
                      Place
                    </p>
                    <p className="font-black text-[4.7mm] leading-[5.4mm] tracking-widest uppercase text-neutral-900">
                      Seated
                    </p>
                  </div>

                  {(!!data.section || !!data.row || !!data.seatNumber) && (
                    <div className="grid grid-cols-3 gap-[1.3mm]">
                      {data.section && (
                        <div>
                          <p className="text-[2.7mm] leading-[3.4mm] text-neutral-500 uppercase font-bold">
                            Section
                          </p>
                          <p className="font-bold text-[4mm] leading-[4.7mm]">
                            {data.section || '-'}
                          </p>
                        </div>
                      )}
                      {data.row && (
                        <div>
                          <p className="text-[2.7mm] leading-[3.4mm] text-neutral-500 uppercase font-bold">
                            Row
                          </p>
                          <p className="font-bold text-[4mm] leading-[4.7mm]">
                            {data.row || '-'}
                          </p>
                        </div>
                      )}
                      {data.seatNumber && (
                        <div>
                          <p className="text-[2.7mm] leading-[3.4mm] text-neutral-500 uppercase font-bold">
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
                  <p className="text-[2.7mm] leading-[3.4mm] text-neutral-500 uppercase font-bold mb-[0.7mm]">
                    Place
                  </p>
                  <p className="font-black text-[4.7mm] leading-[5.4mm] tracking-widest uppercase text-neutral-900">
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
