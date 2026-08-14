'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'

const navItems = [
  { label: 'الرئيسية', href: '/' },
  { label: 'خدماتنا', href: '/services' },
  { label: 'المشاريع', href: '/projects' },
  { label: 'المقالات', href: '/articles' },
  { label: 'تواصل معنا', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header dir="rtl" className="sticky top-0 z-50 w-full shadow-lg shadow-[#1a233a]/10">
      <div className="bg-[#1a233a] text-gray-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-2 transition hover:text-[#c5a059]"
            >
              <Phone className="h-4 w-4 text-[#c5a059]" />
              <span dir="ltr">{siteConfig.phone}</span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden items-center gap-2 transition hover:text-[#c5a059] sm:flex"
            >
              <Mail className="h-4 w-4 text-[#c5a059]" />
              <span>{siteConfig.email}</span>
            </a>
          </div>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-[#c5a059] transition hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            واتساب مباشر
          </a>
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 shadow-md">
              <Image
                src="/logo.png"
                alt={siteConfig.companyName}
                fill
                sizes="48px"
                className="object-contain p-1"
              />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-bold text-[#1a233a]">
                {siteConfig.companyName}
              </span>
              <span className="block text-xs text-gray-500">
                {siteConfig.companyNameEn}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative font-medium text-gray-700 transition hover:text-[#c5a059] after:absolute after:-bottom-1 after:right-0 after:h-0.5 after:w-0 after:bg-[#c5a059] after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="hidden rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-6 py-3 font-bold text-[#1a233a] shadow-lg shadow-[#c5a059]/30 transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl lg:inline-flex"
          >
            طلب عرض سعر
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            className="rounded-lg border border-gray-200 p-2 text-[#1a233a] transition hover:border-[#c5a059] hover:text-[#c5a059] lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <nav className="border-t border-gray-100 bg-white lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block border-b border-gray-100 py-3 font-medium text-gray-700 transition hover:text-[#c5a059]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 block rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-6 py-3 text-center font-bold text-[#1a233a] shadow-lg"
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