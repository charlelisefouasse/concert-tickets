import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Ticket, TicketData } from '@/components/ticket'
import { TicketForm } from '@/components/ticket-form'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [ticketData, setTicketData] = React.useState<TicketData>({
    artist: 'Artist Name',
    date: new Date(),
    venue: 'Venue',
    city: 'City',
    supportingArtists: 'Supporting Artist',
    startingHour: '08:00',
    placeType: 'floor',
    section: '',
    row: '',
    seatNumber: '',
    price: '$45.00',
    ticketType: 'General Admission',
    displayPlacement: true,
    startingHourSuffix: 'PM',
  })

  const updateField = (field: keyof TicketData, value: any) => {
    setTicketData((prev) => ({ ...prev, [field]: value }))
  }

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)

  React.useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      // We want some padding, so let's take the container width minus 64px (padding)
      const containerWidth = containerRef.current.clientWidth - 64
      // 148.5mm is roughly 561px (at 96 DPI). But CSS mm is an absolute unit.
      // We can create a hidden div measuring 148.5mm to get its exact pixel width,
      // or we can use the known CSS ratio: 1mm = 3.779527559px
      const ticketPixelWidth = 148.5 * 3.779527559

      const newScale = Math.min(1.5, containerWidth / ticketPixelWidth)
      setScale(newScale)
    }

    // Initial scale
    updateScale()

    const observer = new ResizeObserver(() => {
      updateScale()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 lg:p-12">
      <div className="max-w-[2000px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Ticket Generator
          </h1>
          <p className="text-slate-500 mt-1">
            Customize your concert memory below.
          </p>
        </div>
        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-8l">
            <div className="flex-1">
              <TicketForm ticketData={ticketData} updateField={updateField} />
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-8 sticky top-12 space-y-8">
            <div
              ref={containerRef}
              className="flex items-center justify-center p-4 md:p-8 lg:p-12 bg-slate-200/50 rounded-3xl border border-slate-200 overflow-hidden shadow-inner min-h-[400px]"
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <Ticket data={ticketData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
