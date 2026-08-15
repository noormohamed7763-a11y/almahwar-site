'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { formatSaudiPhoneNumber } from '@/utils/whatsapp'

const navItems = [
  { label: 'الرئيسية', href: '/' },
  { label: 'خدماتنا', href: '/services' },
  { label: 'المشاريع', href: '/projects' },
  { label: 'المقالات', href: '/articles' },
  { label: 'تواصل معنا', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const cleanPhone = formatSaudiPhoneNumber(siteConfig.phone)
  const directWhatsappUrl = siteConfig.whatsapp || `https://wa.me/${cleanPhone}`

  return (
    <header dir="rtl" className="sticky top-0 z-50 w-full shadow-lg shadow-[#1a233a]/10">
      {/* الشريط العلوي للاتصال السريع - مع إظهار واتساب مباشر */}
      <div className="w-full bg-[#1a233a] text-gray-300">
        <div className="flex w-full items-center justify-between px-0 py-2 sm:px-6 lg:px-8">
          {/* الجهة اليمنى (رقم الهاتف والإيميل) */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* أيقونة الاتصال */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="group flex items-center gap-2 transition sm:gap-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c5a059] text-white shadow-md shadow-[#c5a059]/30 transition group-hover:scale-105 group-hover:bg-[#d4b06a] sm:h-10 sm:w-10">
                <Phone className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              </div>
              <div className="flex flex-col text-right leading-tight">
                <span
                  className="text-[10px] font-black tracking-wide text-white sm:text-xs"
                  dir="ltr"
                >
                  {siteConfig.phone}
                </span>
                <span className="hidden text-[8px] text-gray-300 sm:block sm:text-[10px]">
                  اتصال مباشر
                </span>
              </div>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden items-center gap-2 transition hover:text-[#c5a059] sm:flex"
            >
              <Mail className="h-3.5 w-3.5 text-[#c5a059]" />
              <span className="text-xs">{siteConfig.email}</span>
            </a>
          </div>

          {/* الجهة اليسرى - واتساب مباشر (يظهر دائماً) */}
          <a
            href={directWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 font-bold text-[#c5a059] transition hover:text-white sm:gap-2"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-sm">واتساب مباشر</span>
          </a>
        </div>
      </div>

      {/* الشريط الرئيسي والتنقل */}
      <div className="w-full border-b border-gray-100 bg-white">
        <div className="flex w-full items-center justify-between px-0 py-2 sm:px-6 lg:px-8">
          {/* الشعار */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-1.5 sm:gap-3"
            aria-label={siteConfig.companyName}
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-0.5 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:scale-105 group-hover:border-[#c5a059]/60 sm:h-12 sm:w-12 sm:p-1.5">
              <Image
                src="/logo.png"
                alt={siteConfig.companyName}
                fill
                priority
                sizes="48px"
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col text-right leading-tight">
              <span className="text-[10px] font-black text-[#1a233a] transition-colors duration-200 group-hover:text-[#c5a059] sm:text-base">
                {siteConfig.companyName}
              </span>
              <span className="hidden text-[8px] font-bold tracking-wider uppercase text-gray-500 sm:mt-0.5 sm:block sm:text-[10px]">
                {siteConfig.companyNameEn}
              </span>
            </div>
          </Link>

          {/* روابط التصفح لشاشات الكمبيوتر */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-bold text-gray-700 transition hover:text-[#c5a059] after:absolute after:-bottom-1.5 after:right-0 after:h-0.5 after:w-0 after:bg-[#c5a059] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* زر القائمة للموبايل */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-xl border border-gray-200 p-1.5 text-[#1a233a] transition hover:border-[#c5a059] hover:text-[#c5a059] sm:p-2 lg:hidden"
            >
              {isOpen ? (
                <X className="h-4 w-4 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-4 w-4 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* القائمة المنسدلة للجوال */}
        {isOpen && (
          <nav className="animate-in fade-in slide-in-from-top-2 border-t border-gray-100 bg-white px-4 py-4 duration-200 sm:px-6 lg:hidden">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:text-[#c5a059]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-3 block rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] py-3 text-center text-sm font-bold text-[#1a233a] shadow-md"
              >
                طلب عرض سعر
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}