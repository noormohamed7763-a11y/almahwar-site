import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { services } from '@/data/siteData'
import { SocialLink } from '@/types'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#111827] text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* نبذة عن الشركة والشعار */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white/10 p-1">
                <Image
                  src="/logo.png"
                  alt={siteConfig.companyName}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold text-white">
                {siteConfig.companyName}
              </span>
            </Link>
            <p className="text-sm leading-6 text-gray-400">
              {siteConfig.description}
            </p>
            {siteConfig.social && siteConfig.social.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {siteConfig.social.map((social: SocialLink) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/5 p-2 text-gray-400 transition hover:bg-[#c5a059] hover:text-[#1a233a]"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              روابط سريعة
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition hover:text-[#c5a059]">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-[#c5a059]">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link href="/projects" className="transition hover:text-[#c5a059]">
                  معرض المشاريع
                </Link>
              </li>
              <li>
                <Link href="/articles" className="transition hover:text-[#c5a059]">
                  المقالات
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-[#c5a059]">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* خدماتنا */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              خدمات الشركة
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center gap-1 transition hover:text-[#c5a059]"
                  >
                    <span>{service.title}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              بيانات التواصل
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#c5a059]" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#c5a059]" />
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="transition hover:text-[#c5a059]"
                  dir="ltr"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#c5a059]" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition hover:text-[#c5a059]"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-[#c5a059]" />
                <span>{siteConfig.workingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* حقوق النشر ورابط الإدارة المخفي بأناقة */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span>تنفيذ هندسي معتمد</span>
            <Link
              href="/admin"
              className="text-gray-600 transition hover:text-gray-400"
            >
              بوابة الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}