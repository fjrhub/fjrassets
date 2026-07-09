'use client'

import * as React from 'react'
import { v4 as uuid } from 'uuid'
import type { PortfolioRow, AssetKey } from '@/lib/types'
import { ASSET_KEYS } from '@/lib/types'
import { generateSampleData } from '@/lib/sample-data'
import { parseFlexibleNumber } from '@/lib/format'

const STORAGE_KEY = 'portfolio-rows-v1'

function computeTotal(row: Pick<PortfolioRow, 'CF' | 'GOLD' | 'USDT'>): number {
  return row.CF + row.GOLD + row.USDT
}

function loadFromStorage(): PortfolioRow[] {
  if (typeof window === 'undefined') return generateSampleData()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return generateSampleData()
    const parsed = JSON.parse(raw) as PortfolioRow[]
    if (!Array.isArray(parsed) || parsed.length === 0) return generateSampleData()
    // pastikan TOTAL selalu sinkron
    return parsed
      .map((r) => ({ ...r, TOTAL: computeTotal(r) }))
      .sort((a, b) => a.date.localeCompare(b.date))
  } catch {
    return generateSampleData()
  }
}

export function usePortfolioData() {
  const [rows, setRows] = React.useState<PortfolioRow[]>([])
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setRows(loadFromStorage())
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
    } catch {
      // ignore quota errors
    }
  }, [rows, hydrated])

  const addRow = React.useCallback(
    (input: { date: string; CF: number; GOLD: number; USDT: number }) => {
      const newRow: PortfolioRow = {
        id: uuid(),
        date: input.date,
        CF: input.CF,
        GOLD: input.GOLD,
        USDT: input.USDT,
        TOTAL: computeTotal(input),
      }
      setRows((prev) => {
        // bila tanggal sudah ada, replace
        const filtered = prev.filter((r) => r.date !== input.date)
        const next = [...filtered, newRow].sort((a, b) =>
          a.date.localeCompare(b.date)
        )
        return next
      })
      return newRow
    },
    []
  )

  const deleteRow = React.useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const clearAll = React.useCallback(() => {
    setRows([])
  }, [])

  const resetToSample = React.useCallback(() => {
    setRows(generateSampleData())
  }, [])

  /**
   * Bulk import dari text (tab/comma/whitespace separated).
   * Format yang didukung per baris:
   *   Date<TAB>CF<TAB>GOLD<TAB>USDT   (TOTAL opsional, diabaikan & dihitung ulang)
   * Header baris pertama akan di-skip jika mengandung "date".
   */
  const bulkImport = React.useCallback(
    (text: string): { added: number; errors: string[] } => {
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)

      const errors: string[] = []
      const parsed: PortfolioRow[] = []

      lines.forEach((line, idx) => {
        // split by tab, multiple spaces, or comma
        const parts = line.split(/\t|\s{2,}|,|\s+/).filter(Boolean)
        if (parts.length < 4) {
          errors.push(`Baris ${idx + 1}: kolom kurang dari 4 (${line})`)
          return
        }
        // skip header
        if (idx === 0 && /date/i.test(parts[0])) return

        const [dateStr, cfStr, goldStr, usdtStr] = parts
        // normalisasi tanggal -> yyyy-mm-dd
        const iso = normalizeDate(dateStr)
        if (!iso) {
          errors.push(`Baris ${idx + 1}: tanggal tidak valid "${dateStr}"`)
          return
        }
        const CF = parseFlexibleNumber(cfStr)
        const GOLD = parseFlexibleNumber(goldStr)
        const USDT = parseFlexibleNumber(usdtStr)
        if (![CF, GOLD, USDT].every((n) => Number.isFinite(n) && n >= 0)) {
          errors.push(`Baris ${idx + 1}: angka tidak valid (${line})`)
          return
        }
        parsed.push({
          id: uuid(),
          date: iso,
          CF,
          GOLD,
          USDT,
          TOTAL: CF + GOLD + USDT,
        })
      })

      if (parsed.length === 0) {
        return { added: 0, errors }
      }

      // dedup by date, keep last
      const byDate = new Map<string, PortfolioRow>()
      parsed.forEach((r) => byDate.set(r.date, r))

      setRows((prev) => {
        const existing = new Map(prev.map((r) => [r.date, r]))
        byDate.forEach((r, date) => existing.set(date, r))
        return Array.from(existing.values()).sort((a, b) =>
          a.date.localeCompare(b.date)
        )
      })

      return { added: parsed.length, errors }
    },
    []
  )

  return {
    rows,
    hydrated,
    addRow,
    deleteRow,
    clearAll,
    resetToSample,
    bulkImport,
    assetKeys: ASSET_KEYS as readonly AssetKey[],
  }
}

function normalizeDate(input: string): string | null {
  const s = input.trim()
  // yyyy-mm-dd
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (m) {
    const [, y, mo, d] = m
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  // dd/mm/yyyy or dd-mm-yyyy
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (m) {
    const [, d, mo, y] = m
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  // yyyy/mm/dd
  m = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/)
  if (m) {
    const [, y, mo, d] = m
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return null
}
