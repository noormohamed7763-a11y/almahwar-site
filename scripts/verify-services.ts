/**
 * فحص تحقق مؤقت لجدولي الخدمات — يُشغَّل بـ: npx tsx scripts/verify-services.ts
 * يقرأ فقط، ولا يعدّل أي بيانات.
 */
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: {
      slug: true,
      title: true,
      sortOrder: true,
      icon: true,
      _count: { select: { images: true } },
    },
  })

  console.log('عدد الخدمات المنشورة:', services.length)
  console.log('\nالترتيب الفعلي كما سيظهر في الموقع:')
  for (const s of services) {
    console.log(
      `  ${String(s.sortOrder).padStart(2)} | ${s.slug.padEnd(26)} | ${(s.icon ?? '—').padEnd(12)} | صور: ${s._count.images} | ${s.title}`,
    )
  }

  const uniqueOrders = new Set(services.map((s) => s.sortOrder)).size
  console.log('\nترتيبات مكررة:', services.length - uniqueOrders)
  console.log('إجمالي صور الخدمات:', await prisma.serviceImage.count())

  const idx = await prisma.$queryRaw<Array<{ tablename: string; indexname: string }>>`
    SELECT tablename, indexname FROM pg_indexes
    WHERE tablename IN ('services','service_images')
    ORDER BY tablename, indexname`
  console.log('\nالفهارس:')
  idx.forEach((i) => console.log(`  ${i.tablename}: ${i.indexname}`))

  const fks = await prisma.$queryRaw<Array<{ conname: string; def: string }>>`
    SELECT conname, pg_get_constraintdef(oid) AS def FROM pg_constraint
    WHERE conrelid = 'service_images'::regclass AND contype = 'f'`
  console.log('\nالمفاتيح الأجنبية:')
  fks.forEach((f) => console.log(`  ${f.conname}: ${f.def}`))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
