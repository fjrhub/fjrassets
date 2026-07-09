'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import type { PortfolioRow, AssetKey } from '@/lib/types'
import { ASSET_KEYS, ASSET_META } from '@/lib/types'
import { formatCompactID, formatDateShort, formatNumberID } from '@/lib/format'
import { EmptyChart } from './trend-area-chart'

interface ComparisonBarChartProps {
  rows: PortfolioRow[]
  /** jumlah hari terbaru yang ditampilkan, default 14 */
  days?: number
}

export function ComparisonBarChart({ rows, days = 14 }: ComparisonBarChartProps) {
  const data = React.useMemo(() => {
    const slice = rows.slice(-days)
    // Filter out hari yang SEMUA aset-nya 0 — jangan tampilkan bar group kosong (gap)
    return slice
      .filter((r) => r.CF > 0 || r.GOLD > 0 || r.USDT > 0)
      .map((r) => ({
        date: r.date,
        label: formatDateShort(r.date),
        CF: r.CF,
        GOLD: r.GOLD,
        USDT: r.USDT,
      }))
  }, [rows, days])

  if (data.length === 0) {
    return <EmptyChart />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 12, bottom: 0, left: 0 }}
        barGap={2}
        barCategoryGap="18%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          stroke="currentColor"
          opacity={0.5}
          tickLine={false}
          axisLine={false}
          minTickGap={10}
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
          cursor={{ fill: 'currentColor', opacity: 0.05 }}
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null
            // Filter out aset yang nilainya 0 — jangan tampilkan di tooltip
            const filtered = payload.filter(
              (p) => Number(p.value) > 0 && ASSET_KEYS.includes(p.dataKey as AssetKey)
            )
            if (filtered.length === 0) return null

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
          <Bar
            key={key}
            dataKey={key}
            name={ASSET_META[key].label}
            fill={ASSET_META[key].color}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            // hide bar entirely when value is 0 (transparent + no radius)
          >
            {data.map((d, idx) => (
              <Cell
                key={idx}
                fill={d[key] > 0 ? ASSET_META[key].color : 'transparent'}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
