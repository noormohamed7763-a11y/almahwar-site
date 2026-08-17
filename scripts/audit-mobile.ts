/**
 * فاحص تشويه العرض على الهاتف.
 *
 * يقيس بالأرقام لا بالتخمين:
 *  1. تمرير أفقي للصفحة كاملة (أوضح علامة على تشويه التخطيط).
 *  2. عناصر تتجاوز حدود الشاشة يميناً أو يساراً.
 *  3. صور مشوّهة: نسبة العرض/الارتفاع المعروضة تخالف نسبة الملف الأصلية.
 *  4. نصوص تفيض خارج حاوياتها.
 *  5. أهداف لمس أصغر من 32 بكسل.
 *
 * التشغيل: npx tsx scripts/audit-mobile.ts   (يتطلب سيرفراً على 3111)
 *
 * كود الفحص مكتوب نصاً لا دالة: أدوات البناء (tsx/esbuild) تحقن
 * مساعدات مثل __name في الدوال المسمّاة، وهي غير معرَّفة داخل المتصفح
 * فيفشل page.evaluate بـ ReferenceError.
 */
import { chromium, devices } from 'playwright'

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3111'

const VIEWPORTS = [
  { name: 'أندرويد صغير', width: 360, height: 740 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
  { name: 'هاتف عريض', width: 430, height: 932 },
  { name: 'تابلت', width: 768, height: 1024 },
]

const PATHS = [
  '/',
  '/services',
  '/services/sandwich-panels',
  '/projects',
  '/articles',
  '/articles/best-sandwich-panel-types',
  '/articles/modern-gypsum-types',
  '/contact',
]

interface Problem {
  kind: string
  detail: string
}

const AUDIT_SCRIPT = `(() => {
  const problems = [];
  const vw = window.innerWidth;
  const docEl = document.documentElement;

  const scrollW = Math.max(docEl.scrollWidth, document.body.scrollWidth);
  if (scrollW > vw + 1) {
    problems.push({
      kind: 'تمرير-أفقي',
      detail: 'الصفحة عرضها ' + scrollW + 'px والشاشة ' + vw + 'px (زيادة ' + (scrollW - vw) + 'px)',
    });
  }

  const describe = function (el) {
    const tag = el.tagName.toLowerCase();
    const cls = (el.getAttribute('class') || '').split(/\\s+/).slice(0, 3).join('.');
    const text = (el.textContent || '').trim().slice(0, 35).replace(/\\s+/g, ' ');
    return tag + (cls ? '.' + cls : '') + (text ? ' «' + text + '»' : '');
  };

  const all = Array.prototype.slice.call(document.querySelectorAll('body *'));

  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const isFixed = style.position === 'fixed';

    let insideScroller = false;
    let parent = el.parentElement;
    while (parent && parent !== document.body) {
      const ps = getComputedStyle(parent);
      if (ps.overflowX === 'auto' || ps.overflowX === 'scroll') { insideScroller = true; break; }
      parent = parent.parentElement;
    }

    if (!insideScroller && !isFixed) {
      if (rect.right > vw + 1.5) {
        problems.push({
          kind: 'يتجاوز-اليمين',
          detail: describe(el) + ' يمتد إلى ' + Math.round(rect.right) + 'px (الشاشة ' + vw + 'px)',
        });
      }
      if (rect.left < -1.5) {
        problems.push({
          kind: 'يتجاوز-اليسار',
          detail: describe(el) + ' يبدأ من ' + Math.round(rect.left) + 'px',
        });
      }
    }

    if (el.scrollWidth > el.clientWidth + 2 && style.overflowX === 'visible') {
      const hasText = (el.textContent || '').trim().length > 0;
      if (hasText && el.children.length === 0) {
        problems.push({
          kind: 'نص-يفيض',
          detail: describe(el) + ': المحتوى ' + el.scrollWidth + 'px والحاوية ' + el.clientWidth + 'px',
        });
      }
    }
  }

  const imgs = Array.prototype.slice.call(document.querySelectorAll('img'));
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i];
    if (!img.complete || img.naturalWidth === 0) continue;
    const rect = img.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const fit = getComputedStyle(img).objectFit;
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const renderedRatio = rect.width / rect.height;
    const drift = Math.abs(naturalRatio - renderedRatio) / naturalRatio;

    if (drift > 0.05 && (fit === 'fill' || fit === 'none')) {
      problems.push({
        kind: 'صورة-ممطوطة',
        detail: (img.getAttribute('alt') || img.src.slice(-35)) +
          ': النسبة الأصلية ' + naturalRatio.toFixed(2) +
          ' والمعروضة ' + renderedRatio.toFixed(2) + ' (object-fit: ' + fit + ')',
      });
    }
  }

  const tappable = Array.prototype.slice.call(
    document.querySelectorAll('a, button, input, select, textarea')
  );
  for (let i = 0; i < tappable.length; i++) {
    const el = tappable[i];
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.height < 32 || rect.width < 32) {
      problems.push({
        kind: 'هدف-لمس-صغير',
        detail: describe(el) + ': ' + Math.round(rect.width) + '×' + Math.round(rect.height) + 'px',
      });
    }
  }

  return problems;
})()`

async function main() {
  // نسخة Chromium المثبَّتة مسبقاً على الجهاز، حتى لا يتطلب الفحص
  // تنزيل متصفح جديد. يمكن تجاوزها بمتغير AUDIT_CHROME.
  const executablePath =
    process.env.AUDIT_CHROME ??
    `${process.env.LOCALAPPDATA}\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe`

  const browser = await chromium.launch({ executablePath })

  let totalProblems = 0
  let failedPages = 0
  const summary = new Map<string, number>()

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.width < 500,
      hasTouch: vp.width < 500,
      userAgent: devices['iPhone 13'].userAgent,
    })

    console.log(`\n${'═'.repeat(72)}`)
    console.log(`  ${vp.name} — ${vp.width}×${vp.height}`)
    console.log('═'.repeat(72))

    for (const path of PATHS) {
      const page = await context.newPage()
      try {
        await page.goto(`${BASE}${path}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        })
        await page
          .waitForFunction(
            'Array.prototype.every.call(document.images, i => i.complete)',
            { timeout: 8000 },
          )
          .catch(() => {})

        const problems = (await page.evaluate(AUDIT_SCRIPT)) as Problem[]

        // تجميع المتكررات: عنصر واحد متكرر في قائمة ليس عشر مشاكل
        const grouped = new Map<string, { kind: string; detail: string; count: number }>()
        for (const p of problems) {
          const key = `${p.kind}|${p.detail.slice(0, 55)}`
          const existing = grouped.get(key)
          if (existing) existing.count++
          else grouped.set(key, { kind: p.kind, detail: p.detail, count: 1 })
        }

        if (grouped.size === 0) {
          console.log(`  ✅ ${path}`)
        } else {
          console.log(`  ❌ ${path}`)
          for (const { kind, detail, count } of grouped.values()) {
            console.log(`       ${kind}: ${detail}${count > 1 ? `  ×${count}` : ''}`)
            totalProblems += count
            summary.set(kind, (summary.get(kind) ?? 0) + count)
          }
        }
      } catch (error) {
        // الفشل يُحتسب: صفحة لم تُفحَص لا يجوز أن تبدو كصفحة سليمة
        failedPages++
        console.log(`  ⚠️  ${path} — ${(error as Error).message.split('\n')[0]}`)
      } finally {
        await page.close()
      }
    }

    await context.close()
  }

  console.log(`\n${'═'.repeat(72)}`)
  if (failedPages > 0) {
    console.log(`  ⚠️  ${failedPages} صفحة لم تُفحَص — النتيجة غير مكتملة`)
  }
  if (totalProblems === 0 && failedPages === 0) {
    console.log('  ✅ لا تشويه في أي صفحة على أي مقاس')
  } else if (totalProblems > 0) {
    console.log(`  إجمالي الملاحظات: ${totalProblems}`)
    for (const [kind, count] of [...summary].sort((a, b) => b[1] - a[1])) {
      console.log(`    ${kind}: ${count}`)
    }
  }
  console.log('═'.repeat(72))

  await browser.close()
  process.exit(failedPages > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
