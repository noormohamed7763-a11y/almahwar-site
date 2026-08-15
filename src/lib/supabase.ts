import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * دالة مساعدة لرفع ملف صورة إلى Supabase Storage وإرجاع الرابط المباشر
 */
export async function uploadProjectImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const cleanFileName = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  const { data, error } = await supabaseAdmin.storage
    .from("projects")
    .upload(cleanFileName, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage Error: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("projects")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}