import type { LucideIcon } from 'lucide-react'

export interface SocialLink {
  name: string
  url: string
}

export interface SiteConfig {
  companyName: string
  companyNameEn: string
  description: string
  phone: string
  whatsapp: string
  email: string
  address: string
  workingHours: string
  domain: string
  social: SocialLink[]
}

export interface Service {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  icon: LucideIcon
  features: string[]
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  metaDescription: string
  keywords: string[]
  readTime: string
}

export interface ProjectItem {
  id: string
  title: string
  category: string
  image: string
  description: string
}