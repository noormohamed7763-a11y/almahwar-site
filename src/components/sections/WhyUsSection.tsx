import { BadgeCheck, Award, CalendarCheck, Wallet } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const features = [
  {
    icon: BadgeCheck,
    title: 'جودة مضمونة',
    description:
      'نعتمد أعلى معايير الجودة في التنفيذ ونستخدم أجود الخامات مع ضمان حقيقي على جميع أعمالنا.',
  },
  {
    icon: Award,
    title: 'خبرة واسعة',
    description:
      'فريق من المهندسين والفنيين بخبرة تمتد لسنوات في تنفيذ مشاريع متنوعة في جميع أنحاء المملكة.',
  },
  {
    icon: CalendarCheck,
    title: 'التزام بالمواعيد',
    description:
      'نلتزم بجدول التنفيذ المتفق عليه بدقة، لنضمن تسليم مشروعك في الوقت المحدد دون تأخير.',
  },
  {
    icon: Wallet,
    title: 'أسعار تنافسية',
    description:
      'عروض أسعار شفافة وتنافسية بدون أي تكاليف خفية، لتلائم مختلف الميزانيات واحتياجات المشاريع.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="bg-[#1a233a] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="لماذا نحن؟"
          title="مميزات تجعلنا الخيار الأول"
          description="نلتزم بأعلى المعايير المهنية لنقدم لعملائنا تجربة بناء استثنائية من البداية حتى التسليم."
          dark
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c5a059]/50 hover:bg-white/10"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c5a059] text-[#1a233a] shadow-lg shadow-[#c5a059]/30">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}