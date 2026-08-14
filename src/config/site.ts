import { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  companyName: 'المحور الهندسي للمقاولات',
  companyNameEn: 'AlMahwar Engineering for Contracting',
  description: 'تنفيذ أعمال السندوتش بانل، المظلات، السواتر، الترميم، البناء العام، والدهانات والديكورات بأعلى معايير الجودة والالتزام بالمواعيد في جميع أنحاء المملكة.',
  phone: '056205015',
  whatsapp: 'https://wa.me/96656205015',
  email: 'almhwr.alhndsy@gmail.com',
  address: 'المقر الرئيسي: جدة | الفروع: مكة المكرمة، الرياض، المدينة المنورة',
  workingHours: 'السبت - الخميس: 8:00 صباحاً - 10:00 مساءً',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://almahware.com',
  social: [],
}

export const PROJECT_CATEGORIES = [
  'الكل',
  'سندوتش بانل ومستودعات',
  'مظلات وسواتر',
  'بناء عام وترميم',
  'دهانات وديكورات',
] as const