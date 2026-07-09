'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'

export function AppHeader({ rowCount }: { rowCount: number }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <LineChart className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold leading-tight truncate">
              Portfolio Dashboard
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              CF · GOLD · USDT · Total
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex items-center gap-1 text-xs bg-background/60"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            {rowCount} baris
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
