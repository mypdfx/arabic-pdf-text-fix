# arabic-pdf-text-fix

Fix Arabic text copied out of PDF files — **reversed words** and **broken letters** — in one line of JavaScript.

إصلاح النص العربي المنسوخ من ملفات PDF — **الكلام المقلوب** و**الحروف المفككة أو الغريبة** — بسطر واحد.

> No code? Use the free online tool: **[MyPDFX — Extract text from PDF](https://www.mypdfx.com/extract-text)** (Arabic-first, runs in your browser).
>
> لا تبرمج؟ استخدم الأداة مباشرة: **[استخراج النص من PDF على MyPDFX](https://www.mypdfx.com/extract-text)**

## Why does Arabic come out reversed? / ليش يطلع الكلام مقلوب؟

A PDF stores where each glyph is **drawn**, not the order you **read** it.

1. **Visual order** — many PDFs store the line left to right, as drawn. Copy it and the Arabic comes out backwards: `ملاعلا ابحرم` instead of `مرحبا العالم`.
2. **Presentation forms** — many PDFs store letter *shapes* (Unicode `U+FB50–U+FDFF`, `U+FE70–U+FEFF`) instead of real letters. The text looks right but search, sorting and spell-check fail.

ملف PDF يحفظ مكان رسم كل حرف، لا ترتيب قراءته. لذلك ينقلب الترتيب، أو تُحفظ "أشكال" الحروف بدل الحروف الحقيقية فلا يعمل البحث والنسخ.

## Install

```bash
npm install github:mypdfx/arabic-pdf-text-fix
```

Or just copy `index.js` into your project — one file, no dependencies.

## Use

```js
import { fixArabicPdfText, fixReversedLine, normalizePresentationForms } from "arabic-pdf-text-fix"; // or "./index.js"

// Broken letter shapes → real letters (safe to run on any text)
normalizePresentationForms("ﻣﺮﺣﺒﺎ"); // "مرحبا"

// Reversed line → reading order. Numbers and Latin words keep their order.
fixReversedLine("لاير 1250 رعسلا"); // "السعر 1250 ريال"
fixReversedLine("PDF فلم");          // "ملف PDF"

// Both at once, for a whole pasted block
fixArabicPdfText(pasted, { reversed: true });
```

| Function | What it does |
| --- | --- |
| `normalizePresentationForms(text)` | Replaces Arabic presentation-form glyphs with real letters (NFKC). |
| `hasPresentationForms(text)` | `true` if the text contains those glyphs. |
| `fixReversedLine(line)` | Reverses an Arabic line copied in visual order; keeps numbers/Latin, mirrors brackets. |
| `fixReversedText(text)` | Same for every Arabic line in a block; line order is kept. |
| `fixArabicPdfText(text, { reversed })` | Normalizes letters, and reverses lines only when you say the text is reversed. |

Reversal is **not** applied automatically: detecting reversed Arabic reliably needs the PDF's glyph positions, not just the copied string. If you have the PDF itself, extracting with positions is the robust fix — that is what [MyPDFX](https://www.mypdfx.com/extract-text) does, and its OCR mode reads scanned PDFs too.

## Limits

- Works on text you already copied. Scanned PDFs (images) have no text to copy — they need OCR.
- Some PDFs store damaged font maps (missing letters). No text fixer can recover those; OCR the rendered page instead.

## License

MIT © MyPDFX — [www.mypdfx.com](https://www.mypdfx.com), Arabic-first PDF tools: PDF to Word with Arabic OCR, PDF tables to Excel, text extraction, merge, compress and more.
