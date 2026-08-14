import { siteConfig } from '@/config/site'
import { services, articles } from '@/data/siteData'

const DOMAIN = process.env.SITE_URL || siteConfig.domain || 'https://example.com'

function urlEntry(path: string, priority = '0.8', changefreq = 'weekly') {
  const loc = `${DOMAIN}${path}`
  const lastmod = new Date().toISOString()
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

export async function GET() {
  const staticPages = ['/', '/services', '/projects', '/articles', '/contact']

  const urls: string[] = []

  // static pages
  for (const p of staticPages) urls.push(urlEntry(p, '0.9', 'weekly'))

  // services
  for (const s of services) {
    urls.push(urlEntry(`/services/${s.slug}`, '0.8', 'monthly'))
  }

  // articles
  for (const a of articles) {
    urls.push(urlEntry(`/articles/${a.slug}`, '0.7', 'monthly'))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
