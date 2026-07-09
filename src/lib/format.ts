/**
 * Format helpers — angka mengikuti gaya Indonesia (titik sebagai pemisah ribuan).
 */

/** Format angka menjadi "1.453.137" */
export function formatNumberID(value: number, fractionDigits = 0): string {
  if (!Number.isFinite(value)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/** Format ringkas: 1,45 jt / 4,23 jt */
export function formatCompactID(value: number): string {
  if (!Number.isFinite(value)) return '0'
  if (Math.abs(value) >= 1_000_000_000) {
    return new Intl.NumberFormat('id-ID', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value)
  }
  if (Math.abs(value) >= 1_000_000) {
    return (
      new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(
        value / 1_000_000
      ) + ' jt'
    )
  }
  if (Math.abs(value) >= 1_000) {
    return (
      new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(
        value / 1_000
      ) + ' rb'
    )
  }
  return formatNumberID(value)
}

/** Format mata uang dengan prefix Rp optional */
export function formatCurrencyID(value: number, withPrefix = false): string {
  const formatted = formatNumberID(value, 0)
  return withPrefix ? `Rp ${formatted}` : formatted
}

/** Format persentase dengan tanda + / - dan koma desimal, cth: "+0,53%" / "-1,20%" */
export function formatPercentID(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '0%'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits).replace('.', ',')}%`
}

/** Format signed number (untuk delta), cth: "+18.891" / "-603" */
export function formatSignedID(value: number, fractionDigits = 0): string {
  if (!Number.isFinite(value)) return '0'
  const sign = value > 0 ? '+' : ''
  return `${sign}${formatNumberID(value, fractionDigits)}`
}

/** Format tanggal "01 Jan 2026" */
export function formatDateID(iso: string): string {
  try {
    const d = new Date(iso + 'T00:00:00')
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return iso
  }
}

/** Format tanggal pendek "01/01" */
export function formatDateShort(iso: string): string {
  try {
    const d = new Date(iso + 'T00:00:00')
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
    }).format(d)
  } catch {
    return iso
  }
}

/**
 * Parse angka dari input pengguna yang mungkin menggunakan
 * format Indonesia (titik = ribuan, koma = desimal) atau
 * format English (koma = ribuan, titik = desimal).
 *
 * - "1.453.137" -> 1453137
 * - "1,453,137" -> 1453137
 * - "1.234,56"  -> 1234.56
 * - "1,234.56"  -> 1234.56
 * - "1500.50"   -> 1500.5
 */
export function parseFlexibleNumber(input: string): number {
  if (typeof input !== 'string') return Number(input) || 0
  const trimmed = input.trim().replace(/[^\d.,-]/g, '')
  if (!trimmed) return 0

  const hasComma = trimmed.includes(',')
  const hasDot = trimmed.includes('.')

  if (hasComma && hasDot) {
    // separator terakhir = desimal
    if (trimmed.lastIndexOf(',') > trimmed.lastIndexOf('.')) {
      // format ID: titik ribuan, koma desimal
      return Number(trimmed.replace(/\./g, '').replace(',', '.')) || 0
    }
    // format EN: koma ribuan, titik desimal
    return Number(trimmed.replace(/,/g, '')) || 0
  }

  if (hasComma) {
    // hanya koma - anggap desimal (ID)
    return Number(trimmed.replace(',', '.')) || 0
  }

  if (hasDot) {
    // hanya titik - cek apakah ribuan atau desimal
    const parts = trimmed.split('.')
    if (parts.length > 2) {
      // multiple dots = ribuan (1.453.137)
      return Number(trimmed.replace(/\./g, '')) || 0
    }
    // satu titik - bisa desimal atau ribuan
    const lastPart = parts[parts.length - 1]
    if (lastPart.length === 3 && parts[0].length <= 3 && /^\d+$/.test(parts[0])) {
      // ambigu: "1.453" - anggap ribuan (gaya ID lebih sering)
      return Number(trimmed.replace('.', '')) || 0
    }
    return Number(trimmed) || 0
  }

  return Number(trimmed) || 0
}
