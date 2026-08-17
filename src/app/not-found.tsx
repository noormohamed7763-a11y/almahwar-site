import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f8fafc] px-4 text-center" dir="rtl">
      <span className="text-6xl font-black text-[#c5a059]">404</span>
      <h1 className="mt-4 text-2xl font-extrabold text-[#1a233a]">
        الصفحة غير موجودة
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        الرابط الذي تحاول الوصول إليه غير متاح، وربما تم نقله أو حذفه.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#1a233a] px-6 py-3 text-sm font-bold text-[#c5a059] transition hover:bg-[#253252]"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </main>
  )
}