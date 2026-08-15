import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { services } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'

export default function HomeServicesSection() {
  return (
    <section className="bg-white py-20" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="خدماتنا"
          title="حلول إنشائية وهندسية متكاملة"
          description="نقدم خدمات مقاولات متخصصة بأعلى معايير الجودة والإشراف الهندسي المباشر في جميع مناطق التغطية."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200/70 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:ring-[#c5a059]"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a233a] text-[#c5a059] shadow-sm transition duration-300 group-hover:bg-[#c5a059] group-hover:text-[#1a233a]">
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </div>
                  <h3 className="mt-5 text-base font-bold text-[#1a233a] transition group-hover:text-[#c5a059]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-200/50 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c5a059]">
                    <span>تفاصيل الخدمة</span>
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}