import React from 'react'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { articles } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'

export default function HomeArticlesSection() {
  return (
    <section className="bg-[#f8fafc] py-20" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="المدونة الفنية"
          title="أحدث المقالات والإرشادات الهندسية"
          description="نصائح ومعلومات متخصصة لمساعدتك في اتخاذ أفضل القرارات الهندسية والتنفيذية لمشروعك."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  <span>اقرأ التفاصيل</span>
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}