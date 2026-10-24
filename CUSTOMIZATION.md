# Customization manual

This guide shows you how to change **everything** on your website without knowing how to code.
Almost every change happens in **one file: `content.json`**. Open it in any text editor
(Notepad, TextEdit in plain-text mode, or, best of all, the free [VS Code](https://code.visualstudio.com/)).

> **Quick links:** [JSON rules](#json-rules-read-this-once) · [Checking a change](#how-to-check-that-a-change-worked) · [1 Name](#1-change-your-display-name) · [2 Tagline](#2-change-the-homepage-tagline) · [3 Hero image](#3-replace-the-homepage-hero-image) · [4 Bio](#4-change-the-about-page-biography) · [5 Sections](#5-add-and-remove-about-page-sections) · [6 Social](#6-add-social-media-links) · [7 New project](#7-add-a-new-works-project) · [8 Title](#8-change-an-existing-project-title) · [9 YouTube](#9-add-a-youtube-video) · [10 Thumbnail](#10-change-a-project-thumbnail) · [11 Auto thumbnail](#11-use-an-automatically-retrieved-youtube-thumbnail) · [12 Website link](#12-add-a-normal-external-website-link) · [13 Description/category](#13-change-project-descriptions-and-categories) · [14 Hide](#14-hide-a-project-without-deleting-it) · [15 Colors](#15-change-the-website-colors) · [16 Font](#16-change-the-font) · [17 Navigation](#17-edit-the-navigation-labels) · [18 Tab title/favicon](#18-change-the-browser-tab-title-and-favicon) · [19 Images](#19-add-and-organize-image-files) · [20 Preview](#20-preview-changes-locally) · [21 Publish](#21-publish-changes-through-github) · [22 Undo](#22-undo-a-change-if-something-breaks) · [23 Mistakes](#23-common-mistakes-and-how-to-fix-them) · [Quick reference](#quick-reference-every-editable-field)

---

## JSON rules (read this once)

`content.json` is written in a format called **JSON**. It is strict but simple. These five rules
cover 99% of problems:

1. **Text goes in straight double quotes:** `"like this"`. Not single quotes `'like this'` and not curly “smart quotes” (some word processors turn quotes curly; use a plain-text editor).
2. **Every line in a list or block ends with a comma, except the last one.**
   ```json
   { "label": "YouTube", "url": "https://youtube.com/@me" },   ← comma: more items follow
   { "label": "GitHub",  "url": "https://github.com/me" }      ← NO comma: this is the last one
   ```
3. **Brackets must pair up.** `{ ... }` holds one thing (a project, a link). `[ ... ]` holds a list of things. Every opener needs its closer.
4. **To use a double quote *inside* text, write `\"`**: `"description": "My \"best\" work"`.
5. **`true` and `false` have no quotes** and are lowercase: `"show": false`.

Keys that start with an underscore (like `"_help"`) are notes for you. The website ignores them. You can leave them or delete them.

**A safety net:** if you make a typo, the website does not crash. It shows safe default content and, when you preview locally, a yellow box tells you what is wrong and roughly which line. Paste the file into <https://jsonlint.com> to find the exact spot.

### How to check that a change worked

1. Save the file.
2. Open your local preview (see [section 20](#20-preview-changes-locally)) and refresh the page (Ctrl+R / Cmd+R; use Ctrl+Shift+R / Cmd+Shift+R if you still see the old version).
3. After publishing, the same on your real website address (allow 1–10 minutes for GitHub to update).
4. If a yellow **"Heads-up for the site owner"** box appears at the top of the preview, read it. It lists every problem it found in plain language. Visitors never see that box.

### Project folder map

```
skip-portfolio/
├── index.html        ← Home page      (you never need to edit the three HTML files)
├── about.html        ← About page
├── works.html        ← Works page
├── content.json      ← ★ ALL your text, links, colors, images paths: edit this one
├── styles.css        ← the design (advanced users only)
├── script.js         ← the behavior (advanced users only)
├── assets/
│   ├── favicon.svg   ← tab icon
│   └── images/       ← ★ put your pictures here
│       ├── hero-placeholder.svg
│       ├── about-placeholder.svg
│       ├── about/    ← pictures used inside About-page sections
│       └── projects/ ← project thumbnails
├── README.md
└── CUSTOMIZATION.md  ← this file
```

---

## 1. Change your display name

- **File:** `content.json`
- **Key:** `site` → `name`
- It appears in the menu bar, as the huge title on the homepage, and in the footer.

**Original:**
```json
"site": {
  "name": "skip",
```
**Modified:**
```json
"site": {
  "name": "skip beats",
```
- Keep the quotes and the comma at the end of the line.
- Long names are shrunk automatically so they fit, but short names look best (the homepage title is huge on purpose).
- **Check:** refresh the Home page; the menu bar and the big title both show the new name.

---

## 2. Change the homepage tagline

- **File:** `content.json`
- **Keys:** `home` → `tagline` (big sentence), `eyebrow` (small line above your name), `intro` (short paragraph below)

**Original:**
```json
"eyebrow": "Sound design · Video editing · Game development",
"tagline": "I make things you can hear, watch and play.",
"intro": "Sound effects, edits and small games, built with a love for the details most people only feel.",
```
**Modified:**
```json
"eyebrow": "Sound design · Edits · Games",
"tagline": "Turning silence into something you can feel.",
"intro": "",
```
- Set `intro` or `eyebrow` to `""` (empty quotes) to remove that line. Or hide them without touching the text with `visibility` → `homeIntro` / `homeEyebrow` set to `false`.
- The `·` symbol is just text; copy it or use `|` or `-`.
- **Check:** refresh the Home page.

---

## 3. Replace the homepage hero image

The hero image is the large picture behind your name.

- **File:** `content.json`
- **Key:** `images` → `hero` (and `heroAlt`)
- **Where to put the picture:** inside the `assets/images/` folder.

**Step by step**
1. Pick a wide picture, ideally about **1920 × 1080 pixels or larger**, saved as `.jpg`, `.webp` or `.png`. Keep the file under about 500 KB–1 MB so the site loads quickly.
2. Name it with only lowercase letters, numbers and dashes, e.g. `hero.jpg` (no spaces).
3. Copy it into `assets/images/`.
4. Change the path in `content.json`:

**Original:**
```json
"images": {
  "hero": "assets/images/hero-placeholder.svg",
  "heroAlt": "Abstract glowing sound waveform on a dark background",
```
**Modified:**
```json
"images": {
  "hero": "assets/images/hero.jpg",
  "heroAlt": "Me at my desk surrounded by synthesizers",
```
- **Avoid broken paths:** write the path *exactly* like the file name, including the extension (`.jpg`) and capital letters (`Hero.JPG` is a different file from `hero.jpg` on GitHub). Never start with `/` and never use `C:\...`. The path starts at `assets/`.
- `heroAlt` describes the picture for visitors using screen readers. Keep it short.
- **Related tuning (all under `home`):**
  - `"imageFocus": "center"` → which part stays visible when the picture is cropped: `"top"`, `"bottom"`, `"left"`, `"right"` or `"30% 70%"`.
  - `"imageDim": 0.55` → from `0` (no darkening) to `1` (very dark). Raise it if text is hard to read.
  - `"layout": "split"` → text on the left, picture on the right instead of behind the text.
  - `"heroHeight"`: `"full"`, `"tall"` or `"medium"`. `"textAlign"`: `"left"` or `"center"`.
- **Check:** refresh the Home page. If the picture is missing you will see a tasteful dark pattern instead and (in preview) a yellow message naming the file it could not find.

---

## 4. Change the About page biography

- **File:** `content.json`
- **Keys:** `about` → `heading`, `lead`, `bio`, `portraitCaption` (and the picture itself: `images` → `aboutPortrait`)

`bio` is a **list of paragraphs**. Each paragraph is its own piece of text inside the square brackets.

**Original:**
```json
"heading": "About me",
"lead": "Creative generalist with a soft spot for sound.",
"bio": [
  "Hi, I'm skip. This is a sample biography: replace it ...",
  "I work across sound design, sound effects, video editing and game development. ...",
  "Right now I'm collecting projects here and always up for new collaborations. ..."
],
```
**Modified (two paragraphs):**
```json
"heading": "Hi, I'm skip",
"lead": "Sound designer, editor and game tinkerer from Leeds.",
"bio": [
  "I started making sound effects in my bedroom in 2019 and never stopped.",
  "These days I edit videos, build small games and score anything that will hold still."
],
```
- Add a paragraph: add a comma after the previous paragraph's closing quote and write a new `"..."`.
- The last paragraph has **no comma**.
- Plain text only. HTML tags such as `<b>` are shown literally, on purpose (it keeps your site safe).
- **Your portrait photo:** copy it to `assets/images/` (portrait orientation, about 800 × 1000 px works well) and set `"aboutPortrait": "assets/images/me.jpg"` and `"aboutPortraitAlt": "Photo of me"` under `images`. Use `"aboutPortrait": ""` for no picture; the text then uses the full width. `about` → `portraitCaption` is the optional caption under it (`""` for none).
- **Check:** refresh the About page.

---

## 5. Add and remove About page sections

Below your main biography you can have as many extra sections as you like (`about` → `sections`). Each section is one `{ ... }` block.

**One section, with every option shown:**
```json
{
  "id": "what-i-do",
  "show": true,
  "heading": "What I do",
  "paragraphs": [ "First paragraph.", "Second paragraph." ],
  "list": [ "Bullet point one", "Bullet point two" ],
  "image": {
    "src": "assets/images/about/studio.jpg",
    "alt": "My studio",
    "caption": "Optional caption under the picture"
  },
  "imagePosition": "right",
  "links": [ { "label": "My gear list", "url": "https://example.com/gear" } ]
}
```
Only `heading` is really needed; leave out anything you do not want (for example delete the whole `"image": { ... }` part, and the comma before it, to have no picture).

- `imagePosition`: `"right"`, `"left"` or `"top"` (full width above the text).
- `id`: any short name with letters, numbers and dashes. It lets you link directly to the section later (`about.html#section-what-i-do`).
- **Add a section:** copy a whole `{ ... }` block, paste it right after another block's closing `}` with a **comma between them**, and change the values.
- **Hide a section (keeps it for later):** set `"show": false`.
- **Remove a section completely:** delete its whole block from `{` to `}` and fix the commas (the last block must have no comma after it).
- **Where to put section pictures:** `assets/images/about/` (a tidy habit, any folder under `assets/images/` works). The path is `assets/images/about/studio.jpg`.
- **Other About-page parts:**
  - `socialHeading` → title above your social links (also controlled by `visibility` → `aboutSocialLinks`).
  - `externalLinksHeading` and `externalLinks` → a list of other links with optional descriptions (switch off with `visibility` → `aboutExternalLinks`):
    ```json
    "externalLinks": [
      { "label": "Sound effects library", "url": "https://example.com/sfx", "description": "Free sounds for your own projects.", "show": true }
    ]
    ```
- **Check:** refresh the About page; the section appears (or disappears) in the same order as in the file.

---

## 6. Add social media links

- **File:** `content.json`
- **Key:** `social` → `items`
- They appear on the About page, in the footer, and optionally on the Home page.

**Original:**
```json
"items": [
  { "label": "YouTube",    "url": "https://www.youtube.com/@your-channel", "show": true },
  { "label": "SoundCloud", "url": "https://soundcloud.com/your-name",      "show": true },
  { "label": "GitHub",     "url": "https://github.com/your-username",      "show": true },
  { "label": "Instagram",  "url": "https://www.instagram.com/your-name",   "show": false },
  { "label": "Email",      "url": "mailto:hello@example.com",              "show": false }
]
```
**Modified** (real addresses, Instagram switched on, a new Twitch line added at the end):
```json
"items": [
  { "label": "YouTube",    "url": "https://www.youtube.com/@skipsounds",    "show": true },
  { "label": "SoundCloud", "url": "https://soundcloud.com/skipsounds",      "show": true },
  { "label": "GitHub",     "url": "https://github.com/skipway",             "show": true },
  { "label": "Instagram",  "url": "https://www.instagram.com/skipsounds",   "show": true },
  { "label": "Email",      "url": "mailto:me@mydomain.com",                 "show": false },
  { "label": "Twitch",     "url": "https://www.twitch.tv/skipsounds",       "show": true }
]
```
- The comma after the old last line (Email) is **required** once you add Twitch below it; Twitch has none.
- `label` is the visible text; `url` must start with `https://` (or `mailto:` for email). Anything else (for example `javascript:`) is ignored for safety.
- To show social links on the **Home page** too: `visibility` → `"homeSocialLinks": true`. To hide the footer links: `"footerSocialLinks": false`.
- **Check:** refresh the About page and click each link. It opens in a new tab.

---

## 7. Add a new Works project

- **File:** `content.json`
- **Key:** `works` → `projects` (a list of `{ ... }` blocks)

**The easy way:** copy an existing project block, paste it after the last project, put a comma between, and change the values.

**Original** (the end of the list):
```json
      {
        "show": true,
        "title": "Sound Effects Pack Vol. 1",
        "description": "",
        "category": "Sound Design",
        "year": 2023,
        "url": "https://example.com/sfx-pack"
      },
      {
        "show": false,
        "title": "Hidden example project",
        ...
      }
    ]
```
**Modified** (a new project added at the end; note the comma after the previous `}`):
```json
      {
        "show": false,
        "title": "Hidden example project",
        ...
      },
      {
        "show": true,
        "title": "Rainy Day Foley",
        "description": "Foley recorded for a short film.",
        "category": "Sound Design",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=aqz-KE-bpKQ"
      }
    ]
```
Only `title` is required. See the [quick reference](#quick-reference-every-editable-field) for all project fields.
Projects appear in the order written. Set `works` → `"sort": "newest"` to order by year instead.
- **Check:** refresh the Works page. If your project is missing, check the yellow box (preview) and the commas between blocks.

---

## 8. Change an existing project title

- **File:** `content.json`
- **Key:** `works` → `projects` → the project's `title`
- The title is independent of the link, so you can rename a project without touching its URL or thumbnail.

**Original:** `"title": "Pixel Drift",`
**Modified:** `"title": "Pixel Drift (Game Jam Edition)",`

- Find the project by searching the file for its old title (Ctrl+F / Cmd+F).
- **Check:** refresh the Works page.

---

## 9. Add a YouTube video

- **File:** `content.json`
- **Key:** the project's `url`

Paste the video address into `url`. These formats are recognised automatically (with or without `www.`, `m.`, `https://`, and extras such as `&t=90`):

| Format | Example |
|---|---|
| Normal watch link | `https://www.youtube.com/watch?v=aqz-KE-bpKQ` |
| Short link | `https://youtu.be/aqz-KE-bpKQ` |
| YouTube Shorts | `https://www.youtube.com/shorts/aqz-KE-bpKQ` |

**Original:**
```json
"url": "https://example.com/sfx-pack"
```
**Modified:**
```json
"url": "https://youtu.be/aqz-KE-bpKQ"
```
What visitors get: a card with the video's thumbnail and a play button. Clicking it loads YouTube's privacy-friendly player (`youtube-nocookie.com`) inside the card, and a "Watch on YouTube" button stays underneath. **Videos never start by themselves**; they only play after a visitor clicks.

Variations:
- **A start time:** add it to the address (`https://youtu.be/aqz-KE-bpKQ?t=90` or `?t=1m30s`).
- **Link goes to a normal page but you also want a video:** keep `url` as the page and put the video in a separate field:
  ```json
  "url": "https://example.com/my-devlog",
  "video": "https://www.youtube.com/watch?v=aqz-KE-bpKQ"
  ```
- **No player, only a link card:** add `"embed": false,` to the project.
- If a video's owner has disabled embedding, YouTube says so inside the player and the "Watch on YouTube" button still works. The website also tries to switch such a card back to a plain link automatically (this relies on a signal from YouTube; the always-present button is the reliable fallback).
- **Check:** refresh the Works page; click the play button.

---

## 10. Change a project thumbnail

The thumbnail is the picture on the project card. It is separate from the link: you can change either one without affecting the other.

- **File:** `content.json`
- **Key:** the project's `thumbnail` (optional description for screen readers: `thumbnailAlt`)
- **Where to put the picture:** `assets/images/projects/`

**Step by step**
1. Make a picture in the shape set by `works` → `thumbnailRatio` (default `"16 / 9"`, e.g. **1280 × 720** pixels). `.jpg`, `.webp`, `.png` or `.svg`. Other shapes are cropped to fit, never stretched.
2. Name it simply, e.g. `pixel-drift.jpg`, and copy it into `assets/images/projects/`.
3. Set the path:

**Original:**
```json
"thumbnail": "",
```
**Modified:**
```json
"thumbnail": "assets/images/projects/pixel-drift.jpg",
"thumbnailAlt": "Screenshot of the Pixel Drift title screen",
```
- If a project has **no** `"thumbnail"` line at all, that is fine too.
- **Avoid broken paths:** exact file name, extension and capital letters; no leading `/`. If the file cannot be found, the card falls back to the YouTube thumbnail (for videos) or a tasteful placeholder, and the preview's yellow box names the missing file.
- **Change the shape for all cards:** `works` → `"thumbnailRatio": "1 / 1"` (square), `"4 / 3"`, etc.
- **Check:** refresh the Works page.

---

## 11. Use an automatically retrieved YouTube thumbnail

Nothing to configure: if the project's `url` (or `video`) is a YouTube address and the project has **no** custom `thumbnail`, the website fetches YouTube's own thumbnail.

**Automatic thumbnail:**
```json
{
  "title": "Neon Rain: Sound Design Reel",
  "url": "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  "thumbnail": ""
}
```
**Switch to your own picture instead:** fill `thumbnail` ([section 10](#10-change-a-project-thumbnail)).
**Switch back to automatic:** set `"thumbnail": ""` or delete that line (and fix commas).

If YouTube's picture cannot be loaded (for example the visitor is offline), the placeholder is shown instead.
- **Check:** refresh the Works page. The card shows the video's own picture.

---

## 12. Add a normal external website link

Many sites (itch.io, SoundCloud, Instagram, a personal page...) cannot be embedded. For these the website shows a clean card with a button.

- **File:** `content.json`
- **Keys:** `url`, optionally `linkLabel`, `thumbnail`

**Original:**
```json
{
  "show": true,
  "title": "Sound Effects Pack Vol. 1",
  "description": "",
  "category": "Sound Design",
  "year": 2023,
  "url": "https://example.com/sfx-pack"
}
```
**Modified:**
```json
{
  "show": true,
  "title": "Sound Effects Pack Vol. 1",
  "description": "200 free sounds for your own projects.",
  "category": "Sound Design",
  "year": 2023,
  "url": "https://yourname.itch.io/sfx-pack",
  "linkLabel": "Download on itch.io",
  "thumbnail": "assets/images/projects/sfx-pack.jpg"
}
```
- `url` must start with `https://` (a missing `https://` is added for you, but typing it is better).
- `linkLabel` is the button text. If you leave it out, the button says "View on" plus the site name.
- The link opens in a new tab and is marked safe (`rel="noopener noreferrer"`).
- **Check:** refresh the Works page and click the button.

---

## 13. Change project descriptions and categories

- **File:** `content.json`
- **Keys:** the project's `description` and `category` (and `year`)

**Original:**
```json
"description": "",
"category": "Sound Design",
```
**Modified:**
```json
"description": "Recorded and mixed all effects for a 6-minute short film.",
"category": ["Sound Design", "Film"],
```
- `description` can be `""` or removed entirely; the card simply has no text.
- `category` is either one text (`"Game Dev"`) or a list of texts (`["Video", "Animation"]`). Cards with a list appear under each of its categories.
- **Filter buttons appear automatically** at the top of the Works page, built from your categories (spelling and capital letters must match: `"Sound Design"` and `"sound design"` would be two different filters). They only show when there are **two or more** categories. Switch them off with `visibility` → `"worksFilters": false`; change the "All" button text with `works` → `allLabel`.
- Projects with no category are shown under "All".
- `year` can be a number (`2025`) or text (`"2024–25"`).
- **Check:** refresh the Works page and click the filter buttons.

---

## 14. Hide a project without deleting it

- **File:** `content.json`
- **Key:** the project's `show`

**Original:** `"show": true,`
**Modified:** `"show": false,`

The project's information stays in the file; visitors just do not see it. Change it back to `true` to show it again. (A project with no `show` line counts as shown.)

Also useful: `"featured": true` shows the project on the Home page's "Featured work" strip and marks it with a small accent dot. Change how many appear with `home` → `featured` → `max`, or switch the strip off with `visibility` → `"homeFeaturedWorks": false`.
- **Check:** refresh the Works page. The project is gone (or back).

---

## 15. Change the website colors

- **File:** `content.json`
- **Keys:** `theme` → `colors` (everything else is derived automatically)

| Key | What it colors |
|---|---|
| `background` | the page background |
| `surface` | cards and chips |
| `text` | main text |
| `mutedText` | softer secondary text |
| `border` | thin lines |
| `accent` | **your highlight color**: buttons, active menu item, hover effects |
| `accentText` | text on top of accent-colored buttons (must stay readable!) |

**Original:**
```json
"colors": {
  "background": "#0e0e10",
  "surface": "#17171a",
  "text": "#f1efe9",
  "mutedText": "#9b9aa3",
  "border": "#2a2a30",
  "accent": "#ff6a3d",
  "accentText": "#140a06"
},
```
**Modified** (mint-green accent):
```json
"colors": {
  "background": "#0e0e10",
  "surface": "#17171a",
  "text": "#f1efe9",
  "mutedText": "#9b9aa3",
  "border": "#2a2a30",
  "accent": "#4de0b0",
  "accentText": "#04140d"
},
```
- Colors are written as `"#rrggbb"` hex codes (find one with any "color picker" website), or as names like `"tomato"`. An invalid color is ignored (the default is used) and the preview box tells you.
- **Restrained look tip:** change only `accent` first. If you pick a light accent, keep `accentText` dark; with a dark accent make `accentText` light (e.g. `"#ffffff"`).
- **A light website:** set `background` to `"#f6f4ef"`, `surface` to `"#ffffff"`, `text` to `"#16161a"`, `mutedText` to `"#5d5d66"`, `border` to `"#dcd9d0"`. (The shipped placeholder pictures are dark-themed; use your own pictures.)
- Corner roundness: `theme` → `"radius": "14px"` (`"0px"` = sharp, `"28px"` = very round). Turn off decorative motion: `"animations": false`.
- **Check:** refresh any page; buttons, the menu underline and hover effects use the new accent.

*(Advanced: the default values also live at the top of `styles.css` under `:root` as `--accent`, `--bg`, `--surface`, `--text`, `--muted`, `--border`, `--accent-text`. `content.json` overrides them, so you only edit CSS if you want to change the defaults.)*

---

## 16. Change the font

Your name and titles use the **heading** font; everything else uses the **body** font. Fonts come free from [Google Fonts](https://fonts.google.com).

- **File:** `content.json`
- **Keys:** `theme` → `fonts` → `heading` / `body` → `family`, `weights`, `fallback`

**Original:**
```json
"fonts": {
  "useGoogleFonts": true,
  "heading": {
    "family": "Syne",
    "weights": "600;700;800",
    "fallback": "'Arial Black', 'Helvetica Neue', Arial, sans-serif"
  },
```
**Modified** (heading font changed to Space Grotesk):
```json
"fonts": {
  "useGoogleFonts": true,
  "heading": {
    "family": "Space Grotesk",
    "weights": "500;700",
    "fallback": "'Helvetica Neue', Arial, sans-serif"
  },
```
Steps:
1. Browse <https://fonts.google.com>, open a font, and copy its **exact name** into `family`.
2. In the font's "Styles" list, note which weights exist (e.g. 400, 500, 700) and write them in `weights` separated by semicolons: `"400;700"`. If you list a weight that the font does not offer, Google refuses the whole font and the fallback is used, so check the list.
3. `fallback` = the fonts used while loading or if Google cannot be reached. Use `'single quotes'` around names with spaces (inside the JSON's double quotes). End with `sans-serif` or `serif`.
4. Refresh and look at the heading.

- No internet / Google blocked: the site still looks good, it simply uses the fallback fonts.
- **Do not want Google involved at all?** Set `"useGoogleFonts": false`. The site then uses the fallback stacks (or any font the visitor has installed).
- `weights` can only contain 3-digit numbers and semicolons; `family` only letters, numbers and spaces.
- **Check:** refresh; titles and text show the new typeface. In the preview, open your browser's network tab if in doubt: `fonts.googleapis.com` should answer with status 200.

---

## 17. Edit the navigation labels

- **File:** `content.json`
- **Key:** `navigation` → `items` → each item's `label`

**Original:**
```json
"items": [
  { "label": "Home",  "href": "index.html", "page": "home",  "show": true },
  { "label": "About", "href": "about.html", "page": "about", "show": true },
  { "label": "Works", "href": "works.html", "page": "works", "show": true }
]
```
**Modified:**
```json
"items": [
  { "label": "Start",   "href": "index.html", "page": "home",  "show": true },
  { "label": "Me",      "href": "about.html", "page": "about", "show": true },
  { "label": "Portfolio", "href": "works.html", "page": "works", "show": true },
  { "label": "Shop",    "href": "https://example.com/shop", "show": true }
]
```
- Only change `label` for a rename. Leave `href` and `page` alone unless you add or rename pages.
- `show: false` hides an item from the menu (the page still exists if someone knows the address).
- Extra items can point to outside websites (they open in a new tab). `page` can be omitted for them.
- **Page titles:** the words in the big page headings are set in `about` → `heading` and `works` → `heading`.
- **Check:** refresh; the menu shows your labels and the current page is underlined. On a phone-sized window, the menu is behind the three-line button.

---

## 18. Change the browser tab title and favicon

**Tab title**
- **File:** `content.json`
- **Keys:** `site` → `browserTitle` (Home page tab), `titleTemplate` (other pages), plus `about` → `pageTitle` and `works` → `pageTitle`

**Original:**
```json
"browserTitle": "skip | sound design, video & games",
"titleTemplate": "{page} | {name}",
```
**Modified:**
```json
"browserTitle": "skip beats: sound & games",
"titleTemplate": "{page} · {name}",
```
`{page}` becomes "About" or "Works" and `{name}` becomes your display name. Also set `site` → `description` for the short summary search engines show.

**Favicon (the tiny tab icon)**
- **Key:** `site` → `favicon`
- **Where to put the file:** `assets/` (next to `favicon.svg`)

1. Make a square picture, **at least 64 × 64** pixels (256 × 256 is ideal), as `.png` or `.svg` (`.ico` also works).
2. Save it as `assets/favicon.png`.
3. Change:

**Original:** `"favicon": "assets/favicon.svg",`
**Modified:** `"favicon": "assets/favicon.png",`

- Browsers cache favicons aggressively; if you still see the old one, close the tab and reopen it, or hard-refresh.
- **Check:** look at the browser tab.

---

## 19. Add and organize image files

**Where things go**

| Picture | Folder | Path you write in `content.json` |
|---|---|---|
| Homepage hero | `assets/images/` | `images` → `hero`: `"assets/images/hero.jpg"` |
| About portrait | `assets/images/` | `images` → `aboutPortrait`: `"assets/images/me.jpg"` |
| About section pictures | `assets/images/about/` | section `image` → `src`: `"assets/images/about/studio.jpg"` |
| Project thumbnails | `assets/images/projects/` | project `thumbnail`: `"assets/images/projects/my-game.jpg"` |
| Favicon | `assets/` | `site` → `favicon`: `"assets/favicon.png"` |
| Fallback card picture (optional) | `assets/images/` | `images` → `defaultThumbnail` |

**Rules that prevent broken images**
1. The path is always written **from the folder that contains `index.html`** and starts with `assets/`.
2. Never begin a path with `/` (that breaks the site on GitHub Pages) and never use `C:\Users\...`.
3. Match the file name **exactly**, including capital letters and the extension. On GitHub, `Hero.JPG` and `hero.jpg` are different files.
4. Use simple names: lowercase letters, numbers, dashes. No spaces (`my game.png` → `my-game.png`).
5. Use forward slashes `/`, not backslashes `\`.
6. Allowed picture types: `.jpg`, `.png`, `.webp`, `.gif`, `.svg`.
7. Keep pictures reasonably small (aim for under 500 KB–1 MB each; free tools like squoosh.app shrink them).
8. You may also use a full `https://...` picture address from another site, but pictures stored in your project are more reliable.

**If you upload through GitHub's website:** open `assets/images`, click **Add file → Upload files**, drop your pictures, **Commit changes** ([section 21](#21-publish-changes-through-github)).
**Check:** after setting the path, refresh; if a picture does not show, the preview's yellow box names the exact path that was not found.

---

## 20. Preview changes locally

Browsers refuse to read `content.json` when you simply double-click `index.html` (it opens as `file://...`), so you need a tiny local web server. You do **not** need to install anything unusual.

**Option A: Python** (already on many computers)
1. Open a terminal **inside the project folder** (Windows: open the folder, click the address bar, type `cmd` and press Enter; Mac: right-click the folder → *New Terminal at Folder*).
2. Run:
   ```bash
   python -m http.server 8000
   ```
   (On Windows you may need `py -m http.server 8000`; on Mac `python3 -m http.server 8000`.)
3. Open <http://localhost:8000> in your browser.
4. Press **Ctrl+C** in the terminal to stop.

**Option B: VS Code "Live Server"**: install the free *Live Server* extension, open the project folder, right-click `index.html` → *Open with Live Server*. The page refreshes automatically when you save.

**Option C: Node.js** (if you have it): `npx serve` in the project folder.

While previewing at `localhost`, the yellow **"Heads-up for the site owner"** box lists mistakes in `content.json` and missing images. You can also add `?debug` to any address (for example `https://yourname.github.io/skip-portfolio/?debug`) to see that box on the live site.

**Check:** after every save, refresh the browser (Ctrl+Shift+R forces a fresh copy).

---

## 21. Publish changes through GitHub

Your website lives in a GitHub repository (see `README.md` for the first-time setup). To publish a change:

**Method 1: GitHub website (no extra software)**
1. Go to your repository on github.com.
2. Click the file you changed (e.g. `content.json`), then the pencil icon **✎ Edit**. Paste in or edit your text.
   - For new pictures: open the folder (e.g. `assets/images/projects`) → **Add file → Upload files** → drop the pictures.
   - To replace a whole file with your edited copy: open its folder → **Add file → Upload files** → drop the file with the same name.
3. Scroll down, write a short message ("Add Rainy Day project"), keep **Commit directly to the main branch**, and click **Commit changes**.
4. Wait 1–10 minutes. Watch progress under the **Actions** tab (a yellow dot means "building", a green tick means "live").
5. Open your website address (`https://<your-username>.github.io/skip-portfolio/`) and refresh with Ctrl+Shift+R.

**Method 2: GitHub Desktop**
1. Edit the files in your local project folder.
2. Open GitHub Desktop: your changes are listed on the left.
3. Type a summary, click **Commit to main**, then **Push origin**.

**Check:** the live site shows the change after a hard refresh. If not, wait a few minutes and see [section 23](#23-common-mistakes-and-how-to-fix-them).

---

## 22. Undo a change if something breaks

Git remembers every version of every file, so you can always go back.

**On github.com**
1. Open your repository, click the **clock icon "N commits"** (or press `.`/open **Commits**).
2. Click the commit **before** the one that broke things.
3. Click **Browse files** (or **<>**) to see the repository exactly as it was.
4. To restore one file: open it, click **History**, click the older version's `<>` button, click **Raw**, copy the text, then go to the current file → **✎ Edit** → select all, paste → **Commit changes**.
5. Or revert a whole change: open the bad commit and click **… → Revert**, which makes a "revert" pull request; merge it.

**In GitHub Desktop:** *History* tab → right-click the bad commit → **Revert changes in commit** → **Push origin**.

**Before a risky edit**, copy `content.json` to somewhere safe (e.g. `content-backup.json` on your desktop, not in the repository).

If the *preview* is broken but you have not published yet: just undo in your editor (Ctrl+Z), or re-download the last good `content.json` from GitHub.

---

## 23. Common mistakes and how to fix them

| Symptom | Likely cause | Fix |
|---|---|---|
| Whole site shows default content and the preview box says *"content.json has a typo"* | A missing/extra comma, quote or bracket | Read the line number in the message, or paste the file into <https://jsonlint.com>. Check the line shown **and the line above it** (a missing comma is usually reported on the next line). |
| *"content.json could not be loaded"* in the preview | Opened `index.html` by double-clicking | Use a local server ([section 20](#20-preview-changes-locally)). |
| Everything is empty on the live site | `content.json` not uploaded, or uploaded into a sub-folder | It must sit next to `index.html` in the repository root. |
| A picture does not appear | Wrong path, wrong capitals, wrong extension, file not uploaded | Compare the path in `content.json` with the file name in GitHub letter by letter ([section 19](#19-add-and-organize-image-files)). |
| Picture works locally but not on GitHub | Capital letters differ (`Photo.JPG` vs `photo.jpg`) or path begins with `/` | Make them identical; remove the leading `/`. |
| My new project is not shown | `"show": false`, or a missing comma before the new block | Check `show`, and the comma between `}` and `{`. |
| A project has no link | `url` is missing or does not start with `https://` | Fix the address; the preview box names the project. |
| The video card shows a plain link, not a player | `"embed": false`, or the address is not a recognised YouTube address | Use one of the three formats in [section 9](#9-add-a-youtube-video). |
| The video says "Video unavailable" inside the player | The owner disabled embedding or the video is private | Use the "Watch on YouTube" button, or pick another video. |
| Filter buttons do not show | Fewer than two categories, or `worksFilters` is `false` | Give projects at least two different categories. |
| Colors did not change | Color typo (invalid value) or browser cache | Use `#rrggbb`; hard-refresh (Ctrl+Shift+R). |
| Font did not change | Weight not offered by the font, name misspelled, or `useGoogleFonts` is `false` | Check the font name and weights on fonts.google.com. |
| A line of text vanished | It was set to `""` or `visibility` hides it | Check the `visibility` block. |
| Quotes inside text break the file | Un-escaped `"` | Write `\"` instead, or use single quotes `'` inside your text. |
| Strange characters like `â€™` | File saved in the wrong encoding | Save as **UTF-8** in your editor. |
| Old version still showing after publishing | Browser cache or GitHub still building | Wait 1–10 minutes, check the **Actions** tab for a green tick, hard-refresh. |
| Page not found (404) on GitHub Pages | Pages not enabled, or the address is missing `/skip-portfolio/` | See README → "Publish with GitHub Pages". |
| Website looks unstyled | `styles.css` or `script.js` missing or renamed | Restore the original file names. |

If you are stuck, copy the text of the yellow preview box (or of the browser console: press F12 → Console) when you ask for help.

---

## Quick reference: every editable field

All of these live in `content.json`. **Optional** fields may be left out or set to `""`.

### `site`: site-wide settings
| Field | Purpose | Required? |
|---|---|---|
| `name` | Your display name (menu, hero title, footer) | Yes (default `skip`) |
| `browserTitle` | Browser tab title of the Home page | Optional |
| `titleTemplate` | Tab title of other pages; `{page}` and `{name}` are replaced | Optional |
| `description` | Short summary for search engines | Optional |
| `favicon` | Path to the tab icon | Optional |
| `language` | Page language code, e.g. `en` | Optional |
| `footerText` | Footer line; `{year}` and `{name}` are replaced; `""` hides it | Optional |

### `navigation.items[]`: menu
| Field | Purpose | Required? |
|---|---|---|
| `label` | Words in the menu | Yes |
| `href` | Page or web address it opens | Yes |
| `page` | `home`, `about` or `works` (highlights the current page) | Optional |
| `show` | `true`/`false` | Optional (default `true`) |

### `theme`: look
| Field | Purpose | Required? |
|---|---|---|
| `colors.background / surface / text / mutedText / border / accent / accentText` | See [section 15](#15-change-the-website-colors) | Optional |
| `fonts.useGoogleFonts` | `false` = never contact Google Fonts | Optional |
| `fonts.heading.family / weights / fallback` | Font for name and titles | Optional |
| `fonts.body.family / weights / fallback` | Font for text | Optional |
| `radius` | Corner roundness, e.g. `"14px"` | Optional |
| `animations` | `false` turns off decorative motion | Optional |

### `visibility`: show/hide parts (`true`/`false`)
`homeEyebrow`, `homeIntro`, `homeButtons`, `homeFeaturedWorks`, `homeSocialLinks`, `aboutPortrait`, `aboutSocialLinks`, `aboutExternalLinks`, `worksIntro`, `worksFilters`, `footer`, `footerSocialLinks`. All optional.

### `images`: site-wide picture paths
| Field | Purpose | Required? |
|---|---|---|
| `hero` | Homepage hero picture path | Optional (`""` = pattern only) |
| `heroAlt` | Description of the hero picture | Optional |
| `aboutPortrait` | About-page portrait path (`""` = none) | Optional |
| `aboutPortraitAlt` | Description of the portrait | Optional |
| `defaultThumbnail` | Picture for cards with no thumbnail and no video | Optional |

### `social.items[]`: social links
`label` (text), `url` (`https://…` or `mailto:…`), `show`. Label and url required.

### `home`: homepage
| Field | Purpose | Required? |
|---|---|---|
| `layout` | `overlay` or `split` | Optional |
| `textAlign` | `left` or `center` | Optional |
| `heroHeight` | `full`, `tall`, `medium` | Optional |
| `imageFocus` | Cropping focus, e.g. `center`, `top`, `30% 70%` | Optional |
| `imageDim` | Darkening of the picture, `0`–`1` | Optional |
| `eyebrow` | Small line above your name | Optional |
| `tagline` | Big sentence under your name | Optional |
| `intro` | Short paragraph | Optional |
| `buttons[]` | `label`, `href`, `style` (`primary`/`secondary`/`ghost`) | Optional (`[]` = none) |
| `featured.heading / max / linkLabel` | The "Featured work" strip | Optional |

### `about`: About page
| Field | Purpose | Required? |
|---|---|---|
| `pageTitle` | Browser tab title | Optional |
| `heading` | Big page title | Optional |
| `lead` | One-line summary under the title | Optional |
| `portraitCaption` | Caption under the portrait | Optional |
| `bio[]` | Main biography, one text per paragraph | Optional |
| `sections[]` | Extra sections: `id`, `show`, `heading`, `paragraphs[]`, `list[]`, `image {src, alt, caption}`, `imagePosition` (`right`/`left`/`top`), `links[] {label, url}` | Optional (all parts optional) |
| `socialHeading` | Title above social links | Optional |
| `externalLinksHeading` | Title above external links | Optional |
| `externalLinks[]` | `label`, `url`, `description`, `show` | Optional |

### `works`: Works page
| Field | Purpose | Required? |
|---|---|---|
| `pageTitle` | Browser tab title | Optional |
| `heading` | Big page title | Optional |
| `intro` | Text under the title | Optional |
| `allLabel` | Text of the "show all" filter button | Optional |
| `emptyMessage` | Shown when there are no visible projects | Optional |
| `thumbnailRatio` | Shape of all thumbnails, e.g. `"16 / 9"`, `"1 / 1"` | Optional |
| `sort` | `file` (as written) or `newest` (by year) | Optional |
| `projects[]` | The list of projects (below) | Optional |

### `works.projects[]`: one project
| Field | Purpose | Required? |
|---|---|---|
| `title` | Name shown on the card | **Yes** |
| `show` | `false` hides without deleting | Optional (default `true`) |
| `featured` | `true` also lists it on the Home page | Optional |
| `description` | Short text | Optional |
| `category` | Text or list of texts, used by the filter buttons | Optional |
| `year` | Year (number or text) | Optional |
| `url` | Where it lives; YouTube addresses become a video player | Optional (but a card without a link has no button) |
| `video` | A YouTube address to embed when `url` is a normal page | Optional |
| `embed` | `false` = link card instead of player | Optional |
| `thumbnail` | Path to your own thumbnail; empty = YouTube's (for videos) or a placeholder | Optional |
| `thumbnailAlt` | Description of the thumbnail | Optional |
| `linkLabel` | Custom text for the link button | Optional |
