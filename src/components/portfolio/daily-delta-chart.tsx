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
  Cell,
  ReferenceLine,
} from 'recharts'
import type { PortfolioRow } from '@/lib/types'
import {
  formatCompactID,
  formatDateShort,
  formatNumberID,
  formatPercentID,
  formatSignedID,
} from '@/lib/format'
import { EmptyChart } from './trend-area-chart'

interface DailyDeltaChartProps {
  rows: PortfolioRow[]
  /** jumlah hari terbaru yang ditampilkan, default 30 */
  days?: number
}

const POSITIVE_COLOR = '#3ddc97' // teal/green
const NEGATIVE_COLOR = '#f0685f' // red

export function DailyDeltaChart({ rows, days = 30 }: DailyDeltaChartProps) {
  const data = React.useMemo(() => {
    // Ambil slice N+1 hari terakhir agar bar pertama di slice tetap punya
    // referensi hari sebelumnya untuk hitung delta.
    const slice = rows.slice(-(days + 1))
    return slice.map((r, i) => {
      const prev = i > 0 ? slice[i - 1] : null
      const delta = prev ? r.TOTAL - prev.TOTAL : 0
      return {
        date: r.date,
        label: formatDateShort(r.date),
        delta,
        total: r.TOTAL,
        prevTotal: prev?.TOTAL ?? r.TOTAL,
        isFirst: i === 0,
      }
    })
  }, [rows, days])

  if (data.length === 0) {
    return <EmptyChart />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
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
          cursor={{ fill: 'currentColor', opacity: 0.05 }}
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null
            const item = payload[0].payload as {
              delta: number
              total: number
              prevTotal: number
              isFirst: boolean
            }
            const pct =
              item.prevTotal > 0 ? (item.delta / item.prevTotal) * 100 : 0
            const positive = item.delta >= 0

            return (
              <div className="rounded-lg border border-border bg-popover/95 backdrop-blur px-3 py-2 shadow-lg pointer-events-none min-w-[200px]">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Tanggal: {label}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">Selisih Harian</span>
                    <span
                      className={`font-bold tabular-nums ${
                        positive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {item.isFirst
                        ? '— (hari awal)'
                        : formatSignedID(item.delta)}
                    </span>
                  </div>
                  {!item.isFirst && (
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <span className="text-muted-foreground">Persentase</span>
                      <span
                        className={`font-semibold tabular-nums ${
                          positive ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {formatPercentID(pct)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 text-xs pt-1 border-t border-border/60 mt-1">
                    <span className="text-muted-foreground">Total Hari Ini</span>
                    <span className="font-semibold tabular-nums">
                      {formatNumberID(item.total)}
                    </span>
                  </div>
                  {!item.isFirst && (
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <span className="text-muted-foreground">Total Kemarin</span>
                      <span className="font-semibold tabular-nums text-muted-foreground">
                        {formatNumberID(item.prevTotal)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          }}
        />
        {/* zero reference line */}
        <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.2} />
        <Bar dataKey="delta" radius={[4, 4, 0, 0]} maxBarSize={32}>
          {data.map((d, idx) => (
            <Cell
              key={idx}
              fill={
                d.isFirst
                  ? 'transparent'
                  : d.delta >= 0
                  ? POSITIVE_COLOR
                  : NEGATIVE_COLOR
              }
              fillOpacity={d.isFirst || d.delta === 0 ? 0.15 : 0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
