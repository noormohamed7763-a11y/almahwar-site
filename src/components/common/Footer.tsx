import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { services } from '@/data/siteData'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0e1424] text-gray-400" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* نبذة عن الشركة والشعار المطور */}
          <div className="space-y-4">
            <Link href="/" className="group flex items-center gap-3.5" aria-label={siteConfig.companyName}>
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#c5a059]/30 bg-gradient-to-br from-white/10 to-white/5 p-1.5 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#c5a059]">
                <Image
                  src="/logo.png"
                  alt={siteConfig.companyName}
                  fill
                  sizes="48px"
                  className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col text-right leading-tight">
                <span className="text-base font-extrabold text-white transition-colors duration-200 group-hover:text-[#c5a059]">
                  {siteConfig.companyName}
                </span>
                <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-[#c5a059] uppercase">
                  {siteConfig.companyNameEn}
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-gray-400">
              {siteConfig.description}
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-xs font-bold tracking-wider text-[#c5a059] uppercase">
              روابط سريعة
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/" className="transition hover:text-[#c5a059]">الرئيسية</Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-[#c5a059]">خدماتنا</Link>
              </li>
              <li>
                <Link href="/projects" className="transition hover:text-[#c5a059]">معرض المشاريع</Link>
              </li>
              <li>
                <Link href="/articles" className="transition hover:text-[#c5a059]">المقالات الهندسية</Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-[#c5a059]">اتصل بنا</Link>
              </li>
            </ul>
          </div>

          {/* خدمات الشركة */}
          <div>
            <h3 className="text-xs font-bold tracking-wider text-[#c5a059] uppercase">
              خدماتنا المتخصصة
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center gap-1 transition hover:text-[#c5a059]"
                  >
                    <span>{service.title}</span>
                    <ArrowUpRight className="h-3 w-3 text-[#c5a059]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* بيانات التواصل */}
          <div>
            <h3 className="text-xs font-bold tracking-wider text-[#c5a059] uppercase">
              بيانات التواصل
            </h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#c5a059]" />
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="transition hover:text-[#c5a059]"
                  dir="ltr"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#c5a059]" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition hover:text-[#c5a059]"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" />
                <span>{siteConfig.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* شريط الحقوق */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">تنفيذ هندسي معتمد</span>
            <Link
              href="/admin"
              className="text-gray-600 transition hover:text-[#c5a059]"
            >
              بوابة الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}