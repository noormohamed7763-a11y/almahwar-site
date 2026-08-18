'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { getGeneralConsultationUrl } from '@/utils/whatsapp'

const navItems = [
  { label: 'الرئيسية', href: '/' },
  { label: 'خدماتنا', href: '/services' },
  { label: 'المشاريع', href: '/projects' },
  { label: 'المقالات', href: '/articles' },
  { label: 'تواصل معنا', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const directWhatsappUrl = getGeneralConsultationUrl()

  return (
    <header dir="rtl" className="sticky top-0 z-50 w-full shadow-lg shadow-[#1a233a]/10">
      <div className="bg-[#1a233a] text-gray-300">
        <div className="flex w-full items-center justify-between gap-2 px-4 py-2 text-[11px] sm:px-6 sm:text-sm lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-6">
            <a
              href={`tel:${siteConfig.phone}`}
              className="tap-area flex items-center gap-1.5 truncate transition hover:text-[#c5a059]"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-[#c5a059]" />
              <span dir="ltr">{siteConfig.phone}</span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="tap-area hidden items-center gap-1.5 truncate transition hover:text-[#c5a059] sm:flex"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#c5a059]" />
              <span>{siteConfig.email}</span>
            </a>
          </div>

          <a
            href={directWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-area inline-flex shrink-0 items-center gap-1.5 font-bold text-[#c5a059] transition hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">واتساب مباشر</span>
            <span className="sm:hidden">واتساب</span>
          </a>
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="flex w-full items-center gap-3 px-4 py-3.5 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
          <Link
            href="/"
            className="group flex min-w-0 flex-1 items-center gap-3.5"
            aria-label={siteConfig.companyName}
          >
            {/* 🌟 إطار الشعار المطور مع الهالة الذهبية والظل المعماري */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#c5a059]/40 bg-white p-1 shadow-md shadow-[#c5a059]/20 ring-1 ring-black/5 transition-all duration-300 group-hover:scale-105 group-hover:border-[#c5a059] group-hover:shadow-lg group-hover:shadow-[#c5a059]/30 sm:h-14 sm:w-14">
              <Image
                src="/logo.png"
                alt={siteConfig.companyName}
                fill
                priority
                sizes="56px"
                className="object-contain p-0.5 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex min-w-0 flex-col text-right leading-tight">
              <span className="truncate text-sm font-black text-[#1a233a] transition-colors duration-200 group-hover:text-[#c5a059] sm:text-base">
                {siteConfig.companyName}
              </span>
              <span className="mt-0.5 truncate text-[9px] font-bold tracking-wider text-[#c5a059] uppercase transition-colors duration-200 group-hover:text-[#1a233a] sm:text-[10px]">
                {siteConfig.companyNameEn}
              </span>
            </div>
          </Link>

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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="hidden rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-5 py-2.5 text-xs font-bold text-[#1a233a] shadow-md shadow-[#c5a059]/20 transition duration-300 hover:brightness-105 active:scale-95 lg:inline-flex"
            >
              طلب عرض سعر
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              className="
                inline-flex
                h-11 w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border-2
                border-[#d9b87a]
                bg-[#1a233a]
                text-[#f3d79d]
                shadow-[0_0_0_1px_rgba(197,160,89,0.14),0_8px_18px_rgba(26,35,58,0.18)]
                ring-2
                ring-[#c5a059]/25
                transition-all
                duration-300
                hover:border-[#f0d38b]
                hover:bg-[#253252]
                hover:text-[#f9e8ba]
                active:scale-95
                lg:hidden
              "
            >
              {isOpen ? (
                <X className="h-6 w-6 stroke-[2.5]" />
              ) : (
                <Menu className="h-6 w-6 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:text-[#c5a059]"
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