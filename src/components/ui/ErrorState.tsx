import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'تعذر تحميل البيانات',
  message = 'حدث خطأ مؤقت أثناء جلب البيانات المطلوبة. يرجى المحاولة مرة أخرى.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <AlertCircle className="h-7 w-7" />
      </div>
      
      <h3 className="mt-4 text-base font-bold text-red-900">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-red-600/80">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}