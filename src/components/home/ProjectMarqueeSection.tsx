import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Sparkles, MapPin, Maximize2, ShieldCheck } from 'lucide-react'
import { projectRepository } from '@/lib/projectsRepository'
import { ProjectItem } from '@/types'

const fallbackProjects = [
  {
    id: 'marquee-1',
    slug: 'sandwich-panel-warehouse-jeddah',
    title: 'مستودع ساندوتش بانل لوجستي',
    category: 'ساندوتش بانل',
    location: 'جدة - المنطقة الصناعية',
    area: '1,500 م²',
    image: '/images/hero/sandwich-panel-1.jpg',
  },
  {
    id: 'marquee-2',
    slug: 'steel-structure-hangar',
    title: 'هنجر هيكلي ومستودع تخزين',
    category: 'هياكل حديدية',
    location: 'جدة - الخمرة',
    area: '2,400 م²',
    image: '/images/hero/sandwich-panel-2.jpg',
  },
  {
    id: 'marquee-3',
    slug: 'commercial-canopy-project',
    title: 'مظلات وسواتر تجارية معتمدة',
    category: 'مظلات وسواتر',
    location: 'مكة المكرمة',
    area: '850 م²',
    image: '/images/hero/canopy-1.jpg',
  },
  {
    id: 'marquee-4',
    slug: 'cold-storage-facility',
    title: 'مستودع تبريد وتجميد بانل PIR',
    category: 'عزل وغرف تبريد',
    location: 'الرياض',
    area: '1,100 م²',
    image: '/images/hero/canopy-2.jpg',
  },
]

export default async function ProjectMarqueeSection() {
  let dbProjects: ProjectItem[] = []
  try {
    dbProjects = await projectRepository.getAll()
  } catch (error) {
    console.error('[ProjectMarqueeSection] Failed to fetch projects:', error)
  }

  // استخدام المشاريع من القاعدة، وفي حال كانت أقل من 4 ندمج المجموعتين للثراء البصري
  const displayProjects =
    dbProjects.length >= 3 ? dbProjects : [...dbProjects, ...fallbackProjects]

  // مضاعفة المصفوفة مرتين لضمان دوران الشريط بلا انقطاع (Seamless Loop)
  const marqueeItems = [...displayProjects, ...displayProjects]

  return (
    <section className="relative overflow-hidden bg-[#0a0f1d] py-12 text-white sm:py-16">
      {/* 🌟 هالة خلفية دافئة */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-[#c5a059]/10 blur-3xl" />

      <div className="relative mx-auto w-full px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* رأس القسم */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-3 py-1 text-[11px] font-bold text-[#c5a059]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>معرض المشاريع الميداني الحي</span>
            </span>
            <h2 className="mt-2.5 text-xl font-black text-white sm:text-3xl">
              معرض الأعمال المنفذة بالمملكة
            </h2>
          </div>

          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-[#c5a059] shadow-sm backdrop-blur-sm transition duration-300 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#1a233a]"
          >
            <span>استعراض كافة المشاريع</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
          </Link>
        </div>
      </div>

      {/* 🎬 شريط الصور المتحرك بحوافي متدرجة إبداعية */}
      <div className="relative w-full overflow-hidden py-3">
        {/* طبقات تدرج ضبابية على الأطراف لإخفاء الحواف عند الدخول والخروج */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#0a0f1d] via-[#0a0f1d]/80 to-transparent sm:w-32 lg:w-48" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#0a0f1d] via-[#0a0f1d]/80 to-transparent sm:w-32 lg:w-48" />

        {/* المسار المتحرك */}
        <div className="animate-marquee flex gap-4 sm:gap-6">
          {marqueeItems.map((item, index) => {
            const projectSlug = item.slug || 'sandwich-panel-warehouse-jeddah'
            const coverImage = item.image || '/images/hero/sandwich-panel-1.jpg'

            return (
              <Link
                key={`${item.id}-${index}`}
                href={`/projects/${projectSlug}`}
                className="group relative aspect-[16/10] w-72 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#12192c] shadow-lg ring-1 ring-white/5 transition-all duration-500 hover:border-[#c5a059]/70 hover:shadow-2xl hover:shadow-[#c5a059]/20 sm:w-96"
              >
                {/* صورة المشروع */}
                <Image
                  src={coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 280px, 384px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* تدرج مظلل أسفل النص */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />

                {/* شارة الفئة علوياً */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-[#0a0f1d]/80 px-2.5 py-1 text-[10px] font-bold text-[#c5a059] backdrop-blur-md">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{item.category || 'مقاولات عامة'}</span>
                  </span>
                </div>

                {/* الكارت الزجاجي السفلي للمعلومات */}
                <div className="absolute bottom-3 right-3 left-3 z-10 flex items-center justify-between rounded-xl border border-white/15 bg-[#0a0f1d]/85 p-3 backdrop-blur-md transition duration-300 group-hover:border-[#c5a059]/50 group-hover:bg-[#0a0f1d]/95">
                  <div className="min-w-0 flex-1 text-right">
                    <h3 className="truncate text-xs font-black text-white group-hover:text-[#c5a059] sm:text-sm">
                      {item.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-300">
                      {item.location && (
                        <span className="inline-flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0 text-[#c5a059]" />
                          <span>{item.location}</span>
                        </span>
                      )}
                      {item.area && (
                        <span className="inline-flex items-center gap-1 truncate border-r border-white/15 pr-2">
                          <Maximize2 className="h-3 w-3 shrink-0 text-[#c5a059]" />
                          <span>{item.area}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c5a059] text-[#1a233a] shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
