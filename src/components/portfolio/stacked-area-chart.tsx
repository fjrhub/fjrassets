'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { PortfolioRow, AssetKey } from '@/lib/types'
import { ASSET_KEYS, ASSET_META } from '@/lib/types'
import { formatCompactID, formatDateShort, formatNumberID } from '@/lib/format'
import { EmptyChart } from './trend-area-chart'

interface StackedAreaProps {
  rows: PortfolioRow[]
}

export function StackedAreaChart({ rows }: StackedAreaProps) {
  const data = React.useMemo(
    () =>
      rows.map((r) => ({
        date: r.date,
        label: formatDateShort(r.date),
        CF: r.CF,
        GOLD: r.GOLD,
        USDT: r.USDT,
      })),
    [rows]
  )

  if (data.length === 0) {
    return <EmptyChart />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
        <defs>
          {ASSET_KEYS.map((key) => (
            <linearGradient
              key={key}
              id={`stack-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={ASSET_META[key].color}
                stopOpacity={0.85}
              />
              <stop
                offset="100%"
                stopColor={ASSET_META[key].color}
                stopOpacity={0.45}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          stroke="currentColor"
          opacity={0.5}
          tickLine={false}
          axisLine={false}
          minTickGap={20}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="currentColor"
          opacity={0.5}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompactID(Number(v))}
          width={50}
        />
        <Tooltip
          cursor={{ stroke: 'currentColor', strokeOpacity: 0.15, strokeDasharray: '3 3' }}
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null
            // Filter out aset yang nilainya 0 — jangan tampilkan di tooltip
            const filtered = payload.filter(
              (p) => Number(p.value) > 0 && ASSET_KEYS.includes(p.dataKey as AssetKey)
            )
            if (filtered.length === 0) return null

            const total = filtered.reduce(
              (sum, p) => sum + Number(p.value),
              0
            )

            return (
              <div className="rounded-lg border border-border bg-popover/95 backdrop-blur px-3 py-2 shadow-lg pointer-events-none min-w-[180px]">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Tanggal: {label}
                </p>
                <div className="space-y-1">
                  {filtered.map((entry) => (
                    <div
                      key={entry.dataKey as string}
                      className="flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">
                          {ASSET_META[entry.dataKey as AssetKey].label}
                        </span>
                      </div>
                      <span className="font-semibold tabular-nums">
                        {formatNumberID(Number(entry.value))}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 text-xs pt-1 border-t border-border/60 mt-1">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold tabular-nums">
                      {formatNumberID(total)}
                    </span>
                  </div>
                </div>
              </div>
            )
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        {ASSET_KEYS.map((key) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="assets"
            stroke={ASSET_META[key].color}
            strokeWidth={1.5}
            fill={`url(#stack-${key})`}
            name={ASSET_META[key].label}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
