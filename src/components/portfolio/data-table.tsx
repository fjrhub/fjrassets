'use client'

import * as React from 'react'
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { PortfolioRow, AssetKey } from '@/lib/types'
import { ASSET_KEYS, ASSET_META } from '@/lib/types'
import { formatNumberID, formatDateID } from '@/lib/format'
import { cn } from '@/lib/utils'

interface DataTableProps {
  rows: PortfolioRow[]
  onDelete: (id: string) => void
}

type SortKey = 'date' | 'CF' | 'GOLD' | 'USDT' | 'TOTAL'
type SortDir = 'asc' | 'desc'

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey
  sortKey: SortKey
  sortDir: SortDir
}) {
  if (sortKey !== col)
    return <ArrowUpDown className="h-3 w-3 opacity-40 ml-1 inline" />
  return sortDir === 'asc' ? (
    <ArrowUp className="h-3 w-3 ml-1 inline text-amber-500" />
  ) : (
    <ArrowDown className="h-3 w-3 ml-1 inline text-amber-500" />
  )
}

export function DataTable({ rows, onDelete }: DataTableProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>('date')
  const [sortDir, setSortDir] = React.useState<SortDir>('desc')

  const sorted = React.useMemo(() => {
    const arr = [...rows]
    arr.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (sortKey === 'date') {
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av))
      }
      return sortDir === 'asc'
        ? Number(av) - Number(bv)
        : Number(bv) - Number(av)
    })
    return arr
  }, [rows, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <Card className="bg-card/60 backdrop-blur overflow-hidden">
      <div className="p-4 sm:p-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Riwayat Data</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {rows.length} baris • klik header untuk sort
          </p>
        </div>
      </div>

      <div className="px-2 sm:px-4 pb-4">
        <ScrollArea className="h-[360px] rounded-md border border-border/60">
          <Table>
            <TableHeader className="sticky top-0 bg-card/95 backdrop-blur z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className="cursor-pointer select-none text-xs uppercase tracking-wider"
                  onClick={() => toggleSort('date')}
                >
                  Tanggal <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                {ASSET_KEYS.map((key) => (
                  <TableHead
                    key={key}
                    className="cursor-pointer select-none text-right text-xs uppercase tracking-wider"
                    onClick={() => toggleSort(key as SortKey)}
                  >
                    <span className="inline-flex items-center gap-1.5 justify-end">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: ASSET_META[key].color }}
                      />
                      {ASSET_META[key].label}
                      <SortIcon col={key as SortKey} sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </TableHead>
                ))}
                <TableHead
                  className="cursor-pointer select-none text-right text-xs uppercase tracking-wider"
                  onClick={() => toggleSort('TOTAL')}
                >
                  TOTAL <SortIcon col="TOTAL" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider w-12">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-12"
                  >
                    Belum ada data. Tambahkan lewat panel Input Data di atas.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      'transition-colors',
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
                    )}
                  >
                    <TableCell className="font-medium text-sm whitespace-nowrap">
                      {formatDateID(row.date)}
                    </TableCell>
                    {ASSET_KEYS.map((key) => (
                      <TableCell
                        key={key}
                        className="text-right tabular-nums text-sm"
                      >
                        {formatNumberID(row[key as AssetKey])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right tabular-nums text-sm font-bold text-amber-500">
                      {formatNumberID(row.TOTAL)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                        onClick={() => onDelete(row.id)}
                        aria-label="Hapus baris"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </Card>
  )
}
