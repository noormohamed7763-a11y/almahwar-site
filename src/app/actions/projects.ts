"use server";

import { prisma } from "@/lib/prisma";
import { uploadProjectImage } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { validateImageFile } from "@/lib/validation/image";
import { projectRepository } from "@/lib/projectsRepository";
import { slugify, ensureUniqueSlug } from "@/utils/slug";

/** رد موحّد لرفض الطلبات غير المصرَّح بها */
const UNAUTHORIZED = {
  success: false as const,
  error: "غير مصرَّح لك بتنفيذ هذه العملية. يرجى تسجيل الدخول.",
};

// دالة جلب كافة المشاريع
export async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// دالة إنشاء مشروع جديد مع معالجة رفع الصورة وتثبيت الـ Slug
export async function createProject(formData: FormData) {
  // حارس الصلاحيات أولاً — قبل أي قراءة للمدخلات أو لمس لقاعدة البيانات
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const location = (formData.get("location") as string) || "جدة";
    const area = formData.get("area") as string;
    const completionYear = formData.get("completionYear") as string;

    const rawStatus = (formData.get("status") as string) || "completed";
    const status = rawStatus as ProjectStatus;

    const description = formData.get("description") as string;

    if (!title || !category || !description) {
      return { success: false, error: "جميع الحقول الإلزامية مطلوبة" };
    }

    const imageFile = formData.get("image");
    if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
      return { success: false, error: "صورة المشروع إلزامية" };
    }

    // التحقق من الصورة عبر بايتاتها الفعلية قبل رفعها
    const validation = await validateImageFile(imageFile);
    if (!validation.ok) {
      return { success: false, error: validation.error };
    }

    // رفع الصورة إلى Supabase Storage بالنوع المُستنتج لا المُعلَن
    const imageUrl = await uploadProjectImage(validation.value);

    // توليد slug فريد ونظيف يدعم العربية والإنجليزية (مرة واحدة فقط عند الإنشاء)
    const existingSlugs = await projectRepository.getAllSlugs();
    const slug = ensureUniqueSlug(slugify(title), existingSlugs);

    // حفظ بيانات المشروع في قاعدة البيانات
    const project = await prisma.project.create({
      data: {
        slug,
        title,
        category,
        location,
        area: area || null,
        completionYear: completionYear || null,
        status,
        description,
        image: imageUrl,
      },
    });

    // تحديث الكاش لصفحة المشاريع والصفحة الرئيسية وصفحة التفاصيل
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, project };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "فشل في حفظ المشروع";
    console.error("Create project error:", error);
    return { success: false, error: errorMessage };
  }
}

// دالة تحديث مشروع موجود (مع الحفاظ على ثبات الـ Slug وعدم تغييره لمنع ظهور 404)
export async function updateProject(id: string, formData: FormData) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const location = (formData.get("location") as string) || "جدة";
    const area = formData.get("area") as string;
    const completionYear = formData.get("completionYear") as string;

    const rawStatus = (formData.get("status") as string) || "completed";
    const status = rawStatus as ProjectStatus;

    const description = formData.get("description") as string;
    const imageFile = formData.get("image");

    if (!title || !category || !description) {
      return { success: false, error: "الحقول الإلزامية مطلوبة" };
    }

    let imageUrl: string | undefined = undefined;

    // الصورة اختيارية عند التعديل — لكن إن أُرسلت فتُتحقَّق بنفس الصرامة
    if (imageFile instanceof File && imageFile.size > 0) {
      const validation = await validateImageFile(imageFile);
      if (!validation.ok) {
        return { success: false, error: validation.error };
      }
      imageUrl = await uploadProjectImage(validation.value);
    }

    // تحديث البيانات في قاعدة البيانات مع الحفاظ على ثبات الـ slug الأصلي للمشروع
    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        category,
        location,
        area: area || null,
        completionYear: completionYear || null,
        status,
        description,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, project };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "فشل في تحديث المشروع";
    console.error("Update project error:", error);
    return { success: false, error: errorMessage };
  }
}

// دالة حذف مشروع
export async function deleteProject(id: string) {
  if (!(await requireAdmin())) return UNAUTHORIZED;

  try {
    const deleted = await prisma.project.delete({
      where: { id },
      select: { slug: true },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${deleted.slug}`);
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "فشل في حذف المشروع";
    return { success: false, error: errorMessage };
  }
}