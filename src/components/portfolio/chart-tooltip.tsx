'use client'

import * as React from 'react'

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number | string
    color?: string
    dataKey?: string
  }>
  label?: string | number
  formatter?: (value: number | string, name?: string) => string
  labelFormatter?: (label: string | number) => string
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur px-3 py-2 shadow-lg">
      {label !== undefined && (
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-semibold tabular-nums">
              {formatter
                ? formatter(entry.value ?? 0, entry.name)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
