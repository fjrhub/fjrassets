export type AssetKey = 'CF' | 'GOLD' | 'USDT'

export const ASSET_KEYS: AssetKey[] = ['CF', 'GOLD', 'USDT']

export const ASSET_META: Record<
  AssetKey,
  { label: string; color: string; description: string }
> = {
  CF: {
    label: 'CF',
    color: '#6d93f7', // blue (sesuai HTML referensi)
    description: 'Crypto / Cash Flow',
  },
  GOLD: {
    label: 'GOLD',
    color: '#e8b872', // gold (sesuai HTML referensi)
    description: 'Emas',
  },
  USDT: {
    label: 'USDT',
    color: '#3ddc97', // teal (sesuai HTML referensi)
    description: 'Tether / Stablecoin',
  },
}

export interface PortfolioRow {
  id: string
  date: string // ISO yyyy-mm-dd
  CF: number
  GOLD: number
  USDT: number
  TOTAL: number // computed
}
