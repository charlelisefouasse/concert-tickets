import { useState, useEffect, useRef } from 'react'
import { PencilIcon, PlusIcon } from 'lucide-react'
import { RadioGroup, ColorRadioItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const COLORS = [
  // black
  '#171717',
  // red
  '#b3191f',
  // blue
  '#365cd1',
  // pink
  '#e04c99',
  // purple
  '#9029d6',
  // green
  '#008236',
  // orange
  '#d1671d',
]

export function ColorSelector({
  value,
  onChange,
  className,
}: ColorSelectorProps) {
  const isCustomColor = !COLORS.includes(value)

  const [localColor, setLocalColor] = useState(
    isCustomColor ? value : '#ffffff',
  )
  const [hasPickedCustom, setHasPickedCustom] = useState(isCustomColor)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!COLORS.includes(value)) {
      setLocalColor(value)
      setHasPickedCustom(true)
    }
  }, [value])

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setLocalColor(newColor)
    setHasPickedCustom(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newColor)
      timeoutRef.current = null
    }, 50)
  }

  const handleCustomClick = () => {
    if (hasPickedCustom && value !== localColor) {
      onChange(localColor)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Label className="uppercase text-xs font-bold text-neutral-500">
        Ticket Color
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-4"
      >
        {COLORS.map((color) => {
          return (
            <ColorRadioItem
              key={color}
              value={color}
              id={`color-${color.replace(/[^\w-]/g, '')}`}
              style={
                {
                  backgroundColor: color,
                  '--ring-color': color,
                } as React.CSSProperties
              }
              className="data-checked:ring-(--ring-color)"
              aria-label={color}
            />
          )
        })}

        <div className="relative flex items-center justify-center">
          <input
            type="color"
            value={localColor}
            onChange={handleCustomColorChange}
            onClick={handleCustomClick}
            className="absolute inset-0 size-8 cursor-pointer opacity-0"
            aria-label="Custom color"
          />
          <div
            className={cn(
              'pointer-events-none flex size-8 items-center justify-center rounded-full border border-neutral-200 outline-none ring-offset-2 ring-offset-white transition-all text-neutral-500',
              {
                'ring-2 ring-neutral-900': isCustomColor,
                'bg-white hover:bg-neutral-50 ': !hasPickedCustom,
              },
            )}
            style={hasPickedCustom ? { backgroundColor: localColor } : {}}
          >
            {!hasPickedCustom && <PlusIcon className="size-4" />}
            {hasPickedCustom && (
              <div className="absolute bg-white rounded-full p-1 -bottom-1.5 -right-1.5 border">
                <PencilIcon className="size-3  text-black" />
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
