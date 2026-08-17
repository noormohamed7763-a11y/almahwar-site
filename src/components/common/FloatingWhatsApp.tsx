'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { getGeneralConsultationUrl } from '@/utils/whatsapp'

export default function FloatingWhatsApp() {
  const whatsappUrl = getGeneralConsultationUrl()

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center justify-center">
      {/* رابط زر الواتساب العائم */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-[#25d366]/40 hover:shadow-xl active:scale-95"
      >
        {/* حلقات النبض المضيئة خلف الزر */}
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40 opacity-75 duration-1000" />
        <span className="absolute inset-0 -z-10 h-full w-full animate-pulse rounded-full bg-[#25d366]/20" />

        {/* أيقونة الواتساب */}
        <MessageCircle className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />

        {/* تلميح التلميح (Tooltip) يظهر عند التحويم */}
        <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#1a233a] px-3.5 py-2 text-xs font-bold text-[#c5a059] opacity-0 shadow-md ring-1 ring-white/10 transition-all duration-300 group-hover:opacity-100 sm:right-18">
          تواصل معنا مباشرة
        </span>
      </a>
    </div>
  )
}
