import { ProjectItem } from '@/types'
import { defaultProjects } from '@/data/siteData'
import { safeStorage } from '@/lib/storage'
import { logger } from '@/lib/logger'

const PROJECTS_STORAGE_KEY = 'almahwar_projects_data_v2'

// دالة التحقق البرمجي (Validator) من بنية مصفوفة المشاريع
function isProjectArray(data: unknown): data is ProjectItem[] {
  if (!Array.isArray(data)) return false
  return data.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.category === 'string' &&
      typeof item.image === 'string' &&
      typeof item.description === 'string'
  )
}

export const projectsService = {
  getProjects(): ProjectItem[] {
    return safeStorage.getItem<ProjectItem[]>(
      PROJECTS_STORAGE_KEY,
      defaultProjects,
      isProjectArray
    )
  },

  createProject(data: Omit<ProjectItem, 'id'>): ProjectItem[] {
    const current = this.getProjects()
    const newProject: ProjectItem = {
      ...data,
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    }
    const updated = [newProject, ...current]
    safeStorage.setItem(PROJECTS_STORAGE_KEY, updated)
    logger.info(`Project created: ${newProject.id}`)
    return updated
  },

  updateProject(id: string, patch: Partial<ProjectItem>): ProjectItem[] {
    const current = this.getProjects()
    const updated = current.map((p) => (p.id === id ? { ...p, ...patch } : p))
    safeStorage.setItem(PROJECTS_STORAGE_KEY, updated)
    logger.info(`Project updated: ${id}`)
    return updated
  },

  deleteProject(id: string): ProjectItem[] {
    const current = this.getProjects()
    const updated = current.filter((p) => p.id !== id)
    safeStorage.setItem(PROJECTS_STORAGE_KEY, updated)
    logger.info(`Project deleted: ${id}`)
    return updated
  },
}