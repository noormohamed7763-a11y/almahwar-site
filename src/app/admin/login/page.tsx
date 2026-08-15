'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanPasscode = passcode.trim()
    if (!cleanPasscode) {
      setError('يرجى إدخال رمز المرور')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanPasscode }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // استخدام replace لمنع الرجوع لشاشة الدخول عبر زر Back في المتصفح
        router.replace('/admin')
        router.refresh()
      } else {
        setError(data.message || 'رمز المرور غير صحيح')
      }
    } catch {
      setError('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت والمحاولة لاحقاً')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200/70 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a233a] text-[#c5a059] shadow-lg shadow-[#1a233a]/20">
          <Lock className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-center text-2xl font-extrabold text-[#1a233a]">
          لوحة تحكم المسؤول
        </h1>
        <p className="mt-2 text-center text-xs leading-relaxed text-gray-500">
          أدخل رمز المرور السري للمتابعة وإدارة محتوى الموقع والمشاريع
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="admin-passcode"
              className="block text-xs font-bold text-gray-700"
            >
              رمز المرور السري
            </label>
            <input
              id="admin-passcode"
              name="passcode"
              type="password"
              autoFocus
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-center text-xl font-bold tracking-widest text-[#1a233a] outline-none transition focus:border-[#c5a059] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs font-bold text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a233a] py-3.5 text-sm font-bold text-[#c5a059] shadow-md transition duration-200 hover:bg-[#253252] disabled:cursor-not-allowed disabled:opacity-60 active:scale-98"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-[#c5a059]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            <span>العودة إلى الموقع الرئيسي</span>
          </Link>
        </div>
      </div>
    </main>
  )
}