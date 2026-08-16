import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck, ArrowUpRight, ShieldCheck, Award } from 'lucide-react'
import { siteConfig } from '@/config/site'

const heroImages = [
  {
    src: '/images/hero/sandwich-panel-1.jpg',
    alt: 'هياكل حديدية وهناجر مستودعات',
    title: 'هياكل حديدية ومستودعات',
    tag: 'مواصفات معتمدة',
  },
  {
    src: '/images/hero/sandwich-panel-2.jpg',
    alt: 'تركيب وتوريد ألواح ساندوتش بانل عازلة',
    title: 'سندوتش بانل عازل PIR',
    tag: 'مقاوم للحرارة',
  },
  {
    src: '/images/hero/canopy-1.jpg',
    alt: 'مستودعات وهناجر تجارية متكاملة',
    title: 'مستودعات تجارية وصناعية',
    tag: 'تنفيذ شامل',
  },
  {
    src: '/images/hero/canopy-2.jpg',
    alt: 'مظلات وسواتر ومشاريع عامة',
    title: 'مظلات ومشاريع عامة',
    tag: 'ضمان الجودة',
  },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e1424] via-[#162035] to-[#0f172a] py-14 text-white lg:py-20" dir="rtl">
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#c5a059]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="text-right lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-4 py-1.5 text-xs font-bold text-[#c5a059] shadow-inner backdrop-blur-md">
              <BadgeCheck className="h-4 w-4" />
              <span>شركة مقاولات معتمدة في المملكة العربية السعودية</span>
            </span>

            <h1 className="mt-6 text-3xl font-black leading-tight sm:text-5xl">
              نحو مستقبل <span className="bg-gradient-to-l from-[#c5a059] via-[#e2c785] to-[#f7ebd0] bg-clip-text text-transparent">نَبنيه بجودة</span> وإتقان
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
              {siteConfig.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/projects"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-7 py-3.5 text-sm font-bold text-[#1a233a] shadow-lg shadow-[#c5a059]/20 transition duration-200 hover:brightness-105 active:scale-95 sm:w-auto"
              >
                <span>استكشف مشاريعنا</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-[#c5a059]/50 hover:bg-white/10 sm:w-auto"
              >
                طلب عرض سعر
              </Link>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#c5a059]" />
                <span>ضمان شامل على التنفيذ</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#c5a059]" />
                <span>مطابق لكود البناء السعودي</span>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-4 sm:space-y-5">
                {heroImages.slice(0, 2).map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3.3] overflow-hidden rounded-2xl border border-white/15 bg-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#c5a059] hover:shadow-2xl hover:shadow-[#c5a059]/10"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424]/90 via-[#0e1424]/20 to-transparent" />

                    <div className="absolute inset-x-3 bottom-3 text-right">
                      <span className="inline-block rounded bg-[#c5a059] px-2 py-0.5 text-[10px] font-black text-[#1a233a]">
                        {item.tag}
                      </span>
                      <p className="mt-1 line-clamp-1 text-xs font-bold text-white drop-shadow-sm">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 sm:space-y-5 sm:pt-8">
                {heroImages.slice(2, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3.3] overflow-hidden rounded-2xl border border-white/15 bg-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#c5a059] hover:shadow-2xl hover:shadow-[#c5a059]/10"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424]/90 via-[#0e1424]/20 to-transparent" />

                    <div className="absolute inset-x-3 bottom-3 text-right">
                      <span className="inline-block rounded bg-white px-2 py-0.5 text-[10px] font-black text-[#1a233a]">
                        {item.tag}
                      </span>
                      <p className="mt-1 line-clamp-1 text-xs font-bold text-white drop-shadow-sm">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}