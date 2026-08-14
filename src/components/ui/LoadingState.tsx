import React from 'react'

interface LoadingStateProps {
  count?: number
}

export default function LoadingState({ count = 6 }: LoadingStateProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
        >
          {/* محاكاة الصورة */}
          <div className="aspect-[4/3] w-full bg-gray-200" />
          
          {/* محاكاة النصوص */}
          <div className="p-6 space-y-3">
            <div className="h-5 w-3/4 rounded-md bg-gray-200" />
            <div className="h-3.5 w-full rounded-md bg-gray-100" />
            <div className="h-3.5 w-5/6 rounded-md bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}