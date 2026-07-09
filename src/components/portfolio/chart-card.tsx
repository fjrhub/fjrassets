'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  description?: string
  className?: string
  bodyClassName?: string
  right?: React.ReactNode
  children: React.ReactNode
}

export function ChartCard({
  title,
  description,
  className,
  bodyClassName,
  right,
  children,
}: ChartCardProps) {
  return (
    <Card
      className={cn(
        'bg-card/60 backdrop-blur overflow-hidden',
        className
      )}
    >
      <div className="p-4 sm:p-5 pb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {right}
      </div>
      <div
        className={cn('px-2 sm:px-4 pb-4 w-full relative', bodyClassName)}
      >
        {children}
      </div>
    </Card>
  )
}
