import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ChevronLeft, ArrowRight, Tag, Newspaper } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { publishedArticles, getArticleBySlug } from '@/data/siteData'
import { readingTimeLabel } from '@/utils/readingTime'
import ArticleBody from '@/components/common/ArticleBody'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  // المسوّدات مستثناة: لا تُبنى لها صفحة ولا تُفهرس
  return publishedArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article || article.isDraft) {
    return {
      title: 'المقال غير موجود | المحور الهندسي للمقاولات',
    }
  }

  return {
    title: `${article.title} | ${siteConfig.companyName}`,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `${siteConfig.domain}/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `${siteConfig.domain}/articles/${article.slug}`,
      locale: 'ar_SA',
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  // المسوّدة تعطي 404 كأنها غير موجودة — لا صفحة نصفها فارغ
  if (!article || article.isDraft || !article.content.trim()) {
    notFound()
  }

  const relatedArticles = publishedArticles
    .filter((item) => item.id !== article.id)
    .slice(0, 3)

  const readTime = readingTimeLabel(article.content)

  return (
    <main dir="rtl" className="overflow-x-hidden">
      <section className="bg-[#1a233a]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <nav
            aria-label="مسار التنقل"
            className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 sm:mb-6 sm:text-sm"
          >
            <Link href="/" className="tap-area transition hover:text-[#c5a059]">
              الرئيسية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <Link href="/articles" className="tap-area transition hover:text-[#c5a059]">
              المقالات
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            {/* العنوان طويل: يُقصَّر في المسار على الهاتف بدل أن يلتف سطوراً */}
            <span className="min-w-0 max-w-full truncate text-[#c5a059]">
              {article.title}
            </span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 px-3 py-1.5 text-xs font-medium text-[#c5a059] sm:px-4 sm:text-sm">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {readTime}
          </span>
          <h1 className="mt-4 text-2xl font-extrabold leading-[1.45] text-white sm:mt-5 sm:text-3xl md:text-4xl">
            {article.title}
          </h1>
        </div>
      </section>

      <section className="bg-[#f5f7fa] py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8 lg:p-10">
            <p className="text-base font-medium leading-8 text-gray-700 sm:text-lg sm:leading-9">
              {article.excerpt}
            </p>

            <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a] sm:mt-6 sm:w-24" />

            <div className="mt-7 sm:mt-8">
              <ArticleBody content={article.content} />
            </div>

            <div className="mt-9 border-t border-gray-100 pt-6 sm:mt-10">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#1a233a] sm:text-base">
                <Tag className="h-4 w-4 shrink-0 text-[#c5a059] sm:h-5 sm:w-5" />
                الكلمات المفتاحية
              </h2>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 px-3 py-1.5 text-xs font-medium text-[#1a233a] sm:px-4 sm:text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {relatedArticles.length > 0 && (
            <div className="mt-10 sm:mt-12">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
                <h2 className="flex items-center gap-2 text-xl font-extrabold text-[#1a233a] sm:text-2xl">
                  <Newspaper className="h-5 w-5 shrink-0 text-[#c5a059] sm:h-6 sm:w-6" />
                  مقالات ذات صلة
                </h2>
                <Link
                  href="/articles"
                  className="tap-area inline-flex items-center gap-2 text-xs font-bold text-[#c5a059] transition hover:text-[#1a233a] sm:text-sm"
                >
                  جميع المقالات
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.slug}`}
                    className="group flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:p-6"
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c5a059]">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {readingTimeLabel(related.content)}
                    </span>
                    <h3 className="mt-3 flex-1 text-sm font-bold leading-7 text-[#1a233a] transition group-hover:text-[#c5a059] sm:text-base">
                      {related.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#c5a059] sm:text-sm">
                      اقرأ المزيد
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
