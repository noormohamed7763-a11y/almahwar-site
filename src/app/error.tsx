'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('خطأ في تحميل الصفحة:', error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f8fafc] px-4 text-center" dir="rtl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-2xl font-bold text-red-600">
        !
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-[#1a233a]">
        حدث خطأ مؤقت
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        نعتذر، واجهنا مشكلة تقنية في تحميل هذه الصفحة. هذا غالباً عارض ومؤقت.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-2xl bg-[#1a233a] px-6 py-3 text-sm font-bold text-[#c5a059] transition hover:bg-[#253252]"
        >
          إعادة المحاولة
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-[#1a233a] transition hover:bg-gray-50"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </main>
  )
}