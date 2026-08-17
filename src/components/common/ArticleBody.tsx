import React from 'react'

/**
 * عرض متن المقال المكتوب بصيغة Markdown مبسّطة.
 *
 * سبب كتابة محلّل صغير بدل مكتبة Markdown كاملة: المتن يستخدم أربعة
 * عناصر فقط (عناوين، قوائم نقطية، قوائم مرقّمة، فقرات)، ومكتبة كاملة
 * تعني حجماً أكبر و dangerouslySetInnerHTML بلا حاجة. هنا كل عنصر
 * يُعرض كوسم React حقيقي فلا مجال لإدخال HTML من المحتوى.
 *
 * الصيغة المدعومة:
 *   ## عنوان رئيسي     ### عنوان فرعي     #### عنوان فرعي أصغر
 *   * عنصر قائمة نقطية
 *   1. عنصر قائمة مرقّمة
 *   أي سطر آخر = فقرة
 */

type Block =
  | { kind: 'heading'; level: 2 | 3 | 4; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'paragraph'; text: string }

function parse(content: string): Block[] {
  const blocks: Block[] = []
  const lines = content.split('\n')

  let paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: 'paragraph', text: paragraph.join(' ') })
      paragraph = []
    }
  }

  const flushList = () => {
    if (list) {
      blocks.push({ kind: 'list', ordered: list.ordered, items: list.items })
      list = null
    }
  }

  const flushAll = () => {
    flushParagraph()
    flushList()
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    // سطر فارغ ينهي الفقرة، لكنه لا ينهي القائمة: بعض القوائم في
    // المتن مفصولة بأسطر فارغة بين عناصرها
    if (line === '') {
      flushParagraph()
      continue
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line)
    if (heading) {
      flushAll()
      blocks.push({
        kind: 'heading',
        level: heading[1].length as 2 | 3 | 4,
        text: heading[2].trim(),
      })
      continue
    }

    const bullet = /^[*-]\s+(.*)$/.exec(line)
    if (bullet) {
      flushParagraph()
      if (!list || list.ordered) {
        flushList()
        list = { ordered: false, items: [] }
      }
      list.items.push(bullet[1].trim())
      continue
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(line)
    if (numbered) {
      flushParagraph()
      if (!list || !list.ordered) {
        flushList()
        list = { ordered: true, items: [] }
      }
      list.items.push(numbered[1].trim())
      continue
    }

    // نص عادي: ينهي أي قائمة مفتوحة ويبدأ فقرة
    flushList()
    paragraph.push(line)
  }

  flushAll()
  return blocks
}

export default function ArticleBody({ content }: { content: string }) {
  const blocks = parse(content)

  return (
    // break-words ضروري: المتن يحتوي مصطلحات لاتينية طويلة (Rock Wool،
    // PVC، LED) وبدونه تتجاوز الكلمة حدود البطاقة على الشاشات الضيقة
    <div className="space-y-5 break-words text-gray-700">
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          if (block.level === 2) {
            return (
              <h2
                key={index}
                className="scroll-mt-24 pt-4 text-xl font-extrabold leading-snug text-[#1a233a] sm:text-2xl"
              >
                {block.text}
                <span className="mt-3 block h-1 w-16 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
              </h2>
            )
          }

          if (block.level === 3) {
            return (
              <h3
                key={index}
                className="pt-2 text-lg font-bold leading-snug text-[#1a233a] sm:text-xl"
              >
                {block.text}
              </h3>
            )
          }

          return (
            <h4
              key={index}
              className="text-sm font-bold text-[#c5a059] sm:text-base"
            >
              {block.text}
            </h4>
          )
        }

        if (block.kind === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul'
          return (
            <ListTag
              key={index}
              className={`space-y-2.5 ps-5 text-sm leading-8 sm:text-base ${
                block.ordered ? 'list-decimal' : 'list-disc'
              } marker:text-[#c5a059]`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="ps-1">
                  {item}
                </li>
              ))}
            </ListTag>
          )
        }

        return (
          <p key={index} className="text-sm leading-8 sm:text-base sm:leading-9">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}
