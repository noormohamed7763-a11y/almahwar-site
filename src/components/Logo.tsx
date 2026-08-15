import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

interface LogoProps {
  variant?: 'light' | 'dark'
  showText?: boolean
  className?: string
}

export default function Logo({
  variant = 'light',
  showText = true,
  className = '',
}: LogoProps) {
  const isDark = variant === 'dark'

  return (
    <Link
      href="/"
      className={`group flex items-center gap-3.5 transition-all duration-300 ${className}`}
      aria-label={siteConfig.companyName}
    >
      {/* حاوية الشعار الهندسية ذات الإطار الفاخر */}
      <div
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1.5 transition-all duration-300 group-hover:scale-105 ${
          isDark
            ? 'border border-[#c5a059]/30 bg-gradient-to-br from-white/10 to-white/5 shadow-lg shadow-black/20 backdrop-blur-md group-hover:border-[#c5a059]'
            : 'border border-gray-200/80 bg-white shadow-sm ring-1 ring-black/5 group-hover:border-[#c5a059]/50 group-hover:shadow-md'
        }`}
      >
        <Image
          src="/logo.png"
          alt={siteConfig.companyName}
          fill
          priority
          sizes="44px"
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* النصوص والهوية التجارية */}
      {showText && (
        <div className="flex flex-col text-right leading-tight">
          <span
            className={`text-base font-extrabold tracking-tight transition-colors duration-200 ${
              isDark
                ? 'text-white group-hover:text-[#c5a059]'
                : 'text-[#1a233a] group-hover:text-[#c5a059]'
            }`}
          >
            {siteConfig.companyName}
          </span>
          <span
            className={`mt-0.5 text-[10px] font-semibold tracking-wider uppercase ${
              isDark ? 'text-[#c5a059]' : 'text-gray-500'
            }`}
          >
            {siteConfig.companyNameEn}
          </span>
        </div>
      )}
    </Link>
  )
}