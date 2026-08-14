import { siteConfig } from '@/config/site'

export async function GET() {
  const domain = process.env.SITE_URL || siteConfig.domain || ''
  const sitemapUrl = `${domain.replace(/\/$/, '')}/sitemap.xml`

  const lines = [
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /api/admin',
    'Allow: /',
    `Sitemap: ${sitemapUrl}`,
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
