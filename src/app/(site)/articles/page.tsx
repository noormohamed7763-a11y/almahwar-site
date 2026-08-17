import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import { publishedArticles } from '@/data/siteData'
import { readingTimeLabel } from '@/utils/readingTime'
import { siteConfig } from '@/config/site'

export const metadata = {
  title: 'المدونة والمقالات | المحور الهندسي للمقاولات',
  description:
    'أحدث النصائح والمقالات الهندسية في مجال المقاولات والإنشاءات والمظلات.',
  alternates: {
    canonical: `${siteConfig.domain}/articles`,
  },
}

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] py-10 sm:py-16">
      {/* px-0 على الهاتف مقصود (اتفاق الموقع): البطاقات تمتد لحافة الشاشة
          وحشوها الداخلي p-5 هو ما يفصل النص عن الحافة */}
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] sm:text-sm">
            المدونة والمعرفة
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-[#1a233a] sm:text-3xl md:text-4xl">
            أحدث المقالات والإرشادات الهندسية
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
        </div>

        {publishedArticles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {publishedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:p-6"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c5a059]">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {readingTimeLabel(article.content)}
                  </span>
                  {/* العناوين طويلة: تُقصَّر إلى 3 أسطر لتبقى البطاقات متساوية */}
                  <h2 className="mt-3 line-clamp-3 text-base font-bold leading-7 text-[#1a233a] transition group-hover:text-[#c5a059] sm:mt-4 sm:text-lg">
                    {article.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-600">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#c5a059] sm:mt-6 sm:text-sm">
                  <span>اقرأ المقال بالكامل</span>
                  <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center sm:p-12">
            <Clock className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-3 text-base font-bold text-[#1a233a]">
              لم يُنشر أي مقال بعد
            </h2>
          </div>
        )}
      </div>
    </main>
  )
}
