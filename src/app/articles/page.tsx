import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { articles } from '@/data/siteData'

export const metadata = {
  title: 'المدونة والمقالات | المحور الهندسي للمقاولات',
  description: 'أحدث النصائح والمقالات الهندسية في مجال المقاولات والإنشاءات والمظلات.',
}

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-bold tracking-widest text-[#c5a059]">المدونة والمعرفة</span>
          <h1 className="mt-3 text-3xl font-extrabold text-[#1a233a] sm:text-4xl">
            أحدث المقالات والإرشادات الهندسية
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c5a059]">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime}
                </span>
                <h2 className="mt-4 text-lg font-bold leading-7 text-[#1a233a] transition group-hover:text-[#c5a059]">
                  {article.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-600">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#c5a059]">
                <span>اقرأ المقال بالكامل</span>
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}