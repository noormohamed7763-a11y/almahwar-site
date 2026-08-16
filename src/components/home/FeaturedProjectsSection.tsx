import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Building2 } from 'lucide-react'
import { projectRepository } from '@/lib/projectsRepository'
import ProjectCard from '@/components/ProjectCard'

export default async function FeaturedProjectsSection() {
  // جلب أحدث 3 مشاريع مضافة من قاعدة البيانات مباشرة
  const featuredProjects = await projectRepository.getFeatured(3)

  // إذا لم تكن هناك أي مشاريع مضافة بعد، لا يتم عرض القسم لتجنب الفراغات
  if (!featuredProjects || featuredProjects.length === 0) {
    return null
  }

  return (
    <section className="bg-[#f8fafc] py-16 lg:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        {/* رأس القسم */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-[#c5a059] ring-1 ring-[#c5a059]/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>سابقة أعمال حية وميدانية</span>
            </div>
            <h2 className="mt-3 text-2xl font-black text-[#1a233a] sm:text-3xl lg:text-4xl">
              أحدث مشاريعنا المنجزة
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              نماذج من مشاريع الساندوتش بانل، المظلات، والهياكل الإنشائية التي تم تنفيذها بأعلى معايير الدقة والالتزام.
            </p>
          </div>

          {/* زر التوجه لكافة المشاريع */}
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#1a233a] px-6 py-3.5 text-xs font-bold text-[#c5a059] shadow-md shadow-[#1a233a]/10 transition-all duration-300 hover:bg-[#253252] hover:shadow-lg active:scale-98"
          >
            <span>استعراض كافة المشاريع</span>
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* شبكة عرض البطاقات */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>

        {/* شريط معلومات سفلي سريع لتعزيز الثقة */}
        <div className="mt-14 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 sm:p-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-right">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1a233a] text-[#c5a059]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a233a]">
                  هل لديك مشروع بمواصفات ومساحة خاصة؟
                </h3>
                <p className="text-xs text-gray-500">
                  فريقنا الهندسي مستعد لتقديم المقايسة الفنية وجدول الكميات مجاناً لموقعك.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-5 py-2.5 text-xs font-bold text-[#1a233a] transition hover:bg-[#c5a059] hover:text-[#1a233a]"
            >
              <span>طلب دراسة ومعاينة موقع</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}