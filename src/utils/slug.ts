/**
 * توليد Slug نظيف يدعم الأحرف العربية والإنجليزية والأرقام
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^\u0621-\u064A\u0660-\u0669a-z0-9\-]/g, '')
    .replace(/^-+|-+$/g, '')
}

/**
 * التأكد من عدم تكرار الـ Slug مع تفادي التضارب
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  const cleanBase = slugify(baseSlug) || 'project'
  if (!existingSlugs.includes(cleanBase)) return cleanBase

  let counter = 2
  while (existingSlugs.includes(`${cleanBase}-${counter}`)) {
    counter++
  }
  return `${cleanBase}-${counter}`
}