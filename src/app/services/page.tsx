import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { services } from '@/data/siteData'

export const metadata = {
  title: 'خدماتنا | المحور الهندسي للمقاولات',
  description: 'استكشف خدمات شركة المحور الهندسي للمقاولات المتكاملة بأعلى معايير الجودة.',
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-bold tracking-widest text-[#c5a059]">خدماتنا المتميزة</span>
          <h1 className="mt-3 text-3xl font-extrabold text-[#1a233a] sm:text-4xl">
            حلول إنشائية متكاملة ومبتكرة
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
          <p className="mt-4 text-gray-600">
            نقدم مجموعة متكاملة من خدمات المقاولات والإنشاءات بإشراف هندسي وتنفيذ متقن.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-[#c5a059]/30"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a233a] text-[#c5a059] transition duration-300 group-hover:bg-[#c5a059] group-hover:text-[#1a233a]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-[#1a233a]">{service.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{service.shortDescription}</p>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-[#1a233a]/5 px-4 py-2.5 text-sm font-bold text-[#1a233a] transition hover:bg-[#c5a059] hover:text-[#1a233a]"
                  >
                    <span>تفاصيل الخدمة</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}