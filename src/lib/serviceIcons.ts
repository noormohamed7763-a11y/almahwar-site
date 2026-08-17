import {
  Layers,
  Building2,
  Shield,
  LayoutGrid,
  Home,
  Palette,
  Sparkles,
  Grid,
  Building,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/**
 * ترجمة اسم الأيقونة المخزَّن في قاعدة البيانات إلى مكوّن Lucide.
 *
 * سبب وجود هذا الملف: كانت الخريطة معرَّفة داخل صفحة الخدمات وحدها،
 * فلم تكن الصفحة الرئيسية قادرة على عرض أيقونة الخدمة القادمة من
 * القاعدة. الاسم يُخزَّن نصاً لأن مكوّن React لا يُحفظ في عمود.
 */
const ICON_MAP = {
  Layers,
  Building2,
  Shield,
  LayoutGrid,
  Home,
  Palette,
  Sparkles,
  Grid,
  Building,
  Wrench,
} as const satisfies Record<string, LucideIcon>

/** الأسماء المسموحة — تُستخدم في قائمة اختيار الأيقونة بلوحة التحكم */
export const SERVICE_ICON_NAMES = Object.keys(ICON_MAP) as Array<
  keyof typeof ICON_MAP
>

export type ServiceIconName = keyof typeof ICON_MAP

/** التحقق من أن نصاً ما اسم أيقونة معروف، قبل حفظه في القاعدة */
export function isServiceIconName(value: unknown): value is ServiceIconName {
  return typeof value === 'string' && value in ICON_MAP
}

/**
 * أي اسم غير معروف (أو غائب) يرجع Wrench بدل أن يفشل العرض.
 */
export function getServiceIcon(iconName: string | null | undefined): LucideIcon {
  if (isServiceIconName(iconName)) {
    return ICON_MAP[iconName]
  }
  return Wrench
}
