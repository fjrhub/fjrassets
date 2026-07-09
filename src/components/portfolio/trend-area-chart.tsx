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
import type { PortfolioRow } from '@/lib/types'
import { ASSET_KEYS, ASSET_META } from '@/lib/types'
import { formatCompactID, formatDateShort, formatNumberID } from '@/lib/format'
import { ChartTooltip } from './chart-tooltip'

interface TrendAreaChartProps {
  rows: PortfolioRow[]
}

const TOTAL_COLOR = '#e8b872' // gold

export function TrendAreaChart({ rows }: TrendAreaChartProps) {
  const data = React.useMemo(
    () =>
      rows.map((r) => ({
        date: r.date,
        label: formatDateShort(r.date),
        CF: r.CF,
        GOLD: r.GOLD,
        USDT: r.USDT,
        TOTAL: r.TOTAL,
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
          <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TOTAL_COLOR} stopOpacity={0.35} />
            <stop offset="100%" stopColor={TOTAL_COLOR} stopOpacity={0} />
          </linearGradient>
          {ASSET_KEYS.map((key) => (
            <linearGradient
              key={key}
              id={`gradTrend-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={ASSET_META[key].color}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={ASSET_META[key].color}
                stopOpacity={0}
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
          content={
            <ChartTooltip
              formatter={(v) => formatNumberID(Number(v))}
              labelFormatter={(l) => `Tanggal: ${l}`}
            />
          }
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Area
          type="monotone"
          dataKey="TOTAL"
          stroke={TOTAL_COLOR}
          strokeWidth={2.5}
          fill="url(#gradTotal)"
          name="TOTAL"
        />
        {ASSET_KEYS.map((key) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={ASSET_META[key].color}
            strokeWidth={1.5}
            fill={`url(#gradTrend-${key})`}
            name={ASSET_META[key].label}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Belum ada data untuk ditampilkan.
    </div>
  )
}
