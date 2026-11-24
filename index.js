// arabic-pdf-text-fix — fix Arabic text copied out of PDF files.
// MIT License. Made by MyPDFX (https://www.mypdfx.com), Arabic-first PDF tools.
//
// Two common problems when you copy Arabic from a PDF:
//  1. "Presentation forms": the PDF stores the *shapes* of letters (U+FB50–U+FDFF,
//     U+FE70–U+FEFF) instead of the real letters, so search, sorting and spell
//     check fail even though the text looks fine.
//  2. Visual order: the PDF stores the line in the order it is DRAWN (left to right),
//     so the copied Arabic comes out reversed.

const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const PRESENTATION_FORMS = /[ﭐ-﷿ﹰ-﻿]/g;
const MIRROR = { "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", "«": "»", "»": "«" };

/** Replace Arabic presentation-form glyphs with the real letters (NFKC). */
export function normalizePresentationForms(text) {
  return String(text).replace(PRESENTATION_FORMS, (ch) => ch.normalize("NFKC"));
}

/** True when the text contains Arabic presentation-form glyphs. */
export function hasPresentationForms(text) {
  return /[ﭐ-﷿ﹰ-﻿]/.test(String(text));
}

// Split a line into runs: Arabic runs (Arabic letters + spaces/punctuation between
// them) and LTR runs (Latin letters and digits, which keep their own order).
function runs(line) {
  const out = [];
  const tokens = line.match(/[A-Za-z0-9٠-٩۰-۹]+(?:[.,:/\-_%][A-Za-z0-9٠-٩۰-۹]+)*|[^A-Za-z0-9٠-٩۰-۹]/g) || [];
  for (const t of tokens) {
    const ltr = /^[A-Za-z0-9٠-٩۰-۹]/.test(t);
    out.push({ text: t, ltr });
  }
  return out;
}

/**
 * Fix ONE line of Arabic that was copied in visual (reversed) order.
 * Arabic characters are reversed; Latin words and numbers keep their own order;
 * brackets are mirrored.
 */
export function fixReversedLine(line) {
  const parts = runs(String(line)).reverse();
  return parts
    .map((p) => (p.ltr ? p.text : MIRROR[p.text] ?? p.text))
    .join("");
}

/** Fix every line of a reversed text block (keeps the line order). */
export function fixReversedText(text) {
  return String(text)
    .split(/\r?\n/)
    .map((l) => (ARABIC.test(l) ? fixReversedLine(l) : l))
    .join("\n");
}

/**
 * One call for text pasted from a PDF:
 *  - always converts presentation forms to real letters;
 *  - reverses Arabic lines only when `reversed: true` (you can see the text is
 *    backwards; automatic detection is not reliable enough to do it silently).
 */
export function fixArabicPdfText(text, { reversed = false } = {}) {
  const normalized = normalizePresentationForms(text);
  return reversed ? fixReversedText(normalized) : normalized;
}

export default fixArabicPdfText;
