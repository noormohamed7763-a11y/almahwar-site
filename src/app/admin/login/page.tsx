'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.message || 'رمز المرور غير صحيح')
      }
    } catch {
      setError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f5f7fa] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a233a] text-[#c5a059] shadow-lg">
          <Lock className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-center text-2xl font-extrabold text-[#1a233a]">
          لوحة تحكم المسؤول
        </h1>
        <p className="mt-2 text-center text-xs text-gray-500">
          يرجى إدخال رمز المرور المصرح به للوصول إلى إدارة الموقع
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
              type="password"
              required
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-lg font-bold tracking-widest outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a233a] py-3.5 font-bold text-[#c5a059] shadow-md transition duration-200 hover:bg-[#1a233a]/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'دخول للوحة التحكم'
            )}
          </button>
        </form>
      </div>
    </main>
  )
}