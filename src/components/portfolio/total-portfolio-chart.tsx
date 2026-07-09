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

interface TotalPortfolioChartProps {
  rows: PortfolioRow[]
  mode: 'value' | 'index'
}

const GOLD = '#e8b872'

export function TotalPortfolioChart({ rows, mode }: TotalPortfolioChartProps) {
  const data = React.useMemo(() => {
    if (rows.length === 0) return []
    const baseTotal = rows[0].TOTAL || 1
    return rows.map((r) => ({
      date: r.date,
      label: formatDateShort(r.date),
      TOTAL: r.TOTAL,
      Indeks: Number(((r.TOTAL / baseTotal) * 100).toFixed(2)),
    }))
  }, [rows])

  if (data.length === 0) {
    return <EmptyChart />
  }

  const isIndex = mode === 'index'
  const dataKey = isIndex ? 'Indeks' : 'TOTAL'

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gradTotalPortfolio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
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
          tickFormatter={(v) =>
            isIndex ? Number(v).toFixed(0) : formatCompactID(Number(v))
          }
          width={50}
        />
        <Tooltip
          cursor={{ stroke: GOLD, strokeOpacity: 0.3, strokeDasharray: '3 3' }}
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null
            const item = payload[0]
            const idx = data.findIndex((d) => d.label === label)
            const currentTotal = data[idx]?.TOTAL ?? 0
            const prev = idx > 0 ? data[idx - 1] : null
            const prevTotal = prev?.TOTAL ?? 0
            const delta = prev ? currentTotal - prevTotal : 0

            return (
              <div className="rounded-lg border border-border bg-popover/95 backdrop-blur px-3 py-2 shadow-lg pointer-events-none min-w-[200px]">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  Tanggal: {label}
                </p>
                <div className="space-y-1">
                  {isIndex ? (
                    <>
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD }} />
                          <span className="text-muted-foreground">Indeks (=100)</span>
                        </div>
                        <span className="font-semibold tabular-nums">
                          {Number(item.value).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <span className="text-muted-foreground">Nominal</span>
                        <span className="font-semibold tabular-nums">
                          {formatNumberID(currentTotal)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD }} />
                          <span className="text-muted-foreground">Total Nominal</span>
                        </div>
                        <span className="font-semibold tabular-nums">
                          {formatNumberID(Number(item.value))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <span className="text-muted-foreground">Indeks (=100)</span>
                        <span className="font-semibold tabular-nums">
                          {data[idx]?.Indeks.toFixed(2).replace('.', ',') ?? '100,00'}
                        </span>
                      </div>
                    </>
                  )}
                  {prev && (
                    <div className="flex items-center justify-between gap-4 text-xs pt-1 border-t border-border/60 mt-1">
                      <span className="text-muted-foreground">Perubahan Harian</span>
                      <span
                        className={`font-semibold tabular-nums ${
                          delta >= 0 ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {formatSignedID(delta)} (
                        {formatPercentID(
                          prevTotal > 0 ? (delta / prevTotal) * 100 : 0
                        )})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={GOLD}
          strokeWidth={2.5}
          fill="url(#gradTotalPortfolio)"
          dot={false}
          activeDot={{ r: 5, fill: GOLD, stroke: 'var(--background)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
