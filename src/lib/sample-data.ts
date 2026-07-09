import type { PortfolioRow } from './types'

/**
 * Generate sample data 30 hari (Januari 2026) dengan tren naik + sedikit noise
 * berdasarkan 2 titik yang user kasih: 01 Jan (4.227.421) dan 02 Jan (4.246.312).
 */
export function generateSampleData(): PortfolioRow[] {
  const rows: PortfolioRow[] = []
  const startDate = new Date('2026-01-01T00:00:00')

  // komposisi awal 01 Jan
  let cf = 1_453_137
  let gold = 2_233_875
  let usdt = 540_409

  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    const iso = d.toISOString().slice(0, 10)

    if (i > 0) {
      // pertumbuhan harian acak positif ringan
      cf += Math.round(cf * (0.002 + Math.random() * 0.012))
      gold += Math.round(gold * (0.001 + Math.random() * 0.010))
      usdt += Math.round(usdt * (0.001 + Math.random() * 0.014))
    }

    rows.push({
      id: `seed-${iso}`,
      date: iso,
      CF: cf,
      GOLD: gold,
      USDT: usdt,
      TOTAL: cf + gold + usdt,
    })
  }

  return rows
}
