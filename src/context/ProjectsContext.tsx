'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  startTransition,
} from 'react'
import { ProjectItem } from '@/types'
import { defaultProjects } from '@/data/siteData'
import { projectsService } from '@/services/projectsService'

export type { ProjectItem }

interface ProjectsContextType {
  projects: ProjectItem[]
  isLoading: boolean
  addProject: (project: Omit<ProjectItem, 'id'>) => void
  updateProject: (id: string, project: Partial<ProjectItem>) => void
  deleteProject: (id: string) => void
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // تشغيل التحديث ضمن Transition متوافق مع React 19
    startTransition(() => {
      const data = projectsService.getProjects()
      setProjects(data)
      setIsLoading(false)
    })
  }, [])

  const addProject = (projectData: Omit<ProjectItem, 'id'>) => {
    const updated = projectsService.createProject(projectData)
    setProjects(updated)
  }

  const updateProject = (id: string, projectData: Partial<ProjectItem>) => {
    const updated = projectsService.updateProject(id, projectData)
    setProjects(updated)
  }

  const deleteProject = (id: string) => {
    const updated = projectsService.deleteProject(id)
    setProjects(updated)
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects(): ProjectsContextType {
  const context = useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return context
}