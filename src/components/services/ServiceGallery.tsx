'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  ZoomIn,
  X,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { ServiceImageItem } from '@/lib/servicesRepository'
import { getServiceInquiryUrl } from '@/utils/whatsapp'

interface ServiceGalleryProps {
  images: ServiceImageItem[]
  serviceTitle: string
}

export default function ServiceGallery({ images, serviceTitle }: ServiceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  const activeImage = selectedIndex !== null ? images[selectedIndex] : null

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length)
    }
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
    }
  }

  /**
   * استخراج عنوان فرعي ووصف من نص الكابشن في حال كان يحتوي على عنوان
   */
  const formatCaption = (caption: string | null) => {
    if (!caption) return { title: null, body: '' }
    
    // البحث عن أقواس مثل (Roof Panels) أو أول جملة لتأطيرها كعنوان
    const titleMatch = caption.match(/^([^(]+(?:\([^)]+\))?)/)
    if (titleMatch && caption.length > titleMatch[0].length + 5) {
      const possibleTitle = titleMatch[0].trim()
      const bodyText = caption.substring(titleMatch[0].length).trim()
      return { title: possibleTitle, body: bodyText }
    }

    return { title: null, body: caption }
  }

  return (
    <>
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#c5a059]/10 px-3 py-1 text-xs font-bold text-[#c5a059]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>معرض المواصفات والتنفيذ</span>
            </div>
            <h3 className="mt-2 text-xl font-black text-[#1a233a] sm:text-2xl">
              صور المنتجات والشروحات الفنية
            </h3>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            اضغط على أي صورة للتكبير واستكشاف التفاصيل
          </span>
        </div>

        {/* شبكة الكروت الاحترافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, index) => {
            const { title: itemTitle, body: itemBody } = formatCaption(img.caption)

            return (
              <div
                key={img.id || index}
                onClick={() => setSelectedIndex(index)}
                className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#c5a059]/40"
              >
                {/* منطقة الصورة مع طبقة تفاعلية */}
                <div className="relative w-full aspect-[16/10] bg-gray-900 overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.caption || serviceTitle}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* تدرج مظلل أسفل الصورة */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a233a]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* زر التكبير البصري */}
                  <div className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a233a]/70 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c5a059] group-hover:text-[#1a233a]">
                    <ZoomIn className="h-4 w-4" />
                  </div>

                  {/* وسم فني فوق الصورة */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-[#1a233a]/80 px-3 py-1 text-xs font-bold text-[#c5a059] backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>مواصفة معتمدة</span>
                  </div>
                </div>

                {/* المحتوى والشرح المرفق */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50/50">
                  <div>
                    {itemTitle ? (
                      <div className="mb-2">
                        <h4 className="text-base font-black text-[#1a233a] group-hover:text-[#c5a059] transition-colors flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#c5a059]" />
                          <span>{itemTitle}</span>
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed text-gray-600 font-medium">
                          {itemBody}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed text-gray-700 font-bold">
                        {img.caption || `نموذج من أعمال تنفيذ ${serviceTitle}`}
                      </p>
                    )}
                  </div>

                  {/* زر تفاعلي صغير أسفل الكارت */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#c5a059]">
                    <span className="inline-flex items-center gap-1 group-hover:underline">
                      تكبير الشرح والصورة
                      <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      صورة #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* النافذة المكبرة (Lightbox Modal) */}
      {selectedIndex !== null && activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md transition-all animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* محتوى النافذة */}
          <div
            className="relative max-w-4xl w-full bg-[#1a233a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-[#c5a059] hover:text-[#1a233a]"
              title="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>

            {/* أزرار التنقل بين الصور */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 right-3 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#c5a059] hover:text-[#1a233a]"
                  title="الصورة السابقة"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 left-16 lg:left-3 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#c5a059] hover:text-[#1a233a]"
                  title="الصورة التالية"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </>
            )}

            {/* قسم الصورة المكبرة */}
            <div className="relative flex-1 bg-black min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] flex items-center justify-center">
              <Image
                src={activeImage.url}
                alt={activeImage.caption || serviceTitle}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* قسم التفاصيل والواتساب بالجانب */}
            <div className="w-full lg:w-[360px] p-6 flex flex-col justify-between bg-[#141b2d] border-t lg:border-t-0 lg:border-r border-white/10 text-white overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                  <Sparkles className="h-4 w-4" />
                  <span>تفاصيل المنتج والشرح</span>
                </div>

                <h3 className="mt-3 text-lg font-black text-white leading-snug">
                  {serviceTitle}
                </h3>

                <div className="mt-4 h-0.5 w-12 bg-[#c5a059]" />

                <div className="mt-5 space-y-4">
                  {activeImage.caption ? (
                    <p className="text-sm leading-relaxed text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/10 font-medium">
                      {activeImage.caption}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      لا يوجد نص توضيحي مخصص لهذه الصورة.
                    </p>
                  )}
                </div>
              </div>

              {/* أزرار الإجراء السريع */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                <a
                  href={getServiceInquiryUrl(`${serviceTitle} - ${activeImage.caption?.substring(0, 40) || ''}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#25d366]/20 transition hover:brightness-110"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>استفسار عن هذا المنتج عبر واتساب</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
