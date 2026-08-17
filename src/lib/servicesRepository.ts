import { prisma } from '@/lib/prisma'
import { ensureUniqueSlug, slugify } from '@/utils/slug'

/**
 * مستودع الخدمات — المصدر الوحيد لقراءة الخدمات في كل الموقع.
 *
 * سبب وجوده: كانت الخدمات تُقرأ من مكانين متعارضين — قاعدة البيانات في
 * صفحات /services، ومصفوفة ثابتة في src/data/siteData.ts في الصفحة
 * الرئيسية والتذييل وخريطة الموقع والبيانات المنظّمة. اختلاف الـ slugs
 * بين المصدرين كان يُنتج روابط 404 وينشرها في sitemap.
 *
 * سياسة الأخطاء هنا مقصودة وليست موحّدة:
 *  - ما يظهر في كل صفحة (التذييل، البيانات المنظّمة، شبكة الرئيسية)
 *    يبتلع الخطأ ويرجع قائمة فارغة، وإلا أسقط انقطاعُ القاعدة الموقع
 *    بأكمله بما فيه الصفحات التي لا تحتاج قاعدة بيانات أصلاً.
 *  - ما يمثّل محتوى الصفحة نفسها (قائمة الخدمات وصفحة التفاصيل) يترك
 *    الخطأ يصعد إلى error.tsx، لأن صفحة خدمات فارغة تكذب على الزائر
 *    ومحركات البحث بينما الخطأ الصريح لا يفعل.
 */

/** الحقول التي تحتاجها البطاقات والقوائم — لا نجلب أكثر منها */
const LIST_FIELDS = {
  id: true,
  slug: true,
  title: true,
  description: true,
  icon: true,
  sortOrder: true,
  isPublished: true,
} as const

/** ترتيب العرض الموحّد: sortOrder ثم الأحدث عند التساوي */
const DISPLAY_ORDER = [
  { sortOrder: 'asc' as const },
  { createdAt: 'desc' as const },
]

export interface ServiceListItem {
  id: string
  slug: string
  title: string
  description: string
  icon: string | null
  sortOrder: number
  isPublished: boolean
}

export interface ServiceImageItem {
  id: string
  url: string
  caption: string | null
  sortOrder: number
}

export interface ServiceDetail extends ServiceListItem {
  images: ServiceImageItem[]
}

export interface ServiceAdminItem extends ServiceListItem {
  images: ServiceImageItem[]
  createdAt: string
  updatedAt: string
}

/**
 * خدمات الموقع المنشورة — محتوى صفحة /services.
 * يترك الخطأ يصعد للـ error boundary.
 */
export async function listPublishedServices(): Promise<ServiceListItem[]> {
  return prisma.service.findMany({
    where: { isPublished: true },
    orderBy: DISPLAY_ORDER,
    select: LIST_FIELDS,
  })
}

/**
 * خدمة واحدة بصورها مرتبة. يرجع null إذا لم توجد (فتظهر 404 صحيحة)،
 * ويرفع استثناءً إذا فشل الاتصال (فيظهر خطأ لا 404 كاذبة).
 */
export async function getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
  const decodedSlug = decodeURIComponent(slug)

  const service = await prisma.service.findFirst({
    where: {
      isPublished: true,
      OR: [{ slug: decodedSlug }, { slug }],
    },
    select: {
      ...LIST_FIELDS,
      images: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, url: true, caption: true, sortOrder: true },
      },
    },
  })

  return service
}

/**
 * خدمات أخرى لعرضها في صفحة التفاصيل.
 * الترتيب صريح — بدونه كان Postgres يرجع صفوفاً غير محدَّدة مع take.
 */
export async function listOtherServices(
  excludeId: string,
  limit = 4,
): Promise<Pick<ServiceListItem, 'id' | 'title' | 'slug'>[]> {
  return prisma.service.findMany({
    where: { isPublished: true, NOT: { id: excludeId } },
    orderBy: DISPLAY_ORDER,
    take: limit,
    select: { id: true, title: true, slug: true },
  })
}

/**
 * خدمات التنقل — التذييل والبيانات المنظّمة وشبكة الصفحة الرئيسية.
 * تظهر في كل صفحة، فالفشل يُسجَّل ويرجع فارغاً بدل إسقاط الموقع.
 */
export async function listServicesForNavigation(
  limit?: number,
): Promise<ServiceListItem[]> {
  try {
    return await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: DISPLAY_ORDER,
      ...(limit ? { take: limit } : {}),
      select: LIST_FIELDS,
    })
  } catch (error) {
    console.error('[Services] تعذّر جلب خدمات التنقل، سيُخفى القسم:', error)
    return []
  }
}

/**
 * روابط الخدمات لخريطة الموقع.
 * الفشل هنا يرجع فارغاً: خريطة ناقصة أهون من خريطة تعيد 500 لجوجل.
 */
export async function listServiceRoutes(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  try {
    return await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: DISPLAY_ORDER,
      select: { slug: true, updatedAt: true },
    })
  } catch (error) {
    console.error('[Sitemap] تعذّر جلب روابط الخدمات:', error)
    return []
  }
}

// ── ما يلي للوحة التحكم فقط ──────────────────────────────────────

/** كل الخدمات بما فيها المخفية، مع صورها — لجدول لوحة التحكم */
export async function listAllServicesForAdmin(): Promise<ServiceAdminItem[]> {
  const services = await prisma.service.findMany({
    orderBy: DISPLAY_ORDER,
    select: {
      ...LIST_FIELDS,
      createdAt: true,
      updatedAt: true,
      images: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, url: true, caption: true, sortOrder: true },
      },
    },
  })

  // تحويل التواريخ إلى نصوص: الجدول مكوّن عميل ولا يستقبل كائنات Date
  return services.map((service) => ({
    ...service,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  }))
}

/** slug فريد مبني على العنوان، مع استثناء الخدمة نفسها عند التعديل */
export async function buildUniqueServiceSlug(
  source: string,
  excludeId?: string,
): Promise<string> {
  const others = await prisma.service.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  })

  const base = slugify(source) || 'service'
  return ensureUniqueSlug(base, others.map((s) => s.slug))
}

/** أعلى ترتيب حالي + 1 — لتذهب الخدمة الجديدة إلى آخر القائمة */
export async function nextServiceSortOrder(): Promise<number> {
  const last = await prisma.service.findFirst({
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  })
  return (last?.sortOrder ?? -1) + 1
}
