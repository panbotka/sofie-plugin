# CLAUDE.md — sofie-plugin

Chrome/Brave Manifest V3 extension that replaces "Sofie Elefteriadu" with "Sofie Chodúrová"
on every page, including Czech declension of the surname. Everything in the repo is in **English**
(code, comments, docs, commits). Only the test sentences are Czech.

## Layout

- `manifest.json`: MV3 manifest. A single content script on `<all_urls>`, all frames, no permissions.
- `src/replace.js`: **all replacement logic.** It is pure, with no DOM access, and is exported as
  `globalThis.SofieReplace` and as `module.exports`, so Node can test it.
- `src/content.js`: DOM walker plus `MutationObserver`. It skips inputs, textareas,
  contenteditable elements, scripts and styles.
- `test/replace.test.js`: `node:test` unit tests (run with `npm test`; there are no dependencies).
- `test/fixture.html`: page for the end-to-end check in a real browser.

## How declension works

The first name is left untouched; only the surname is rewritten. The case is decided in
`grammaticalCase(first, prep)`:
- `Sofií` → instrumental (Chodúrovou).
- `Sofii` → dative or locative (Chodúrové) after k/ke/díky/proti/o/v/při/po…
  Otherwise accusative (Chodúrovou).
- `Sofie`/`Sofia`/no first name → genitive (Chodúrové) after od/do/z/u/bez…
  With no first name, the dative, locative, accusative and instrumental prepositions also apply.
  The default is the nominative (Chodúrová).
- An optional `paní` between the preposition and the name is allowed.

When adding a rule, add a test case to `test/replace.test.js` first.

## Verification

1. `npm test` must pass.
2. Run the end-to-end test in a real browser. Extensions need a headed Chrome, so on the Pi use Xvfb:
   ```bash
   Xvfb :99 &   export DISPLAY=:99
   python3 -m http.server 8731 --directory test &
   agent-browser close; agent-browser --extension "$PWD" open http://localhost:8731/fixture.html
   agent-browser eval "document.body.innerText"   # expect Chodúrová/Chodúrovou, textarea unchanged
   agent-browser close
   ```
   Clean up by PID (`kill <pid>`), **not** with `pkill -f "Xvfb :99"`. That pattern also
   matches the shell running the command, so `pkill` kills the shell too.

## Release

Bump `version` in **both** `manifest.json` and `package.json`. There is no Web Store listing;
users install it as an unpacked extension (see README).

Repo: https://github.com/panbotka/sofie-plugin (public, MIT).
