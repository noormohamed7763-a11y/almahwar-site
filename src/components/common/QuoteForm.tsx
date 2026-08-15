'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { formatSaudiPhoneNumber } from '@/utils/whatsapp'

interface QuoteFormProps {
  serviceName?: string
}

export default function QuoteForm({ serviceName = 'عام' }: QuoteFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState(siteConfig.mainCity || 'جدة')
  const [notes, setNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `*طلب عرض سعر جديد* 🏗️
━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${name.trim()}
📱 *الجوال:* ${phone.trim()}
📍 *المدينة:* ${city}
🛠️ *الخدمة:* ${serviceName}
📝 *ملاحظات:* ${notes.trim() || 'لا يوجد'}
━━━━━━━━━━━━━━━━━━`

    const cleanPhone = formatSaudiPhoneNumber(siteConfig.phone)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

    setGeneratedUrl(whatsappUrl)
    setIsSubmitted(true)

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center text-emerald-900 shadow-sm backdrop-blur-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-base font-bold">تم تجهيز طلبك بنجاح!</h4>
          <p className="mt-1 text-xs text-emerald-700">
            تم فتح محادثة الواتساب المباشرة لتأكيد المواصفات والأسعار الهندسية.
          </p>
        </div>

        <div className="pt-2">
          <a
            href={generatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#20bd5a]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>اضغط هنا لفتح الواتساب مباشرة</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
      <div>
        <label htmlFor="quote-name" className="block text-xs font-bold text-gray-700">
          الاسم الكريم <span className="text-red-500">*</span>
        </label>
        <input
          id="quote-name"
          type="text"
          required
          placeholder="مثال: م. فهد الحربي"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
        />
      </div>

      <div>
        <label htmlFor="quote-phone" className="block text-xs font-bold text-gray-700">
          رقم الجوال <span className="text-red-500">*</span>
        </label>
        <input
          id="quote-phone"
          type="tel"
          required
          placeholder="05XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="quote-city" className="block text-xs font-bold text-gray-700">
          المدينة / المنطقة <span className="text-red-500">*</span>
        </label>
        <select
          id="quote-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
        >
          {siteConfig.serviceAreas?.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          )) ?? <option value="جدة">جدة</option>}
          <option value="مدينة أخرى">مدينة أخرى داخل المملكة</option>
        </select>
      </div>

      <div>
        <label htmlFor="quote-notes" className="block text-xs font-bold text-gray-700">
          المواصفات المطلوبة أو المساحة التقديرية
        </label>
        <textarea
          id="quote-notes"
          rows={3}
          placeholder="مثال: توريد وتركيب مستودع 800 متر، سماكة عزل 7.5 سم..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#1a233a] to-[#243152] py-3 text-sm font-bold text-[#c5a059] shadow-md shadow-[#1a233a]/15 transition duration-200 hover:brightness-110 active:scale-[0.99]"
      >
        <Send className="h-4 w-4" />
        <span>إرسال الطلب وحساب التكلفة عبر الواتساب</span>
      </button>
    </form>
  )
}