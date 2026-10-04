// Content script: walks the page and replaces the name in text nodes and in a
// few user-visible attributes. Keeps watching the DOM for dynamically loaded content.
(function () {
  'use strict';

  const { replaceText, QUICK } = globalThis.SofieReplace;

  // Never touch code, styles or anything the user is typing into.
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'TEMPLATE']);
  const ATTRIBUTES = ['title', 'alt', 'aria-label', 'placeholder'];

  function isSkipped(element) {
    for (let el = element; el; el = el.parentElement) {
      if (SKIP_TAGS.has(el.tagName) || el.isContentEditable) return true;
    }
    return false;
  }

  function fixTextNode(node) {
    const value = node.nodeValue;
    if (!value || !QUICK.test(value) || isSkipped(node.parentElement)) return;
    const replaced = replaceText(value);
    if (replaced !== value) node.nodeValue = replaced;
  }

  function fixAttributes(element) {
    if (isSkipped(element)) return;
    for (const name of ATTRIBUTES) {
      const value = element.getAttribute(name);
      if (value && QUICK.test(value)) {
        const replaced = replaceText(value);
        if (replaced !== value) element.setAttribute(name, replaced);
      }
    }
  }

  function fixTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      fixTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) fixAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) fixTextNode(node);
      else fixAttributes(node);
    }
  }

  function fixTitle() {
    const replaced = replaceText(document.title);
    if (replaced !== document.title) document.title = replaced;
  }

  fixTree(document.body || document.documentElement);
  fixTitle();

  // Replacements never re-match, so the observer cannot loop on its own changes.
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'characterData') fixTextNode(m.target);
      else if (m.type === 'attributes') fixAttributes(m.target);
      else m.addedNodes.forEach(fixTree);
    }
    fixTitle();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRIBUTES,
  });
})();
