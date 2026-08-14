import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ChevronLeft, ArrowRight, Tag, Newspaper } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { articles, getArticleBySlug } from '@/data/siteData'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'المقال غير موجود | المحور الهندسي للمقاولات',
    }
  }

  return {
    title: `${article.title} | ${siteConfig.companyName}`,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      locale: 'ar_SA',
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = articles
    .filter((item) => item.id !== article.id)
    .slice(0, 3)

  return (
    <main dir="rtl" className="overflow-x-hidden">
      <section className="bg-[#1a233a]">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <nav
            aria-label="مسار التنقل"
            className="mb-6 flex items-center gap-2 text-sm text-gray-400"
          >
            <Link href="/" className="transition hover:text-[#c5a059]">
              الرئيسية
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <Link href="/articles" className="transition hover:text-[#c5a059]">
              المقالات
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-[#c5a059]">{article.title}</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-4 py-1.5 text-sm font-medium text-[#c5a059]">
            <Clock className="h-4 w-4" />
            {article.readTime}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.4] text-white sm:text-4xl">
            {article.title}
          </h1>
        </div>
      </section>

      <section className="bg-[#f5f7fa] py-14">
        <div className="mx-auto max-w-4xl px-4">
          <article className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 sm:p-10">
            <p className="text-lg leading-9 text-gray-700">{article.excerpt}</p>

            <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />

            <div className="mt-8 space-y-5 leading-9 text-gray-700">
              <p>{article.metaDescription}</p>
              <p>
                يحرص فريق {siteConfig.companyName} على تقديم معلومات دقيقة وعملية تساعدك على
                اتخاذ القرار الصحيح لمشروعك، مع أفضل الحلول والخدمات الهندسية المعتمدة في جميع
                أنحاء المملكة العربية السعودية.
              </p>
              <p>
                إذا كنت بحاجة إلى استشارة متخصصة أو عرض سعر تفصيلي، لا تتردد في التواصل معنا عبر
                صفحة تواصل معنا أو من خلال زر الواتساب المباشر.
              </p>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-6">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-[#1a233a]">
                <Tag className="h-5 w-5 text-[#c5a059]" />
                الكلمات المفتاحية
              </h2>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 px-4 py-1.5 text-sm font-medium text-[#1a233a] transition hover:bg-[#c5a059] hover:text-[#1a233a]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-extrabold text-[#1a233a]">
                <Newspaper className="h-6 w-6 text-[#c5a059]" />
                مقالات ذات صلة
              </h2>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#c5a059] transition hover:text-[#1a233a]"
              >
                جميع المقالات
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/articles/${related.slug}`}
                  className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c5a059]">
                    <Clock className="h-3.5 w-3.5" />
                    {related.readTime}
                  </span>
                  <h3 className="mt-3 flex-1 text-base font-bold leading-7 text-[#1a233a] transition group-hover:text-[#c5a059]">
                    {related.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#c5a059]">
                    اقرأ المزيد
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}