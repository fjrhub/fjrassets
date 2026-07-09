'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppHeader } from '@/components/portfolio/app-header'
import { StatsCards } from '@/components/portfolio/stats-cards'
import { TrendAreaChart } from '@/components/portfolio/trend-area-chart'
import { ComparisonBarChart } from '@/components/portfolio/comparison-bar-chart'
import { CompositionDonut } from '@/components/portfolio/composition-donut'
import { StackedAreaChart } from '@/components/portfolio/stacked-area-chart'
import { TotalPortfolioChart } from '@/components/portfolio/total-portfolio-chart'
import { DailyDeltaChart } from '@/components/portfolio/daily-delta-chart'
import { ChartCard } from '@/components/portfolio/chart-card'
import { DataInput } from '@/components/portfolio/data-input'
import { DataTable } from '@/components/portfolio/data-table'
import { usePortfolioData } from '@/hooks/use-portfolio-data'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Home() {
  const {
    rows,
    hydrated,
    addRow,
    deleteRow,
    clearAll,
    resetToSample,
    bulkImport,
  } = usePortfolioData()

  const [barDays, setBarDays] = React.useState('14')
  const [deltaDays, setDeltaDays] = React.useState('30')
  const [growthMode, setGrowthMode] = React.useState<'value' | 'index'>('value')

  const lastDate = React.useMemo(() => {
    if (rows.length === 0) return undefined
    return rows[rows.length - 1].date
  }, [rows])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-amber-500/5">
      <AppHeader rowCount={rows.length} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Hero / page heading */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Visualisasi Portfolio
          </h2>
          <p className="text-sm text-muted-foreground">
            Pantau pertumbuhan aset harianmu lewat chart interaktif. Data tersimpan otomatis di browser.
          </p>
        </motion.section>

        {/* Stats */}
        <StatsCards rows={rows} />

        {/* Chart utama: Pertumbuhan Total Portofolio (full width) */}
        <ChartCard
          title="Pertumbuhan Total Portofolio"
          description="Area performa · hover untuk detail · toggle mode Nominal / Indeks (=100)"
          bodyClassName="h-[300px] sm:h-[360px]"
          right={
            <div className="flex gap-1 bg-muted/40 border border-border rounded-lg p-1">
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  'h-7 px-3 text-xs font-mono',
                  growthMode === 'value'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setGrowthMode('value')}
              >
                Nominal
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  'h-7 px-3 text-xs font-mono',
                  growthMode === 'index'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setGrowthMode('index')}
              >
                Indeks (=100)
              </Button>
            </div>
          }
        >
          <TotalPortfolioChart rows={rows} mode={growthMode} />
        </ChartCard>

        {/* Main charts grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <ChartCard
            title="Tren Pertumbuhan Aset"
            description="Garis area TOTAL dan masing-masing aset dari waktu ke waktu"
            className="lg:col-span-2"
            bodyClassName="h-[300px] sm:h-[360px]"
          >
            <TrendAreaChart rows={rows} />
          </ChartCard>

          <ChartCard
            title="Komposisi Aset"
            description={`Distribusi aset per ${lastDate ?? '-'} · aset 0 disembunyikan`}
            bodyClassName="h-[300px] sm:h-[360px]"
          >
            <CompositionDonut rows={rows} />
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ChartCard
            title="Perbandingan Harian"
            description="Side-by-side bar CF / GOLD / USDT · aset 0 disembunyikan"
            bodyClassName="h-[300px] sm:h-[340px]"
            right={
              <Select value={barDays} onValueChange={setBarDays}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 hari</SelectItem>
                  <SelectItem value="14">14 hari</SelectItem>
                  <SelectItem value="30">30 hari</SelectItem>
                  <SelectItem value="90">90 hari</SelectItem>
                </SelectContent>
              </Select>
            }
          >
            <ComparisonBarChart rows={rows} days={Number(barDays)} />
          </ChartCard>

          <ChartCard
            title="Komposisi Bertumpuk"
            description="Stacked area: kontribusi tiap aset terhadap TOTAL · aset 0 disembunyikan dari tooltip"
            bodyClassName="h-[300px] sm:h-[340px]"
          >
            <StackedAreaChart rows={rows} />
          </ChartCard>
        </section>

        {/* Perubahan Harian — full width, seperti HTML referensi */}
        <ChartCard
          title="Perubahan Harian"
          description="Selisih total vs hari sebelumnya · hijau = naik, merah = turun"
          bodyClassName="h-[280px] sm:h-[320px]"
          right={
            <Select value={deltaDays} onValueChange={setDeltaDays}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 hari</SelectItem>
                <SelectItem value="14">14 hari</SelectItem>
                <SelectItem value="30">30 hari</SelectItem>
                <SelectItem value="90">90 hari</SelectItem>
              </SelectContent>
            </Select>
          }
        >
          <DailyDeltaChart rows={rows} days={Number(deltaDays)} />
        </ChartCard>

        {/* Input section */}
        <DataInput
          onAdd={addRow}
          onBulkImport={bulkImport}
          onResetSample={resetToSample}
          onClearAll={clearAll}
          lastDate={lastDate}
        />

        {/* Data table */}
        <DataTable rows={rows} onDelete={deleteRow} />

        {/* Footer */}
        <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
          <p>
            Dibuat dengan Next.js · Recharts · shadcn/ui • Data tersimpan lokal di browser kamu.
          </p>
        </footer>
      </main>

      {!hydrated && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
