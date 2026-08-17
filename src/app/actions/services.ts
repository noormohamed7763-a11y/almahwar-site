"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { uploadServiceImage, deleteStoredImage } from "@/lib/supabase";
import { validateImageFile } from "@/lib/validation/image";
import { isServiceIconName } from "@/lib/serviceIcons";
import {
  buildUniqueServiceSlug,
  nextServiceSortOrder,
} from "@/lib/servicesRepository";

/** رد موحّد لرفض الطلبات غير المصرَّح بها */
const UNAUTHORIZED = {
  success: false as const,
  error: "غير مصرَّح لك بتنفيذ هذه العملية. يرجى تسجيل الدخول.",
};

/** حدود أطوال النصوص — الأعمدة نوعها TEXT بلا سقف في القاعدة */
const MAX_TITLE = 120;
const MAX_DESCRIPTION = 4000;
const MAX_CAPTION = 500;

/**
 * تحديث الكاش لكل ما يعرض الخدمات.
 *
 * القائمة أطول من المتوقع لأن الخدمات تظهر في التذييل والبيانات المنظّمة
 * على كل صفحة، لا في /services وحدها.
 */
function revalidateServiceViews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
  revalidatePath("/admin/services");
  revalidatePath("/sitemap.xml");
}

/** قراءة نص من النموذج مع تقليم وفحص الطول */
function readText(
  formData: FormData,
  field: string,
  max: number,
): { ok: true; value: string } | { ok: false; error: string } {
  const raw = formData.get(field);
  const value = typeof raw === "string" ? raw.trim() : "";

  if (value.length > max) {
    return {
      ok: false,
      error: `الحقل يتجاوز الحد المسموح (${max} حرفاً).`,
    };
  }

  return { ok: true, value };
}

// ── الخدمات ──────────────────────────────────────────────────────

export async function createService(formData: FormData) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const title = readText(formData, "title", MAX_TITLE);
    if (!title.ok) return { success: false, error: title.error };

    const description = readText(formData, "description", MAX_DESCRIPTION);
    if (!description.ok) return { success: false, error: description.error };

    if (!title.value || !description.value) {
      return { success: false, error: "عنوان الخدمة ووصفها إلزاميان" };
    }

    // اسم الأيقونة يُقبل فقط إن كان من الأسماء المعروفة
    const rawIcon = formData.get("icon");
    const icon = isServiceIconName(rawIcon) ? rawIcon : null;

    const isPublished = formData.get("isPublished") !== "false";

    const slug = await buildUniqueServiceSlug(title.value);
    const sortOrder = await nextServiceSortOrder();

    const service = await prisma.service.create({
      data: {
        title: title.value,
        slug,
        description: description.value,
        icon,
        isPublished,
        sortOrder,
      },
    });

    // رفع صورة أولية إن وُجدت أثناء إضافة الخدمة
    const imageFile = formData.get("image");
    const captionRaw = formData.get("imageCaption");
    const captionText = typeof captionRaw === "string" ? captionRaw.trim() : "";

    if (imageFile instanceof File && imageFile.size > 0) {
      const validation = await validateImageFile(imageFile);
      if (validation.ok) {
        const url = await uploadServiceImage(validation.value);
        await prisma.serviceImage.create({
          data: {
            serviceId: service.id,
            url,
            caption: captionText || null,
            sortOrder: 0,
          },
        });
      }
    }

    revalidateServiceViews(slug);
    return { success: true, serviceId: service.id };
  } catch (error) {
    console.error("Create service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في حفظ الخدمة",
    };
  }
}

export async function updateService(id: string, formData: FormData) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const existing = await prisma.service.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!existing) return { success: false, error: "الخدمة غير موجودة" };

    const title = readText(formData, "title", MAX_TITLE);
    if (!title.ok) return { success: false, error: title.error };

    const description = readText(formData, "description", MAX_DESCRIPTION);
    if (!description.ok) return { success: false, error: description.error };

    if (!title.value || !description.value) {
      return { success: false, error: "عنوان الخدمة ووصفها إلزاميان" };
    }

    const rawIcon = formData.get("icon");
    const icon = isServiceIconName(rawIcon) ? rawIcon : null;

    const isPublished = formData.get("isPublished") !== "false";

    const rawSortOrder = formData.get("sortOrder");
    const parsedSortOrder = Number(rawSortOrder);
    const sortOrder = Number.isFinite(parsedSortOrder)
      ? Math.trunc(parsedSortOrder)
      : undefined;

    // الـ slug يبقى ثابتاً عند التعديل: تغييره يكسر الروابط المفهرسة
    // في جوجل ويُنتج 404 لكل من حفظ الرابط القديم
    const service = await prisma.service.update({
      where: { id },
      data: {
        title: title.value,
        description: description.value,
        icon,
        isPublished,
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    revalidateServiceViews(service.slug);
    return { success: true };
  } catch (error) {
    console.error("Update service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في تحديث الخدمة",
    };
  }
}

export async function deleteService(id: string) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    // تُقرأ روابط الصور قبل الحذف: بعد الحذف التعاقبي تختفي الصفوف
    // فلا يبقى أي مرجع للملفات في التخزين
    const service = await prisma.service.findUnique({
      where: { id },
      select: { slug: true, images: { select: { url: true } } },
    });
    if (!service) return { success: false, error: "الخدمة غير موجودة" };

    await prisma.service.delete({ where: { id } });

    // تنظيف التخزين بعد نجاح حذف السجل — أفضل جهد لا يُفشل العملية
    await Promise.all(service.images.map((img) => deleteStoredImage(img.url)));

    revalidateServiceViews(service.slug);
    return { success: true };
  } catch (error) {
    console.error("Delete service error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في حذف الخدمة",
    };
  }
}

