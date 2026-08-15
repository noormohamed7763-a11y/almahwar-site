export const siteConfig = {
  companyName: 'المحور الهندسي للمقاولات العامة',
  companyNameEn: 'AlMahwar Engineering for General Contracting',
  description: 'تنفيذ أعمال الساندوتش بانل، المظلات، السواتر، الترميم، البناء العام، والدهانات والديكورات بأعلى معايير الجودة والالتزام بالمواعيد في المملكة العربية السعودية.',
  phone: '0565205015',
  whatsapp: 'https://wa.me/966565205015',
  whatsappUrl: 'https://wa.me/966565205015',
  email: 'almhwr.alhndsy@gmail.com',
  mainCity: 'جدة',
  address: 'المملكة العربية السعودية - المقر الرئيسي: جدة',
  serviceAreas: ['جدة', 'مكة المكرمة', 'الرياض', 'المدينة المنورة'],
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