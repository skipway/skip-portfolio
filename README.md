# skip — portfolio website

A modern, responsive, **completely static** portfolio for showcasing sound design, sound effects,
video editing, game development and any other creative work. It is built with plain HTML, CSS and
JavaScript, and hosts for free on GitHub Pages.

- **Three pages:** Home, About, Works (with category filters and YouTube video cards)
- **One content file:** change text, links, images, colors, fonts and visibility in [`content.json`](content.json)
- **No build step, no Node.js, no backend, no database, no paid services, no accounts, no dependencies**
- Works under a repository sub-path (`https://<you>.github.io/skip-portfolio/`) because every path is relative
- Dark neutral design with one restrained accent color, subtle motion, responsive from phone to desktop

> **Everything about customizing is in [`CUSTOMIZATION.md`](CUSTOMIZATION.md)**: 23 step-by-step guides
> with before/after examples and a table of every editable field.

## What is in the folder

```
skip-portfolio/
├── index.html          Home page
├── about.html          About page
├── works.html          Works page
├── content.json        ★ all your content and settings (edit this)
├── styles.css          design (advanced)
├── script.js           behavior (advanced)
├── assets/
│   ├── favicon.svg
│   └── images/         ★ your pictures go here (hero, about/, projects/)
├── .nojekyll           tells GitHub Pages to publish the files as they are
├── README.md           this file
└── CUSTOMIZATION.md    the customization manual
```

The three HTML files are tiny shells; `script.js` reads `content.json` and builds the pages. You normally only touch `content.json` and the `assets/images` folder.

## Quick start

### 1. Preview on your computer

Browsers block reading `content.json` when you double-click `index.html`, so start a tiny local server.
In a terminal opened **inside this folder**:

```bash
python -m http.server 8000
```

(Windows: `py -m http.server 8000`; Mac/Linux: `python3 -m http.server 8000`.)
Then open <http://localhost:8000>. Other options (VS Code Live Server, `npx serve`) are in
[CUSTOMIZATION.md → section 20](CUSTOMIZATION.md#20-preview-changes-locally).

While previewing, a yellow "Heads-up for the site owner" box lists any mistakes in `content.json` and any images it cannot find. Visitors never see it.

### 2. Make the website yours

Open `content.json` and replace the sample text, links and project examples. Put your pictures in `assets/images/`. See [CUSTOMIZATION.md](CUSTOMIZATION.md).

### 3. Publish with GitHub Pages

**a) Create the repository**
1. Sign in at <https://github.com> (create a free account if needed).
2. Click **+ → New repository**.
3. Repository name: `skip-portfolio`. Choose **Public** (required for free GitHub Pages on personal accounts). Leave "Add a README" **unticked** if you are uploading this folder's files.
4. Click **Create repository**.

**b) Upload the files**
- *Easiest, in the browser:* on the new empty repository page click **uploading an existing file**, drag in **everything inside** the `skip-portfolio` folder (the files and the `assets` folder, **not** the outer folder itself, so that `index.html` is at the top level), then click **Commit changes**.
  - Make sure the hidden `.nojekyll` file is included. If your computer hides it, it is optional; the site works without it.
- *With GitHub Desktop:* **File → Add local repository…** → choose this folder → **Publish repository** (untick "Keep this code private").

**c) Turn on GitHub Pages**
1. In the repository click **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source** choose **Deploy from a branch**.
3. Under **Branch** pick **main** and the folder **/ (root)**, then click **Save**.

**d) Wait for deployment and find your address**
- Stay on **Settings → Pages**. After roughly 1–10 minutes a box appears saying
  **"Your site is live at https://&lt;your-username&gt;.github.io/skip-portfolio/"**.
- You can watch progress under the **Actions** tab (a green tick means finished).
- Open the address; if it shows a 404 for the first minutes, wait and refresh.

To publish later changes see [CUSTOMIZATION.md → section 21](CUSTOMIZATION.md#21-publish-changes-through-github).

## Security and limitations (please read)

This is a **static public website**:

- **There is no private admin dashboard and no login system**, because there is no backend. You cannot password-protect anything.
- **Every file in the repository, including `content.json`, can be read by any visitor.** Never put passwords, API keys, private addresses, phone numbers or anything confidential in it. There are no secrets anywhere in this project, and it needs none.
- **Anyone with write permission to your GitHub repository can change the site.** Protect your GitHub account with a strong password and two-factor authentication, and only add collaborators you trust.
- Text from `content.json` is always displayed as plain text; HTML in it is never executed. Web addresses are validated before they become links, images or videos (only `http(s)` is accepted, plus `mailto:` for social links). Outside links open in a new tab with `rel="noopener noreferrer"`.
- YouTube videos load from `youtube-nocookie.com` only **after a visitor clicks play**, and never start by themselves.
- The only outside services used are optional: Google Fonts (disable with `"useGoogleFonts": false`) and YouTube thumbnails/players for projects that use YouTube links. The site looks fine if they are unavailable.

## How it handles mistakes

- Missing optional fields get sensible defaults; missing images become a tasteful placeholder; an empty project list shows a friendly message.
- A typo in `content.json` (such as a missing comma) shows safe default content instead of a blank page, and your local preview explains what is wrong.

## Browser support

Any current version of Chrome, Edge, Firefox, Safari (including iOS and Android browsers). It uses modern CSS such as `color-mix()`, so very old browsers (before about 2023) show simpler styling.

## Files you can safely delete

Nothing needs deleting. The placeholder pictures `hero-placeholder.svg`, `about-placeholder.svg`, `about/workspace-placeholder.svg`, `projects/pixel-drift.svg` and `projects/quick-cut.svg` can be removed once you no longer reference them in `content.json`.
