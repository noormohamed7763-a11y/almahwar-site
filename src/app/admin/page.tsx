'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  LogOut,
  Upload,
  ImageIcon,
  FolderOpen,
} from 'lucide-react'
import { useProjects } from '@/context/ProjectsContext'
import { ProjectItem } from '@/types'

// مكتبة الصور الجاهزة في المشروع
const PRESET_GALLERY = [
  { label: 'مستودع سندوتش بانل 1', src: '/images/hero/sandwich-panel-1.jpg' },
  { label: 'مستودع سندوتش بانل 2', src: '/images/hero/sandwich-panel-2.jpg' },
  { label: 'مظلات مواقف 1', src: '/images/hero/canopy-1.jpg' },
  { label: 'مظلات وسواتر 2', src: '/images/hero/canopy-2.jpg' },
  { label: 'مستودع صناعي', src: '/images/projects/warehouse-1.jpg' },
  { label: 'مصنع متكامل', src: '/images/projects/warehouse-2.jpg' },
  { label: 'مظلات سيارات', src: '/images/projects/car-canopy-1.jpg' },
  { label: 'مظلات مداخل', src: '/images/projects/car-canopy-2.jpg' },
  { label: 'سواتر حدائق', src: '/images/projects/garden-1.jpg' },
  { label: 'استراحات ومسابح', src: '/images/projects/garden-2.jpg' },
]

const CATEGORIES = [
  'سندوتش بانل ومستودعات',
  'مظلات وسواتر',
  'بناء عام وترميم',
  'دهانات وديكورات',
  'أخرى',
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const { projects, addProject, updateProject, deleteProject } = useProjects()

  // حالة إضافة مشروع جديد
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState(PRESET_GALLERY[0].src)
  const [showGalleryModal, setShowGalleryModal] = useState(false)

  // حالة تعديل مشروع
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ProjectItem>>({})
  const [showEditGalleryModal, setShowEditGalleryModal] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  // تسجيل الخروج
  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' }).catch(() => {})
    router.push('/admin/login')
    router.refresh()
  }

  // رفع صورة من الجهاز وتحويلها إلى Base64
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing = false
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      if (isEditing) {
        setEditForm((prev) => ({ ...prev, image: result }))
      } else {
        setSelectedImage(result)
      }
    }
    reader.readAsDataURL(file)
  }

  // إرسال إضافة مشروع جديد
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      alert('يرجى ملء كافة الحقول')
      return
    }

    addProject({
      title: title.trim(),
      category,
      description: description.trim(),
      image: selectedImage,
    })

    setTitle('')
    setDescription('')
    alert('تمت إضافة المشروع بنجاح!')
  }

  // بدء التعديل
  const startEditing = (project: ProjectItem) => {
    setEditingId(project.id)
    setEditForm({ ...project })
  }

  // حفظ التعديل
  const saveEdit = (id: string) => {
    if (!editForm.title?.trim() || !editForm.description?.trim()) {
      alert('يرجى ملء كافة البيانات')
      return
    }
    updateProject(id, editForm)
    setEditingId(null)
    setEditForm({})
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* شريط رأس لوحة التحكم */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a233a] text-[#c5a059]">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1a233a]">لوحة تحكم المشاريع</h1>
              <p className="text-xs text-gray-500">إدارة وتحديث مشاريع شركة المحور الهندسي</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#c5a059]/10 px-3.5 py-1.5 text-xs font-bold text-[#c5a059]">
              المشاريع النشطة: {projects.length}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* نموذج إضافة مشروع جديد */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#1a233a]">
            <Plus className="h-5 w-5 text-[#c5a059]" />
            إضافة مشروع جديد
          </h2>

          <form onSubmit={handleAddSubmit} className="mt-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-gray-700">عنوان المشروع</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: توريد وتركيب مستودع صناعي"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">التصنيف</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c5a059]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* قسم اختيار ومعاينة الصورة */}
            <div>
              <label className="block text-xs font-bold text-gray-700">صورة المشروع</label>
              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* معاينة الصورة المحددة */}
                <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-2 ring-[#c5a059]/40">
                  <Image
                    src={selectedImage}
                    alt="معاينة الصورة"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* أزرار الاختيار والرفع */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1a233a] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#2c3e63]"
                  >
                    <FolderOpen className="h-4 w-4 text-[#c5a059]" />
                    اختيار من المعرض الجاهز
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 text-gray-500" />
                    رفع صورة من جهازك
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, false)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700">الوصف والمواصفات</label>
              <textarea
                rows={3}
                required
                placeholder="تفاصيل المشروع والمواصفات الهندسية المنفذة..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#c5a059]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#1a233a] py-3.5 text-sm font-bold text-[#c5a059] shadow-md transition hover:bg-[#1a233a]/90"
            >
              إضافة المشروع للمعرض
            </button>
          </form>
        </section>

        {/* قائمة المشاريع الحالية */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#1a233a]">المشاريع المتاحة حالياً ({projects.length})</h2>

          <div className="space-y-4">
            {projects.map((project) => {
              const isEditing = editingId === project.id

              return (
                <div
                  key={project.id}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
                >
                  {isEditing ? (
                    /* نموذج التعديل */
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold text-gray-600">العنوان</label>
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#c5a059]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-600">التصنيف</label>
                          <select
                            value={editForm.category || CATEGORIES[0]}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                            className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#c5a059]"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* تغيير الصورة أثناء التعديل */}
                      <div>
                        <label className="text-xs font-bold text-gray-600">تغيير الصورة</label>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-300">
                            <Image
                              src={editForm.image || project.image}
                              alt="معاينة"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowEditGalleryModal(true)}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200"
                          >
                            اختر من المعرض
                          </button>
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                          >
                            رفع صورة
                          </button>
                          <input
                            ref={editFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, true)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-600">الوصف</label>
                        <textarea
                          rows={2}
                          value={editForm.description || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:border-[#c5a059]"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => saveEdit(project.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          <Check className="h-4 w-4" /> حفظ التعديل
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
                        >
                          <X className="h-4 w-4" /> إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* العرض الافتراضي للبطاقة */
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        {/* صورة مصغرة للمشروع */}
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-gray-200">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#1a233a]">{project.title}</h3>
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                              {project.category}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => startEditing(project)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/10 px-3.5 py-2 text-xs font-bold text-[#c5a059] transition hover:bg-[#c5a059] hover:text-[#1a233a]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف مشروع "${project.title}"؟`)) {
                              deleteProject(project.id)
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

      </div>

      {/* نافذة اختيار الصورة من المعرض (لإضافة مشروع جديد) */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="flex items-center gap-2 font-bold text-[#1a233a]">
                <ImageIcon className="h-5 w-5 text-[#c5a059]" />
                اختر صورة من معرض المشروع
              </h3>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {PRESET_GALLERY.map((item) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => {
                    setSelectedImage(item.src)
                    setShowGalleryModal(false)
                  }}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border-2 p-1.5 text-right transition ${
                    selectedImage === item.src
                      ? 'border-[#c5a059] bg-[#c5a059]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-2 text-xs font-bold text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* نافذة اختيار الصورة من المعرض (أثناء التعديل) */}
      {showEditGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-[#1a233a]">تغيير صورة المشروع من المعرض</h3>
              <button
                onClick={() => setShowEditGalleryModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {PRESET_GALLERY.map((item) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => {
                    setEditForm((prev) => ({ ...prev, image: item.src }))
                    setShowEditGalleryModal(false)
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-gray-200 p-1.5 text-right transition hover:border-[#c5a059]"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="mt-2 text-xs font-bold text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}