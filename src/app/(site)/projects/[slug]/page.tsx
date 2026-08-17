import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  ArrowRight,
  Layers,
  Images
} from 'lucide-react'
import { projectRepository } from '@/lib/projectsRepository'
import { siteConfig } from '@/config/site'
import { generateProjectWhatsAppUrl } from '@/utils/whatsapp'
import { getAbsoluteUrl } from '@/utils/url'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

// دالة مساعدة لضمان سلامة رابط الصورة سواء كانت محلية أو سحابية
function resolveImageUrl(imagePath: string): string {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return getAbsoluteUrl(imagePath)
}

export async function generateStaticParams() {
  const projects = await projectRepository.getAll()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await projectRepository.getBySlug(slug)

  if (!project) {
    return { title: `المشروع غير موجود | ${siteConfig.companyName}` }
  }

  const title = `${project.title} | ${siteConfig.companyName}`
  const description = project.description
  const imageUrl = resolveImageUrl(project.image)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteConfig.domain}/projects/${project.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${siteConfig.domain}/projects/${project.slug}`,
    },
  }
}

export default async function SingleProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await projectRepository.getBySlug(slug)

  if (!project) {
    notFound()
  }

  const whatsappUrl = generateProjectWhatsAppUrl(project.title, project.category, project.location)
  const fullImageUrl = resolveImageUrl(project.image)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: siteConfig.domain,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المشاريع',
            item: `${siteConfig.domain}/projects`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: `${siteConfig.domain}/projects/${project.slug}`,
          },
        ],
      },
      {
        '@type': 'HomeAndConstructionBusiness',
        name: siteConfig.companyName,
        telephone: siteConfig.phone,
        url: siteConfig.domain,
        image: fullImageUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.address,
          addressLocality: siteConfig.mainCity,
          addressCountry: 'SA',
        },
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* شريط التنقل الفرعي (Breadcrumbs) */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="tap-area transition hover:text-[#c5a059]">الرئيسية</Link>
          <span>/</span>
          <Link href="/projects" className="tap-area transition hover:text-[#c5a059]">المشاريع</Link>
          <span>/</span>
          <span className="line-clamp-1 text-[#1a233a]">{project.title}</span>
        </nav>

        {/* رأس الصفحة */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#1a233a] px-3.5 py-1 text-xs font-semibold text-[#c5a059]">
              {project.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <MapPin className="h-3.5 w-3.5 text-[#c5a059]" />
              موقع المشروع: {project.location}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-[#1a233a] sm:text-3xl lg:text-4xl">
            {project.title}
          </h1>
        </div>

        {/* جسم الصفحة والتفاصيل */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* العمود الرئيسي */}
          <div className="space-y-8 lg:col-span-8">
            {/* الصورة الرئيسية */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm ring-1 ring-gray-200">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 750px"
                className="object-cover"
              />
            </div>

            {/* تفاصيل المشروع */}
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200/80">
              <h2 className="text-xl font-bold text-[#1a233a]">نظرة عامة على المشروع</h2>
              <p className="mt-4 leading-relaxed text-gray-700 whitespace-pre-line">
                {project.description}
              </p>

              {/* المواد المستخدمة */}
              {project.materials && project.materials.length > 0 && (
                <div className="mt-8">
                  <h3 className="flex items-center gap-2 text-base font-bold text-[#1a233a]">
                    <Layers className="h-5 w-5 text-[#c5a059]" />
                    المواصفات الفنية والمواد المستخدمة
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {project.materials.map((material, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 rounded-xl bg-gray-50 p-3.5 text-xs font-semibold text-gray-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* معايير الجودة والمميزات */}
              {project.features && project.features.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="flex items-center gap-2 text-base font-bold text-[#1a233a]">
                    <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                    معايير التنفيذ والجودة
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* معرض الصور الإضافية (إن وجد) */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200/80">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#1a233a]">
                  <Images className="h-5 w-5 text-[#c5a059]" />
                  معرض صور إضافية من الموقع
                </h3>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {project.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                      <Image
                        src={imgUrl}
                        alt={`${project.title} - صورة ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 250px"
                        className="object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* العمود الجانبي (Sidebar) */}
          <div className="space-y-6 lg:col-span-4">
            {/* بطاقة معلومات سريعة */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/80">
              <h3 className="text-base font-bold text-[#1a233a]">بيانات المشروع</h3>
              
              <div className="mt-4 divide-y divide-gray-100 text-sm">
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">المدينة / الموقع:</span>
                  <span className="font-semibold text-[#1a233a]">{project.location}</span>
                </div>
                {project.area && (
                  <div className="flex justify-between py-3">
                    <span className="text-gray-500">إجمالي المساحة:</span>
                    <span className="font-semibold text-[#1a233a]">{project.area}</span>
                  </div>
                )}
                {project.completionYear && (
                  <div className="flex justify-between py-3">
                    <span className="text-gray-500">سنة التنفيذ:</span>
                    <span className="font-semibold text-[#1a233a]">{project.completionYear}</span>
                  </div>
                )}
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">حالة المشروع:</span>
                  {project.status === 'ongoing' ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                      <Clock className="h-3.5 w-3.5" />
                      قيد التنفيذ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      تم التسليم بنجاح
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* بطاقة التواصل والطلب */}
            <div className="rounded-3xl bg-[#1a233a] p-6 text-white shadow-xl shadow-[#1a233a]/10">
              <h3 className="text-lg font-bold text-[#c5a059]">هل ترغب بتنفيذ مشروع مماثل؟</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-300">
                احصل على استشارة هندسية ومعاينة ميدانية لموقعك مع عرض سعر تفصيلي.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] py-3.5 text-sm font-bold text-[#1a233a] shadow-md transition hover:brightness-105 active:scale-98"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>طلب عرض سعر عبر الواتساب</span>
                </a>

                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4 text-[#c5a059]" />
                  <span dir="ltr">{siteConfig.phone}</span>
                </a>
              </div>
            </div>

            {/* زر العودة */}
            <Link
              href="/projects"
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-600 transition hover:border-[#c5a059] hover:text-[#1a233a]"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة لكافة المشاريع</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}