import React from 'react'
import { BadgeCheck, Award, CalendarCheck, Wallet } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const features = [
  {
    icon: BadgeCheck,
    title: 'جودة وضمان معتمد',
    description: 'نعتمد أعلى المواصفات الفنية مع تقديم ضمان حقيقي على كافة أعمال العزل والهياكل الإنشائية.',
  },
  {
    icon: Award,
    title: 'كادر هندسي متخصص',
    description: 'فريق من المهندسين والفنيين المؤهلين بخبرة ميدانية واسعة في تنفيذ كبرى المشاريع الصناعية والتجارية.',
  },
  {
    icon: CalendarCheck,
    title: 'الالتزام التام بالمواعيد',
    description: 'جدولة زمنية دقيقة تضمن تسليم كافة مراحل المشروع في موعدها المحدد وفق العقد المبرم.',
  },
  {
    icon: Wallet,
    title: 'تسعير واضح وشفاف',
    description: 'عروض أسعار تفصيلية توضح كافة بنود التوريد والتركيب دون أي تكاليف إضافية غير معلنة.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="bg-[#1a233a] py-20 text-white" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="لماذا تختارنا؟"
          title="معايير تجعلنا الخيار الموثوق لمشروعك"
          description="نجمع بين الدقة الهندسية والسرعة في التنفيذ لتقديم أفضل قيمة استثمارية لعملائنا."
          dark
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c5a059]/50 hover:bg-white/10"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c5a059] text-[#1a233a] shadow-lg shadow-[#c5a059]/20">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-base font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-300">
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