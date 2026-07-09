'use client'

import * as React from 'react'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  Trophy,
  Calendar,
  Activity,
  Gauge,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import type { PortfolioRow } from '@/lib/types'
import {
  formatCompactID,
  formatNumberID,
  formatDateID,
  formatPercentID,
  formatSignedID,
} from '@/lib/format'

interface StatsCardsProps {
  rows: PortfolioRow[]
}

function calcGrowth(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function StatsCards({ rows }: StatsCardsProps) {
  if (rows.length === 0) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 sm:p-5 h-32 animate-pulse bg-muted/40" />
        ))}
      </div>
    )
  }

  const latest = rows[rows.length - 1]
  const previous = rows.length > 1 ? rows[rows.length - 2] : latest

  const totalGrowth = calcGrowth(latest.TOTAL, previous.TOTAL)
  const cfGrowth = calcGrowth(latest.CF, previous.CF)
  const goldGrowth = calcGrowth(latest.GOLD, previous.GOLD)
  const usdtGrowth = calcGrowth(latest.USDT, previous.USDT)

  const totalDelta = latest.TOTAL - previous.TOTAL
  const cfDelta = latest.CF - previous.CF
  const goldDelta = latest.GOLD - previous.GOLD
  const usdtDelta = latest.USDT - previous.USDT

  const maxTotal = Math.max(...rows.map((r) => r.TOTAL))
  const minTotal = Math.min(...rows.map((r) => r.TOTAL))

  // Indeks (=100) — basis hari pertama
  const firstTotal = rows[0]?.TOTAL ?? 0
  const latestIndeks =
    firstTotal > 0 ? (latest.TOTAL / firstTotal) * 100 : 100
  const previousIndeks =
    firstTotal > 0 ? (previous.TOTAL / firstTotal) * 100 : 100
  const indeksGrowth = calcGrowth(latestIndeks, previousIndeks)

  const cards = [
    {
      label: 'Total Aset',
      value: formatNumberID(latest.TOTAL),
      sub: `${formatSignedID(totalDelta)} (${formatPercentID(totalGrowth)})`,
      extra: `Indeks (=100): ${latestIndeks.toFixed(2).replace('.', ',')}`,
      growth: totalGrowth,
      icon: Wallet,
      accent: 'from-amber-500/20 to-yellow-500/10',
      ring: 'ring-amber-500/30',
      iconColor: 'text-amber-500',
      // Total always shown
      hidden: false,
    },
    {
      label: 'CF',
      value: formatNumberID(latest.CF),
      sub: `${formatSignedID(cfDelta)} (${formatPercentID(cfGrowth)})`,
      growth: cfGrowth,
      icon: Coins,
      accent: 'from-blue-500/20 to-indigo-500/10',
      ring: 'ring-blue-500/30',
      iconColor: 'text-blue-400',
      hidden: latest.CF === 0,
    },
    {
      label: 'GOLD',
      value: formatNumberID(latest.GOLD),
      sub: `${formatSignedID(goldDelta)} (${formatPercentID(goldGrowth)})`,
      growth: goldGrowth,
      icon: Trophy,
      accent: 'from-amber-500/20 to-yellow-500/10',
      ring: 'ring-amber-500/30',
      iconColor: 'text-amber-400',
      hidden: latest.GOLD === 0,
    },
    {
      label: 'USDT',
      value: formatNumberID(latest.USDT),
      sub: `${formatSignedID(usdtDelta)} (${formatPercentID(usdtGrowth)})`,
      growth: usdtGrowth,
      icon: TrendingUp,
      accent: 'from-emerald-500/20 to-teal-500/10',
      ring: 'ring-emerald-500/30',
      iconColor: 'text-emerald-400',
      hidden: latest.USDT === 0,
    },
  ].filter((c) => !c.hidden)

  const secondaryCards = [
    {
      icon: Calendar,
      iconColor: 'text-muted-foreground',
      label: 'Tanggal Terbaru',
      value: formatDateID(latest.date),
      sub: `${rows.length} baris tercatat`,
      tabular: false,
    },
    {
      icon: Activity,
      iconColor: totalDelta >= 0 ? 'text-emerald-500' : 'text-rose-500',
      label: 'Perubahan Harian',
      value: formatSignedID(totalDelta),
      sub: formatPercentID(totalGrowth) + ' vs kemarin',
      tabular: true,
      highlight: totalDelta >= 0 ? 'text-emerald-500' : 'text-rose-500',
    },
    {
      icon: Trophy,
      iconColor: 'text-yellow-500',
      label: 'Peak Total',
      value: formatCompactID(maxTotal),
      sub: 'nilai tertinggi',
      tabular: true,
    },
    {
      icon: Gauge,
      iconColor: 'text-amber-500',
      label: 'Indeks (=100)',
      value: latestIndeks.toFixed(2).replace('.', ','),
      sub: `basis ${formatDateID(rows[0]?.date ?? latest.date)} • ${formatPercentID(indeksGrowth)}`,
      tabular: true,
      highlight: indeksGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500',
    },
  ]

  // Map count ke kelas grid desktop (lg = >=1024px)
  // 1 → 1 kolom, 2 → 2, 3 → 3, 4+ → 4
  const desktopGridClass =
    cards.length <= 1
      ? 'sm:grid-cols-1'
      : cards.length === 2
      ? 'sm:grid-cols-2'
      : cards.length === 3
      ? 'sm:grid-cols-3'
      : 'sm:grid-cols-4'

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* main KPI cards — adaptif: 2 kolom di mobile, hingga 4 kolom di desktop */}
      <div className={`grid grid-cols-2 ${desktopGridClass} gap-3 sm:gap-4`}>
        {cards.map((card, idx) => {
          const Icon = card.icon
          const positive = card.growth >= 0
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
            >
              <Card
                className={`relative overflow-hidden p-4 sm:p-5 ring-1 ${card.ring} bg-gradient-to-br ${card.accent} border-0 h-full`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {card.label}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold mt-1 tabular-nums truncate">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`shrink-0 rounded-xl bg-background/60 p-2 ${card.iconColor}`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] sm:text-xs">
                  {positive ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-rose-500 shrink-0" />
                  )}
                  <span
                    className={positive ? 'text-emerald-500' : 'text-rose-500'}
                  >
                    {card.sub}
                  </span>
                </div>
                {card.extra && (
                  <p className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground/80 truncate">
                    {card.extra}
                  </p>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {secondaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card
              key={card.label}
              className="p-3 sm:p-4 bg-card/60 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
                <span className="uppercase tracking-wider">{card.label}</span>
              </div>
              <p
                className={`text-sm sm:text-base font-bold tabular-nums ${
                  card.highlight ?? ''
                } ${card.tabular ? '' : ''}`}
              >
                {card.value}
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                {card.sub}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
