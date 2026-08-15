import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BadgeCheck,
  Award,
  CalendarCheck,
  Wallet,
  MessageCircle,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { services, articles } from '@/data/siteData'
import { projectRepository } from '@/lib/projectsRepository'
import SectionHeading from '@/components/ui/SectionHeading'
import ProjectCard from '@/components/ProjectCard'
import { formatSaudiPhoneNumber } from '@/utils/whatsapp'

interface Feature {
  icon: typeof BadgeCheck
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: BadgeCheck,
    title: 'جودة مضمونة',
    description:
      'نعتمد أعلى معايير الجودة في التنفيذ ونستخدم أجود الخامات مع ضمان حقيقي على جميع أعمالنا.',
  },
  {
    icon: Award,
    title: 'خبرة واسعة',
    description:
      'فريق من المهندسين والفنيين بخبرة تمتد لسنوات في تنفيذ مشاريع متنوعة في جميع أنحاء المملكة.',
  },
  {
    icon: CalendarCheck,
    title: 'التزام بالمواعيد',
    description:
      'نلتزم بجدول التنفيذ المتفق عليه بدقة، لنضمن تسليم مشروعك في الوقت المحدد دون تأخير.',
  },
  {
    icon: Wallet,
    title: 'أسعار تنافسية',
    description:
      'عروض أسعار شفافة وتنافسية بدون أي تكاليف خفية، لتلائم مختلف الميزانيات واحتياجات المشاريع.',
  },
]

// صور قسم الهيرو
const heroImages = [
  {
    src: '/images/hero/sandwich-panel-1.jpg',
    alt: 'هياكل حديدية ومستودعات عازلة',
    title: 'هياكل حديدية وهناجر',
    tag: 'مواصفات هندسية',
  },
  {
    src: '/images/hero/sandwich-panel-2.jpg',
    alt: 'تركيب ألواح ساندوتش بانل للمستودعات',
    title: 'مستودعات ساندوتش بانل',
    tag: 'عزل حراري PIR',
  },
  {
    src: '/images/hero/canopy-1.jpg',
    alt: 'مستودعات تجارية وصناعية معزولة',
    title: 'مستودعات تجارية وصناعية',
    tag: 'تنفيذ شامل',
  },
  {
    src: '/images/hero/canopy-2.jpg',
    alt: 'مظلات وسواتر ومشاريع عامة',
    title: 'مظلات ومشاريع عامة',
    tag: 'ضمان معتمد',
  },
]

export default async function HomePage() {
  const cleanPhone = formatSaudiPhoneNumber(siteConfig.phone)
  const whatsappConsultationUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'السلام عليكم، أرغب في الحصول على استشارة وعرض سعر بخصوص مشروعي.'
  )}`

  // جلب المشاريع الحية من قاعدة البيانات مباشرة
  const projects = await projectRepository.getFeatured(3)

  return (
    <main className="overflow-x-hidden bg-white" dir="rtl">
      {/* 1. قسم البداية (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e1424] via-[#162035] to-[#0f172a] py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#c5a059]/10 blur-[100px]" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="text-right lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-4 py-1.5 text-xs font-bold text-[#c5a059] shadow-inner backdrop-blur-md">
                <BadgeCheck className="h-4 w-4" />
                <span>شركة مقاولات معتمدة في المملكة العربية السعودية</span>
              </span>

              <h1 className="mt-6 text-3xl font-black leading-tight sm:text-5xl">
                نحو مستقبل <span className="bg-gradient-to-l from-[#c5a059] via-[#e2c785] to-[#f7ebd0] bg-clip-text text-transparent">نَبنيه بجودة</span> وإتقان
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
                {siteConfig.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-7 py-3.5 text-sm font-bold text-[#1a233a] shadow-lg shadow-[#c5a059]/20 transition-all duration-200 hover:brightness-105 active:scale-95"
                >
                  <span>استكشف مشاريعنا</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-[#c5a059]/50 hover:bg-white/10"
                >
                  طلب عرض سعر
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#c5a059]" />
                  <span>ضمان شامل على الأعمال</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#c5a059]" />
                  <span>مطابق لكود البناء السعودي</span>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4 sm:space-y-6">
                  {heroImages.slice(0, 2).map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[4/3.3] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/5 to-transparent shadow-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#c5a059] hover:shadow-[#c5a059]/15"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 360px"
                        className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424]/90 via-[#0e1424]/20 to-transparent" />
                      
                      <div className="absolute bottom-3 right-3 left-3 text-right">
                        <span className="inline-block rounded bg-[#c5a059] px-2 py-0.5 text-[10px] font-black text-[#1a233a]">
                          {item.tag}
                        </span>
                        <p className="mt-1 line-clamp-1 text-xs font-bold text-white drop-shadow-sm">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 sm:space-y-6 sm:pt-10">
                  {heroImages.slice(2, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[4/3.3] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/5 to-transparent shadow-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#c5a059] hover:shadow-[#c5a059]/15"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 360px"
                        className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424]/90 via-[#0e1424]/20 to-transparent" />
                      
                      <div className="absolute bottom-3 right-3 left-3 text-right">
                        <span className="inline-block rounded bg-white px-2 py-0.5 text-[10px] font-black text-[#1a233a]">
                          {item.tag}
                        </span>
                        <p className="mt-1 line-clamp-1 text-xs font-bold text-white drop-shadow-sm">
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

      {/* 2. قسم الخدمات */}
      <section className="bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#c5a059]"
                >
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a233a] text-[#c5a059] transition duration-300 group-hover:bg-[#c5a059] group-hover:text-[#1a233a]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-[#1a233a] transition group-hover:text-[#c5a059]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-gray-600 line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-gray-100 pt-3">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                      <span>اعرف المزيد</span>
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. قسم أبرز الأعمال مع مكوّن ProjectCard المتناسق */}
      {projects && projects.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-extrabold tracking-wider uppercase text-[#c5a059]">
                  سابقة الأعمال
                </span>
                <h2 className="mt-1 text-2xl font-extrabold text-[#1a233a] sm:text-3xl">
                  مشاريع نفخر بتنفيذها
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  نماذج حية من أعمالنا المنجزة في مختلف مناطق المملكة مع إمكانية طلب مشروع مماثل مباشرة.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#c5a059] transition hover:text-[#1a233a]"
              >
                <span>عرض كافة المشاريع</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  priority={idx === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. قسم لماذا نحن */}
      <section className="bg-[#1a233a] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="لماذا نحن؟"
            title="مميزات تجعلنا الخيار الأول"
            description="نلتزم بأعلى المعايير المهنية لنقدم لعملائنا تجربة بناء استثنائية من البداية حتى التسليم."
            dark
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c5a059]/50 hover:bg-white/10"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c5a059] text-[#1a233a] shadow-lg shadow-[#c5a059]/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-300">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. قسم المدونة */}
      <section className="bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="المدونة"
            title="أحدث المقالات الهندسية"
            description="نصائح وإرشادات من خبرائنا لمساعدتك في اتخاذ أفضل القرارات لمشروعك."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#c5a059]"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-[#c5a059]">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                  <h3 className="mt-4 text-base font-bold leading-snug text-[#1a233a] transition group-hover:text-[#c5a059]">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c5a059]">
                    <span>اقرأ المزيد</span>
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* زر الواتساب العائم */}
      <a
        href={whatsappConsultationUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر الواتساب"
        className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-3 rounded-full bg-[#25d366] px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#25d366]/30 transition duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <MessageCircle className="h-5 w-5" />
        <span>تواصل معنا عبر الواتساب</span>
      </a>
    </main>
  )
}