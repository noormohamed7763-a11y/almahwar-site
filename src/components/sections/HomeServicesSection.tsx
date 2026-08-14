import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { services } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'

export default function HomeServicesSection() {
  return (
    <section className="bg-[#f5f7fa] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="خدماتنا"
          title="حلول متكاملة لجميع احتياجاتك الإنشائية"
          description="نقدم مجموعة واسعة من خدمات المقاولات المتخصصة بإشراف هندسي كامل وجودة عالية."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group rounded-2xl bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1a233a]/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a233a] text-[#c5a059] transition duration-300 group-hover:bg-[#c5a059] group-hover:text-[#1a233a]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1a233a]">{service.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-600">
                  {service.shortDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#c5a059]">
                  اعرف المزيد
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}