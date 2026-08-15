'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { siteConfig } from '@/config/site'

interface QuoteFormProps {
  serviceName?: string
}

export default function QuoteForm({ serviceName = 'عام' }: QuoteFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('جدة')
  const [notes, setNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `*طلب عرض سعر جديد* 🏗️
━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${name}
📱 *الجوال:* ${phone}
📍 *المدينة:* ${city}
🛠️ *الخدمة:* ${serviceName}
📝 *ملاحظات:* ${notes || 'لا يوجد'}
━━━━━━━━━━━━━━━━━━`

    const rawWhatsApp = siteConfig.whatsapp || 'https://wa.me/966562050150'
    const separator = rawWhatsApp.includes('?') ? '&' : '?'
    const url = `${rawWhatsApp}${separator}text=${encodeURIComponent(message)}`

    setIsSubmitted(true)
    
    if (typeof window !== 'undefined') {
      window.open(url, '_self')
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-xl bg-emerald-50 p-6 text-center text-emerald-800 ring-1 ring-emerald-200">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h4 className="mt-2 font-bold">تم إرسال طلبك بنجاح!</h4>
        <p className="mt-1 text-xs text-emerald-700">
          جاري تحويلك الآن إلى محادثة الواتساب المباشرة مع خدمة العملاء...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="quote-name" className="block text-xs font-bold text-gray-700">الاسم الكريم *</label>
        <input
          id="quote-name"
          type="text"
          required
          placeholder="أدخل اسمك..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
        />
      </div>

      <div>
        <label htmlFor="quote-phone" className="block text-xs font-bold text-gray-700">رقم الجوال *</label>
        <input
          id="quote-phone"
          type="tel"
          required
          placeholder="05XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
        />
      </div>

      <div>
        <label htmlFor="quote-city" className="block text-xs font-bold text-gray-700">المدينة / المنطقة</label>
        <select
          id="quote-city"
          aria-label="المدينة أو المنطقة"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
        >
          <option value="جدة">جدة</option>
          <option value="مكة المكرمة">مكة المكرمة</option>
          <option value="الرياض">الرياض</option>
          <option value="المدينة المنورة">المدينة المنورة</option>
          <option value="أخرى">مدينة أخرى</option>
        </select>
      </div>

      <div>
        <label htmlFor="quote-notes" className="block text-xs font-bold text-gray-700">تفاصيل المشروع (اختياري)</label>
        <textarea
          id="quote-notes"
          rows={2}
          placeholder="المساحة التقريبية أو أي تفاصيل أخرى..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a233a] py-3 text-sm font-bold text-[#c5a059] shadow-md transition hover:bg-[#1a233a]/90 active:scale-[0.99]"
      >
        <Send className="h-4 w-4" />
        <span>إرسال الطلب عبر الواتساب</span>
      </button>
    </form>
  )
}