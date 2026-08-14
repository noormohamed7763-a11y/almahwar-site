'use client'

import React, { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Critical Root Layout Error intercepted:', error)
  }, [error])

  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 text-2xl font-bold">
            !
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            حدث خطأ جسيم في التطبيق
          </h2>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            نعتذر، واجه الخادم مشكلة غير متوقعة في تحميل بنية الصفحة الأساسية.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 w-full rounded-xl bg-[#1a233a] py-3 text-sm font-bold text-[#c5a059] transition hover:bg-[#1a233a]/90"
          >
            إعادة تحميل التطبيق
          </button>
        </div>
      </body>
    </html>
  )
}