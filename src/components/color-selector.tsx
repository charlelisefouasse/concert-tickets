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
      </RadioGroup>
    </div>
  )
}
