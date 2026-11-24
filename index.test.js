import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePresentationForms, hasPresentationForms, fixReversedLine, fixReversedText, fixArabicPdfText } from "./index.js";

test("presentation forms become real letters", () => {
  const shapes = "ﻣﺮﺣﺒﺎ"; // مرحبا as glyph shapes
  assert.ok(hasPresentationForms(shapes));
  assert.equal(normalizePresentationForms(shapes), "مرحبا");
  assert.equal(normalizePresentationForms("ﻻ"), "لا"); // lam-alef ligature
});

test("a reversed Arabic line is put back in reading order", () => {
  assert.equal(fixReversedLine("ملاعلا ابحرم"), "مرحبا العالم");
});

test("numbers and Latin words keep their own order", () => {
  // "السعر 1250 ريال" copied in visual order
  assert.equal(fixReversedLine("لاير 1250 رعسلا"), "السعر 1250 ريال");
  assert.equal(fixReversedLine("PDF فلم"), "ملف PDF");
  assert.equal(fixReversedLine("2026-11-20 :خيراتلا"), "التاريخ: 2026-11-20");
});

test("brackets are mirrored", () => {
  // Drawn left-to-right, "نص (تجربة)" is stored as "(ةبرجت) صن" (brackets are mirrored when drawn).
  assert.equal(fixReversedLine("(ةبرجت) صن"), "نص (تجربة)");
});

test("multi-line text keeps line order; non-Arabic lines untouched", () => {
  assert.equal(fixReversedText("لوأ رطس\nHello 123\nيناث رطس"), "سطر أول\nHello 123\nسطر ثاني");
});

test("one-call helper", () => {
  assert.equal(fixArabicPdfText("ﻣﺮﺣﺒﺎ"), "مرحبا");
  assert.equal(fixArabicPdfText("ﺎﺒﺣﺮﻣ", { reversed: true }), "مرحبا");
});
