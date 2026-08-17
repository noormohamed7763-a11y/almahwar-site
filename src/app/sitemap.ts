import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { publishedArticles } from '@/data/siteData'
import { projectRepository } from '@/lib/projectsRepository'
import { listServiceRoutes } from '@/lib/servicesRepository'

export const revalidate = 3600 // إعادة التحقق والتحديث كل ساعة

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.domain
  const [projects, dbServices] = await Promise.all([
    projectRepository.getAll(),
    listServiceRoutes(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/projects',
    '/articles',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // من القاعدة لا من المصفوفة الثابتة: كانت الخريطة تنشر slugs قديمة
  // تعيد 404 وتُخفي الخدمات الحقيقية عن الفهرسة
  const serviceRoutes: MetadataRoute.Sitemap = dbServices.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt
      ? new Date(project.updatedAt)
      : project.createdAt
      ? new Date(project.createdAt)
      : new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const articleRoutes: MetadataRoute.Sitemap = publishedArticles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...articleRoutes]
}