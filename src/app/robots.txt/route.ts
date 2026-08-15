import { siteConfig } from '@/config/site'

export const dynamic = 'force-static'

export async function GET() {
  const rawDomain =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    siteConfig.domain ||
    'https://almahware.com'

  const domain = rawDomain.replace(/\/$/, '')
  const sitemapUrl = `${domain}/sitemap.xml`

  const lines = [
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /admin/*',
    'Disallow: /api/admin',
    'Disallow: /api/auth',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}