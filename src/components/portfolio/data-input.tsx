'use client'

import * as React from 'react'
import { Plus, Upload, FileSpreadsheet, Trash2, RotateCcw, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { ASSET_KEYS, ASSET_META } from '@/lib/types'
import { parseFlexibleNumber, formatNumberID } from '@/lib/format'
import { cn } from '@/lib/utils'

interface DataInputProps {
  onAdd: (input: { date: string; CF: number; GOLD: number; USDT: number }) => void
  onBulkImport: (text: string) => { added: number; errors: string[] }
  onResetSample: () => void
  onClearAll: () => void
  /** tanggal terbaru yang sudah ada, untuk default date input */
  lastDate?: string
}

export function DataInput({
  onAdd,
  onBulkImport,
  onResetSample,
  onClearAll,
  lastDate,
}: DataInputProps) {
  const { toast } = useToast()
  const [date, setDate] = React.useState('')
  const [cf, setCf] = React.useState('')
  const [gold, setGold] = React.useState('')
  const [usdt, setUsdt] = React.useState('')
  const [bulkText, setBulkText] = React.useState('')

  // default ke hari ini saat mount
  React.useEffect(() => {
    if (!date) {
      const today = new Date().toISOString().slice(0, 10)
      setDate(today)
    }
  }, [date])

  React.useEffect(() => {
    if (lastDate) {
      // bila pengguna belum mengisi apa-apa, default ke hari setelah lastDate
      const next = new Date(lastDate + 'T00:00:00')
      next.setDate(next.getDate() + 1)
      setDate(next.toISOString().slice(0, 10))
    }
  }, [lastDate])

  const cfNum = parseFlexibleNumber(cf)
  const goldNum = parseFlexibleNumber(gold)
  const usdtNum = parseFlexibleNumber(usdt)
  const totalPreview = cfNum + goldNum + usdtNum

  const handleAdd = () => {
    if (!date) {
      toast({
        title: 'Tanggal wajib diisi',
        variant: 'destructive',
      })
      return
    }
    if (cfNum <= 0 && goldNum <= 0 && usdtNum <= 0) {
      toast({
        title: 'Isi minimal salah satu nilai aset',
        variant: 'destructive',
      })
      return
    }
    onAdd({ date, CF: cfNum, GOLD: goldNum, USDT: usdtNum })
    toast({
      title: 'Data tersimpan',
      description: `Tanggal ${date} • Total ${formatNumberID(totalPreview)}`,
    })
    // reset
    setCf('')
    setGold('')
    setUsdt('')
    // pindah ke tanggal berikutnya
    const next = new Date(date + 'T00:00:00')
    next.setDate(next.getDate() + 1)
    setDate(next.toISOString().slice(0, 10))
  }

  const handleBulk = () => {
    if (!bulkText.trim()) {
      toast({
        title: 'Tidak ada teks untuk diimpor',
        variant: 'destructive',
      })
      return
    }
    const { added, errors } = onBulkImport(bulkText)
    if (added > 0) {
      toast({
        title: `${added} baris berhasil diimpor`,
        description:
          errors.length > 0
            ? `${errors.length} baris dilewati`
            : 'Semua baris berhasil diproses',
      })
      setBulkText('')
    } else {
      toast({
        title: 'Gagal mengimpor',
        description: errors[0] ?? 'Periksa kembali format teks',
        variant: 'destructive',
      })
    }
  }

  const loadSampleBulk = () => {
    setBulkText(
      [
        'Date\tCF\tGOLD\tUSDT',
        '2026-01-01\t1.453.137\t2.233.875\t540.409',
        '2026-01-02\t1.464.448\t2.240.901\t540.963',
      ].join('\n')
    )
  }

  return (
    <Card className="p-4 sm:p-6 bg-card/60 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-amber-500" />
            Input Data
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tambahkan data harian secara manual atau tempel banyak baris sekaligus.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetSample}
            className="text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Hapus Semua
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manual">
        <TabsList className="grid grid-cols-2 w-full sm:w-auto">
          <TabsTrigger value="manual" className="text-xs sm:text-sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="bulk" className="text-xs sm:text-sm">
            <Upload className="h-4 w-4 mr-1.5" />
            Bulk Paste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs">
                Tanggal
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm"
              />
            </div>
            {ASSET_KEYS.map((key) => {
              const state =
                key === 'CF'
                  ? { value: cf, set: setCf }
                  : key === 'GOLD'
                  ? { value: gold, set: setGold }
                  : { value: usdt, set: setUsdt }
              return (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`input-${key}`} className="text-xs flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: ASSET_META[key].color }}
                    />
                    {ASSET_META[key].label}
                  </Label>
                  <Input
                    id={`input-${key}`}
                    inputMode="decimal"
                    placeholder="0"
                    value={state.value}
                    onChange={(e) => state.set(e.target.value)}
                    className="text-sm tabular-nums"
                  />
                </div>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <div className="text-sm">
              <span className="text-muted-foreground">Preview Total: </span>
              <span className="font-bold tabular-nums">
                {formatNumberID(totalPreview)}
              </span>
            </div>
            <Button onClick={handleAdd} className="sm:w-auto">
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah Data
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="mt-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Format: <code className="px-1 py-0.5 rounded bg-muted text-foreground">Date, CF, GOLD, USDT</code> per baris (tab / koma / spasi dipisahkan). TOTAL otomatis dihitung.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadSampleBulk}
              className="text-xs h-7"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Isi contoh
            </Button>
          </div>
          <Textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={'Date\tCF\tGOLD\tUSDT\n2026-01-01\t1.453.137\t2.233.875\t540.409\n2026-01-02\t1.464.448\t2.240.901\t540.963'}
            className={cn(
              'min-h-[160px] font-mono text-xs resize-y',
              'placeholder:text-muted-foreground/60'
            )}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {bulkText.trim() ? `${bulkText.trim().split(/\r?\n/).length} baris terdeteksi` : 'Tempel data dari Excel / CSV / TSV'}
            </p>
            <Button onClick={handleBulk}>
              <Upload className="h-4 w-4 mr-1.5" />
              Import
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
