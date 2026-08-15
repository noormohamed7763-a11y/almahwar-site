import { PrismaClient } from '@prisma/client'
import { defaultProjects } from '../src/data/siteData'

const prisma = new PrismaClient()

async function main() {
  console.log('جاري إدراج المشاريع الافتراضية في قاعدة البيانات...')

  for (const project of defaultProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        id: project.id,
        slug: project.slug,
        title: project.title,
        category: project.category,
        location: project.location || 'جدة',
        area: project.area || null,
        completionYear: project.completionYear || null,
        description: project.description,
        image: project.image,
        gallery: project.gallery || [],
        materials: project.materials || [],
        features: project.features || [],
        status: project.status || 'completed',
        createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      },
    })
  }

  console.log('تم إدراج المشاريع الافتراضية بنجاح.')
}

main()
  .catch((e) => {
    console.error('حدث خطأ أثناء إدراج البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })