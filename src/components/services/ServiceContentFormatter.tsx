'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Flame,
  Droplets,
  Layers,
  HelpCircle,
  ChevronDown,
  LayoutGrid,
  Zap,
  Brush,
} from 'lucide-react'

interface ServiceContentFormatterProps {
  description: string
  serviceTitle: string
}

export default function ServiceContentFormatter({
  description,
  serviceTitle,
}: ServiceContentFormatterProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // إذا لم يكن النص يحتوي على عناوين ماركداون، يتم عرضه بنص منسق أنيق عادي
  if (!description.includes('##') && !description.includes('###')) {
    return (
      <article className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200/80">
        <h2 className="text-2xl font-black text-[#1a233a]">
          تفاصيل خدمة {serviceTitle}
        </h2>
        <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
        <div className="mt-6 leading-8 text-gray-700 whitespace-pre-line text-sm sm:text-base font-medium">
          {description}
        </div>
      </article>
    )
  }

  /**
   * تحليل النص وتحويله إلى أقسام هيكلية
   */
  const sections = description.split(/(?=\n##\s)/).map((sec) => sec.trim())

  return (
    <div className="space-y-10">
      {sections.map((section, idx) => {
        const lines = section.split('\n').filter((l) => l.trim().length > 0)
        const headerLine = lines[0] || ''
        const isH2 = headerLine.startsWith('## ')
        const titleText = headerLine.replace(/^##\s*/, '').trim()
        const contentLines = isH2 ? lines.slice(1) : lines

        // 1. قسم المميزات
        if (titleText.includes('مميزات')) {
          return (
            <div
              key={idx}
              className="rounded-3xl bg-[#1a233a] p-6 sm:p-8 text-white shadow-lg border border-white/10"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                <Sparkles className="h-4 w-4" />
                <span>المزايا والمواصفات</span>
              </div>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                {titleText}
              </h3>
              <div className="mt-3 h-1 w-16 rounded-full bg-[#c5a059]" />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contentLines.map((line, lIdx) => {
                  const cleanText = line.replace(/^[*-]\s*/, '').trim()
                  if (!cleanText) return null

                  return (
                    <div
                      key={lIdx}
                      className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/10 transition hover:border-[#c5a059]/50 hover:bg-white/10"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#c5a059] text-[#1a233a]">
                        <CheckCircle2 className="h-4 w-4 font-bold" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-200 leading-relaxed">
                        {cleanText}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        // 2. قسم الأنواع (الجبس بورد، المقاوم للرطوبة، المقاوم للحريق، البلدي)
        if (titleText.includes('أنواع') || titleText.includes('أنواع الجبس')) {
          const typeBlocks = section
            .split(/(?=\n###\s)/)
            .filter((b) => b.includes('###'))

          return (
            <div
              key={idx}
              className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200/80"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                <Layers className="h-4 w-4" />
                <span>التصنيف الفني</span>
              </div>
              <h3 className="mt-2 text-xl font-black text-[#1a233a] sm:text-2xl">
                {titleText}
              </h3>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {typeBlocks.map((block, bIdx) => {
                  const blockLines = block.split('\n').filter((l) => l.trim())
                  const bTitle = blockLines[0]?.replace(/^###\s*/, '').trim() || ''
                  const bBody = blockLines.slice(1).join(' ').trim()

                  // اختيار أيقونة ووسم مخصص لكل نوع
                  let badge = { text: 'نوع معتمد', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: ShieldCheck }
                  if (bTitle.includes('رطوبة')) {
                    badge = { text: 'مقاوم للرطوبة (مباني مبللة)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Droplets }
                  } else if (bTitle.includes('حريق')) {
                    badge = { text: 'مقاوم للحريق (معايير سلامة)', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Flame }
                  } else if (bTitle.includes('بلدي')) {
                    badge = { text: 'زخارف كلاسيكية وتراثية', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Brush }
                  } else if (bTitle.includes('بورد')) {
                    badge = { text: 'خفيف السُمك وسريع التركيب', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Zap }
                  } else if (bTitle.includes('إنشائي')) {
                    badge = { text: 'إشراف وتدعيم إنشائي', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: ShieldCheck }
                  } else if (bTitle.includes('معماري')) {
                    badge = { text: 'تحديث التشطيبات والواجهات', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: LayoutGrid }
                  } else if (bTitle.includes('صحية') || bTitle.includes('صحي')) {
                    badge = { text: 'شبكات المياه والسباكة', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: Droplets }
                  } else if (bTitle.includes('كهربائي')) {
                    badge = { text: 'التمديدات والأنظمة الكهربائية', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Zap }
                  } else if (bTitle.includes('PIR') || bTitle.includes('إيزوسيانات')) {
                    badge = { text: 'مقاوم للحريق وعزل حراري فائق (PIR)', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Flame }
                  } else if (bTitle.includes('PU') || bTitle.includes('يوريثان')) {
                    badge = { text: 'عزل عالي للمستودعات وغرف التبريد (PU)', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: ShieldCheck }
                  } else if (bTitle.includes('صخر')) {
                    badge = { text: 'عزل صوتي ومقاومة نيران للمصانع (Rock Wool)', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Flame }
                  } else if (bTitle.includes('EPS') || bTitle.includes('بوليسترين')) {
                    badge = { text: 'خيار اقتصادي وسريع التركيب (EPS)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Zap }
                  } else if (bTitle.includes('أكريليك') || bTitle.includes('أكريليكية')) {
                    badge = { text: 'مقاوم للتشقق وثبات ألوان عالي', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Brush }
                  } else if (bTitle.includes('سيليكون') || bTitle.includes('سيليكونية')) {
                    badge = { text: 'مقاوم للماء والرطوبة البحرية', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: Droplets }
                  } else if (bTitle.includes('إسمنت') || bTitle.includes('إسمنتية')) {
                    badge = { text: 'صلابة والتصاق قوي بالخرسانة', color: 'bg-[#1a233a] text-white border-[#1a233a]', icon: ShieldCheck }
                  } else if (bTitle.includes('حراري') || bTitle.includes('عزل حراري')) {
                    badge = { text: 'عزل حراري وتقليل امتصاص الشمس', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Sparkles }
                  } else if (bTitle.includes('قماش') || bTitle.includes('PVC') || bTitle.includes('PVDF')) {
                    badge = { text: 'مقاوم للأشعة الشمسية وتعدد التصاميم (PVC)', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: ShieldCheck }
                  } else if (bTitle.includes('حديد') || bTitle.includes('حديدية')) {
                    badge = { text: 'صلابة وقوة تحمل للرياح الشديدة', color: 'bg-[#1a233a] text-white border-[#1a233a]', icon: ShieldCheck }
                  } else if (bTitle.includes('خشب') || bTitle.includes('خشبية') || bTitle.includes('برجولات')) {
                    badge = { text: 'طابع طبيعي وفاخر للجلسات والحدائق', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Brush }
                  } else if (bTitle.includes('كربونيت') || bTitle.includes('بولي كربونيت')) {
                    badge = { text: 'نفاذية ضوء طبيعي مع حماية من الشمس', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Sparkles }
                  } else if (bTitle.includes('معدن') || bTitle.includes('معدنية') || bTitle.includes('ألمنيوم')) {
                    badge = { text: 'مقاومة عالية للرطوبة وسهلة التنظيف', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: ShieldCheck }
                  } else if (bTitle.includes('شبك') || bTitle.includes('شبكية') || bTitle.includes('بلاطات')) {
                    badge = { text: 'سهولة الصيانة والوصول للتكييف والتمديدات', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Zap }
                  }

                  const BadgeIcon = badge.icon

                  return (
                    <div
                      key={bIdx}
                      className="flex flex-col justify-between rounded-2xl bg-gray-50/70 p-6 border border-gray-200/80 transition-all hover:shadow-md hover:bg-white hover:border-[#c5a059]/40"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${badge.color}`}>
                            <BadgeIcon className="h-3.5 w-3.5" />
                            <span>{badge.text}</span>
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-[#1a233a]">
                          {bTitle}
                        </h4>
                        <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                          {bBody}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        // 3. قسم أحدث التصاميم أو الاتجاهات
        if (titleText.includes('تصاميم') || titleText.includes('اتجاهات')) {
          const designBlocks = section
            .split(/(?=\n###\s)/)
            .filter((b) => b.includes('###'))

          return (
            <div
              key={idx}
              className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200/80"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                <LayoutGrid className="h-4 w-4" />
                <span>عصرنة وتشطيبات</span>
              </div>
              <h3 className="mt-2 text-xl font-black text-[#1a233a] sm:text-2xl">
                {titleText}
              </h3>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {designBlocks.map((block, dIdx) => {
                  const blockLines = block.split('\n').filter((l) => l.trim())
                  const dTitle = blockLines[0]?.replace(/^###\s*/, '').trim() || ''
                  const dBody = blockLines.slice(1).join(' ').trim()

                  return (
                    <div
                      key={dIdx}
                      className="rounded-2xl bg-white p-5 border border-gray-200/90 shadow-sm transition hover:border-[#c5a059] hover:shadow-md"
                    >
                      <h4 className="text-base font-black text-[#1a233a] flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#c5a059]" />
                        <span>{dTitle}</span>
                      </h4>
                      <p className="mt-2 text-xs text-gray-600 leading-relaxed font-medium">
                        {dBody}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        // 4. قسم الأسئلة الشائعة (FAQ)
        if (titleText.includes('الأسئلة الشائعة') || titleText.includes('أسئلة')) {
          const faqBlocks = section
            .split(/(?=\n###\s)/)
            .filter((b) => b.includes('###'))

          return (
            <div
              key={idx}
              className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200/80"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                <HelpCircle className="h-4 w-4" />
                <span>إجابات سريعة</span>
              </div>
              <h3 className="mt-2 text-xl font-black text-[#1a233a] sm:text-2xl">
                الأسئلة الشائعة حول الخدمة
              </h3>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />

              <div className="mt-8 space-y-4">
                {faqBlocks.map((block, fIdx) => {
                  const blockLines = block.split('\n').filter((l) => l.trim())
                  const question = blockLines[0]?.replace(/^###\s*/, '').trim() || ''
                  const answer = blockLines.slice(1).join(' ').trim()
                  const isOpen = openFaq === fIdx

                  return (
                    <div
                      key={fIdx}
                      className="rounded-2xl border border-gray-200/90 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                        className="w-full flex items-center justify-between p-4 text-right bg-gray-50/80 hover:bg-gray-100/80 font-extrabold text-sm text-[#1a233a] transition"
                      >
                        <span>{question}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#c5a059] transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white border-t border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                          {answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        // 5. الأقسام العادية الأخرى (المقدمة أو الخاتمة أو الاستخدامات)
        return (
          <article
            key={idx}
            className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200/80"
          >
            {titleText && (
              <>
                <h3 className="text-xl font-black text-[#1a233a] sm:text-2xl">
                  {titleText}
                </h3>
                <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
              </>
            )}
            <div className="mt-6 space-y-4 leading-8 text-gray-700 text-xs sm:text-sm font-medium">
              {contentLines.map((line, cIdx) => {
                if (line.startsWith('* ') || line.startsWith('- ')) {
                  return (
                    <div key={cIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#c5a059] mt-1" />
                      <span>{line.replace(/^[*-]\s*/, '')}</span>
                    </div>
                  )
                }
                return <p key={cIdx}>{line}</p>
              })}
            </div>
          </article>
        )
      })}
    </div>
  )
}
