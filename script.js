/* =====================================================================
   script.js: the behaviour of the website.

   You do NOT need to edit this file to change text, links, images,
   colors or fonts. Everything ordinary lives in content.json.
   This file:
     1. loads content.json
     2. checks it and fills in safe defaults for anything missing
     3. builds the menu, footer and the three pages from that content

   SECURITY NOTE: all text from content.json is inserted as plain text
   (textContent), never as HTML, and every web address is checked before
   it becomes a link, an image or a video player.

   Sections of this file
     1. Settings you might change
     2. Small helpers (text, safe links, image paths)
     3. YouTube helpers
     4. Reading and checking content.json
     5. Page building blocks (images, links, buttons)
     6. Project cards and the video player
     7. The three pages (home, about, works)
     8. Menu, footer, theme and fonts
     9. Start-up
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. SETTINGS YOU MIGHT CHANGE
     ------------------------------------------------------------------ */

  // CUSTOMIZATION POINT: the file that holds all your content.
  var CONTENT_FILE = 'content.json';

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // The owner-only "heads-up" box (missing images, typos in content.json...)
  // appears when you preview locally, or when you add ?debug to the address.
  var IS_DEV =
    /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname) ||
    /\.(local|localhost|test)$/.test(location.hostname) ||
    location.protocol === 'file:' ||
    /[?&]debug\b/.test(location.search);

  /* ------------------------------------------------------------------
     2. SMALL HELPERS
     ------------------------------------------------------------------ */

  var warnings = [];
  var bannerEl = null;

  function warn(message) {
    if (warnings.indexOf(message) !== -1) return;
    warnings.push(message);
    if (window.console) console.warn('[skip-portfolio] ' + message);
    renderBanner();
  }

  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function arr(v) { return Array.isArray(v) ? v : []; }

  // Text value: returns the trimmed string, or the fallback if it is not a string.
  function text(v, fallback) {
    if (typeof v === 'string') return v.trim();
    if (typeof v === 'number' && isFinite(v)) return String(v);
    return fallback === undefined ? '' : fallback;
  }

  // true/false value that also forgives "true"/"false" typed in quotes.
  function flag(v, fallback) {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') {
      var s = v.trim().toLowerCase();
      if (s === 'true' || s === 'yes') return true;
      if (s === 'false' || s === 'no') return false;
    }
    return fallback;
  }

  function oneOf(v, allowed, fallback, label) {
    var s = text(v, '').toLowerCase();
    if (!s) return fallback;
    if (allowed.indexOf(s) !== -1) return s;
    warn('"' + label + '" should be one of ' + allowed.join(', ') + ' but is "' + v + '". Using "' + fallback + '".');
    return fallback;
  }

  // A list of paragraphs: accepts "one text" or ["text", "text"].
  function paragraphs(v) {
    var list = typeof v === 'string' ? v.split(/\n{2,}/) : arr(v);
    return list.map(function (s) { return text(s, ''); }).filter(Boolean);
  }

  function fill(template, vars) {
    return String(template).replace(/\{(\w+)\}/g, function (m, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : m;
    });
  }

  // Builds a DOM element. Children given as strings become TEXT, never HTML.
  function h(tag, props) {
    var el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    var kids = [].slice.call(arguments, 2);
    [].concat.apply([], kids).forEach(function (kid) {
      if (kid === null || kid === undefined || kid === false) return;
      el.appendChild(kid.nodeType ? kid : document.createTextNode(String(kid)));
    });
    return el;
  }

  // Validates a web address. Returns a safe string, or null.
  //   allowRelative: also accept "about.html" / "#top" (for menu and buttons)
  //   allowMailto:   also accept mailto: links (for social links)
  function safeUrl(value, opts) {
    opts = opts || {};
    var s = text(value, '');
    if (!s) return null;
    if (s.charAt(0) === '#') return opts.allowRelative ? s : null;
    // forgive a missing "https://" on addresses like "example.com/page"
    if (!opts.allowRelative && !/^[a-z][a-z0-9+.-]*:/i.test(s) && s.slice(0, 2) !== '//' && /^[^\s\/]+\.[^\s\/]+/.test(s)) {
      s = 'https://' + s;
    }
    var u;
    try { u = new URL(s, opts.allowRelative ? document.baseURI : undefined); } catch (e) { return null; }
    var okProtocol = u.protocol === 'https:' || u.protocol === 'http:' || (opts.allowMailto && u.protocol === 'mailto:');
    if (!okProtocol) return null;
    if (opts.allowRelative && !/^[a-z][a-z0-9+.-]*:/i.test(s) && s.slice(0, 2) !== '//') return s; // keep relative paths relative
    return u.href;
  }

  function isExternal(href) {
    try {
      var u = new URL(href, document.baseURI);
      return (u.protocol === 'http:' || u.protocol === 'https:') && u.origin !== location.origin;
    } catch (e) { return false; }
  }

  // Image paths: relative paths are kept relative to the page (so they work on
  // a GitHub Pages repository sub-path); only http(s) addresses are allowed
  // otherwise. javascript:, data: and similar are refused.
  function assetPath(value, label) {
    var s = text(value, '').replace(/\\/g, '/');
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return s;
    if (/^[a-z][a-z0-9+.-]*:/i.test(s) || s.slice(0, 2) === '//') {
      warn('Image path "' + value + '"' + (label ? ' (' + label + ')' : '') + ' is not allowed. Use a file path like assets/images/photo.jpg or an https:// address.');
      return '';
    }
    if (s.charAt(0) === '/') {
      warn('Image path "' + value + '"' + (label ? ' (' + label + ')' : '') + ' starts with "/", which breaks on GitHub Pages. Using "' + s.replace(/^\/+/, '') + '" instead; please remove the leading slash.');
    }
    return s.replace(/^(\.\/|\/)+/, '');
  }

  function externalAttrs(href) {
    return isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  }

  // <a> element; adds target/rel (and a hidden "opens in new tab" note) for outside links.
  function link(href, className, children) {
    var ext = isExternal(href);
    var props = { class: className, href: href };
    if (ext) { props.target = '_blank'; props.rel = 'noopener noreferrer'; }
    var a = h('a', props, children);
    if (ext) a.appendChild(h('span', { class: 'sr-only' }, ' (opens in a new tab)'));
    return a;
  }

  function hostOf(href) {
    try { return new URL(href).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  /* ------------------------------------------------------------------
     3. YOUTUBE HELPERS
     Recognises youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
     (also /embed/ID, /live/ID and m./music. variants).
     ------------------------------------------------------------------ */

  function parseStart(v) {
    if (!v) return 0;
    if (/^\d+$/.test(v)) return parseInt(v, 10);
    var m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(v);
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  }

  function parseYouTube(input) {
    var s = text(input, '');
    if (!s) return null;
    var u;
    try { u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : 'https://' + s); } catch (e) { return null; }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    var host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, '');
    var parts = u.pathname.split('/').filter(Boolean);
    var id = null;
    if (host === 'youtu.be') {
      id = parts[0];
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (parts[0] === 'watch') id = u.searchParams.get('v');
      else if (['shorts', 'embed', 'live', 'v'].indexOf(parts[0]) !== -1) id = parts[1];
    }
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
    var start = parseStart(u.searchParams.get('t') || u.searchParams.get('start'));
    return {
      id: id,
      start: start,
      watchUrl: 'https://www.youtube.com/watch?v=' + id + (start ? '&t=' + start + 's' : '')
    };
  }

  /* ------------------------------------------------------------------
     4. READING AND CHECKING content.json
     Every field is checked; anything missing or wrong falls back to a safe
     default so one typo never breaks the whole site.
     ------------------------------------------------------------------ */

  function color(v, fallback, label) {
    var s = text(v, '');
    if (!s) return fallback;
    if (window.CSS && CSS.supports && CSS.supports('color', s)) return s;
    warn('theme.colors.' + label + ' "' + v + '" is not a valid color. Using ' + fallback + '.');
    return fallback;
  }

  function normalizeFont(v, defaults, label) {
    var f = isObj(v) ? v : {};
    var family = text(f.family, '') || defaults.family;
    if (!/^[A-Za-z0-9 ]+$/.test(family)) {
      warn('theme.fonts.' + label + '.family "' + family + '" may only contain letters, numbers and spaces. Using "' + defaults.family + '".');
      family = defaults.family;
    }
    var weights = text(f.weights, '') || defaults.weights;
    if (!/^\d{3}(;\d{3})*$/.test(weights)) {
      warn('theme.fonts.' + label + '.weights "' + weights + '" should look like "400;600;700". Using "' + defaults.weights + '".');
      weights = defaults.weights;
    }
    var fallback = text(f.fallback, '') || defaults.fallback;
    if (!/^[\w\s,'"-]+$/.test(fallback)) {
      warn('theme.fonts.' + label + '.fallback contains unsupported characters. Using the default fallback fonts.');
      fallback = defaults.fallback;
    }
    return { family: family, weights: weights, fallback: fallback };
  }

  function normalizeImage(v, label) {
    if (!isObj(v)) return null;
    var src = assetPath(v.src, label);
    if (!src) return null;
    return { src: src, alt: text(v.alt, ''), caption: text(v.caption, '') };
  }

  function normalizeLinks(list, label, withDescription) {
    return arr(list).map(function (item, i) {
      if (!isObj(item) || flag(item.show, true) === false) return null;
      var url = safeUrl(item.url, { allowMailto: true });
      var name = text(item.label, '');
      if (!url) { warn(label + ' item #' + (i + 1) + ' ("' + name + '") has a missing or invalid "url" and was skipped. It must start with https://'); return null; }
      var entry = { label: name || hostOf(url) || url, url: url };
      if (withDescription) entry.description = text(item.description, '');
      return entry;
    }).filter(Boolean);
  }

  function normalizeProject(raw, index) {
    var n = index + 1;
    if (!isObj(raw)) { warn('works.projects item #' + n + ' is not a { ... } block and was skipped.'); return null; }
    if (flag(raw.show, true) === false) return null;

    var title = text(raw.title, '');
    if (!title) { warn('works.projects item #' + n + ' has no "title". Showing "Untitled project".'); title = 'Untitled project'; }

    var urlText = text(raw.url, '');
    var videoText = text(raw.video, '');
    var yt = parseYouTube(videoText || urlText);
    if (videoText && !yt) warn('Project "' + title + '": "video" is not a recognised YouTube address (youtube.com/watch?v=..., youtu.be/... or youtube.com/shorts/...).');

    var href = safeUrl(urlText);
    if (!href && urlText && yt) href = yt.watchUrl;
    if (urlText && !href) warn('Project "' + title + '": "url" is not a valid web address. It must start with https://. The card will have no link.');
    if (!href && !urlText && yt) href = yt.watchUrl;

    var cats = (Array.isArray(raw.category) ? raw.category : [raw.category]).map(function (c) { return text(c, ''); }).filter(Boolean);

    var label = text(raw.linkLabel, '');
    var urlIsYouTube = !!parseYouTube(urlText);
    if (!label) label = urlIsYouTube ? 'Watch on YouTube' : (hostOf(href || '') ? 'View on ' + hostOf(href) : 'View project');

    return {
      title: title,
      description: text(raw.description, ''),
      categories: cats,
      year: text(raw.year, ''),
      href: href,
      linkLabel: label,
      yt: yt,
      embed: flag(raw.embed, true),
      secondaryYouTube: !!(yt && href && !urlIsYouTube),   // video lives separately from the main link
      thumbnail: assetPath(raw.thumbnail, 'thumbnail of "' + title + '"'),
      thumbnailAlt: text(raw.thumbnailAlt, ''),
      featured: flag(raw.featured, false)
    };
  }

  function normalizeConfig(raw) {
    var r = isObj(raw) ? raw : {};
    if (raw !== null && raw !== undefined && !isObj(raw)) warn('content.json must be one { ... } block. Using default content.');

    var site = isObj(r.site) ? r.site : {};
    var name = text(site.name, '') || 'skip';
    var cfg = {};

    cfg.site = {
      name: name,
      browserTitle: text(site.browserTitle, '') || name,
      titleTemplate: text(site.titleTemplate, '') || '{page} | {name}',
      description: text(site.description, ''),
      favicon: assetPath(site.favicon, 'site.favicon') || 'assets/favicon.svg',
      language: /^[A-Za-z]{2,3}(-[A-Za-z0-9]+)*$/.test(text(site.language, '')) ? text(site.language, '') : 'en',
      footerText: typeof site.footerText === 'string' ? site.footerText.trim() : '© {year} {name}'
    };

    // navigation
    var navItems = arr((isObj(r.navigation) ? r.navigation : {}).items).map(function (it, i) {
      if (!isObj(it) || flag(it.show, true) === false) return null;
      var href = safeUrl(it.href, { allowRelative: true });
      var label = text(it.label, '');
      if (!href || !label) { warn('navigation.items item #' + (i + 1) + ' needs a "label" and a valid "href".'); return null; }
      return { label: label, href: href, page: text(it.page, '') };
    }).filter(Boolean);
    if (!navItems.length && !(isObj(r.navigation) && Array.isArray(r.navigation.items) && r.navigation.items.length)) {
      navItems = [
        { label: 'Home', href: 'index.html', page: 'home' },
        { label: 'About', href: 'about.html', page: 'about' },
        { label: 'Works', href: 'works.html', page: 'works' }
      ];
    }
    cfg.navigation = { items: navItems };

    // theme
    var theme = isObj(r.theme) ? r.theme : {};
    var colors = isObj(theme.colors) ? theme.colors : {};
    var fonts = isObj(theme.fonts) ? theme.fonts : {};
    var radius = text(theme.radius, '');
    if (radius && !/^\d+(\.\d+)?(px|rem|em)$/.test(radius)) { warn('theme.radius "' + radius + '" should look like "14px". Using 14px.'); radius = ''; }
    cfg.theme = {
      colors: {
        background: color(colors.background, '#0e0e10', 'background'),
        surface: color(colors.surface, '#17171a', 'surface'),
        text: color(colors.text, '#f1efe9', 'text'),
        mutedText: color(colors.mutedText, '#9b9aa3', 'mutedText'),
        border: color(colors.border, '#2a2a30', 'border'),
        accent: color(colors.accent, '#ff6a3d', 'accent'),
        accentText: color(colors.accentText, '#140a06', 'accentText')
      },
      fonts: {
        useGoogleFonts: flag(fonts.useGoogleFonts, true),
        heading: normalizeFont(fonts.heading, { family: 'Syne', weights: '600;700;800', fallback: "'Arial Black', 'Helvetica Neue', Arial, sans-serif" }, 'heading'),
        body: normalizeFont(fonts.body, { family: 'Inter', weights: '400;500;600', fallback: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" }, 'body')
      },
      radius: radius || '14px',
      animations: flag(theme.animations, true)
    };

    // visibility
    var vis = isObj(r.visibility) ? r.visibility : {};
    var visKeys = {
      homeEyebrow: true, homeIntro: true, homeButtons: true, homeFeaturedWorks: true, homeSocialLinks: false,
      aboutPortrait: true, aboutSocialLinks: true, aboutExternalLinks: true,
      worksIntro: true, worksFilters: true, footer: true, footerSocialLinks: true
    };
    cfg.visibility = {};
    Object.keys(visKeys).forEach(function (k) { cfg.visibility[k] = flag(vis[k], visKeys[k]); });

    // images
    var im = isObj(r.images) ? r.images : {};
    cfg.images = {
      hero: 'hero' in im ? assetPath(im.hero, 'images.hero') : 'assets/images/hero-placeholder.svg',
      heroAlt: text(im.heroAlt, ''),
      aboutPortrait: assetPath(im.aboutPortrait, 'images.aboutPortrait'),
      aboutPortraitAlt: text(im.aboutPortraitAlt, ''),
      defaultThumbnail: assetPath(im.defaultThumbnail, 'images.defaultThumbnail')
    };

    // social
    cfg.social = { items: normalizeLinks((isObj(r.social) ? r.social : {}).items, 'social.items', false) };

    // home
    var home = isObj(r.home) ? r.home : {};
    var feat = isObj(home.featured) ? home.featured : {};
    var maxFeat = parseInt(feat.max, 10);
    var dim = parseFloat(home.imageDim);
    var focus = text(home.imageFocus, 'center');
    if (!/^[A-Za-z0-9% .-]+$/.test(focus)) { warn('home.imageFocus "' + focus + '" is not valid. Using "center".'); focus = 'center'; }
    var buttons = Array.isArray(home.buttons) ? home.buttons : [
      { label: 'See my work', href: 'works.html', style: 'primary' },
      { label: 'About me', href: 'about.html', style: 'secondary' }
    ];
    cfg.home = {
      layout: oneOf(home.layout, ['overlay', 'split'], 'overlay', 'home.layout'),
      textAlign: oneOf(home.textAlign, ['left', 'center'], 'left', 'home.textAlign'),
      heroHeight: oneOf(home.heroHeight, ['full', 'tall', 'medium'], 'tall', 'home.heroHeight'),
      imageFocus: focus,
      imageDim: isFinite(dim) ? Math.min(1, Math.max(0, dim)) : 0.55,
      eyebrow: text(home.eyebrow, ''),
      tagline: typeof home.tagline === 'string' ? home.tagline.trim() : 'I make things you can hear, watch and play.',
      intro: text(home.intro, ''),
      buttons: buttons.map(function (b, i) {
        if (!isObj(b)) return null;
        var href = safeUrl(b.href, { allowRelative: true });
        var label = text(b.label, '');
        if (!href || !label) { warn('home.buttons item #' + (i + 1) + ' needs a "label" and a valid "href".'); return null; }
        return { label: label, href: href, style: oneOf(b.style, ['primary', 'secondary', 'ghost'], 'secondary', 'home.buttons style') };
      }).filter(Boolean),
      featured: {
        heading: typeof feat.heading === 'string' ? feat.heading.trim() : 'Featured work',
        max: isFinite(maxFeat) && maxFeat > 0 ? maxFeat : 3,
        linkLabel: typeof feat.linkLabel === 'string' ? feat.linkLabel.trim() : 'View all work →'
      }
    };

    // about
    var about = isObj(r.about) ? r.about : {};
    cfg.about = {
      pageTitle: text(about.pageTitle, '') || 'About',
      heading: text(about.heading, '') || 'About',
      lead: text(about.lead, ''),
      portraitCaption: text(about.portraitCaption, ''),
      bio: paragraphs(about.bio),
      sections: arr(about.sections).map(function (s, i) {
        if (!isObj(s)) { warn('about.sections item #' + (i + 1) + ' is not a { ... } block and was skipped.'); return null; }
        if (flag(s.show, true) === false) return null;
        var id = text(s.id, '');
        var pos = oneOf(s.imagePosition, ['right', 'left', 'top'], 'right', 'about.sections imagePosition');
        return {
          id: /^[A-Za-z][\w-]*$/.test(id) ? 'section-' + id : '',
          heading: text(s.heading, ''),
          paragraphs: paragraphs(s.paragraphs),
          list: arr(s.list).map(function (x) { return text(x, ''); }).filter(Boolean),
          image: normalizeImage(s.image, 'about section "' + (text(s.heading, '') || (i + 1)) + '" image'),
          imagePosition: pos,
          links: normalizeLinks(s.links, 'about.sections[' + i + '].links', false)
        };
      }).filter(Boolean),
      socialHeading: typeof about.socialHeading === 'string' ? about.socialHeading.trim() : 'Find me online',
      externalLinksHeading: typeof about.externalLinksHeading === 'string' ? about.externalLinksHeading.trim() : 'More from me',
      externalLinks: normalizeLinks(about.externalLinks, 'about.externalLinks', true)
    };

    // works
    var works = isObj(r.works) ? r.works : {};
    var ratio = text(works.thumbnailRatio, '16 / 9').replace(':', '/');
    if (!/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(ratio)) { warn('works.thumbnailRatio "' + works.thumbnailRatio + '" should look like "16 / 9". Using 16 / 9.'); ratio = '16 / 9'; }
    if (works.projects !== undefined && !Array.isArray(works.projects)) warn('works.projects must be a list [ ... ] of { ... } blocks.');
    var projects = arr(works.projects).map(normalizeProject).filter(Boolean);
    if (oneOf(works.sort, ['file', 'newest'], 'file', 'works.sort') === 'newest') {
      projects = projects.map(function (p, i) { return { p: p, i: i }; }).sort(function (a, b) {
        var ya = parseInt(a.p.year, 10), yb = parseInt(b.p.year, 10);
        if (isNaN(ya)) ya = -Infinity;
        if (isNaN(yb)) yb = -Infinity;
        return yb === ya ? a.i - b.i : yb - ya;
      }).map(function (x) { return x.p; });
    }
    cfg.works = {
      pageTitle: text(works.pageTitle, '') || 'Works',
      heading: text(works.heading, '') || 'Works',
      intro: text(works.intro, ''),
      allLabel: text(works.allLabel, '') || 'All',
      emptyMessage: text(works.emptyMessage, '') || 'No projects to show yet.',
      thumbnailRatio: ratio,
      projects: projects
    };

    return cfg;
  }

  function jsonProblem(err, source) {
    var msg = String(err && err.message ? err.message : err);
    var m = /position (\d+)/.exec(msg);
    if (m && !/line \d+/.test(msg)) {
      var pos = parseInt(m[1], 10);
      var before = source.slice(0, pos);
      msg += ' (around line ' + before.split('\n').length + ')';
    }
    return msg;
  }

  /* ------------------------------------------------------------------
     5. PAGE BUILDING BLOCKS
     ------------------------------------------------------------------ */

  // <img> that tries each source in turn and runs onFail if none load.
  function makeImage(sources, opts) {
    opts = opts || {};
    var img = document.createElement('img');
    img.alt = opts.alt || '';
    img.decoding = 'async';
    if (opts.eager) img.setAttribute('fetchpriority', 'high'); else img.loading = 'lazy';
    var i = 0;
    function next() {
      if (i >= sources.length) { if (img.parentNode) img.parentNode.removeChild(img); if (opts.onFail) opts.onFail(); return; }
      img.src = sources[i++];
    }
    img.addEventListener('error', function () {
      var bad = sources[i - 1];
      if (bad && !/^https?:\/\/(i\.ytimg\.com)\//i.test(bad)) {
        warn('Image not found: "' + bad + '"' + (opts.who ? ' (' + opts.who + ')' : '') + '. Check the file name, capital letters and folder.');
      }
      next();
    });
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    next();
    return img;
  }

  function buttonEl(b) {
    return link(b.href, 'btn btn--' + b.style, [b.label, h('span', { class: 'btn__arrow', 'aria-hidden': 'true' }, isExternal(b.href) ? '↗' : '→')]);
  }

  function socialList(items, className) {
    return h('ul', { class: className || 'chips' }, items.map(function (s) {
      return h('li', null, link(s.url, 'chip', [s.label, h('span', { class: 'chip__arrow', 'aria-hidden': 'true' }, ' ↗')]));
    }));
  }

  var observer = null;
  function setupReveal(root) {
    var els = [].slice.call(root.querySelectorAll('.reveal'));
    if (!document.documentElement.classList.contains('js-anim') || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); observer.unobserve(en.target); }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    }
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. PROJECT CARDS AND THE VIDEO PLAYER
     Videos never start by themselves: the card shows a thumbnail with a
     play button, and the player only loads after the visitor clicks it.
     ------------------------------------------------------------------ */

  function thumbnailSources(p, cfg) {
    var list = [];
    if (p.thumbnail) list.push(p.thumbnail);                       // your own thumbnail wins
    if (p.yt) {                                                    // otherwise YouTube's own
      list.push('https://i.ytimg.com/vi/' + p.yt.id + '/maxresdefault.jpg');
      list.push('https://i.ytimg.com/vi/' + p.yt.id + '/hqdefault.jpg');
    }
    if (cfg.images.defaultThumbnail) list.push(cfg.images.defaultThumbnail);
    return list;
  }

  // The picture area. The tasteful placeholder is always drawn underneath, so
  // a missing or slow image never leaves an empty box.
  function buildThumb(p, cfg) {
    var ph = h('div', { class: 'thumb' },
      h('div', { class: 'thumb__ph', 'aria-hidden': 'true' }, h('span', { class: 'thumb__initial' }, p.title.charAt(0).toUpperCase())));
    var sources = thumbnailSources(p, cfg);
    if (sources.length) {
      var img = makeImage(sources, { alt: p.thumbnailAlt || '', who: 'thumbnail of "' + p.title + '"' });
      img.className = 'thumb__img';
      ph.appendChild(img);
    }
    return ph;
  }

  function fillMedia(media, p, cfg, embedBroken) {
    media.textContent = '';
    var thumb = buildThumb(p, cfg);
    if (p.yt && p.embed && !embedBroken) {
      media.appendChild(h('button', {
        class: 'card__play', type: 'button',
        'aria-label': 'Play video: ' + p.title,
        onclick: function () { mountPlayer(media, p, cfg); }
      }, thumb, h('span', { class: 'play-icon', 'aria-hidden': 'true' })));
    } else if (p.href) {
      var a = h('a', Object.assign({ class: 'card__media-link', href: p.href, tabindex: '-1', 'aria-hidden': 'true' }, externalAttrs(p.href)), thumb);
      media.appendChild(a);
    } else {
      media.appendChild(thumb);
    }
  }

  function mountPlayer(media, p, cfg) {
    var params = new URLSearchParams({ rel: '0', playsinline: '1', autoplay: '1', enablejsapi: '1' });
    if (p.yt.start) params.set('start', String(p.yt.start));
    if (location.protocol === 'http:' || location.protocol === 'https:') params.set('origin', location.origin);

    var iframe = h('iframe', {
      class: 'card__player',
      src: 'https://www.youtube-nocookie.com/embed/' + p.yt.id + '?' + params.toString(),
      title: 'Video player: ' + p.title,
      allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen',
      referrerpolicy: 'strict-origin-when-cross-origin'
    });
    media.textContent = '';
    media.appendChild(iframe);

    // If YouTube reports that this video cannot be embedded, swap back to a
    // normal thumbnail card that links to the original video.
    function onMessage(ev) {
      if (ev.source !== iframe.contentWindow) return;
      var data = ev.data;
      if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { return; } }
      if (data && data.event === 'onError') {
        window.removeEventListener('message', onMessage);
        fillMedia(media, p, cfg, true);
        var body = media.parentNode && media.parentNode.querySelector('.card__body');
        if (body) body.insertBefore(h('p', { class: 'card__notice', role: 'status' }, 'This video cannot be played here. Use the link below to watch it on YouTube.'), body.firstChild);
      }
    }
    window.addEventListener('message', onMessage);
    iframe.addEventListener('load', function () {
      try { iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), 'https://www.youtube-nocookie.com'); } catch (e) { /* ignore */ }
    });
    iframe.focus();
  }

  function buildCard(p, cfg) {
    var media = h('div', { class: 'card__media' });
    fillMedia(media, p, cfg, false);

    var meta = (p.categories.length || p.year) ? h('div', { class: 'card__meta' },
      p.categories.map(function (c) { return h('span', { class: 'tag' }, c); }),
      p.year ? h('span', { class: 'year' }, p.year) : null) : null;

    var actions = [];
    if (p.href) actions.push(link(p.href, 'btn btn--ghost btn--sm', [p.linkLabel, h('span', { class: 'btn__arrow', 'aria-hidden': 'true' }, '↗')]));
    if (p.secondaryYouTube) actions.push(link(p.yt.watchUrl, 'btn btn--ghost btn--sm', ['Watch on YouTube', h('span', { class: 'btn__arrow', 'aria-hidden': 'true' }, '↗')]));

    return h('article', { class: 'card reveal' + (p.featured ? ' card--featured' : '') },
      media,
      h('div', { class: 'card__body' },
        meta,
        h('h3', { class: 'card__title' }, p.title, p.featured ? h('span', { class: 'sr-only' }, ' (featured)') : null),
        p.description ? h('p', { class: 'card__desc' }, p.description) : null,
        actions.length ? h('div', { class: 'card__actions' }, actions) : null));
  }

  /* ------------------------------------------------------------------
     7. THE THREE PAGES
     ------------------------------------------------------------------ */

  function renderHome(cfg, main) {
    var hm = cfg.home, v = cfg.visibility;
    var hero = h('section', { class: 'hero hero--' + hm.layout + ' hero--h-' + hm.heroHeight + ' hero--align-' + hm.textAlign });
    hero.style.setProperty('--dim', String(hm.imageDim));
    // shrink the big name a little for longer names (4 letters = full size)
    hero.style.setProperty('--name-vw', String(Math.min(24, Math.max(6, Math.round(125 / Math.max(1, cfg.site.name.length))))));

    var media = h('div', { class: 'hero__media' });
    if (cfg.images.hero) {
      var img = makeImage([cfg.images.hero], {
        alt: cfg.images.heroAlt, eager: true, who: 'images.hero',
        onFail: function () { media.classList.add('is-fallback'); }
      });
      img.className = 'hero__img';
      img.style.objectPosition = hm.imageFocus;
      media.appendChild(img);
    } else {
      media.classList.add('is-fallback');
    }

    var content = h('div', { class: 'hero__content container' },
      v.homeEyebrow && hm.eyebrow ? h('p', { class: 'eyebrow rise', style: '--i:0' }, hm.eyebrow) : null,
      h('h1', { class: 'hero__name rise', style: '--i:1' }, cfg.site.name),
      hm.tagline ? h('p', { class: 'hero__tagline rise', style: '--i:2' }, hm.tagline) : null,
      v.homeIntro && hm.intro ? h('p', { class: 'hero__intro rise', style: '--i:3' }, hm.intro) : null,
      v.homeButtons && hm.buttons.length ? h('div', { class: 'hero__actions rise', style: '--i:4' }, hm.buttons.map(buttonEl)) : null,
      v.homeSocialLinks && cfg.social.items.length ? h('div', { class: 'hero__social rise', style: '--i:5' }, socialList(cfg.social.items)) : null);

    hero.appendChild(media);
    hero.appendChild(content);
    main.appendChild(hero);

    if (v.homeFeaturedWorks) {
      var featured = cfg.works.projects.filter(function (p) { return p.featured; }).slice(0, hm.featured.max);
      if (featured.length) {
        var grid = h('div', { class: 'grid' }, featured.map(function (p) { return buildCard(p, cfg); }));
        var worksItem = cfg.navigation.items.filter(function (i) { return i.page === 'works'; })[0];
        main.appendChild(h('section', { class: 'section container' },
          h('div', { class: 'section__head' },
            hm.featured.heading ? h('h2', { class: 'section__title' }, hm.featured.heading) : null,
            hm.featured.linkLabel ? link(worksItem ? worksItem.href : 'works.html', 'more-link', hm.featured.linkLabel) : null),
          grid));
      }
    }
  }

  function aboutSection(s) {
    var textBlock = h('div', { class: 'about-section__text' },
      s.heading ? h('h2', null, s.heading) : null,
      s.paragraphs.map(function (p) { return h('p', null, p); }),
      s.list.length ? h('ul', { class: 'bullets' }, s.list.map(function (li) { return h('li', null, li); })) : null,
      s.links.length ? h('ul', { class: 'link-list' }, s.links.map(function (l) {
        return h('li', null, link(l.url, 'link-row', [h('span', null, l.label), h('span', { class: 'link-row__arrow', 'aria-hidden': 'true' }, '↗')]));
      })) : null);

    var fig = null;
    if (s.image) {
      fig = h('figure', { class: 'figure' });
      fig.appendChild(makeImage([s.image.src], { alt: s.image.alt, who: 'about section "' + (s.heading || s.id) + '"', onFail: function () { if (fig.parentNode) fig.parentNode.removeChild(fig); } }));
      if (s.image.caption) fig.appendChild(h('figcaption', null, s.image.caption));
    }
    return h('section', { class: 'about-section reveal' + (fig ? ' about-section--img-' + s.imagePosition : ''), id: s.id || null }, textBlock, fig);
  }

  function renderAbout(cfg, main) {
    var a = cfg.about, v = cfg.visibility;
    main.appendChild(h('section', { class: 'page-head container' },
      h('h1', { class: 'page-title rise', style: '--i:0' }, a.heading),
      a.lead ? h('p', { class: 'page-lead rise', style: '--i:1' }, a.lead) : null));

    var portrait = null;
    if (v.aboutPortrait && cfg.images.aboutPortrait) {
      portrait = h('figure', { class: 'figure figure--portrait' });
      portrait.appendChild(makeImage([cfg.images.aboutPortrait], {
        alt: cfg.images.aboutPortraitAlt, eager: true, who: 'images.aboutPortrait',
        onFail: function () { if (portrait.parentNode) { portrait.parentNode.classList.remove('has-portrait'); portrait.parentNode.removeChild(portrait); } }
      }));
      if (a.portraitCaption) portrait.appendChild(h('figcaption', null, a.portraitCaption));
    }
    if (portrait || a.bio.length) {
      main.appendChild(h('section', { class: 'container about-top' + (portrait ? ' has-portrait' : '') },
        portrait,
        h('div', { class: 'prose rise', style: '--i:2' }, a.bio.map(function (p) { return h('p', null, p); }))));
    }

    var wrap = h('div', { class: 'container about-sections' }, a.sections.map(aboutSection));
    if (a.sections.length) main.appendChild(wrap);

    var extras = h('div', { class: 'container about-extras' });
    if (v.aboutSocialLinks && cfg.social.items.length) {
      extras.appendChild(h('section', { class: 'reveal' },
        a.socialHeading ? h('h2', null, a.socialHeading) : null,
        socialList(cfg.social.items)));
    }
    if (v.aboutExternalLinks && a.externalLinks.length) {
      extras.appendChild(h('section', { class: 'reveal' },
        a.externalLinksHeading ? h('h2', null, a.externalLinksHeading) : null,
        h('ul', { class: 'link-list' }, a.externalLinks.map(function (l) {
          return h('li', null, link(l.url, 'link-row', [
            h('span', null, h('strong', null, l.label), l.description ? h('small', null, l.description) : null),
            h('span', { class: 'link-row__arrow', 'aria-hidden': 'true' }, '↗')]));
        }))));
    }
    if (extras.childNodes.length) main.appendChild(extras);

    if (!a.bio.length && !portrait && !a.sections.length && !extras.childNodes.length) {
      main.appendChild(h('p', { class: 'container empty' }, 'Nothing here yet. Add your biography to content.json (about.bio).'));
    }
  }

  function renderWorks(cfg, main) {
    var w = cfg.works, v = cfg.visibility;
    main.appendChild(h('section', { class: 'page-head container' },
      h('h1', { class: 'page-title rise', style: '--i:0' }, w.heading),
      v.worksIntro && w.intro ? h('p', { class: 'page-lead rise', style: '--i:1' }, w.intro) : null));

    var section = h('section', { class: 'container works' });
    main.appendChild(section);

    if (!w.projects.length) {
      section.appendChild(h('p', { class: 'empty' }, w.emptyMessage));
      return;
    }

    var grid = h('div', { class: 'grid', id: 'works-grid' });
    var entries = w.projects.map(function (p) { return { p: p, el: buildCard(p, cfg) }; });
    entries.forEach(function (e) { grid.appendChild(e.el); });

    var cats = [];
    w.projects.forEach(function (p) { p.categories.forEach(function (c) { if (cats.indexOf(c) === -1) cats.push(c); }); });

    if (v.worksFilters && cats.length > 1) {
      var status = h('p', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
      var buttons = [];
      var select = function (cat, btn) {
        var shown = 0;
        entries.forEach(function (e) {
          var match = !cat || e.p.categories.indexOf(cat) !== -1;
          e.el.hidden = !match;
          if (match) shown++;
        });
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        status.textContent = 'Showing ' + shown + ' of ' + entries.length + ' projects' + (cat ? ' in ' + cat : '') + '.';
      };
      [''].concat(cats).forEach(function (cat) {
        var btn = h('button', { class: 'filter', type: 'button', 'aria-pressed': cat ? 'false' : 'true', onclick: function () { select(cat, btn); } }, cat || w.allLabel);
        buttons.push(btn);
      });
      section.appendChild(h('div', { class: 'filters', role: 'group', 'aria-label': 'Filter projects by category' }, buttons));
      section.appendChild(status);
    }
    section.appendChild(grid);
  }

  /* ------------------------------------------------------------------
     8. MENU, FOOTER, THEME AND FONTS
     ------------------------------------------------------------------ */

  function renderHeader(cfg, page) {
    var header = document.getElementById('site-header');
    if (!header) return;
    var current = location.pathname.split('/').pop() || 'index.html';
    var items = cfg.navigation.items;
    var homeItem = items.filter(function (i) { return i.page === 'home'; })[0];

    var list = h('ul', { class: 'nav__list', id: 'nav-list' }, items.map(function (it) {
      var path = it.href.split(/[?#]/)[0].split('/').pop() || 'index.html';
      var active = it.page ? it.page === page : (!isExternal(it.href) && path === current);
      var a = h('a', Object.assign({ class: 'nav__link' + (active ? ' is-active' : ''), href: it.href }, active ? { 'aria-current': 'page' } : {}, externalAttrs(it.href)), it.label);
      return h('li', null, a);
    }));

    var nav = h('div', { class: 'container nav' });
    var toggle = h('button', {
      class: 'nav__toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'nav-list', 'aria-label': 'Menu',
      onclick: function () { setOpen(!nav.classList.contains('is-open')); }
    }, h('span', { class: 'nav__bars', 'aria-hidden': 'true' }));

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    list.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 640) setOpen(false); });

    nav.appendChild(h('a', { class: 'brand', href: homeItem ? homeItem.href : 'index.html' }, cfg.site.name));
    nav.appendChild(toggle);
    nav.appendChild(h('nav', { class: 'nav__menu', 'aria-label': 'Main' }, list));
    header.textContent = '';
    header.appendChild(nav);
  }

  function renderFooter(cfg) {
    var footer = document.getElementById('site-footer');
    if (!footer) return;
    var v = cfg.visibility;
    var line = cfg.site.footerText ? fill(cfg.site.footerText, { year: String(new Date().getFullYear()), name: cfg.site.name }) : '';
    var social = v.footerSocialLinks && cfg.social.items.length;
    if (!v.footer || (!line && !social)) { footer.hidden = true; return; }
    footer.textContent = '';
    footer.appendChild(h('div', { class: 'container footer' },
      line ? h('p', { class: 'footer__text' }, line) : null,
      social ? socialList(cfg.social.items, 'chips chips--small') : null));
  }

  function applyTheme(cfg) {
    var root = document.documentElement, c = cfg.theme.colors, f = cfg.theme.fonts;
    var vars = {
      '--bg': c.background, '--surface': c.surface, '--text': c.text, '--muted': c.mutedText,
      '--border': c.border, '--accent': c.accent, '--accent-text': c.accentText,
      '--radius': cfg.theme.radius, '--thumb-ratio': cfg.works.thumbnailRatio,
      '--font-heading': '"' + f.heading.family + '", ' + f.heading.fallback,
      '--font-body': '"' + f.body.family + '", ' + f.body.fallback
    };
    Object.keys(vars).forEach(function (k) { root.style.setProperty(k, vars[k]); });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', c.background);
    if (cfg.theme.animations && !reduceMotion) root.classList.add('js-anim');
    root.lang = cfg.site.language;

    // Optional web fonts. One <link> per font, so a mistake in one never breaks
    // the other. If Google Fonts cannot be reached, the fallback fonts are used.
    if (f.useGoogleFonts) {
      var seen = {};
      [f.heading, f.body].forEach(function (font) {
        if (seen[font.family]) return;
        seen[font.family] = true;
        var href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(font.family).replace(/%20/g, '+') + ':wght@' + font.weights + '&display=swap';
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        document.head.appendChild(l);
      });
    }
  }

  function applyHead(cfg, page) {
    var s = cfg.site;
    var pageTitle = page === 'about' ? cfg.about.pageTitle : page === 'works' ? cfg.works.pageTitle : '';
    document.title = pageTitle ? fill(s.titleTemplate, { page: pageTitle, name: s.name }) : s.browserTitle;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && s.description) desc.setAttribute('content', s.description);

    var icon = document.querySelector('link[rel~="icon"]');
    if (icon) {
      var types = { svg: 'image/svg+xml', png: 'image/png', ico: 'image/x-icon', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };
      var ext = (s.favicon.split(/[?#]/)[0].split('.').pop() || '').toLowerCase();
      if (types[ext]) icon.setAttribute('type', types[ext]); else icon.removeAttribute('type');
      icon.setAttribute('href', s.favicon);
    }
  }

  /* The owner-only box shown when previewing locally (see IS_DEV above). */
  function renderBanner(fatal) {
    if (!IS_DEV || !document.body || !warnings.length) return;
    if (!bannerEl) {
      bannerEl = h('aside', { class: 'dev-banner', role: 'status' });
      document.body.insertBefore(bannerEl, document.body.firstChild);
    }
    bannerEl.textContent = '';
    bannerEl.appendChild(h('button', { class: 'dev-banner__close', type: 'button', 'aria-label': 'Dismiss this message', onclick: function () { bannerEl.hidden = true; } }, '×'));
    bannerEl.appendChild(h('strong', null, 'Heads-up for the site owner'));
    bannerEl.appendChild(h('p', null, 'Only you see this box (while previewing, or with ?debug in the address). Visitors never see it.'));
    bannerEl.appendChild(h('ul', null, warnings.map(function (w) { return h('li', null, w); })));
    bannerEl.hidden = false;
  }

  /* ------------------------------------------------------------------
     9. START-UP
     ------------------------------------------------------------------ */

  function start(raw) {
    var page = document.body.getAttribute('data-page') || 'home';
    var cfg = normalizeConfig(raw);
    applyTheme(cfg);
    applyHead(cfg, page);
    renderHeader(cfg, page);

    var main = document.getElementById('main');
    main.textContent = '';
    if (page === 'about') renderAbout(cfg, main);
    else if (page === 'works') renderWorks(cfg, main);
    else renderHome(cfg, main);
    renderFooter(cfg);
    setupReveal(document.body);
    document.documentElement.classList.add('is-ready');
    renderBanner();
  }

  function init() {
    fetch(CONTENT_FILE, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('The file "' + CONTENT_FILE + '" was not found (HTTP ' + res.status + '). Is it in the same folder as index.html?');
        return res.text();
      })
      .then(function (src) {
        var data;
        try { data = JSON.parse(src); } catch (e) {
          throw new Error('content.json has a typo and could not be read: ' + jsonProblem(e, src) + '. Usual causes: a missing or extra comma, a missing quote, or a missing bracket. Paste the file into jsonlint.com to find the exact spot.');
        }
        return data;
      })
      .catch(function (err) {
        var msg = err && err.message ? err.message : String(err);
        if (location.protocol === 'file:' || /Failed to fetch|NetworkError|Load failed/i.test(msg)) {
          msg = 'content.json could not be loaded. If you opened index.html by double-clicking it, that is the cause: browsers block this for security. Start a tiny local server instead (see "Preview changes locally" in CUSTOMIZATION.md). Details: ' + msg;
        }
        warn(msg);
        if (window.console) console.error('[skip-portfolio] Using safe default content. ' + msg);
        return null; // null makes normalizeConfig use the safe defaults
      })
      .then(start);
  }

  // Exposed only so the logic can be checked from the browser console.
  window.SkipPortfolio = { parseYouTube: parseYouTube, safeUrl: safeUrl, assetPath: assetPath, normalizeConfig: normalizeConfig };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
