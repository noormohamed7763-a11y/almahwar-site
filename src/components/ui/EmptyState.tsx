import React from 'react'
import { FolderOpen, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onReset?: () => void
  resetLabel?: string
}

export default function EmptyState({
  title = 'لا توجد عناصر لعرضها',
  description = 'لم نتمكن من العثور على أي نتائج مطابقة في هذا القسم حالياً.',
  actionLabel,
  actionHref,
  onReset,
  resetLabel = 'إعادة ضبط الفلاتر',
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a233a]/5 text-[#c5a059]">
        <FolderOpen className="h-8 w-8" />
      </div>
      
      <h3 className="mt-4 text-lg font-bold text-[#1a233a]">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{description}</p>
      
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition hover:border-[#c5a059] hover:text-[#c5a059]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{resetLabel}</span>
          </button>
        )}

        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a233a] px-5 py-2.5 text-xs font-bold text-[#c5a059] transition hover:bg-[#1a233a]/90"
          >
            <span>{actionLabel}</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  )
}