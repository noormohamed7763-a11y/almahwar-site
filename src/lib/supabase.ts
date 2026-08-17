import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseServiceRoleKey } from "@/lib/env";
import { buildStoragePath, type ValidatedImage } from "@/lib/validation/image";

const STORAGE_BUCKET = "projects";

let cachedClient: SupabaseClient | null = null;

/**
 * عميل Supabase بمفتاح الخدمة — يتجاوز كل قواعد RLS.
 *
 * يُنشأ عند أول استخدام لا عند تحميل الملف: كان الإصدار السابق يمرر
 * نصاً فارغاً عند غياب المتغيرات فينتج عميل معطوب بصمت. الآن يفشل
 * بخطأ واضح يحدد المتغير الناقص.
 *
 * لا يُستورد هذا الملف من أي كود يعمل في المتصفح.
 */
function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  cachedClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

/**
 * رفع صورة مشروع تم التحقق منها مسبقاً، وإرجاع رابطها العام.
 *
 * يستقبل ValidatedImage فقط — لا Buffer خام ولا اسم ملف من العميل.
 * فيستحيل استدعاؤها بمحتوى غير مُتحقَّق منه، ويصبح التحقق شرطاً
 * يفرضه نظام الأنواع لا مجرد اتفاق بين المطورين.
 */
export async function uploadProjectImage(image: ValidatedImage): Promise<string> {
  return uploadImage(image, 'projects')
}

/**
 * رفع صورة خدمة تم التحقق منها مسبقاً، وإرجاع رابطها العام.
 *
 * تستخدم نفس الـ bucket بمجلد services منفصل، حتى لا يتطلب تشغيل
 * الميزة إنشاء bucket جديد يدوياً في Supabase.
 */
export async function uploadServiceImage(image: ValidatedImage): Promise<string> {
  return uploadImage(image, 'services')
}

/** المنطق المشترك للرفع — لا يُصدَّر حتى لا يُمرَّر مجلد عشوائي */
async function uploadImage(
  image: ValidatedImage,
  folder: 'projects' | 'services',
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const storagePath = buildStoragePath(image, folder);

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, image.buffer, {
      contentType: image.contentType,
      // false: المسار يحتوي طابعاً زمنياً وجزءاً عشوائياً فلا يتكرر،
      // وإيقاف الاستبدال يمنع الكتابة فوق صورة قائمة عند أي تضارب
      upsert: false,
    });

  if (error) {
    throw new Error(`فشل رفع الصورة إلى التخزين: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * حذف ملف صورة من التخزين انطلاقاً من رابطه العام.
 *
 * ضروري لأن onDelete: Cascade يحذف صفوف الصور من قاعدة البيانات فقط،
 * فكانت الملفات تبقى في التخزين إلى الأبد بلا أي مرجع إليها.
 *
 * «أفضل جهد» عن قصد: لا يرفع استثناءً. فشل حذف ملف لا يجوز أن يُفشل
 * حذف الخدمة نفسها من القاعدة، وأسوأ نتيجة هي ملف معلّق يُسجَّل في اللوج.
 */
export async function deleteStoredImage(publicUrl: string): Promise<void> {
  const storagePath = extractStoragePath(publicUrl);
  if (!storagePath) {
    console.warn(`[التخزين] تعذّر استخراج مسار الملف من الرابط: ${publicUrl}`);
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error(`[التخزين] فشل حذف الملف ${storagePath}:`, error.message);
    }
  } catch (error) {
    console.error(`[التخزين] خطأ غير متوقع أثناء حذف ${storagePath}:`, error);
  }
}

/**
 * استخراج المسار الداخلي من رابط Supabase العام.
 * شكل الرابط: .../storage/v1/object/public/<bucket>/<path>
 * يرجع null لأي رابط لا يطابق هذا الشكل أو ينتمي لـ bucket آخر.
 */
function extractStoragePath(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;

  const path = publicUrl.slice(index + marker.length);
  return path ? decodeURIComponent(path) : null;
}
