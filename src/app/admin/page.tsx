'use client'

import React, { useState, useEffect, useTransition, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  LogOut,
  FolderGit2,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
  Upload,
  AlertCircle,
  X,
  Building,
  Wrench,
} from 'lucide-react'
import { ProjectItem } from '@/types'
import { createProject, updateProject, deleteProject } from '@/app/actions/projects'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProjectsList = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects', { cache: 'no-store' })
      if (res.status === 401) {
        router.replace('/admin/login')
        return
      }
      const data = await res.json()
      if (data.projects) {
        setProjects(data.projects)
      }
    } catch {
      console.error('Failed to load projects')
    } finally {
      setIsLoadingData(false)
    }
  }, [router])

  useEffect(() => {
    let isMounted = true
    const loadInitialData = async () => {
      try {
        const res = await fetch('/api/admin/projects', { cache: 'no-store' })
        if (res.status === 401) {
          router.replace('/admin/login')
          return
        }
        const data = await res.json()
        if (isMounted && data.projects) {
          setProjects(data.projects)
        }
      } catch {
        console.error('Failed to load projects')
      } finally {
        if (isMounted) setIsLoadingData(false)
      }
    }
    loadInitialData()
    return () => { isMounted = false }
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.replace('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف مشروع "${title}" نهائياً؟`)) return
    setDeletingId(id)
    try {
      const res = await deleteProject(id)
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
        router.refresh()
      } else {
        alert(res.error || 'فشل حذف المشروع')
      }
    } catch {
      alert('حدث خطأ أثناء الحذف')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSubmitProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setActionError(null)

    const formElement = e.currentTarget
    const formData = new FormData(formElement)

    startTransition(async () => {
      let res
      if (editingProject) {
        res = await updateProject(editingProject.id, formData)
      } else {
        res = await createProject(formData)
      }

      if (res.success && res.project) {
        setIsModalOpen(false)
        setEditingProject(null)
        setPreviewImage(null)
        formElement.reset()
        await fetchProjectsList()
        router.refresh()
      } else {
        setActionError(res.error || 'فشل حفظ المشروع')
      }
    })
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCount = projects.length
  const completedCount = projects.filter((p) => p.status === 'completed').length
  const ongoingCount = projects.filter((p) => p.status === 'ongoing').length

  return (
    <main className="min-h-screen bg-[#f8fafc] py-10" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a233a] text-[#c5a059]">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#1a233a]">لوحة تحكم المشاريع</h1>
              <p className="text-xs text-gray-500">إدارة قاعدة بيانات الأعمال والمشاريع</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/services" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100">
              <Wrench className="h-3.5 w-3.5" />
              <span>إدارة الخدمات</span>
            </Link>
            <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100">
              <span>معاينة الموقع</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button onClick={() => { setEditingProject(null); setActionError(null); setPreviewImage(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-4 py-2.5 text-xs font-bold text-[#1a233a] shadow-sm transition hover:brightness-105">
              <Plus className="h-4 w-4" />
              <span>إضافة مشروع جديد</span>
            </button>
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100" title="تسجيل الخروج">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* بطاقات الإحصائيات */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">إجمالي المشاريع</span>
              <p className="text-2xl font-black text-[#1a233a]">{totalCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">تم التسليم بنجاح</span>
              <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">قيد التنفيذ</span>
              <p className="text-2xl font-black text-amber-600">{ongoingCount}</p>
            </div>
          </div>
        </section>

        {/* شريط البحث */}
        <section className="mt-8">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المشروع، التصنيف، أو المدينة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-4 pr-11 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
            />
          </div>
        </section>

        {/* جدول عرض المشاريع */}
        <section className="mt-6">
          {isLoadingData ? (
            <div className="flex h-64 items-center justify-center rounded-3xl bg-white ring-1 ring-gray-200/70">
              <Loader2 className="h-8 w-8 animate-spin text-[#c5a059]" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200/70">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold text-gray-500">
                    <tr>
                      <th className="py-4 px-6">المشروع</th>
                      <th className="py-4 px-6">التصنيف</th>
                      <th className="py-4 px-6">الموقع / المساحة</th>
                      <th className="py-4 px-6">الحالة</th>
                      <th className="py-4 px-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="transition hover:bg-gray-50/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              <Image src={project.image} alt={project.title} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-[#1a233a]">{project.title}</p>
                              <span className="text-xs text-gray-400">{project.completionYear ? `سنة ${project.completionYear}` : '—'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{project.category}</span>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-600">
                          <div>{project.location}</div>
                          <div className="text-gray-400">{project.area || '—'}</div>
                        </td>
                        <td className="py-4 px-6">
                          {project.status === 'ongoing' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                              <Clock className="h-3 w-3" /> قيد التنفيذ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" /> مكتمل
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => { setEditingProject(project); setPreviewImage(project.image); setActionError(null); setIsModalOpen(true); }} className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white" title="تعديل">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <Link href={`/projects/${project.slug}`} target="_blank" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition hover:bg-[#1a233a] hover:text-[#c5a059]" title="معاينة">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <button onClick={() => handleDelete(project.id, project.title)} disabled={deletingId === project.id} className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white" title="حذف">
                              {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <FolderGit2 className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-base font-bold text-[#1a233a]">لا توجد مشاريع مطابقة</h3>
            </div>
          )}
        </section>

        {/* النافذة المنبثقة لإضافة أو تعديل مشروع (تتضمن كافة الحقول) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <button onClick={() => setIsModalOpen(false)} className="absolute left-6 top-6 rounded-full bg-gray-100 p-2 text-gray-400 transition hover:text-[#1a233a]">
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-extrabold text-[#1a233a]">
                {editingProject ? 'تعديل بيانات المشروع' : 'إضافة مشروع جديد'}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {editingProject ? 'قم بتحديث التفاصيل وسيحفظ التغيير فوراً' : 'أدخل تفاصيل المشروع الجديد'}
              </p>

              {actionError && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs font-bold text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="mt-6 space-y-4">
                {/* عنوان المشروع */}
                <div>
                  <label className="block text-xs font-bold text-gray-700">عنوان المشروع *</label>
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={editingProject?.title || ''}
                    placeholder="مثال: تركيب مستودع سندوتش بانل عازل"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* التصنيف والموقع */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700">التصنيف *</label>
                    <select
                      name="category"
                      required
                      defaultValue={editingProject?.category || 'سندوتش بانل ومستودعات'}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                    >
                      <option value="سندوتش بانل ومستودعات">سندوتش بانل ومستودعات</option>
                      <option value="مظلات وسواتر">مظلات وسواتر</option>
                      <option value="بناء عام وترميم">بناء عام وترميم</option>
                      <option value="هياكل إنشائية وديكورات">هياكل إنشائية وديكورات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700">المدينة / الموقع *</label>
                    <input
                      name="location"
                      type="text"
                      required
                      defaultValue={editingProject?.location || 'جدة'}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                {/* المساحة، سنة التنفيذ، الحالة */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700">المساحة</label>
                    <input
                      name="area"
                      type="text"
                      defaultValue={editingProject?.area || ''}
                      placeholder="مثال: 1,500 م²"
                      className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700">سنة التنفيذ</label>
                    <input
                      name="completionYear"
                      type="text"
                      defaultValue={editingProject?.completionYear || new Date().getFullYear().toString()}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700">حالة المشروع</label>
                    <select
                      name="status"
                      defaultValue={editingProject?.status || 'completed'}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                    >
                      <option value="completed">مكتمل ومسلّم</option>
                      <option value="ongoing">قيد التنفيذ</option>
                    </select>
                  </div>
                </div>

                {/* وصف المشروع */}
                <div>
                  <label className="block text-xs font-bold text-gray-700">وصف المشروع *</label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    defaultValue={editingProject?.description || ''}
                    placeholder="اكتب نبذة هندسية عن تفاصيل العمل والمواصفات..."
                    className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* صورة المشروع */}
                <div>
                  <label className="block text-xs font-bold text-gray-700">
                    صورة المشروع {editingProject ? '(اختياري للاستبدال)' : '*'}
                  </label>
                  <div className="mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-4 transition hover:border-[#c5a059]">
                    {previewImage && (
                      <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl">
                        <Image src={previewImage} alt="معاينة" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null)
                            const input = document.getElementById('project-image-input') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                          className="absolute left-2 top-2 rounded-full bg-red-600 p-1.5 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <label className="flex w-full cursor-pointer flex-col items-center gap-2 text-center text-xs text-gray-500">
                      <Upload className="h-8 w-8 text-[#c5a059]" />
                      <span className="font-bold text-[#1a233a]">
                        {previewImage ? 'اضغط هنا لتغيير الصورة' : 'اضغط هنا لاختيار صورة المشروع'}
                      </span>
                      <input
                        id="project-image-input"
                        name="image"
                        type="file"
                        accept="image/*"
                        required={!editingProject && !previewImage}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setPreviewImage(URL.createObjectURL(file))
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* أزرار الحفظ والإلغاء */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-5 py-3 text-xs font-bold text-gray-600 transition hover:bg-gray-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-xl bg-[#1a233a] px-6 py-3 text-xs font-bold text-[#c5a059] shadow-md transition hover:bg-[#253252] disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <span>{editingProject ? 'حفظ التعديلات' : 'حفظ ونشر المشروع'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}