// ── صور الخدمات ──────────────────────────────────────────────────

export async function addServiceImage(serviceId: string, formData: FormData) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { slug: true },
    });
    if (!service) return { success: false, error: "الخدمة غير موجودة" };

    const caption = readText(formData, "caption", MAX_CAPTION);
    if (!caption.ok) return { success: false, error: caption.error };

    const imageFile = formData.get("image");
    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return { success: false, error: "يجب اختيار صورة" };
    }

    // التحقق من الصورة عبر بايتاتها الفعلية قبل رفعها
    const validation = await validateImageFile(imageFile);
    if (!validation.ok) {
      return { success: false, error: validation.error };
    }

    const url = await uploadServiceImage(validation.value);

    // الصورة الجديدة تذهب إلى آخر المعرض
    const last = await prisma.serviceImage.findFirst({
      where: { serviceId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.serviceImage.create({
      data: {
        serviceId,
        url,
        caption: caption.value || null,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    revalidateServiceViews(service.slug);
    return { success: true };
  } catch (error) {
    console.error("Add service image error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في رفع الصورة",
    };
  }
}

export async function updateServiceImageCaption(
  imageId: string,
  caption: string,
) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const trimmed = caption.trim();
    if (trimmed.length > MAX_CAPTION) {
      return {
        success: false,
        error: `الوصف يتجاوز الحد المسموح (${MAX_CAPTION} حرفاً).`,
      };
    }

    const image = await prisma.serviceImage.update({
      where: { id: imageId },
      data: { caption: trimmed || null },
      select: { service: { select: { slug: true } } },
    });

    revalidateServiceViews(image.service.slug);
    return { success: true };
  } catch (error) {
    console.error("Update caption error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في تحديث الوصف",
    };
  }
}

export async function deleteServiceImage(imageId: string) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const image = await prisma.serviceImage.delete({
      where: { id: imageId },
      select: { url: true, service: { select: { slug: true } } },
    });

    await deleteStoredImage(image.url);

    revalidateServiceViews(image.service.slug);
    return { success: true };
  } catch (error) {
    console.error("Delete service image error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في حذف الصورة",
    };
  }
}

/**
 * تحريك صورة خطوة واحدة داخل المعرض.
 *
 * يبادل قيمتي sortOrder داخل معاملة واحدة: بدونها كان يمكن أن تُحدَّث
 * صورة وتفشل الأخرى فيبقى المعرض بترتيب مكرر أو ناقص.
 */
export async function moveServiceImage(
  imageId: string,
  direction: "up" | "down",
) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const current = await prisma.serviceImage.findUnique({
      where: { id: imageId },
      select: {
        id: true,
        serviceId: true,
        sortOrder: true,
        service: { select: { slug: true } },
      },
    });
    if (!current) return { success: false, error: "الصورة غير موجودة" };

    const neighbour = await prisma.serviceImage.findFirst({
      where: {
        serviceId: current.serviceId,
        sortOrder:
          direction === "up"
            ? { lt: current.sortOrder }
            : { gt: current.sortOrder },
      },
      orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
      select: { id: true, sortOrder: true },
    });

    // في طرف القائمة لا يوجد جار — ليس خطأً، لا شيء يُنقل
    if (!neighbour) return { success: true };

    await prisma.$transaction([
      prisma.serviceImage.update({
        where: { id: current.id },
        data: { sortOrder: neighbour.sortOrder },
      }),
      prisma.serviceImage.update({
        where: { id: neighbour.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    revalidateServiceViews(current.service.slug);
    return { success: true };
  } catch (error) {
    console.error("Move service image error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "فشل في نقل الصورة",
    };
  }
}
