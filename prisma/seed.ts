import { PrismaClient } from '@prisma/client'
import { defaultProjects } from '../src/data/siteData'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 جاري إدخال الخدمات الأساسية...')

  const servicesList = [
    {
      title: 'السندوتش بانل',
      slug: 'sandwich-panels',
      description: 'توريد وتركيب ألواح السندوتش بانل العازلة للحرارة والصوت، والمستخدمة في المستودعات، الهناجر، والمباني الجاهزة بأعلى معايير الجودة والكفاءة العالية.',
      icon: 'Layers',
    },
    {
      title: 'الهياكل الحديدية والهناجر',
      slug: 'steel-structures-hangars',
      description: 'تصميم وتنفيذ الهياكل المعدنية الثقيلة، الهناجر الصناعية، المستودعات، والمظلات الكبرى وفق أحدث التصاميم الهندسية الإنشائية وبأقوى درجات الأمان.',
      icon: 'Building2',
    },
    {
      title: 'المظلات والسواتر',
      slug: 'awnings-screens',
      description: 'تصنيع وتركيب جميع أنواع المظلات والسواتر للسيارات، الاستراحات، والقصور بمختلف التصاميم والأشكال التي تلبي احتياجات الخصوصية والحماية من العوامل الجوية.',
      icon: 'Shield',
    },
    {
      title: 'ألواح الجدران',
      slug: 'wall-panels',
      description: 'توريد وتركيب ألواح الجدران المعزولة والديكورية للمواجهات الداخلية والخارجية للمباني، مع ضمان العزل الحراري والمظهر الجمالي المتميز.',
      icon: 'LayoutGrid',
    },
    {
      title: 'ألواح الأسقف',
      slug: 'roof-panels',
      description: 'تركيب ألواح الأسقف المعدنية والمعزولة المقاومة لتسرب المياه والعوامل المناخية المختلفة للمنشآت التجارية والصناعية.',
      icon: 'Home',
    },
    {
      title: 'الدهانات',
      slug: 'paints',
      description: 'تنفيذ أعمال الدهانات الداخلية والخارجية الفاخرة، الإيبوكسي للأرضيات، والتشطيبات الديكورية الحديثة بأجود أنواع الخامات العالمية.',
      icon: 'Palette',
    },
    {
      title: 'الجبس',
      slug: 'gypsum',
      description: 'تصميم وتنفيذ أعمال الجبس بورد، الأسقف المعلقة، الديكورات الجبسية الكلاسيكية والمودرن، وإخفاء الإضاءات بطرق احترافية.',
      icon: 'Sparkles',
    },
    {
      title: 'الأسقف المستعارة',
      slug: 'false-ceilings',
      description: 'تركيب الأسقف المستعارة بمختلف أنواعها (بلاطات، شبكية، ألمنيوم) للمكاتب، الشركات، والمراكز التجارية مع تسهيل الوصول للتمديدات.',
      icon: 'Grid',
    },
    {
      title: 'ترميم المباني',
      slug: 'building-restoration',
      description: 'خدمات شاملة لترميم وتأهيل المباني القديمة، معالجة التصدعات والتشققات، وتجديد الواجهات الداخلية والخارجية لتعود كالجديدة تماماً.',
      icon: 'Wrench',
    },
    {
      title: 'البناء العام',
      slug: 'general-construction',
      description: 'تنفيذ مشاريع المقاولات العامة والبناء من الصفر حتى التسليم، مع الالتزام التام بالجداول الزمنية والمواصفات الهندسية المعتمدة.',
      icon: 'Building',
    },
  ]

  for (const [index, s] of servicesList.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        description: s.description,
        // الأيقونة تُحدَّث أيضاً: بدونها كان تغييرها في هذا الملف
        // لا يُطبَّق على أي خدمة موجودة مهما أُعيد تشغيل الزرع
        icon: s.icon,
        // والترتيب كذلك: بدونه تبقى كل الخدمات القائمة على 0 فيرتد
        // الترتيب إلى createdAt وتظهر القائمة معكوسة.
        // تنبيه: هذا يستبدل أي ترتيب ضُبط يدوياً من لوحة التحكم —
        // هذا الملف هو المرجع الأساسي لترتيب الخدمات العشر الأصلية.
        sortOrder: index,
      },
      create: {
        title: s.title,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        // الترتيب من موضع الخدمة في هذه القائمة، لا من وقت الإدخال
        sortOrder: index,
      },
    })
  }

  console.log(`✅ تم إدخال وتحديث ${servicesList.length} خدمة بنجاح!`)

  // ── المشاريع ───────────────────────────────────────────────────
  console.log('🌱 جاري إدخال المشاريع الافتراضية...')

  for (const project of defaultProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        slug: project.slug,
        title: project.title,
        category: project.category,
        location: project.location,
        area: project.area ?? null,
        completionYear: project.completionYear ?? null,
        description: project.description,
        image: project.image,
        gallery: project.gallery ?? [],
        materials: project.materials ?? [],
        features: project.features ?? [],
        status: project.status,
      },
    })
  }

  console.log(`✅ تم إدخال ${defaultProjects.length} مشروع بنجاح!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })