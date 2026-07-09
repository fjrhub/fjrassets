'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import type { PortfolioRow } from '@/lib/types'
import { ASSET_KEYS, ASSET_META } from '@/lib/types'
import { formatNumberID } from '@/lib/format'
import { EmptyChart } from './trend-area-chart'

interface CompositionDonutProps {
  rows: PortfolioRow[]
}

export function CompositionDonut({ rows }: CompositionDonutProps) {
  const latest = rows[rows.length - 1]

  // Sembunyikan aset yang nilainya 0 — jangan tampilkan slice kosong
  const data = React.useMemo(() => {
    if (!latest) return []
    return ASSET_KEYS.map((key) => ({
      name: ASSET_META[key].label,
      value: latest[key],
      color: ASSET_META[key].color,
    })).filter((d) => d.value > 0)
  }, [latest])

  if (!latest || data.length === 0) {
    return <EmptyChart />
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const hasMultiple = data.length > 1

  return (
    <div
      className="relative h-full w-full [&_.recharts-surface]:outline-none [&_.recharts-surface:focus]:outline-none"
      style={{ outline: 'none' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={hasMultiple ? '62%' : '0%'}
            outerRadius="90%"
            paddingAngle={hasMultiple ? 2 : 0}
            stroke="none"
            isAnimationActive
            // disable klik/hover "active shape" yang menampilkan highlight kotak
            activeShape={false as unknown as undefined}
            // jangan set activeIndex otomatis
            activeIndex={undefined as unknown as number}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            trigger="hover"
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null
              const item = payload[0]
              const val = Number(item.value)
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0'
              return (
                <div className="rounded-lg border border-border bg-popover/95 backdrop-blur px-3 py-2 shadow-lg pointer-events-none">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.payload.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <p className="text-sm font-semibold tabular-nums mt-0.5">
                    {formatNumberID(val)}{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({pct}%)
                    </span>
                  </p>
                </div>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Total
        </span>
        <span className="text-lg sm:text-xl font-bold tabular-nums">
          {formatNumberID(total)}
        </span>
      </div>

      {/* legend */}
      <div className="absolute -bottom-1 left-0 right-0 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-semibold tabular-nums">
              {total > 0 ? ((d.value / total) * 100).toFixed(1) : '0'}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
