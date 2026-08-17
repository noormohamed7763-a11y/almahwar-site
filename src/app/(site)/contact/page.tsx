'use client'

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { getContactFormWhatsAppUrl, getGeneralConsultationUrl } from '@/utils/whatsapp'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'سندوتش بانل',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const waUrl = getContactFormWhatsAppUrl(
      formData.name,
      formData.phone,
      formData.service,
      formData.message
    )

    setIsSubmitted(true)

    // فتح الرابط بسلاسة دون التعرض لحظر النوافذ المنبثقة
    window.location.href = waUrl
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] py-16">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-bold tracking-widest text-[#c5a059]">تواصل معنا</span>
          <h1 className="mt-3 text-3xl font-extrabold text-[#1a233a] sm:text-4xl">
            نحن هنا لتحويل أفكارك إلى واقع
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* بطاقة معلومات الشركة */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl bg-[#1a233a] p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold text-[#c5a059]">معلومات التواصل</h2>
              <p className="mt-2 text-sm text-gray-300">
                يسعدنا الرد على جميع استفساراتكم وتقديم الاستشارات الفنية وعروض الأسعار على مدار الساعة.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c5a059]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">الهاتف المباشر</span>
                    <a href={`tel:${siteConfig.phone}`} className="tap-area font-bold text-white transition hover:text-[#c5a059]" dir="ltr">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c5a059]">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">واتساب المبيعات</span>
                    <a 
                      href={getGeneralConsultationUrl()} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="tap-area font-bold text-white transition hover:text-[#c5a059]"
                      dir="ltr"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c5a059]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">البريد الإلكتروني</span>
                    <a href={`mailto:${siteConfig.email}`} className="tap-area font-bold text-white transition hover:text-[#c5a059]">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c5a059]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">المقر الرئيسي</span>
                    <span className="font-bold text-white">{siteConfig.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c5a059]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">أوقات العمل</span>
                    <span className="font-bold text-white">{siteConfig.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* نموذج طلب عرض السعر */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 lg:col-span-7">
            <h2 className="text-2xl font-bold text-[#1a233a]">طلب استشارة أو عرض سعر</h2>
            <p className="mt-1 text-sm text-gray-500">
              املأ البيانات التالية وسيتم تحويل طلبك مباشرة إلى فريق الدعم الهندسي عبر الواتساب.
            </p>

            {isSubmitted && (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium">جاري تحويلك الآن إلى الواتساب مع نص طلبك المجهز...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-bold text-gray-700">الاسم الكريم *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="أدخل اسمك أو اسم المؤسسة"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" className="block text-sm font-bold text-gray-700">رقم الجوال *</label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  placeholder="05XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                />
              </div>

              <div>
                <label htmlFor="contact-service" className="block text-sm font-bold text-gray-700">نوع الخدمة المطلوبة</label>
                <select
                  id="contact-service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                >
                  <option value="سندوتش بانل">سندوتش بانل وغرف معزولة</option>
                  <option value="مظلات وسواتر">مظلات وسواتر وهياكل حديدية</option>
                  <option value="ترميم">ترميم وتأهيل المباني</option>
                  <option value="بناء عام">بناء عام وإنشاءات</option>
                  <option value="دهانات">دهانات وتشطيبات داخلية وخارجية</option>
                  <option value="أسقف مستعارة">أسقف مستعارة وديكورات جبسية</option>
                  <option value="بلاط وسيراميك">بلاط وبورسلين وسيراميك</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-bold text-gray-700">تفاصيل المشروع / الاستفسار *</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="المساحة التقريبية، المدينة/الموقع، أو أي تفاصيل إضافية..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c5a059] py-4 text-base font-bold text-[#1a233a] shadow-lg shadow-[#c5a059]/20 transition hover:bg-[#d9b87a] active:scale-[0.99]"
              >
                <Send className="h-5 w-5" />
                <span>إرسال الطلب مباشرة عبر الواتساب</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}