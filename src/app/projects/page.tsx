'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useProjects } from '@/context/ProjectsContext'
import { PROJECT_CATEGORIES } from '@/config/site'
import SectionHeading from '@/components/ui/SectionHeading'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects()
  const [activeCategory, setActiveCategory] = useState<string>('الكل')

  const filteredProjects =
    activeCategory === 'الكل'
      ? projects
      : projects.filter((item) => item.category === activeCategory)

  return (
    <main className="min-h-screen bg-[#f5f7fa] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          eyebrow="معرض الأعمال"
          title="مشاريع نفتخر بإنجازها"
          description="استعرض أحدث المشاريع التي نفذتها شركة المحور الهندسي بأعلى معايير الدقة والجودة."
        />

        {/* أزرار الفلترة والتصنيفات */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#1a233a] text-[#c5a059] shadow-lg shadow-[#1a233a]/10 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-[#1a233a]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* مسار معالجة حالات البيانات */}
        {isLoading ? (
          <LoadingState count={6} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="لا توجد مشاريع مضافة حالياً"
            description="نعمل حالياً على تحديث قائمة الأعمال والمشاريع المنجزة."
            actionLabel="تواصل معنا للاستفسار"
            actionHref="/contact"
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title={`لا توجد مشاريع في قسم "${activeCategory}"`}
            description="لم نقم بإضافة مشاريع ضمن هذا التصنيف حتى الآن."
            onReset={() => setActiveCategory('الكل')}
          />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-[#1a233a]/80 px-3 py-1 text-xs font-bold text-[#c5a059] backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1a233a] transition group-hover:text-[#c5a059]">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}