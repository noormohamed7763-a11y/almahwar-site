'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import ServiceIcon from '@/components/common/ServiceIcon'

export interface ServiceItemProp {
  id: string
  title: string
  slug: string
  icon?: string | null
  description: string
  image?: string | null
}

interface SlideItem {
  image: string
  tag: string
}

function getSlidesForService(service: ServiceItemProp): SlideItem[] {
  const slug = service.slug.toLowerCase()
  const title = service.title.toLowerCase()
  const mainImage = service.image || '/images/hero/sandwich-panel-2.jpg'

  if (slug.includes('sandwich') || title.includes('بانل') || title.includes('ساندوتش')) {
    return [
      { image: mainImage, tag: 'ألواح PIR معتمدة' },
      { image: '/images/hero/sandwich-panel-1.jpg', tag: 'مستودعات معزولة 100%' },
      { image: '/images/hero/canopy-1.jpg', tag: 'مقاوم للحريق والكود' },
    ]
  }

  if (slug.includes('steel') || slug.includes('hangar') || title.includes('هياكل') || title.includes('هناجر')) {
    return [
      { image: '/images/hero/sandwich-panel-2.jpg', tag: 'جسور وهياكل صلبة' },
      { image: '/images/hero/sandwich-panel-1.jpg', tag: 'مستودعات صناعية' },
      { image: '/images/hero/canopy-2.jpg', tag: 'مواصفات كود البناء' },
    ]
  }

  if (slug.includes('canop') || title.includes('مظلات') || title.includes('سواتر')) {
    return [
      { image: '/images/hero/canopy-1.jpg', tag: 'مظلات وسواتر تجارية' },
      { image: '/images/hero/canopy-2.jpg', tag: 'تظليل وتغطية حديثة' },
      { image: '/images/hero/sandwich-panel-1.jpg', tag: 'ضمان هندسي معتمد' },
    ]
  }

  return [
    { image: mainImage, tag: 'جودة وحرفية معتمدة' },
    { image: '/images/hero/sandwich-panel-1.jpg', tag: 'تنفيذ كود البناء' },
    { image: '/images/hero/canopy-1.jpg', tag: 'ضمان واستشارات فنية' },
  ]
}

export default function ServiceCard({ service }: { service: ServiceItemProp }) {
  const slides = getSlidesForService(service)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [isPaused, slides.length])

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-[#c5a059]/80 sm:rounded-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* 🖼️ منطقة غلاف الخدمة التفاعلية مع ألبوم الصور */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1a233a]">
        {slides.map((slide, idx) => (
          <Image
            key={idx}
            src={slide.image}
            alt={`${service.title} - صورة ${idx + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-700 ease-in-out ${
              idx === currentIndex
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0'
            }`}
          />
        ))}

        {/* طبقة التدرج الداكن لثبات النص والتأثير المعماري */}
        <div className="absolute inset-0 z-15 bg-gradient-to-t from-[#1a233a]/90 via-[#1a233a]/30 to-transparent pointer-events-none" />

        {/* 🏷️ الشارة التفاعلية المتغيرة آلياً مع كل صورة */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-[#1a233a]/80 px-2 py-0.5 text-[9px] font-bold text-[#c5a059] backdrop-blur-md transition-all duration-500 sm:px-2.5 sm:py-1 sm:text-[10px]">
            <Sparkles className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
            <span>{slides[currentIndex].tag}</span>
          </span>
        </div>

        {/* 🔘 مؤشرات نقطية مصغرة للتنقل بين الصور */}
        <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 sm:bottom-3 sm:left-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`عرض الصورة ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-4 bg-[#c5a059]'
                  : 'w-1.5 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>

        {/* أيقونة الخدمة العائمة في زاوية الصورة */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-[#c5a059] text-[#1a233a] shadow-md transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#1a233a] sm:bottom-3 sm:right-3 sm:h-11 sm:w-11 sm:rounded-2xl">
          <ServiceIcon name={service.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* تفاصيل وتوصيف الخدمة */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
        <div>
          <Link
            href={`/services/${service.slug}`}
            aria-label={`عرض تفاصيل خدمة ${service.title}`}
            className="inline-block"
          >
            <h3 className="text-xs font-extrabold text-[#1a233a] transition group-hover:text-[#c5a059] sm:text-base">
              {service.title}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-500 sm:mt-1.5 sm:text-xs">
            {service.description.substring(0, 90)}...
          </p>
        </div>

        <div className="mt-3 border-t border-gray-100 pt-2.5 sm:mt-4 sm:pt-3">
          <Link
            href={`/services/${service.slug}`}
            aria-label={`عرض تفاصيل خدمة ${service.title}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#c5a059] transition hover:underline group-hover:text-[#1a233a] sm:text-xs"
          >
            <span>التفاصيل والمواصفات</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
