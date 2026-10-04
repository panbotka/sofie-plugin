# Sofie Replace

A tiny Chrome / Brave extension that replaces the name **Sofie Elefteriadu** with
**Sofie Chodúrová** on every web page you visit. It handles Czech grammatical cases.

| Original | Replaced |
|---|---|
| Sofie Elefteriadu zpívá. | Sofie Chodúrová zpívá. |
| Dopis od Sofie Elefteriadu. | Dopis od Sofie Chodúrové. |
| Mám dárek pro Sofii Elefteriadu. | Mám dárek pro Sofii Chodúrovou. |
| Rozhovor se Sofií Elefteriadu. | Rozhovor se Sofií Chodúrovou. |
| Mluvil jsem s paní Elefteriadu. | Mluvil jsem s paní Chodúrovou. |

## Installation

The extension is not in the Chrome Web Store. You load it as an "unpacked" extension, which takes about a minute.

1. **Download the code.** Pick one of these:
   - Click the green **Code** button on this GitHub page, choose **Download ZIP**, and unzip it, or
   - run `git clone https://github.com/panbotka/sofie-plugin.git`.
2. **Open the extensions page:**
   - Brave: type `brave://extensions` in the address bar.
   - Chrome: type `chrome://extensions` in the address bar.
3. **Turn on Developer mode** with the switch in the top-right corner.
4. Click **Load unpacked** and select the folder that contains `manifest.json`.
5. Done. Reload any open tabs, and the name is replaced everywhere.

**To update:** download the new version into the same folder, then click the ↻ (reload) icon
on the extension's card in `brave://extensions`.

**To uninstall or pause:** click **Remove**, or switch the extension off on its card.

> Do not delete or move the folder after installing. The browser loads the extension from it.
> Brave / Chrome may show a "Disable developer mode extensions" notice on startup. That is
> expected for unpacked extensions; just close it.

## What it does

- Replaces the name in page text, in the tab title, and in the `title`, `alt`, `aria-label`,
  and `placeholder` attributes.
- Also handles content that loads later (infinite scroll, social media, news sites) via a `MutationObserver`.
- Never changes text you are typing (inputs, textareas, rich-text editors) or page code.
- Recognises the spellings *Elefteriadu*, *Elefteriadou*, *Eleftheriadu*, and *Eleftheriadou*,
  in any letter case.
- Runs entirely locally. It makes no network requests and collects no data.

## Known limitations

- **Genitive without a preposition** ("koncert Sofie Elefteriadu") becomes "koncert Sofie Chodúrová",
  because "Sofie" looks the same in the nominative and the genitive.
- **Sofii without diacritics after "se"** is assumed to be the instrumental case ("se Sofii" → "Chodúrovou").
- A name split across HTML elements (e.g. `<b>Sofie</b> Elefteriadu`) is only partly handled:
  the surname is replaced, but in the nominative.
- Text inside images, videos, PDFs, and closed Shadow DOM is not changed.

## Development

```bash
npm test   # unit tests for the replacement logic (Node 18+, no dependencies)
```

- `src/replace.js`: pure text replacement and Czech case detection, with no DOM access.
- `src/content.js`: the content script that walks the DOM and watches for changes.
- `test/fixture.html`: a page for manual testing in the browser.

## License

[MIT](LICENSE)
