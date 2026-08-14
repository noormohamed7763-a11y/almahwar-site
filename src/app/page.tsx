import Link from 'next/link'
import Image from 'next/image'
import {
  BadgeCheck,
  Award,
  CalendarCheck,
  Wallet,
  MessageCircle,
  ArrowLeft,
  Clock,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { services, articles } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'

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

const projects = [
  {
    title: 'مستودع سندوتش بانل',
    image: '/images/projects/warehouse-1.jpg',
    description: 'تنفيذ مستودع كامل بألواح سندوتش بانل عازلة للحرارة والرطوبة.',
  },
  {
    title: 'مصنع صناعي',
    image: '/images/projects/warehouse-2.jpg',
    description: 'تشطيبات صناعية بمواصفات هندسية دقيقة وأعلى معايير الجودة.',
  },
  {
    title: 'مظلات مواقف السيارات',
    image: '/images/projects/car-canopy-1.jpg',
    description: 'مظلات معدنية لمواقف السيارات بمساحات كبيرة وتصاميم متينة.',
  },
  {
    title: 'مظلات المداخل والبوابات',
    image: '/images/projects/car-canopy-2.jpg',
    description: 'تصاميم عصرية لمظلات المداخل والبوابات بإطلالة أنيقة.',
  },
  {
    title: 'سواتر الحدائق',
    image: '/images/projects/garden-1.jpg',
    description: 'سواتر حديدية بتصاميم راقية توفر الخصوصية والحماية معاً.',
  },
  {
    title: 'الاستراحات والمسابح',
    image: '/images/projects/garden-2.jpg',
    description: 'حلول متكاملة للمظلات والسواتر للاستراحات والمسابح والحدائق.',
  },
]

export default function HomePage() {
  const whatsappConsultationUrl = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    'أرغب في الحصول على استشارة مجانية بخصوص مشروعي.',
  )}`

  return (
    <main className="overflow-x-hidden">
      {/* قسم البداية (Hero Section) */}
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

      {/* قسم الخدمات */}
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
                  <p className="mt-2 text-sm leading-7 text-gray-600">{service.shortDescription}</p>
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

      {/* قسم المشاريع */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="أبرز الأعمال"
            title="مشاريع نفخر بتقديمها"
            description="نموذج من مشاريعنا المنفذة في المستودعات والمظلات والسواتر بجودة عالية وإتقان."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1a233a]">{project.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم لماذا نحن */}
      <section className="bg-[#1a233a] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="لماذا نحن؟"
            title="مميزات تجعلنا الخيار الأول"
            description="نلتزم بأعلى المعايير المهنية لنقدم لعملائنا تجربة بناء استثنائية من البداية حتى التسليم."
            dark
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c5a059]/50 hover:bg-white/10"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c5a059] text-[#1a233a] shadow-lg shadow-[#c5a059]/30">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* قسم المدونة */}
      <section className="bg-[#f5f7fa] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="المدونة"
            title="أحدث المقالات"
            description="نصائح وإرشادات من خبرائنا لمساعدتك في اتخاذ أفضل القرارات لمشروعك."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c5a059]">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime}
                </span>
                <h3 className="mt-4 text-lg font-bold leading-7 text-[#1a233a] transition group-hover:text-[#c5a059]">
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-gray-600">
                  {article.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#c5a059]">
                  اقرأ المزيد
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
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
        className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-3 rounded-full bg-[#25d366] px-5 py-3.5 font-bold text-white shadow-xl shadow-[#25d366]/30 transition duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <MessageCircle className="h-5 w-5" />
        تواصل معنا عبر الواتساب
      </a>
    </main>
  )
}