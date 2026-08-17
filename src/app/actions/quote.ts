"use server"

import { headers } from "next/headers"
import { getContactFormWhatsAppUrl } from "@/utils/whatsapp"
import {
  checkRateLimit,
  recordFailure,
  PUBLIC_FORM_RATE_LIMIT,
} from "@/lib/security/rate-limit"

export interface QuoteActionResponse {
  success: boolean
  whatsappUrl?: string
  error?: string
  retryAfterSeconds?: number
}

/**
 * تعبير نمطي للتحقق من صحة رقم الجوال في المملكة العربية السعودية
 * يقبل الأشكال: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX, 9665XXXXXXXX
 */
const SAUDI_PHONE_REGEX = /^(?:(?:\+?966)|0)?5[0-9]{8}$/

export async function submitQuoteRequest(
  formData: FormData
): Promise<QuoteActionResponse> {
  // 1. حماية الحقل المخفي (Honeypot): إذا تمت تعبئته من قِبل البوت تُرفض العملية خفية
  const honeypot = formData.get("confirm_email_hp")
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    console.warn("[أمان البوتات] تم رصد محاولة سبام عبر الحقل المخفي Honeypot")
    return {
      success: true,
      whatsappUrl: "#",
    }
  }

  // 2. استخراج عنوان IP وحساب تقييد معدل الطلبات (Rate Limit)
  let clientIp = "unknown"
  try {
    const headerList = await headers()
    const forwarded = headerList.get("x-forwarded-for")
    if (forwarded) {
      clientIp = forwarded.split(",")[0]?.trim() || "unknown"
    } else {
      clientIp = headerList.get("x-real-ip")?.trim() || "unknown"
    }
  } catch (err) {
    console.error("تعذر قراءة ترويسات IP من الخادم:", err)
  }

  const rateLimitKey = `quote-form:${clientIp}`
  const limit = checkRateLimit(rateLimitKey, PUBLIC_FORM_RATE_LIMIT)

  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60)
    return {
      success: false,
      error: `تم تجاوز عدد محاولات إرسال الطلبات المسموح بها. يرجى الانتظار ${minutes} دقيقة قبل المحاولة مجدداً.`,
      retryAfterSeconds: limit.retryAfterSeconds,
    }
  }

  // 3. قراءة وتنقية المدخلات
  const rawName = formData.get("name")
  const rawPhone = formData.get("phone")
  const rawCity = formData.get("city")
  const rawNotes = formData.get("notes")
  const rawService = formData.get("serviceName")

  const name = typeof rawName === "string" ? rawName.trim() : ""
  const phone = typeof rawPhone === "string" ? rawPhone.trim() : ""
  const city = typeof rawCity === "string" ? rawCity.trim() : "جدة"
  const notes = typeof rawNotes === "string" ? rawNotes.trim() : ""
  const serviceName = typeof rawService === "string" ? rawService.trim() : "عام"

  // 4. التحقق الصارم من الصحة والأطوال
  if (!name || name.length < 2) {
    return {
      success: false,
      error: "يرجى كتابة الاسم بشكل صحيح (حرفين على الأقل).",
    }
  }
  if (name.length > 80) {
    return {
      success: false,
      error: "الاسم يتجاوز الحد المسموح به (80 حرفاً).",
    }
  }

  if (!phone) {
    return {
      success: false,
      error: "يرجى إدخال رقم الجوال.",
    }
  }

  // تنظيف الرموز الشائعة قبل الفحص النمطي
  const cleanPhoneDigits = phone.replace(/[\s\-\(\)]/g, "")
  if (!SAUDI_PHONE_REGEX.test(cleanPhoneDigits)) {
    recordFailure(rateLimitKey, PUBLIC_FORM_RATE_LIMIT)
    return {
      success: false,
      error: "يرجى إدخال رقم جوال سعودي صحيح (مثال: 05XXXXXXXX).",
    }
  }

  if (notes.length > 1000) {
    return {
      success: false,
      error: "تفاصيل الطلب تتجاوز الحد المسموح به (1000 حرف).",
    }
  }

  // 5. توليد رابط الواتساب بنجاح وتسجيل الطلب في تقييد المعدل
  const details = notes
    ? `المدينة: ${city}\nالملاحظات والمواصفات: ${notes}`
    : `المدينة: ${city}`

  try {
    const whatsappUrl = getContactFormWhatsAppUrl(
      name,
      phone,
      serviceName,
      details
    )

    // احتساب الطلب الناجح ضمن النافذة لتقييد الإغراق المتكرر
    recordFailure(rateLimitKey, PUBLIC_FORM_RATE_LIMIT)

    return {
      success: true,
      whatsappUrl,
    }
  } catch (err) {
    console.error("خطأ في معالجة طلب عرض السعر:", err)
    return {
      success: false,
      error: "حدث خطأ أثناء إعداد رابط الواتساب، يرجى المحاولة لاحقاً.",
    }
  }
}
