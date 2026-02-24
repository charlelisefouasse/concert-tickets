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
}

export function Ticket({ data, className }: TicketProps) {
  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString()
    : 'DATE TBD'

  const isSeat = data.placeType === 'seat'

  return (
    <div
      className={cn(
        'relative flex w-[148.5mm] h-[42mm] overflow-hidden rounded-xl bg-white shadow-2xl text-slate-900 border border-slate-200 shrink-0',
        className,
      )}
    >
      {/* Background embellishments */}
      <div className="absolute top-0 left-0 w-full h-[2mm] bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* Main Body (75%) */}
      <div className="flex-[0.75] w-[75%] flex flex-col justify-between p-[4mm] shrink-0 min-w-0">
        <div className="flex flex-col gap-[2mm] w-full items-center h-full justify-center">
          <h1 className="text-[8mm] leading-[8mm] font-black uppercase tracking-tighter truncate text-slate-900">
            {data.artist || 'ARTIST NAME'}
          </h1>
          {data.supportingArtists && (
            <p className="text-[3mm] leading-[4mm] text-slate-600 font-medium uppercase mt-[1mm] truncate">
              with {data.supportingArtists}
            </p>
          )}
        </div>

        <div className="gap-[2mm] mt-auto flex justify-between">
          <div className="flex gap-[1.5mm] items-center font-bold text-[3mm] leading-[3.5mm] text-slate-800 uppercase">
            <span className="truncate">{formattedDate}</span>
            {formattedDate && data.city && <span>•</span>}
            <span className="truncate">
              {data.startingHour}{' '}
              {data.startingHourSuffix === '24h' ? '' : data.startingHourSuffix}
            </span>
          </div>

          <div className="flex gap-[1.5mm] items-center font-bold text-[3mm] leading-[3.5mm] text-slate-800 uppercase">
            <span className="truncate">{data.venue}</span>
            {data.venue && data.city && <span>•</span>}
            <span className="truncate">{data.city}</span>
          </div>
        </div>
      </div>

      {/* Dashed Separator */}
      <div className="relative w-[0.5mm] border-l-[0.5mm] border-dashed border-slate-300  shrink-0 flex items-center justify-center" />

      {/* Stub (25%) */}
      <div className="flex-[0.25] w-[25%] flex flex-col p-[4mm] bg-slate-50 shrink-0 items-center gap-[2mm] text-center h-full">
        <div className="w-full flex flex-col justify-evenly h-full">
          {data.ticketType && (
            <p className="text-[2.5mm] leading-[3mm] font-bold uppercase tracking-wider text-indigo-600">
              {data.ticketType}
            </p>
          )}
          {data.price && (
            <p className="text-[3mm] leading-[3.5mm] font-black mt-[1mm]">
              {data.price}
            </p>
          )}
          <h2 className="text-[4mm] leading-[4.5mm] font-black uppercase text-slate-900 text-wrap mt-[2mm]">
            {data.artist || 'ARTIST'}
          </h2>
          <p className="text-[2.5mm] leading-[3mm] text-slate-500 uppercase font-medium mt-[0.5mm]">
            {formattedDate}
          </p>
        </div>

        {data.displayPlacement && (
          <>
            <div className="w-full h-[0.25mm] bg-slate-200" />
            <div className="w-full">
              {isSeat ? (
                <div className="space-y-[1mm]">
                  <div>
                    <p className="text-[2mm] leading-[2.5mm] text-slate-500 uppercase font-bold mb-[0.5mm]">
                      Place
                    </p>
                    <p className="font-black text-[3.5mm] leading-[4mm] tracking-widest uppercase text-indigo-600">
                      Seated
                    </p>
                  </div>

                  {(!!data.section || !!data.row || !!data.seatNumber) && (
                    <div className="grid grid-cols-3 gap-[1mm]">
                      {data.section && (
                        <div>
                          <p className="text-[2mm] leading-[2.5mm] text-slate-500 uppercase font-bold">
                            Section
                          </p>
                          <p className="font-bold text-[3mm] leading-[3.5mm]">
                            {data.section || '-'}
                          </p>
                        </div>
                      )}
                      {data.row && (
                        <div>
                          <p className="text-[2mm] leading-[2.5mm] text-slate-500 uppercase font-bold">
                            Row
                          </p>
                          <p className="font-bold text-[3mm] leading-[3.5mm]">
                            {data.row || '-'}
                          </p>
                        </div>
                      )}
                      {data.seatNumber && (
                        <div>
                          <p className="text-[2mm] leading-[2.5mm] text-slate-500 uppercase font-bold">
                            Seat
                          </p>
                          <p className="font-bold text-[3mm] leading-[3.5mm]">
                            {data.seatNumber || '-'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-[2mm] leading-[2.5mm] text-slate-500 uppercase font-bold mb-[0.5mm]">
                    Place
                  </p>
                  <p className="font-black text-[3.5mm] leading-[4mm] tracking-widest uppercase text-indigo-600">
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
