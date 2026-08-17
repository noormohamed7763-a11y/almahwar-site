import { LucideIcon } from 'lucide-react'

// بيانات إعدادات الموقع
export interface SocialLink {
  name: string
  url: string
}

export interface SiteConfig {
  companyName: string
  companyNameEn: string
  description: string
  phone: string
  whatsappUrl: string
  email: string
  mainCity: string
  address: string
  serviceAreas: string[]
  workingHours: string
  domain: string
  social: SocialLink[]
}

// واجهة بيانات الخدمات
export interface Service {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  icon: LucideIcon
  features: string[]
}

// واجهة بيانات المقالات
export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  metaDescription: string
  keywords: string[]
  /**
   * متن المقال بصيغة Markdown مبسّطة: ## و### و#### للعناوين،
   * و* للقوائم، و1. للقوائم المرقّمة. يُعرَض عبر ArticleBody.
   *
   * فارغ = مسوّدة لم يُكتب متنها بعد.
   */
  content: string
  /**
   * المسوّدة لا تظهر في قائمة المقالات ولا في خريطة الموقع، ولا
   * تُبنى لها صفحة. تُنشر بمجرد إزالة هذا الحقل وإضافة المتن.
   */
  isDraft?: boolean
}

// واجهة بيانات المشاريع
export interface ProjectItem {
  id: string
  slug: string
  title: string
  category: string
  location: string
  description: string
  image: string
  status?: 'completed' | 'ongoing'
  area?: string
  completionYear?: string
  materials?: string[]
  gallery?: string[]
  features?: string[]
  createdAt?: string
  updatedAt?: string
}

// واجهة مدخلات إضافة/تعديل المشاريع
export interface ProjectInput {
  title: string
  slug?: string
  category: string
  location: string
  description: string
  image: string
  status?: 'completed' | 'ongoing'
  area?: string
  completionYear?: string
  materials?: string[]
  gallery?: string[]
  features?: string[]
}