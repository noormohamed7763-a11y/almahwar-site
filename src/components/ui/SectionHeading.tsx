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
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <span className="text-sm font-bold tracking-widest text-[#c5a059]">
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-3xl font-extrabold sm:text-4xl ${
          dark ? 'text-white' : 'text-[#1a233a]'
        }`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
      {description && (
        <p
          className={`mt-4 leading-7 ${
            dark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}