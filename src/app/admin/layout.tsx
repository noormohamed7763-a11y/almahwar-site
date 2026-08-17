import type { Metadata } from 'next'

/**
 * قوقعة لوحة التحكم — بلا شريط تنقل الموقع العام ولا تذييله.
 *
 * صفحات اللوحة تعرّف وسم <main> الخاص بها، فهذا الـ layout لا يضيف
 * وسماً آخر حتى لا يتكرر التداخل الذي كان موجوداً.
 */
export const metadata: Metadata = {
  title: 'لوحة التحكم | المحور الهندسي',
  // منع الفهرسة على مستوى الوسوم أيضاً، إضافةً إلى robots.txt
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen bg-[#f8fafc]">{children}</div>
}
