"use server";

import { prisma } from "@/lib/prisma";
import { uploadProjectImage } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";

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

// دالة إنشاء مشروع جديد مع معالجة رفع الصورة
export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const location = (formData.get("location") as string) || "جدة";
    const area = formData.get("area") as string;
    const completionYear = formData.get("completionYear") as string;
    
    const rawStatus = (formData.get("status") as string) || "completed";
    const status = rawStatus as ProjectStatus;

    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    if (!title || !category || !description || !imageFile) {
      return { success: false, error: "جميع الحقول الإلزامية مطلوبة" };
    }

    // رفع الصورة إلى Supabase Storage
    const imageBytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageBytes);
    const imageUrl = await uploadProjectImage(
      buffer,
      imageFile.name,
      imageFile.type
    );

    // توليد slug فريد
    const slug = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

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

    // تحديث الكاش لصفحة المشاريع والصفحة الرئيسية
    revalidatePath("/projects");
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

// دالة تحديث مشروع موجود
export async function updateProject(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const location = (formData.get("location") as string) || "جدة";
    const area = formData.get("area") as string;
    const completionYear = formData.get("completionYear") as string;
    
    const rawStatus = (formData.get("status") as string) || "completed";
    const status = rawStatus as ProjectStatus;

    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title || !category || !description) {
      return { success: false, error: "الحقول الإلزامية مطلوبة" };
    }

    let imageUrl: string | undefined = undefined;

    // إذا تم رفع صورة جديدة، يتم رفعها عبر دالة المساعدة
    if (imageFile && imageFile.size > 0) {
      const imageBytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageBytes);
      imageUrl = await uploadProjectImage(
        buffer,
        imageFile.name,
        imageFile.type
      );
    }

    const slug = `${title.toLowerCase().replace(/\s+/g, "-")}-${id.slice(0, 6)}`;

    // تحديث البيانات في قاعدة البيانات
    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
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
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "فشل في حذف المشروع";
    return { success: false, error: errorMessage };
  }
}