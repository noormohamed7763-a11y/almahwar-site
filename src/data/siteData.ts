import {
  Layers,
  Building2,
  Hammer,
  PaintRoller,
  Umbrella,
  Grid3x3,
  LayoutGrid,
  Sparkles,
} from 'lucide-react'
import { Service, Article, ProjectItem } from '@/types'

// إعادة تصدير إعدادات الموقع لضمان التوافق المركزي
export { siteConfig } from '@/config/site'

export const services: Service[] = [
  {
    id: 'sandwich-panel',
    slug: 'sandwich-panel',
    title: 'سندوتش بانل',
    shortDescription:
      'تركيب سندوتش بانل عازل للحرارة والرطوبة للمستودعات والمصانع والفلل، بجودة عالية وسرعة تنفيذ.',
    fullDescription:
      'نوفر حلول السندوتش بانل المتكاملة للمستودعات والمصانع والمباني التجارية والسكنية بألواح عازلة عالية الكفاءة.',
    icon: Layers,
    features: [
      'توريد وتركيب ألواح سندوتش بانل من المصانع المعتمدة',
      'عزل حراري وصوتي ممتاز يقلل استهلاك الطاقة',
      'سرعة التنفيذ بتشطيبات دقيقة ومقاييس مضبوطة',
      'ضمان على الخامات وأعمال التركيب',
    ],
  },
  {
    id: 'general-construction',
    slug: 'general-construction',
    title: 'البناء العام',
    shortDescription:
      'تنفيذ مشاريع البناء العام من الألف إلى الياء بأعلى معايير الجودة والالتزام التام بالمواصفات.',
    fullDescription:
      'ننفذ مشاريع البناء العام من الهيكل الإنشائي حتى التشطيب النهائي بإشراف هندسي متكامل.',
    icon: Building2,
    features: [
      'إشراف هندسي كامل على جميع مراحل التنفيذ',
      'تنفيذ الهيكل الإنشائي والتشطيبات وفق كود البناء السعودي',
      'متابعة دقيقة للجودة والتكاليف والجدول الزمني',
      'ضمان على الأعمال والالتزام بالمواصفات',
    ],
  },
  {
    id: 'renovation',
    slug: 'renovation',
    title: 'الترميم',
    shortDescription:
      'إعادة تأهيل المباني القديمة والمتهالكة وإطالة عمرها الافتراضي بحلول هندسية آمنة ومدروسة.',
    fullDescription:
      'نقدم خدمات ترميم المباني وإعادة تأهيلها ومعالجة التشققات والرطوبة وتحديث الواجهات.',
    icon: Hammer,
    features: [
      'فحص هندسي شامل لتحديد أعمال الترميم اللازمة',
      'معالجة التشققات والرطوبة والعزل بأنظمة حديثة',
      'ترميم الواجهات والأنظمة الكهربائية والصحية',
    ],
  },
  {
    id: 'painting',
    slug: 'painting',
    title: 'الدهانات',
    shortDescription:
      'دهانات داخلية وخارجية بأفضل الخامات العالمية وألوان عصرية تليق بذوقك وتدوم طويلاً.',
    fullDescription:
      'ننفذ أعمال الدهانات الداخلية والخارجية باحترافية عالية وبتقنيات مقاومة للعوامل الجوية.',
    icon: PaintRoller,
    features: [
      'تجهيز ومعالجة الأسطح قبل الدهان لنتائج مثالية',
      'خامات عالمية مقاومة للرطوبة والعوامل الجوية',
      'تشطيبات ناعمة ومتساوية بألوان عصرية',
    ],
  },
  {
    id: 'canopies-and-fences',
    slug: 'canopies-and-fences',
    title: 'المظلات والسواتر',
    shortDescription:
      'تصميم وتنفيذ المظلات والسواتر بأنواعها لمواقف السيارات والحدائق بأشكال عصرية.',
    fullDescription:
      'ننفذ المظلات والسواتر الحديدية والقماشية والخشبية لمواقف السيارات والحدائق والمسابح.',
    icon: Umbrella,
    features: [
      'تصميم حسب الموقع والمساحة واحتياج العميل',
      'خامات متينة مقاومة للصدأ والعوامل الجوية',
      'تنفيذ سريع مع ضمان دقة التركيب',
    ],
  },
  {
    id: 'false-ceilings',
    slug: 'false-ceilings',
    title: 'الأسقف المستعارة',
    shortDescription:
      'تركيب الأسقف المستعارة الجبسية والبيضاء والألمنيوم بتصاميم إضاءة عصرية.',
    fullDescription:
      'ننفذ الأسقف المستعارة بمختلف الأنواع مع دمج وحدات الإضاءة المخفية بدقة وإتقان.',
    icon: Grid3x3,
    features: [
      'تصاميم عصرية متعددة المستويات مع إضاءة مخفية',
      'عزل محسّن للصوت والحرارة في المساحات',
    ],
  },
  {
    id: 'tiles-and-ceramics',
    slug: 'tiles-and-ceramics',
    title: 'البلاط والسيراميك',
    shortDescription:
      'توريد وتركيب البلاط والسيراميك والبورسلين لمختلف المساحات بدقة في الميزان.',
    fullDescription:
      'نوفر خدمات تركيب البلاط والسيراميك للأرضيات والجدران الداخلية والخارجية.',
    icon: LayoutGrid,
    features: [
      'توريد مقاسات متنوعة حسب الطلب',
      'تركيب دقيق مع ضبط المستويات والميول',
    ],
  },
  {
    id: 'gypsum-and-decoration',
    slug: 'gypsum-and-decoration',
    title: 'الجبس والديكورات',
    shortDescription:
      'تصاميم جبسية وديكورات داخلية فاخرة تجمع بين الأناقة والفخامة.',
    fullDescription:
      'نقدم أعمال الجبس والديكورات الحديثة والأسقف المعلقة والجداريات.',
    icon: Sparkles,
    features: [
      'تصاميم جبسية فاخرة تناسب ذوق العميل',
      'فريق متخصص في الديكورات الحديثة',
    ],
  },
]

