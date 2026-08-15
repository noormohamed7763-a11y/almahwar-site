import React from 'react'
import { projectRepository } from '@/lib/projectsRepository'
import ProjectCard from '@/components/ProjectCard'
import { siteConfig } from '@/config/site'

// ضمان جلب أحدث البيانات من قاعدة البيانات عند كل زيارة
export const dynamic = 'force-dynamic'

export const metadata = {
  title: `معرض المشاريع والأعمال المنجزة | ${siteConfig.companyName}`,
  description:
    'استعرض سابقة أعمالنا في مشاريع الساندوتش بانل، المظلات، السواتر، وأعمال البناء والترميم في مختلف مناطق المملكة مع إمكانية طلب مشروع مماثل فوراً.',
}

export default async function ProjectsPage() {
  const projects = await projectRepository.getAll()

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#c5a059]">
            سابقة الأعمال الهندسية
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1a233a] sm:text-4xl">
            المشاريع والمنتجات المنجزة
          </h1>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            تصفح أعمالنا الميدانية المنفذة بأعلى معايير الجودة، واطلب استشارة وعرض سعر لتنفيذ مشروع مماثل لموقعك مباشرة.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-[#c5a059]">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1a233a]">لا توجد مشاريع معروضة حالياً</h3>
            <p className="mt-1 text-sm text-gray-500">
              سيتم ظهور المشاريع هنا فور إضافتها واعتمادها من لوحة الإدارة.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}