import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MessageCircle,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  ChevronLeft,
  FileText,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { services, getServiceBySlug } from '@/data/siteData'
import QuoteForm from '@/components/common/QuoteForm'

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'الخدمة غير موجودة | المحور الهندسي للمقاولات',
    }
  }

  return {
    title: `${service.title} | ${siteConfig.companyName}`,
    description: service.shortDescription,
    keywords: [service.title, 'مقاولات', siteConfig.companyName],
    openGraph: {
      title: `${service.title} | ${siteConfig.companyName}`,
      description: service.shortDescription,
      locale: 'ar_SA',
      type: 'website',
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const Icon = service.icon

  const whatsappUrl = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    `أرغب في الاستفسار عن خدمة ${service.title} والحصول على عرض سعر مناسب.`,
  )}`

  return (
    <main dir="rtl" className="overflow-x-hidden">
      <section className="bg-[#1a233a]">
        <div className="mx-auto max-w-7xl px-0 py-14 sm:px-6 lg:px-8">
          <nav
            aria-label="مسار التنقل"
            className="mb-6 flex items-center gap-2 text-sm text-gray-400"
          >
            <Link href="/" className="transition hover:text-[#c5a059]">
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/services" className="transition hover:text-[#c5a059]">
              خدماتنا
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-[#c5a059]">{service.title}</span>
          </nav>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#c5a059] text-[#1a233a] shadow-lg shadow-[#c5a059]/30">
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                {service.title}
              </h1>
              <p className="mt-3 max-w-2xl leading-8 text-gray-300">
                {service.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fa] py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-0 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <article className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-2xl font-extrabold text-[#1a233a]">
                نبذة عن خدمة {service.title}
              </h2>
              <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
              <p className="mt-6 leading-8 text-gray-700">
                {service.fullDescription}
              </p>

              <h3 className="mt-10 text-xl font-extrabold text-[#1a233a]">
                مميزات تنفيذ الخدمة لدى {siteConfig.companyName}
              </h3>
              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
              <ul className="mt-6 space-y-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c5a059]" />
                    <span className="leading-7 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </article>

            <div className="mt-10 rounded-2xl bg-[#1a233a] p-8">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    خدماتنا الأخرى
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    استكشف باقي خدماتنا المنفذة بنفس المعايير والجودة.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-[#c5a059] px-6 py-3 font-bold text-[#1a233a] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  جميع الخدمات
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services
                  .filter((item) => item.id !== service.id)
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/services/${item.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#c5a059]/50 hover:bg-white/10"
                    >
                      <item.icon className="h-5 w-5 shrink-0 text-[#c5a059]" />
                      <span className="text-sm font-medium text-gray-200 transition group-hover:text-white">
                        {item.title}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366]/15 text-[#25d366]">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#1a233a]">
                استفسار سريع
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                تواصل مباشرة مع فريقنا للاستفسار عن خدمة {service.title} أو طلب
                عرض سعر مجاني.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#25d366]/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
                واتساب مباشر
              </a>
              <div className="mt-5 space-y-3 border-t border-gray-100 pt-5 text-sm">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-3 text-gray-600 transition hover:text-[#c5a059]"
                >
                  <Phone className="h-4 w-4 text-[#c5a059]" />
                  <span dir="ltr">{siteConfig.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-gray-600 transition hover:text-[#c5a059]"
                >
                  <Mail className="h-4 w-4 text-[#c5a059]" />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#1a233a]">
                <FileText className="h-5 w-5 text-[#c5a059]" />
                اطلب عرض سعر
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                املأ النموذج وسيصلك عرض السعر عبر الواتساب في أقرب وقت.
              </p>
              <div className="mt-5">
                <QuoteForm serviceName={service.title} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}