export const articles: Article[] = [
  {
    id: 'best-sandwich-panel-types',
    slug: 'best-sandwich-panel-types',
    title: 'أفضل أنواع السندوتش بانل في السعودية',
    excerpt:
      'دليل شامل لأفضل أنواع السندوتش بانل وكيفية اختيار النوع المناسب لاحتياجك.',
    metaDescription:
      'مقارنة بين أنواع السندوتش بانل البولي يوريثان والصوف الصخري في السوق السعودي.',
    keywords: ['سندوتش بانل', 'سندوتش بانل جدة', 'اسعار السندوتش بانل'],
    readTime: '6 دقائق قراءة',
  },
  {
    id: 'canopy-prices-saudi-arabia',
    slug: 'canopy-prices-saudi-arabia',
    title: 'أسعار المظلات ومواصفاتها',
    excerpt:
      'نظرة تفصيلية على أسعار المظلات بأنواعها المختلفة في السعودية والعوامل المؤثرة في التكلفة.',
    metaDescription:
      'تعرف على أسعار مظلات السيارات والحدائق مع شركة المحور الهندسي.',
    keywords: ['اسعار المظلات', 'مظلات سيارات جدة', 'سواتر مكة'],
    readTime: '5 دقائق قراءة',
  },
  {
    id: 'building-renovation-guide',
    slug: 'building-renovation-guide',
    title: 'دليل ترميم المباني ومعالجة التصدعات',
    excerpt:
      'كل ما تحتاج معرفته عن ترميم المباني خطوة بخطوة من الفحص الهندسي إلى التشطيب.',
    metaDescription:
      'دليل شامل لترميم المباني في السعودية ومعالجة التشققات والرطوبة.',
    keywords: ['ترميم مباني', 'شركة ترميم جدة', 'معالجة الرطوبة'],
    readTime: '8 دقائق قراءة',
  },
]

export const defaultProjects: ProjectItem[] = [
  {
    id: 'p-1',
    slug: 'sandwich-panel-warehouse-jeddah',
    title: 'مستودع سندوتش بانل متكامل',
    category: 'سندوتش بانل ومستودعات',
    location: 'جدة - الخمرة الصناعية',
    area: '1,200 م²',
    completionYear: '2026',
    image: '/images/hero/sandwich-panel-1.jpg',
    description:
      'تنفيذ وتوريد مستودع كامل بألواح سندوتش بانل عازلة للحرارة مع شبكة تصريف ومواصفات مطابقة لاشتراطات الدفاع المدني وكود البناء السعودي.',
    materials: [
      'ألواح PIR عازلة سماكة 7.5 سم',
      'هياكل حديدية معالجة ضد الصدأ',
      'أبواب صناعية هيدروليكية',
      'أنظمة تصريف مياه الأمطار',
    ],
    features: [
      'مطابق لاشتراطات الدفاع المدني وكود البناء السعودي',
      'عزل حراري وصوتي عالي الكفاءة',
      'ضمان شامل على التركيب والتسريب',
    ],
    status: 'completed',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
  {
    id: 'p-2',
    slug: 'commercial-car-park-canopies',
    title: 'مظلات مواقف سيارات كبرى',
    category: 'مظلات وسواتر',
    location: 'مكة المكرمة',
    area: '850 م²',
    completionYear: '2026',
    image: '/images/hero/canopy-1.jpg',
    description:
      'تصميم وتنفيذ مظلات قماشية وهياكل حديدية مجلفنة لمواقف سيارات مجمع تجاري مع مقاومة عالية للرياح والحرارة.',
    materials: [
      'قماش PVC كوري وزن 1100 جرام عالي الكثافة',
      'مواسير وإطارات فولاذية مجلفنة ومدهونة حرارياً',
      'قواعد خرسانية مسلحة مطابقة للمواصفات',
    ],
    features: [
      'حجب تام للأشعة فوق البنفسجية بنسبة 100%',
      'مقاومة للرياح والتقلبات الجوية الشديدة',
      'ضمان لمدة 10 سنوات على القماش والهيكل',
    ],
    status: 'completed',
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
  {
    id: 'p-3',
    slug: 'commercial-building-renovation-facades',
    title: 'ترميم وتأهيل واجهات مبنى تجاري',
    category: 'بناء عام وترميم',
    location: 'الرياض',
    area: '2,400 م²',
    completionYear: '2026',
    image: '/images/hero/sandwich-panel-2.jpg',
    description:
      'معالجة التصدعات والتشققات وتطبيق دهانات خارجية مقاومة للرطوبة والحرارة مع تجديد المظهر المعماري بالكامل.',
    materials: [
      'مواد حقن وتدعيم إيبوكسية ألمانية',
      'دهانات بروفايل خارجية مقاومة للعوامل الجوية',
      'عوازل مائية وحرارية للواجهات والأسطح',
    ],
    features: [
      'معالجة جذرية للشروخ الهيكلية والسطحية',
      'إشراف هندسي ميداني على كافة مراحل الترميم',
      'شهادة ضمان معتمدة على أعمال العزل والدهان',
    ],
    status: 'completed',
    createdAt: '2026-08-10T08:30:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  const decoded = decodeURIComponent(slug)
  return services.find((service) => service.slug === decoded || service.slug === slug)
}

export function getArticleBySlug(slug: string): Article | undefined {
  const decoded = decodeURIComponent(slug)
  return articles.find((article) => article.slug === decoded || article.slug === slug)
}