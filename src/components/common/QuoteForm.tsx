'use client'

import React, { useState, useTransition } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Send,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { submitQuoteRequest } from '@/app/actions/quote'

interface QuoteFormProps {
  serviceName?: string
}

const quoteSchema = z.object({
  name: z.string().trim().min(2, 'الاسم يجب أن يكون أكثر من حرفين').max(80, 'الاسم طويل جدًا'),
  phone: z.string().trim().regex(/^((\+?966)|0)?5\d{8}$/, 'يرجى إدخال رقم جوال سعودي صحيح مثل 05XXXXXXXX'),
  city: z.string().trim().min(2, 'يرجى اختيار المدينة'),
  notes: z.string().trim().max(1000, 'تفاصيل الطلب طويلة جدًا').optional().default(''),
})

type QuoteFormValues = {
  name: string
  phone: string
  city: string
  notes?: string
}

export default function QuoteForm({ serviceName = 'عام' }: QuoteFormProps) {
  const [city, setCity] = useState(siteConfig.mainCity || 'جدة')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: '',
      phone: '',
      city: city,
      notes: '',
    },
  })

  const handleCityChange = (value: string) => {
    setCity(value)
    setValue('city', value, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<QuoteFormValues> = (values) => {
    setErrorMessage(null)

    const formData = new FormData()
    formData.set('name', values.name)
    formData.set('phone', values.phone)
    formData.set('city', values.city)
    formData.set('notes', values.notes || '')
    formData.set('serviceName', serviceName)

    startTransition(async () => {
      const res = await submitQuoteRequest(formData)

      if (res.success && res.whatsappUrl) {
        setGeneratedUrl(res.whatsappUrl)
        setIsSubmitted(true)
        toast.success('تم تجهيز طلبك بنجاح')

        if (typeof window !== 'undefined' && res.whatsappUrl !== '#') {
          window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer')
        }
      } else {
        const message = res.error || 'حدث خطأ أثناء معالجة الطلب.'
        setErrorMessage(message)
        toast.error(message)
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center text-emerald-900 shadow-sm backdrop-blur-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-base font-bold">تم تجهيز طلبك بنجاح!</h4>
          <p className="mt-1 text-xs text-emerald-700">
            تم فتح محادثة الواتساب المباشرة لتأكيد المواصفات والأسعار الهندسية.
          </p>
        </div>

        <div className="pt-2">
          <a
            href={generatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#20bd5a]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>اضغط هنا لفتح الواتساب مباشرة</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right" dir="rtl">
      {/* 🛡️ 1. الحقل المخفي (Honeypot) لكشف وحجب البوتات التلقائية */}
      <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="confirm_email_hp">البريد التوكيدي</label>
        <input
          id="confirm_email_hp"
          type="text"
          name="confirm_email_hp"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label htmlFor="quote-name" className="block text-xs font-bold text-gray-700">
          الاسم الكريم <span className="text-red-500">*</span>
        </label>
        <input
          id="quote-name"
          type="text"
          maxLength={80}
          placeholder="مثال: م. فهد الحربي"
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name && (
          <p className="mt-1 text-[11px] font-medium text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quote-phone" className="block text-xs font-bold text-gray-700">
          رقم الجوال <span className="text-red-500">*</span>
        </label>
        <input
          id="quote-phone"
          type="tel"
          placeholder="05XXXXXXXX"
          dir="ltr"
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
        {errors.phone && (
          <p className="mt-1 text-[11px] font-medium text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quote-city" className="block text-xs font-bold text-gray-700">
          المدينة / المنطقة <span className="text-red-500">*</span>
        </label>
        <select
          id="quote-city"
          value={city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
        >
          {siteConfig.serviceAreas?.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          )) ?? <option value="جدة">جدة</option>}
          <option value="مدينة أخرى">مدينة أخرى داخل المملكة</option>
        </select>
        {errors.city && (
          <p className="mt-1 text-[11px] font-medium text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quote-notes" className="block text-xs font-bold text-gray-700">
          المواصفات المطلوبة أو المساحة التقديرية
        </label>
        <textarea
          id="quote-notes"
          rows={3}
          maxLength={1000}
          placeholder="مثال: توريد وتركيب مستودع 800 متر، سماكة عزل 7.5 سم..."
          className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20"
          {...register('notes')}
        />
        {errors.notes && (
          <p className="mt-1 text-[11px] font-medium text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#1a233a] to-[#243152] py-3 text-sm font-bold text-[#c5a059] shadow-md shadow-[#1a233a]/15 transition duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending || isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>جاري فحص وإعداد الطلب...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>إرسال الطلب وحساب التكلفة عبر الواتساب</span>
          </>
        )}
      </button>
    </form>
  )
}