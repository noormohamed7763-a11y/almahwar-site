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
  ArrowRight,
  Loader2,
  Upload,
  AlertCircle,
  X,
  Wrench,
  Eye,
  EyeOff,
  ImagePlus,
  ChevronUp,
  ChevronDown,
  Images,
} from 'lucide-react'
import type { ServiceAdminItem } from '@/lib/servicesRepository'
import { SERVICE_ICON_NAMES } from '@/lib/serviceIcons'
import ServiceIcon from '@/components/common/ServiceIcon'
import {
  createService,
  updateService,
  deleteService,
  addServiceImage,
  deleteServiceImage,
  moveServiceImage,
  updateServiceImageCaption,
} from '@/app/actions/services'

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<ServiceAdminItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceAdminItem | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  // معرض الصور: الخدمة المفتوحة حالياً
  const [galleryServiceId, setGalleryServiceId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [galleryError, setGalleryError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/services', { cache: 'no-store' })
      if (res.status === 401) {
        router.replace('/admin/login')
        return
      }
      const data = await res.json()
      if (data.services) setServices(data.services)
    } catch {
      console.error('Failed to load services')
    } finally {
      setIsLoadingData(false)
    }
  }, [router])

  // التحميل الأولي منفصل عن fetchServices: استدعاء دالة تُحدِّث الحالة
  // مباشرةً داخل الـ effect يخالف قاعدة react-hooks/set-state-in-effect،
  // و isMounted يمنع الكتابة على مكوّن أُلغي قبل وصول الرد
  useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      try {
        const res = await fetch('/api/admin/services', { cache: 'no-store' })
        if (res.status === 401) {
          router.replace('/admin/login')
          return
        }
        const data = await res.json()
        if (isMounted && data.services) setServices(data.services)
      } catch {
        console.error('Failed to load services')
      } finally {
        if (isMounted) setIsLoadingData(false)
      }
    }

    loadInitialData()
    return () => {
      isMounted = false
    }
  }, [router])

  const galleryService = services.find((s) => s.id === galleryServiceId) ?? null

  const handleSubmitService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setActionError(null)

    const formElement = e.currentTarget
    const formData = new FormData(formElement)

    startTransition(async () => {
      const res = editingService
        ? await updateService(editingService.id, formData)
        : await createService(formData)

      if (res.success) {
        setIsModalOpen(false)
        setEditingService(null)
        formElement.reset()
        await fetchServices()
        router.refresh()
        
        // فتح معرض الصور فوراً للخدمة الجديدة ليتمكن من رفع الصور من جهازه مباشرة
        if (!editingService && 'serviceId' in res && res.serviceId) {
          setGalleryServiceId(res.serviceId as string)
        }
      } else {
        setActionError(res.error || 'فشل حفظ الخدمة')
      }
    })
  }

  const handleDeleteService = async (service: ServiceAdminItem) => {
    const imagesNote =
      service.images.length > 0
        ? `\nسيُحذف معها ${service.images.length} صورة من المعرض.`
        : ''
    if (!confirm(`حذف خدمة "${service.title}" نهائياً؟${imagesNote}`)) return

    setBusyId(service.id)
    try {
      const res = await deleteService(service.id)
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== service.id))
        if (galleryServiceId === service.id) setGalleryServiceId(null)
        router.refresh()
      } else {
        alert(res.error || 'فشل حذف الخدمة')
      }
    } finally {
      setBusyId(null)
    }
  }

  const handleTogglePublish = async (service: ServiceAdminItem) => {
    setBusyId(service.id)
    try {
      const formData = new FormData()
      formData.set('title', service.title)
      formData.set('description', service.description)
      formData.set('icon', service.icon ?? '')
      formData.set('sortOrder', String(service.sortOrder))
      formData.set('isPublished', service.isPublished ? 'false' : 'true')

      const res = await updateService(service.id, formData)
      if (res.success) {
        await fetchServices()
        router.refresh()
      } else {
        alert(res.error || 'فشل تحديث حالة النشر')
      }
    } finally {
      setBusyId(null)
    }
  }

  const handleAddImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!galleryServiceId) return
    setGalleryError(null)

    const formElement = e.currentTarget
    const formData = new FormData(formElement)

    startTransition(async () => {
      const res = await addServiceImage(galleryServiceId, formData)
      if (res.success) {
        formElement.reset()
        setImagePreview(null)
        await fetchServices()
        router.refresh()
      } else {
        setGalleryError(res.error || 'فشل رفع الصورة')
      }
    })
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('حذف هذه الصورة نهائياً؟')) return
    setBusyId(imageId)
    try {
      const res = await deleteServiceImage(imageId)
      if (res.success) {
        await fetchServices()
        router.refresh()
      } else {
        alert(res.error || 'فشل حذف الصورة')
      }
    } finally {
      setBusyId(null)
    }
  }

  const handleMoveImage = async (imageId: string, direction: 'up' | 'down') => {
    setBusyId(imageId)
    try {
      const res = await moveServiceImage(imageId, direction)
      if (res.success) {
        await fetchServices()
        router.refresh()
      } else {
        alert(res.error || 'فشل نقل الصورة')
      }
    } finally {
      setBusyId(null)
    }
  }

  const handleSaveCaption = async (imageId: string, caption: string) => {
    setBusyId(imageId)
    try {
      const res = await updateServiceImageCaption(imageId, caption)
      if (res.success) {
        await fetchServices()
        router.refresh()
      } else {
        alert(res.error || 'فشل تحديث الوصف')
      }
    } finally {
      setBusyId(null)
    }
  }

  const publishedCount = services.filter((s) => s.isPublished).length
  const totalImages = services.reduce((sum, s) => sum + s.images.length, 0)

  return (
    <main className="min-h-screen bg-[#f8fafc] py-10" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a233a] text-[#c5a059]">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#1a233a]">لوحة تحكم الخدمات</h1>
              <p className="text-xs text-gray-500">
                {services.length} خدمة · {publishedCount} منشورة · {totalImages} صورة
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>لوحة المشاريع</span>
            </Link>
            <button
              onClick={() => {
                setEditingService(null)
                setActionError(null)
                setIsModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-4 py-2.5 text-xs font-bold text-[#1a233a] shadow-sm transition hover:brightness-105"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة خدمة</span>
            </button>
          </div>
        </header>

        {/* جدول الخدمات */}
        <section className="mt-8">
          {isLoadingData ? (
            <div className="flex h-64 items-center justify-center rounded-3xl bg-white ring-1 ring-gray-200/70">
              <Loader2 className="h-8 w-8 animate-spin text-[#c5a059]" />
            </div>
          ) : services.length > 0 ? (
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200/70">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold text-gray-500">
                    <tr>
                      <th className="py-4 px-6">الخدمة</th>
                      <th className="py-4 px-6">الترتيب</th>
                      <th className="py-4 px-6">المعرض</th>
                      <th className="py-4 px-6">الحالة</th>
                      <th className="py-4 px-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {services.map((service) => (
                      <tr key={service.id} className="transition hover:bg-gray-50/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a233a] text-[#c5a059]">
                              <ServiceIcon name={service.icon} className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#1a233a]">{service.title}</p>
                              <span className="text-xs text-gray-400" dir="ltr">
                                /{service.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs font-bold text-gray-600">
                          {service.sortOrder}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => {
                              setGalleryServiceId(service.id)
                              setGalleryError(null)
                              setImagePreview(null)
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 transition hover:bg-[#1a233a] hover:text-[#c5a059]"
                          >
                            <Images className="h-3.5 w-3.5" />
                            {service.images.length} صورة
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleTogglePublish(service)}
                            disabled={busyId === service.id}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition disabled:opacity-50 ${
                              service.isPublished
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                            title={service.isPublished ? 'إخفاء من الموقع' : 'نشر على الموقع'}
                          >
                            {busyId === service.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : service.isPublished ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                            {service.isPublished ? 'منشورة' : 'مخفية'}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingService(service)
                                setActionError(null)
                                setIsModalOpen(true)
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                              title="تعديل"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/services/${service.slug}`}
                              target="_blank"
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition hover:bg-[#1a233a] hover:text-[#c5a059]"
                              title="معاينة"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteService(service)}
                              disabled={busyId === service.id}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                              title="حذف"
                            >
                              {busyId === service.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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
              <Wrench className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-base font-bold text-[#1a233a]">لا توجد خدمات بعد</h3>
              <p className="mt-2 text-sm text-gray-500">
                أضف أول خدمة، أو شغّل <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">npx prisma db seed</code> لإدخال الخدمات الأساسية.
              </p>
            </div>
          )}
        </section>

        {/* نافذة إضافة / تعديل خدمة */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute left-6 top-6 rounded-full bg-gray-100 p-2 text-gray-400 transition hover:text-[#1a233a]"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-extrabold text-[#1a233a]">
                {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {editingService
                  ? `الرابط ثابت ولا يتغير: /services/${editingService.slug}`
                  : 'الرابط يُولَّد تلقائياً من العنوان'}
              </p>

              {actionError && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs font-bold text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitService} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">عنوان الخدمة *</label>
                  <input
                    name="title"
                    type="text"
                    required
                    maxLength={120}
                    defaultValue={editingService?.title || ''}
                    placeholder="مثال: السندوتش بانل"
                    className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700">الأيقونة</label>
                    <select
                      name="icon"
                      defaultValue={editingService?.icon || 'Wrench'}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                    >
                      {SERVICE_ICON_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700">الترتيب</label>
                    <input
                      name="sortOrder"
                      type="number"
                      min={0}
                      defaultValue={editingService?.sortOrder ?? 0}
                      disabled={!editingService}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059] disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700">وصف الخدمة *</label>
                  <textarea
                    name="description"
                    rows={5}
                    required
                    maxLength={4000}
                    defaultValue={editingService?.description || ''}
                    placeholder="اكتب وصفاً تفصيلياً للخدمة والمواصفات الفنية..."
                    className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* صورة الخدمة والشرح الفني الأول */}
                {!editingService && (
                  <div className="space-y-3 rounded-2xl border-2 border-dashed border-gray-200 p-4">
                    <label className="block text-xs font-bold text-[#1a233a]">
                      صورة الخدمة الأولى (اختياري — ارفع من جهازك مباشرة)
                    </label>

                    {imagePreview && (
                      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gray-100">
                        <Image src={imagePreview} alt="معاينة" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            const input = document.getElementById('service-initial-image') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                          className="absolute left-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <label className="flex cursor-pointer flex-col items-center gap-2 text-center text-xs text-gray-500">
                      <Upload className="h-7 w-7 text-[#c5a059]" />
                      <span className="font-bold text-[#1a233a]">
                        {imagePreview ? 'اضغط هنا لتغيير الصورة المحددة' : 'اضغط هنا لاختيار صورة الخدمة من جهازك'}
                      </span>
                      <span>JPG أو PNG أو WebP أو AVIF — بحد أقصى 5 ميجابايت</span>
                      <input
                        id="service-initial-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          setImagePreview(file ? URL.createObjectURL(file) : null)
                        }}
                      />
                    </label>

                    <input
                      name="imageCaption"
                      type="text"
                      maxLength={500}
                      placeholder="الشرح الفني للصورة (اختياري — مثال: ألواح الأسقف Roof Panels...)"
                      className="w-full rounded-xl border border-gray-200 p-3 text-xs outline-none focus:border-[#c5a059]"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2.5 rounded-xl bg-gray-50 p-3.5">
                  <input
                    name="isPublished"
                    type="checkbox"
                    value="true"
                    defaultChecked={editingService?.isPublished ?? true}
                    className="h-4 w-4 rounded border-gray-300 accent-[#c5a059]"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    منشورة وظاهرة في الموقع
                  </span>
                </label>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
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
                      <span>{editingService ? 'حفظ التعديلات' : 'حفظ الخدمة'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* نافذة معرض صور الخدمة */}
        {galleryService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <button
                onClick={() => setGalleryServiceId(null)}
                className="absolute left-6 top-6 rounded-full bg-gray-100 p-2 text-gray-400 transition hover:text-[#1a233a]"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-extrabold text-[#1a233a]">
                معرض صور: {galleryService.title}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                الوصف يظهر تحت الصورة في صفحة الخدمة. الترتيب هو ترتيب العرض.
              </p>

              {galleryError && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs font-bold text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{galleryError}</span>
                </div>
              )}

              {/* نموذج إضافة صورة */}
              <form
                onSubmit={handleAddImage}
                className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 p-4"
              >
                {imagePreview && (
                  <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl">
                    <Image src={imagePreview} alt="معاينة" fill className="object-cover" />
                  </div>
                )}

                <label className="flex cursor-pointer flex-col items-center gap-2 text-center text-xs text-gray-500">
                  <Upload className="h-7 w-7 text-[#c5a059]" />
                  <span className="font-bold text-[#1a233a]">
                    {imagePreview ? 'اضغط لتغيير الصورة' : 'اختر صورة لإضافتها للمعرض'}
                  </span>
                  <span>JPG أو PNG أو WebP أو AVIF — بحد أقصى 5 ميجابايت</span>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      setImagePreview(file ? URL.createObjectURL(file) : null)
                    }}
                  />
                </label>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <textarea
                    name="caption"
                    rows={2}
                    maxLength={500}
                    placeholder="وصف الشرح والشروط الفنية للصورة (مثال: ألواح الأسقف Roof Panels: تأتي الطبقة المعدنية الخارجية بشكل مضلع بارز...)"
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs outline-none focus:border-[#c5a059] resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1a233a] px-5 py-3 text-xs font-bold text-[#c5a059] transition hover:bg-[#253252] disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    <span>رفع الصورة</span>
                  </button>
                </div>
              </form>

              {/* الصور الحالية */}
              {galleryService.images.length > 0 ? (
                <ul className="mt-6 space-y-3">
                  {galleryService.images.map((img, index) => (
                    <li
                      key={img.id}
                      className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-3 sm:flex-row sm:items-center"
                    >
                      <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-28">
                        <Image
                          src={img.url}
                          alt={img.caption || galleryService.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>

                      <textarea
                        rows={2}
                        defaultValue={img.caption || ''}
                        maxLength={500}
                        placeholder="وصف الشرح الفني للصورة"
                        onBlur={(e) => {
                          const next = e.target.value.trim()
                          if (next !== (img.caption || '')) {
                            handleSaveCaption(img.id, next)
                          }
                        }}
                        className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-[#c5a059] resize-none"
                      />

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() => handleMoveImage(img.id, 'up')}
                          disabled={index === 0 || busyId === img.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition hover:bg-gray-200 disabled:opacity-30"
                          title="أعلى"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveImage(img.id, 'down')}
                          disabled={
                            index === galleryService.images.length - 1 || busyId === img.id
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition hover:bg-gray-200 disabled:opacity-30"
                          title="أسفل"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          disabled={busyId === img.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                          title="حذف"
                        >
                          {busyId === img.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-xs text-gray-500">
                  لا توجد صور في هذا المعرض بعد — قسم «معرض أعمال وتنفيذ الخدمة» لن
                  يظهر في صفحة الخدمة حتى تُضاف أول صورة.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
