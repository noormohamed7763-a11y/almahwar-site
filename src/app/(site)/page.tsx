import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BadgeCheck,
  Award,
  CalendarCheck,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { publishedArticles } from '@/data/siteData'
import { listServicesForNavigation } from '@/lib/servicesRepository'
import ServiceIcon from '@/components/common/ServiceIcon'
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection'

const features = [
  {
    icon: BadgeCheck,
    title: 'جودة مضمونة',
    description: 'نعتمد أعلى معايير الجودة في التنفيذ ونستخدم أجود الخامات مع ضمان حقيقي.',
  },
  {
    icon: Award,
    title: 'خبرة واسعة',
    description: 'فريق من المهندسين والفنيين بخبرة تمتد لسنوات في تنفيذ مشاريع المملكة.',
  },
  {
    icon: CalendarCheck,
    title: 'التزام بالمواعيد',
    description: 'نلتزم بجدول التنفيذ المتفق عليه بدقة لتسليم مشروعك في وقته.',
  },
  {
    icon: Wallet,
    title: 'أسعار تنافسية',
    description: 'عروض أسعار شفافة وتنافسية بدون أي تكاليف خفية تلائم ميزانيتك.',
  },
]

const heroImages = [
  { src: '/images/hero/sandwich-panel-1.jpg', alt: 'هياكل حديدية ومستودعات', title: 'هياكل حديدية وهناجر', tag: 'مواصفات هندسية' },
  { src: '/images/hero/sandwich-panel-2.jpg', alt: 'مستودعات ساندوتش بانل', title: 'مستودعات ساندوتش بانل', tag: 'عزل حراري PIR' },
  { src: '/images/hero/canopy-1.jpg', alt: 'مستودعات تجارية وصناعية', title: 'مستودعات تجارية وصناعية', tag: 'تنفيذ شامل' },
  { src: '/images/hero/canopy-2.jpg', alt: 'مظلات ومشاريع عامة', title: 'مظلات ومشاريع عامة', tag: 'ضمان معتمد' },
]

export default async function HomePage() {
  // شبكة الخدمات من القاعدة: كانت من مصفوفة ثابتة بـ slugs مختلفة عن
  // الخدمات الفعلية فكانت أكثر بطاقاتها تؤدي إلى 404
  const services = await listServicesForNavigation(8)

  return (
    <main className="overflow-x-hidden bg-white" dir="rtl">
      {/* 1. قسم البداية (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e1424] via-[#162035] to-[#0f172a] py-10 text-white sm:py-16 lg:py-24">
        <div className="relative w-full px-0 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="text-right lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-3 py-1 text-[11px] font-bold text-[#c5a059] shadow-inner">
                <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
                <span>شركة مقاولات معتمدة بالمملكة</span>
              </span>

              <h1 className="mt-4 text-2xl font-black leading-snug sm:text-4xl lg:text-5xl">
                نحو مستقبل <span className="bg-gradient-to-l from-[#c5a059] via-[#e2c785] to-[#f7ebd0] bg-clip-text text-transparent">نَبنيه بجودة</span> وإتقان
              </h1>

              <p className="mt-3 text-xs leading-relaxed text-gray-300 sm:text-sm lg:text-base">
                {siteConfig.description}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/projects"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-5 py-3 text-xs font-bold text-[#1a233a] shadow-md transition-all hover:brightness-105 sm:w-auto sm:text-sm"
                >
                  <span>استكشف مشاريعنا</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:text-sm"
                >
                  طلب عرض سعر
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-between sm:justify-start sm:gap-6 border-t border-white/10 pt-4 text-[11px] sm:text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#c5a059]" />
                  <span>ضمان شامل</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#c5a059]" />
                  <span>كود البناء السعودي</span>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  {heroImages.slice(0, 2).map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-lg"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 640px) 50vw, 360px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2 left-2 text-right">
                        <span className="inline-block rounded bg-[#c5a059] px-1.5 py-0.5 text-[9px] font-black text-[#1a233a]">
                          {item.tag}
                        </span>
                        <p className="mt-0.5 text-[11px] font-bold text-white line-clamp-1">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 sm:space-y-4 sm:pt-6">
                  {heroImages.slice(2, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-lg"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 360px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2 left-2 text-right">
                        <span className="inline-block rounded bg-white px-1.5 py-0.5 text-[9px] font-black text-[#1a233a]">
                          {item.tag}
                        </span>
                        <p className="mt-0.5 text-[11px] font-bold text-white line-clamp-1">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. قسم الخدمات — بطاقات مصورة جذابة وعصرية */}
      {services.length > 0 && (
      <section className="bg-[#f8fafc] py-14 sm:py-24">
        <div className="w-full px-4 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 px-3.5 py-1 text-xs font-black text-[#c5a059]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>خدماتنا المعتمدة</span>
            </span>
            <h2 className="mt-3 text-2xl font-black text-[#1a233a] sm:text-4xl">
              حلول مقاولات هندسية متكاملة
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              تصفح خدماتنا المصممة بأعلى معايير الجودة وكود البناء السعودي
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const coverImage = service.image || '/images/hero/sandwich-panel-2.jpg'

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-[#c5a059]/80"
                >
                  {/* صورة غلاف الخدمة التعبيرية */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1a233a]">
                    <Image
                      src={coverImage}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* طبقة التدرج الداكن لثبات النص والتأثير المعماري */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a233a]/90 via-[#1a233a]/30 to-transparent" />

                    {/* أيقونة الخدمة العائمة في زاوية الصورة */}
                    <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c5a059] text-[#1a233a] shadow-md transition duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#1a233a]">
                      <ServiceIcon name={service.icon} className="h-5 w-5" />
                    </div>
                  </div>

                  {/* تفاصيل وتوصيف الخدمة */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="text-base font-extrabold text-[#1a233a] transition group-hover:text-[#c5a059]">
                        {service.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {service.description.substring(0, 90)}...
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-bold text-[#c5a059] group-hover:text-[#1a233a]">
                      <span>التفاصيل والمواصفات</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      )}

      {/* 3. استدعاء قسم المشاريع المميزة من قاعدة البيانات */}
      <FeaturedProjectsSection />

      {/* 4. قسم لماذا نحن */}
      <section className="bg-[#1a233a] py-12 sm:py-20 text-white">
        <div className="w-full px-0 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#c5a059]">لماذا نحن؟</span>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">مميزات تجعلنا الخيار الأول</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition hover:border-[#c5a059]/50"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#c5a059] text-[#1a233a]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-sm sm:text-base font-bold text-white">{feature.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. قسم المدونة — المسوّدات مستثناة */}
      {publishedArticles.length > 0 && (
      <section className="bg-[#f8fafc] py-12 sm:py-20">
        <div className="w-full px-0 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#c5a059]">المدونة</span>
            <h2 className="mt-2 text-2xl font-extrabold text-[#1a233a] sm:text-3xl">أحدث المقالات الهندسية</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {publishedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-gray-200/80 transition hover:ring-[#c5a059]"
              >
                <div>
                  <h3 className="line-clamp-3 text-sm sm:text-base font-bold leading-snug text-[#1a233a] group-hover:text-[#c5a059]">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

    </main>
  )
}