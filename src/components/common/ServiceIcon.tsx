import { createElement } from 'react'
import { getServiceIcon } from '@/lib/serviceIcons'

interface ServiceIconProps {
  /** اسم الأيقونة كما هو مخزَّن في عمود Service.icon */
  name: string | null | undefined
  className?: string
}

/**
 * عرض أيقونة الخدمة القادمة من قاعدة البيانات.
 *
 * سبب وجوده كمكوّن مستقل: إسناد نتيجة getServiceIcon إلى متغير بحرف
 * كبير داخل جسم مكوّن يخالف قاعدة react-hooks/static-components وتفشل
 * بها عملية البناء. createElement هنا يمرّر المكوّن كقيمة صريحة
 * فلا يبدو كأنه مكوّن يُنشأ أثناء العرض.
 */
export default function ServiceIcon({ name, className }: ServiceIconProps) {
  return createElement(getServiceIcon(name), { className })
}
