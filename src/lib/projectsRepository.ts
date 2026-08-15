import { ProjectItem, ProjectInput } from '@/types'
import { prisma } from '@/lib/prisma'
import { Project as PrismaProject } from '@prisma/client'
import { ensureUniqueSlug, slugify } from '@/utils/slug'

export interface IProjectRepository {
  getAll(): Promise<ProjectItem[]>
  getById(id: string): Promise<ProjectItem | null>
  getBySlug(slug: string): Promise<ProjectItem | null>
  getFeatured(limit?: number): Promise<ProjectItem[]>
  create(input: ProjectInput): Promise<ProjectItem>
  update(id: string, input: Partial<ProjectInput>): Promise<ProjectItem | null>
  delete(id: string): Promise<boolean>
}

// دالة مساعدة محددة النوع بدقة لتحويل كائنات Prisma إلى ProjectItem
function mapToProjectItem(item: PrismaProject): ProjectItem {
  return {
    ...item,
    area: item.area ?? undefined,
    completionYear: item.completionYear ?? undefined,
    status: item.status as ProjectItem['status'],
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

class PrismaProjectRepository implements IProjectRepository {
  async getAll(): Promise<ProjectItem[]> {
    try {
      const items = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return items.map(mapToProjectItem)
    } catch (error) {
      console.error('Failed to fetch projects from DB:', error)
      return []
    }
  }

  async getById(id: string): Promise<ProjectItem | null> {
    try {
      const item = await prisma.project.findUnique({
        where: { id },
      })
      return item ? mapToProjectItem(item) : null
    } catch (error) {
      console.error(`Failed to fetch project by id (${id}):`, error)
      return null
    }
  }

  async getBySlug(slug: string): Promise<ProjectItem | null> {
    try {
      const decodedSlug = decodeURIComponent(slug)
      const item = await prisma.project.findFirst({
        where: {
          OR: [{ slug: decodedSlug }, { slug }],
        },
      })
      return item ? mapToProjectItem(item) : null
    } catch (error) {
      console.error(`Failed to fetch project by slug (${slug}):`, error)
      return null
    }
  }

  async getFeatured(limit = 3): Promise<ProjectItem[]> {
    try {
      const items = await prisma.project.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
      return items.map(mapToProjectItem)
    } catch (error) {
      console.error('Failed to fetch featured projects:', error)
      return []
    }
  }

  async create(input: ProjectInput): Promise<ProjectItem> {
    try {
      const existingProjects = await prisma.project.findMany({
        select: { slug: true },
      })
      const existingSlugs = existingProjects.map((p) => p.slug)
      
      const rawSlug = input.slug?.trim() ? input.slug : (slugify(input.title) || 'project')
      const finalSlug = ensureUniqueSlug(rawSlug, existingSlugs)

      const created = await prisma.project.create({
        data: {
          slug: finalSlug,
          title: input.title.trim(),
          category: input.category.trim(),
          location: input.location?.trim() || 'جدة',
          area: input.area?.trim() || null,
          completionYear: input.completionYear?.trim() || null,
          description: input.description.trim(),
          image: input.image,
          gallery: input.gallery || [],
          materials: input.materials || [],
          features: input.features || [],
          status: input.status || 'completed',
        },
      })

      return mapToProjectItem(created)
    } catch (error) {
      console.error('Failed to create project in DB:', error)
      throw error
    }
  }

  async update(id: string, input: Partial<ProjectInput>): Promise<ProjectItem | null> {
    try {
      const existing = await prisma.project.findUnique({ where: { id } })
      if (!existing) return null

      let nextSlug = existing.slug

      if (typeof input.slug === 'string') {
        const trimmed = input.slug.trim()
        if (trimmed && trimmed !== existing.slug) {
          const otherProjects = await prisma.project.findMany({
            where: { id: { not: id } },
            select: { slug: true },
          })
          const otherSlugs = otherProjects.map((p) => p.slug)
          nextSlug = ensureUniqueSlug(trimmed, otherSlugs)
        }
      }

      const updated = await prisma.project.update({
        where: { id },
        data: {
          ...(input.title !== undefined && { title: input.title.trim() }),
          ...(input.category !== undefined && { category: input.category.trim() }),
          ...(input.location !== undefined && { location: input.location.trim() }),
          ...(input.area !== undefined && { area: input.area ? input.area.trim() : null }),
          ...(input.completionYear !== undefined && { completionYear: input.completionYear ? input.completionYear.trim() : null }),
          ...(input.description !== undefined && { description: input.description.trim() }),
          ...(input.image !== undefined && { image: input.image }),
          ...(input.gallery !== undefined && { gallery: input.gallery }),
          ...(input.materials !== undefined && { materials: input.materials }),
          ...(input.features !== undefined && { features: input.features }),
          ...(input.status !== undefined && { status: input.status }),
          slug: nextSlug,
        },
      })

      return mapToProjectItem(updated)
    } catch (error) {
      console.error(`Failed to update project (${id}):`, error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.project.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error(`Failed to delete project (${id}):`, error)
      return false
    }
  }
}

export const projectRepository: IProjectRepository = new PrismaProjectRepository()