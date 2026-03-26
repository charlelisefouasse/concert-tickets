import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Ticket, TicketData } from '@/components/ticket'
import { TicketForm } from '@/components/ticket-form'
import { ColorSelector } from '@/components/color-selector'
import { PatternSelector, PatternType } from '@/components/pattern-selector'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

import { toPng } from 'html-to-image'
import { addDpiMetadata } from '@/server/generate-ticket'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [ticketData, setTicketData] = React.useState<TicketData>({
    artist: 'Artist Name',
    date: new Date(),
    venue: 'Venue',
    city: 'City',
    supportingArtists: 'Supporting Artist',
    startingHour: '',
    placeType: 'floor',
    section: '',
    row: '',
    seatNumber: '',
    price: '',
    ticketType: 'General Admission',
    displayPlacement: true,
    displayTime: true,
    startingHourSuffix: 'PM',
    dateFormat: 'dd/MM/yyyy',
    themeColor: '#171717',
    pattern: 'none',
  })

  const updateField = (field: keyof TicketData, value: any) => {
    setTicketData((prev) => ({ ...prev, [field]: value }))
  }

  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)
  const [isDownloading, setIsDownloading] = React.useState(false)

  const handleDownload = async () => {
    const node = document.getElementById('ticket')

    if (!node) {
      return
    }

    try {
      setIsDownloading(true)
      const ticketWidthMm = 200
      const targetDpi = 300
      // Calculate how many pixels we need total
      const targetPixels = (ticketWidthMm / 25.4) * targetDpi

      // Find the ratio between target pixels and current screen pixels
      const currentWidthPx = node.offsetWidth
      const customRatio = targetPixels / currentWidthPx

      const dataUrl = await toPng(node, { pixelRatio: customRatio })

      const processedUrl = await addDpiMetadata({
        data: { imageUri: dataUrl, dpi: targetDpi },
      })

      const link = document.createElement('a')
      link.href = processedUrl
      const artist = ticketData.artist
        ? ticketData.artist.replace(/\s+/g, '-').toLowerCase()
        : ''
      const date = ticketData.date?.toLocaleDateString() ?? ''
      link.download = `ticket-${artist}-${date}.png`
      link.click()
    } catch (err) {
      console.error('oops, something went wrong!', err)
    } finally {
      setIsDownloading(false)
    }
  }

  React.useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return

      const style = window.getComputedStyle(containerRef.current)
      const paddingX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)

      // We want the inner width available for the ticket
      const containerWidth = containerRef.current.clientWidth - paddingX
      // 148.5mm is roughly 561px (at 96 DPI). But CSS mm is an absolute unit.
      // We can create a hidden div measuring 148.5mm to get its exact pixel width,
      // or we can use the known CSS ratio: 1mm = 3.779527559px
      const ticketPixelWidth = 200 * 3.779527559

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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-4 md:p-8 md:py-6 min-[1920px]:p-12">
      <div className="max-w-[2000px] mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Ticket Generator
          </h1>
          <p className="text-neutral-500 mt-1">
            Customize your concert ticket souvenir below.
          </p>
        </div>

        <div className="gap-8 flex flex-wrap items-start">
          {/* Left Column: Form */}

          <div className="flex flex-col w-full max-w-md gap-4 items-center">
            <TicketForm ticketData={ticketData} updateField={updateField} />
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full"
              size="lg"
            >
              <Download />
              {isDownloading ? 'Generating...' : 'Download PNG'}
            </Button>
          </div>

          {/* Right Column: Live Preview */}
          <div className="flex-1 sticky top-12 space-y-8 overflow-hidden min-w-[300px]">
            <div
              ref={containerRef}
              className="relative flex items-center justify-center p-4 md:p-8 lg:p-12 bg-neutral-200/50 rounded-3xl border border-neutral-200 overflow-hidden shadow-inner lg:min-h-[400px]"
            >
              <div className="scale-[0.1] absolute">
                <Ticket
                  data={ticketData}
                  id="ticket"
                  className="border-[0.1mm] border-dashed border-neutral-400"
                />
              </div>
              <div
                style={{
                  position: 'relative',
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <Ticket data={ticketData} className="shadow-2xl" />
              </div>
            </div>

            <div className="hidden lg:flex gap-6">
              <ColorSelector
                value={ticketData.themeColor || '#171717'}
                onChange={(val) => updateField('themeColor', val)}
                className="px-4 py-3"
              />

              <PatternSelector
                value={(ticketData.pattern || 'none') as PatternType}
                onChange={(val) => updateField('pattern', val)}
                themeColor={ticketData.themeColor || '#171717'}
                className="px-4 py-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
