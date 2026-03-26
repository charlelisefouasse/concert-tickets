import * as React from 'react'
import { RadioGroup, PatternRadioItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export const PATTERNS = [
  'none',
  'dots',
  'stripes',
  'horizontal',
  'vertical',
  'grid',
  'honeycomb',
  'checkerboard',
  'waves',
  'circular',
  'gradient',
] as const

export type PatternType = (typeof PATTERNS)[number]

export function getPatternStyle(
  pattern: PatternType,
  color: string,
  isPreview = false,
): React.CSSProperties {
  const scale = isPreview ? 0.8 : 1
  const stripeWidth = 0.3 * scale
  const stripeSpacing = 4 * scale
  const gridLine = 0.2 * scale
  const gridSpacing = 5 * scale
  const baseOpacity = 0.06 * scale

  let style: React.CSSProperties = {}

  switch (pattern) {
    case 'honeycomb': {
      const scale = isPreview ? 0.7 : 1
      const p21 = 5.25 * scale
      const p30 = 7.5 * scale
      const p19 = 4.75 * scale
      const p40 = 10 * scale
      const p60 = 15 * scale
      style = {
        backgroundColor: '#ffffff',
        backgroundImage: `radial-gradient(circle farthest-side at 0% 50%, #ffffff 23.5%, transparent 0), radial-gradient(circle farthest-side at 0% 50%, ${color} 24%, transparent 0), linear-gradient(#ffffff 14%, transparent 0, transparent 85%, #ffffff 0), linear-gradient(150deg, #ffffff 24%, ${color} 0, ${color} 26%, transparent 0, transparent 74%, ${color} 0, ${color} 76%, #ffffff 0), linear-gradient(30deg, #ffffff 24%, ${color} 0, ${color} 26%, transparent 0, transparent 74%, ${color} 0, ${color} 76%, #ffffff 0), linear-gradient(90deg, ${color} 2%, #ffffff 0, #ffffff 98%, ${color} 0%)`,
        backgroundPosition: `${p21}mm ${p30}mm, ${p19}mm ${p30}mm, 0 0, 0 0, 0 0, 0 0`,
        backgroundSize: `${p40}mm ${p60}mm`,
        opacity: baseOpacity,
      }
      break
    }
    case 'dots': {
      const scale = isPreview ? 0.6 : 1
      const s = 8.2 * scale
      const r = 0.4 * scale
      style = {
        backgroundImage: `radial-gradient(${color} ${r}mm, transparent ${r}mm)`,
        backgroundSize: `${s}mm ${s}mm`,
        opacity: 0.1,
      }
      break
    }
    case 'stripes':
      style = {
        backgroundImage: `repeating-linear-gradient(45deg, ${color} 0, ${color} ${stripeWidth}mm, transparent ${stripeWidth}mm, transparent ${stripeSpacing}mm)`,
        opacity: baseOpacity,
      }
      break
    case 'horizontal':
      style = {
        backgroundImage: `repeating-linear-gradient(0deg, ${color} 0, ${color} ${stripeWidth}mm, transparent ${stripeWidth}mm, transparent ${stripeSpacing}mm)`,
        opacity: baseOpacity,
      }
      break
    case 'vertical':
      style = {
        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0, ${color} ${stripeWidth}mm, transparent ${stripeWidth}mm, transparent ${stripeSpacing}mm)`,
        opacity: baseOpacity,
      }
      break
    case 'grid':
      style = {
        backgroundImage: `linear-gradient(${color} ${gridLine}mm, transparent ${gridLine}mm), linear-gradient(90deg, ${color} ${gridLine}mm, transparent ${gridLine}mm)`,
        backgroundSize: `${gridSpacing}mm ${gridSpacing}mm`,
        opacity: baseOpacity,
      }
      break

    case 'waves': {
      const scale = isPreview ? 0.5 : 1
      const w = 3.2 * scale
      style = {
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #ffffff ${w}mm), repeating-linear-gradient(${color}55, ${color})`,
        opacity: baseOpacity,
      }
      break
    }
    case 'checkerboard': {
      const scale = isPreview ? 0.5 : 1
      const s = 8 * scale
      style = {
        backgroundImage: `repeating-linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%, ${color}), repeating-linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%, ${color})`,
        backgroundPosition: `0 0, ${s / 2}mm ${s / 2}mm`,
        backgroundSize: `${s}mm ${s}mm`,
        opacity: 0.05,
      }
      break
    }
    case 'circular': {
      const scale = isPreview ? 0.5 : 1
      const c1 = 1.8 * scale
      const c2 = 3.5 * scale
      style = {
        backgroundImage: `radial-gradient(circle at center center, ${color}, #ffffff), repeating-radial-gradient(circle at center center, ${color}, ${color} ${c1}mm, transparent ${c1}mm, transparent ${c2}mm)`,
        backgroundBlendMode: 'multiply',
        opacity: 0.03,
      }
      break
    }
    case 'gradient': {
      style = {
        backgroundImage: `radial-gradient(circle at top left, ${color}, transparent 70%)`,
        filter: `blur(${3 * scale}mm)`,
        backgroundRepeat: 'no-repeat',
        opacity: 0.08,
      }
      break
    }
    default:
      return {}
  }

  if (isPreview) {
    style.opacity = 0.5
  }

  return style
}

interface PatternSelectorProps {
  value: PatternType
  onChange: (value: PatternType) => void
  themeColor: string
  className?: string
}

export function PatternSelector({
  value,
  onChange,
  themeColor,
  className,
}: PatternSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <Label className="uppercase text-xs font-bold text-neutral-500">
        Ticket Pattern
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-4"
      >
        {PATTERNS.map((pattern) => {
          return (
            <PatternRadioItem
              key={pattern}
              value={pattern}
              id={`pattern-${pattern}`}
              className="data-checked:ring-(--ring-color) bg-white group/item"
              style={{ '--ring-color': themeColor } as React.CSSProperties}
              aria-label={pattern}
            >
              {pattern !== 'none' ? (
                <div
                  className="absolute inset-0"
                  style={getPatternStyle(pattern, themeColor, true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-neutral-400 group-data-checked/item:text-neutral-800">
                  NONE
                </div>
              )}
            </PatternRadioItem>
          )
        })}
      </RadioGroup>
    </div>
  )
}
