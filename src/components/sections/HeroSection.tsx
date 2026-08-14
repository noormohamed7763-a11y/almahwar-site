import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'
import { siteConfig } from '@/config/site'

const heroImages = [
  {
    src: '/images/hero/sandwich-panel-1.jpg',
    alt: 'مستودع سندوتش بانل عصري',
    offset: '',
  },
  {
    src: '/images/hero/sandwich-panel-2.jpg',
    alt: 'واجهة مصنع بألواح سندوتش بانل',
    offset: 'mt-8',
  },
  {
    src: '/images/hero/canopy-1.jpg',
    alt: 'مظلة مواقف سيارات',
    offset: '-mt-8',
  },
  {
    src: '/images/hero/canopy-2.jpg',
    alt: 'سواتر ومظلات للحديقة',
    offset: '',
  },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#1a233a]">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#c5a059]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#2c3e63] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div className="text-center lg:text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-4 py-1.5 text-sm font-medium text-[#c5a059]">
            <BadgeCheck className="h-4 w-4" />
            شركة مقاولات معتمدة في المملكة العربية السعودية
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.3] text-white sm:text-5xl lg:text-6xl">
            نحو مستقبل <span className="text-[#c5a059]">نبنيه بجودة</span> وإتقان
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300 lg:mx-0">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/projects"
              className="w-full rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-8 py-4 text-center font-bold text-[#1a233a] shadow-lg shadow-[#c5a059]/30 transition duration-300 hover:-translate-y-0.5 hover:scale-105 sm:w-auto"
            >
              استكشف مشاريعنا
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-full border-2 border-white/40 px-8 py-4 text-center font-bold text-white transition duration-300 hover:border-[#c5a059] hover:text-[#c5a059] sm:w-auto"
            >
              طلب عرض سعر
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {heroImages.map((image) => (
            <div key={image.src} className={`relative aspect-[4/5] ${image.offset}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="rounded-2xl object-cover shadow-2xl ring-1 ring-[#c5a059]/30"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}