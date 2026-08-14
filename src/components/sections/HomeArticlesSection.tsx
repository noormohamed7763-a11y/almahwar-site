import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { articles } from '@/data/siteData'
import SectionHeading from '@/components/ui/SectionHeading'

export default function HomeArticlesSection() {
  return (
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
  )
}