-- ════════════════════════════════════════════════════════════════════
--  إضافة جدولي الخدمات وصورها
-- ════════════════════════════════════════════════════════════════════
--  كُتب هذا الملف يدوياً لأن الجدولين ربما أُنشئا سابقاً بـ `prisma db push`
--  بلا سجل ترحيل. لذلك كل عملية هنا محصّنة بـ IF NOT EXISTS: إن كانت
--  الجداول موجودة فالترحيل لا يفعل شيئاً ويُسجَّل كمطبَّق، وإن كانت
--  غائبة فيُنشئها. في الحالتين لا تُفقد أي بيانات ولا يحتاج إلى reset.
-- ════════════════════════════════════════════════════════════════════

-- CreateTable
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "service_images" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_images_pkey" PRIMARY KEY ("id")
);

-- AlterTable: أعمدة أُضيفت بعد أول إنشاء للجدولين
-- (لا تفعل شيئاً إن كان الجدول جديداً لأنها معرَّفة أعلاه)
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "service_images" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "services_isPublished_sortOrder_idx" ON "services"("isPublished", "sortOrder");

-- CreateIndex: PostgreSQL لا يفهرس المفاتيح الأجنبية تلقائياً
CREATE INDEX IF NOT EXISTS "service_images_serviceId_sortOrder_idx" ON "service_images"("serviceId", "sortOrder");

-- AddForeignKey
-- PostgreSQL لا يدعم ADD CONSTRAINT IF NOT EXISTS، فيُفحص الوجود صراحةً
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'service_images_serviceId_fkey'
    ) THEN
        ALTER TABLE "service_images"
            ADD CONSTRAINT "service_images_serviceId_fkey"
            FOREIGN KEY ("serviceId") REFERENCES "services"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
