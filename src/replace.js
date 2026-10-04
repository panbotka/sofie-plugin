// Pure text replacement logic. No DOM access, so it can be unit-tested in Node.
// Exposed as globalThis.SofieReplace (browser) and module.exports (Node).
(function (root) {
  'use strict';

  // Surname spellings to replace: Elefteriadu, Elefteriadou, Eleftheriadu, Eleftheriadou.
  const SURNAME = 'Elefth?eriado?u';

  // Czech forms of the first name that may precede the surname.
  const FIRST = 'Sof(?:ie|ii|ií|ia)';

  // Prepositions that decide the grammatical case when the first name is
  // missing or ambiguous. Longer variants first ("se" before "s").
  const GEN = ['od', 'do', 'ze', 'z', 'u', 'bez', 'kromě', 'podle', 'vedle', 'okolo', 'kolem', 'místo', 'během', 'blízko', 'uprostřed'];
  const DAT = ['kvůli', 'proti', 'naproti', 'díky', 'vůči', 'ke', 'k'];
  const LOC = ['při', 've', 'v', 'o', 'po'];
  const ACC = ['pro', 'přes', 'mimo', 'na', 'za'];
  const INS = ['se', 's', 'před', 'nad', 'pod', 'mezi'];

  const PREPS = [...GEN, ...DAT, ...LOC, ...ACC, ...INS].sort((a, b) => b.length - a.length);

  const WS = '[\\s\\u00A0]+';
  const NOT_LETTER_BEFORE = '(?<![\\p{L}\\p{N}])';
  const NOT_LETTER_AFTER = '(?![\\p{L}\\p{N}])';

  const PATTERN = new RegExp(
    NOT_LETTER_BEFORE +
      `(?:(?<prep>${PREPS.join('|')})${WS})?` +
      `(?:(?<title>paní)${WS})?` +
      `(?:(?<first>${FIRST})${WS})?` +
      `(?<last>${SURNAME})` +
      NOT_LETTER_AFTER,
    'giu'
  );

  // Cheap pre-check so we only run the big regex on relevant text.
  const QUICK = /eleft/i;

  const FORMS = {
    nom: 'Chodúrová', // Sofie Chodúrová
    gen: 'Chodúrové', // od Sofie Chodúrové
    dat: 'Chodúrové', // k Sofii Chodúrové
    acc: 'Chodúrovou', // pro Sofii Chodúrovou
    loc: 'Chodúrové', // o Sofii Chodúrové
    ins: 'Chodúrovou', // se Sofií Chodúrovou
  };

  /** Returns the grammatical case for a match based on the first name form and preposition. */
  function grammaticalCase(first, prep) {
    const p = prep ? prep.toLowerCase() : null;
    const f = first ? first.toLowerCase() : null;
    const has = (list) => p !== null && list.includes(p);

    if (f === 'sofií') return 'ins';
    if (f === 'sofii') {
      if (has(DAT)) return 'dat';
      if (has(LOC)) return 'loc';
      if (has(INS)) return 'ins'; // "se Sofii" = "se Sofií" typed without diacritics
      return 'acc'; // "viděl jsem Sofii", "pro Sofii", "na Sofii"
    }
    // "Sofie", "Sofia" or no first name at all.
    if (has(GEN)) return 'gen';
    if (f === null) {
      if (has(DAT)) return 'dat';
      if (has(LOC)) return 'loc';
      if (has(ACC)) return 'acc';
      if (has(INS)) return 'ins';
    }
    return 'nom';
  }

  /** Applies the letter case of the original surname (e.g. ALL CAPS) to the replacement. */
  function matchLetterCase(original, replacement) {
    if (original === original.toUpperCase()) return replacement.toUpperCase();
    if (original === original.toLowerCase()) return replacement.toLowerCase();
    return replacement;
  }

  /** Replaces every occurrence of Sofie Elefteriadu in a string. */
  function replaceText(text) {
    if (typeof text !== 'string' || !QUICK.test(text)) return text;
    return text.replace(PATTERN, (match, ...args) => {
      const groups = args[args.length - 1];
      const form = FORMS[grammaticalCase(groups.first, groups.prep)];
      const surnameStart = match.length - groups.last.length;
      return match.slice(0, surnameStart) + matchLetterCase(groups.last, form);
    });
  }

  const api = { replaceText, grammaticalCase, QUICK };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SofieReplace = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
