import React from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  dark?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl px-0 text-center sm:mb-14 sm:px-4">
      <span className="text-xs font-bold tracking-widest text-[#c5a059] sm:text-sm">
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl ${
          dark ? 'text-white' : 'text-[#1a233a]'
        }`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a] sm:w-20" />
      {description && (
        <p
          className={`mt-4 text-sm leading-7 sm:text-base ${
            dark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}