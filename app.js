/* =============================================================================
   JARVIS — app logic
   -----------------------------------------------------------------------------
   Diese Datei enthält KEINE Release- oder Funktionsdaten.
   Alles wird aus js/data.js (window.JARVIS_DATA) gelesen und gerendert.
   Bei Updates musst du hier nichts ändern.
   ========================================================================== */

(function () {
  'use strict';

  const D = window.JARVIS_DATA;
  if (!D) { console.error('JARVIS: js/data.js not loaded.'); return; }

  const cfg = D.siteConfig;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SEEN_KEY = 'jarvis:lastSeenVersion';
  const $ = (sel, root) => (root || document).querySelector(sel);

  /* ---------- tiny DOM helper (uses textContent -> no HTML injection) ------- */
  function append(el, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) child.forEach((c) => append(el, c));
    else if (child.nodeType) el.appendChild(child);
    else el.appendChild(document.createTextNode(String(child)));
  }
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    Object.keys(props || {}).forEach((k) => {
      const v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    kids.forEach((c) => append(el, c));
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  /* ---------- release logic ------------------------------------------------- */
  const isVisible = (x) => cfg.showSampleData || !x.sample;
  const hasValidDownload = (r) =>
    !!r && typeof r.downloadUrl === 'string' && /^(https:\/\/|\/downloads\/)/.test(r.downloadUrl.trim());

  function cmpVersion(a, b) {
    const pa = String(a).split('.').map(Number);
    const pb = String(b).split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const d = (pa[i] || 0) - (pb[i] || 0);
      if (d) return d;
    }
    return 0;
  }
  // newest first
  function cmpNewest(a, b) {
    return (
      new Date(b.releaseDate) - new Date(a.releaseDate) ||
      b.generation - a.generation ||
      cmpVersion(b.version, a.version)
    );
  }
  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // All releases that are shown anywhere (drafts never are).
  const visibleReleases = D.releases.filter((r) => r.status !== 'draft' && isVisible(r)).sort(cmpNewest);
  // latestRelease: derived, never hard-coded. Archived releases can't be "latest".
  const latest = visibleReleases.find((r) => r.status === 'published') || null;

  function releaseKeys(r) {
    const keys = [];
    if (r === latest) keys.push('latest');
    else if (r.status === 'archived') keys.push('archived');
    else keys.push('previous');
    if (!hasValidDownload(r)) keys.push('unavailable');
    return keys;
  }
  function releaseBadges(r) {
    const out = [];
    const keys = releaseKeys(r);
    if (keys.includes('latest')) out.push(h('span', { class: 'badge badge--latest', text: 'Latest' }));
    if (keys.includes('previous')) out.push(h('span', { class: 'badge', text: 'Previous release' }));
    if (keys.includes('archived')) out.push(h('span', { class: 'badge badge--muted', text: 'Archived' }));
    if (keys.includes('unavailable')) out.push(h('span', { class: 'badge badge--warn', text: 'Download unavailable' }));
    if (r.sample) out.push(h('span', { class: 'badge badge--sample', text: 'Sample' }));
    return out;
  }

  /* Download action: active ONLY with a valid URL, otherwise a disabled button. */
  function downloadAction(r, big) {
    const cls = 'btn ' + (big ? 'btn-primary' : 'btn-sm');
    const label = big ? 'Download latest version →' : 'Download v' + r.version + ' →';
    if (hasValidDownload(r)) {
      return h('a', { class: cls, href: r.downloadUrl.trim(), download: true, rel: 'noopener' }, h('span', { text: label }));
    }
    return h(
      'button',
      { class: cls, type: 'button', disabled: true, 'aria-disabled': 'true' },
      h('span', { text: big ? label : 'Download unavailable' })
    );
  }

  /* ---------- hero: background blocks ---------------------------------------- */
  function initBlocks() {
    const root = $('#bgBlocks');
    const count = window.innerWidth < 700 ? 20 : 40;
    const rnd = (a, b) => a + Math.random() * (b - a);

    function place(el) {
      el.style.left = rnd(0, 96).toFixed(1) + '%';
      el.style.top = rnd(0, 94).toFixed(1) + '%';
    }
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'blk' + (Math.random() < 0.14 ? ' blk--lit' : '');
      const w = Math.round(rnd(6, 40));
      const wide = Math.random() < 0.35;
      el.style.width = (wide ? w * 2 : w) + 'px';
      el.style.height = w + 'px';
      el.style.setProperty('--o', rnd(0.25, 0.7).toFixed(2));
      el.style.setProperty('--d', rnd(9, 18).toFixed(1) + 's');
      el.style.setProperty('--delay', '-' + rnd(0, 14).toFixed(1) + 's');
      el.style.setProperty('--dx', Math.round(rnd(-22, 22)) + 'px');
      el.style.setProperty('--dy', Math.round(rnd(-22, 22)) + 'px');
      place(el);
      // Jump to a fresh position whenever a fade cycle ends (block is invisible then).
      if (!reduceMotion) el.addEventListener('animationiteration', () => place(el));
      root.appendChild(el);
    }
  }

  /* ---------- statements: scroll-driven letter activation ------------------- */
  function initStatements() {
    const items = Array.prototype.slice.call(document.querySelectorAll('.statement'));
    items.forEach((li) => {
      const text = li.textContent.trim();
      clear(li);
      li.appendChild(h('span', { class: 'sr-only', text }));
      const vis = h('span', { class: 'vis', 'aria-hidden': 'true' });
      text.split(' ').forEach((word, wi, arr) => {
        const w = h('span', { class: 'w' });
        Array.prototype.forEach.call(word, (ch) => w.appendChild(h('span', { class: 'c', text: ch })));
        vis.appendChild(w);
        if (wi < arr.length - 1) vis.appendChild(document.createTextNode(' '));
      });
      li.appendChild(vis);
      li._chars = Array.prototype.slice.call(li.querySelectorAll('.c'));
      li._lit = 0;
    });
    if (reduceMotion) { items.forEach((li) => li._chars.forEach((c) => c.classList.add('on'))); return; }

    let ticking = false;
    function update() {
      ticking = false;
      const vh = window.innerHeight;
      items.forEach((li) => {
        const top = li.getBoundingClientRect().top;
        // 0 when the statement enters at ~88% of the viewport, 1 after scrolling ~45% of a viewport.
        const p = Math.min(1, Math.max(0, (vh * 0.88 - top) / (vh * 0.45)));
        const n = li._chars.length;
        const lit = Math.round(p * n);
        if (lit === li._lit) return;
        for (let i = 0; i < n; i++) li._chars[i].classList.toggle('on', i < lit);
        li._lit = lit;
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- reveal on scroll ------------------------------------------------ */
  let revealObserver = null;
  function observeReveals(root) {
    const els = (root || document).querySelectorAll('.reveal:not(.in)');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    els.forEach((e) => revealObserver.observe(e));
  }

  /* ---------- CTA ------------------------------------------------------------------ */
  function renderCta() {
    const box = $('#downloadAction');
    clear(box);
    box.appendChild(downloadAction(latest, true));
    if (!latest) {
      box.appendChild(h('p', { class: 'cta__meta', id: 'ctaStatus', text: 'Coming soon — no release has been published yet.' }));
    } else if (!hasValidDownload(latest)) {
      box.appendChild(h('p', { class: 'cta__meta', id: 'ctaStatus', text: 'Coming soon — the installation file for v' + latest.version + ' has not been published yet.' }));
    } else {
      const parts = ['Latest: v' + latest.version, 'Generation ' + latest.generation, formatDate(latest.releaseDate)];
      if (latest.platform) parts.push(latest.platform);
      if (latest.sample) parts.push('sample data');
      box.appendChild(h('p', { class: 'cta__meta', text: parts.join(' · ') }));
    }
  }

  /* ---------- update notification --------------------------------------------- */
  function readSeen() { try { return localStorage.getItem(SEEN_KEY); } catch (e) { return null; } }
  function markSeen() { try { if (latest) localStorage.setItem(SEEN_KEY, latest.version); } catch (e) { /* storage unavailable */ } }

  function hideNotice() {
    const n = $('#notice');
    n.classList.add('is-out');
    setTimeout(() => { n.hidden = true; }, 300);
  }

  function initNotice() {
    const n = $('#notice');
    if (!latest) return;                       // no releases -> no notification
    if (readSeen() === latest.version) return; // user already knows this version
    $('#noticeText').textContent = 'New version of JARVIS — Generation v' + latest.version + ' is available.';
    n.hidden = false;
    $('#noticeLink').addEventListener('click', (e) => {
      e.preventDefault();
      markSeen();
      hideNotice();
      goToLibrary(true);
    });
    $('#noticeClose').addEventListener('click', () => { markSeen(); hideNotice(); });
  }

  function goToLibrary(highlight) {
    const lib = $('#library');
    lib.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (!highlight) return;
    const card = $('#libLatest .card');
    if (!card) return;
    setTimeout(() => {
      card.classList.add('is-highlight');
      setTimeout(() => card.classList.remove('is-highlight'), 3800);
    }, reduceMotion ? 0 : 650);
  }

  /* ---------- functions section ------------------------------------------------ */
  const STATUS_LABEL = { available: 'Available', 'in-development': 'In development', planned: 'Planned' };
  const fnItems = D.functions.filter(isVisible);
  const intItems = D.integrations.filter(isVisible);

  const CATEGORIES = [
    { id: 'core', title: 'Core Functions', items: () => fnItems.filter((f) => f.category === 'core' && f.status === 'available') },
    { id: 'ai', title: 'AI Capabilities', items: () => fnItems.filter((f) => f.category === 'ai' && f.status === 'available') },
    { id: 'integrations', title: 'Integrations', items: () => intItems.filter((i) => i.category === 'integrations' && i.status === 'available') },
    { id: 'services', title: 'Supported Services', items: () => intItems.filter((i) => i.category === 'services' && i.status === 'available') },
    { id: 'automation', title: 'Automation', items: () => fnItems.filter((f) => f.category === 'automation' && f.status === 'available') },
    { id: 'requirements', title: 'System Requirements', items: () => D.systemRequirements.filter(isVisible).map((r) => ({ name: r.label, description: r.value, status: null, sample: r.sample })) },
    // Everything not yet available (functions AND integrations) is collected here automatically.
    { id: 'upcoming', title: 'Upcoming Features', items: () => fnItems.concat(intItems).filter((x) => x.status !== 'available') },
  ];

  function fnRow(item) {
    const meta = [];
    if (item.integrations && item.integrations.length) meta.push('Requires: ' + item.integrations.join(', '));
    if (item.compatibility) meta.push(item.compatibility);
    if (item.requirements) meta.push(item.requirements);
    const tags = [];
    if (item.status) tags.push(h('span', { class: 'badge' + (item.status === 'available' ? '' : ' badge--muted'), text: STATUS_LABEL[item.status] || item.status }));
    if (item.sample) tags.push(h('span', { class: 'badge badge--sample', text: 'Sample' }));
    return h('li', { class: 'row reveal' },
      h('h4', { class: 'row__name', text: item.name }),
      h('div', { class: 'row__body' },
        h('p', { text: item.description }),
        meta.length > 0 && h('p', { class: 'row__meta', text: meta.join(' · ') })),
      h('div', { class: 'row__tags' }, tags));
  }

  function renderFunctions() {
    const root = $('#functionsRoot');
    clear(root);
    CATEGORIES.forEach((cat) => {
      const items = cat.items();
      const hid = 'cat-' + cat.id;
      root.appendChild(h('section', { class: 'cat', 'aria-labelledby': hid },
        h('div', { class: 'cat__head reveal' },
          h('h3', { class: 'cat__title', id: hid, text: cat.title }),
          h('span', { class: 'cat__count', text: String(items.length).padStart(2, '0') })),
        items.length
          ? h('ul', null, items.map(fnRow))
          : h('p', { class: 'cat__empty reveal', text: 'No entries yet.' })));
    });
    if (cfg.showSampleData) $('#functionsNote').hidden = false;
    observeReveals(root);
  }

  /* ---------- library ------------------------------------------------------------ */
  const state = { q: '', status: 'all', sort: 'desc' };
  const openGens = new Set(latest ? [latest.generation] : []);
  const openRels = new Set();

  function changelogBlock(r) {
    const cl = r.changelog || {};
    const groups = [['added', 'New features'], ['fixed', 'Bug fixes'], ['changed', 'Changes since previous version']];
    const cols = groups
      .filter((g) => cl[g[0]] && cl[g[0]].length)
      .map((g) => h('div', null, h('h5', { text: g[1] }), h('ul', null, cl[g[0]].map((t) => h('li', { text: t })))));
    return cols.length ? h('div', { class: 'cl' }, cols) : h('p', { class: 'muted', text: 'No changelog provided.' });
  }

  function detailsBlock(r) {
    const reqs = r.systemRequirements || [];
    const meta = [];
    if (r.platform) meta.push('Platform: ' + r.platform);
    if (r.checksum) meta.push('SHA-256: ' + r.checksum);
    return [
      r.description && h('p', { class: 'card__desc', text: r.description }),
      h('h5', { class: 'detail-title', text: 'Changelog' }),
      changelogBlock(r),
      reqs.length > 0 && h('h5', { class: 'detail-title', text: 'Compatibility & system requirements' }),
      reqs.length > 0 && h('ul', { class: 'reqs' }, reqs.map((t) => h('li', { text: t }))),
      meta.length > 0 && h('div', { class: 'meta' }, meta.map((m) => h('span', { text: m }))),
      h('div', { class: 'action' },
        downloadAction(r, false),
        !hasValidDownload(r) && h('span', { class: 'action__hint', text: 'No installation file has been published for this version.' })),
    ];
  }

  function renderLatest() {
    const box = $('#libLatest');
    clear(box);
    if (!latest) {
      box.appendChild(h('div', { class: 'card' }, h('p', { class: 'empty', text: 'No releases have been published yet.' })));
      return;
    }
    box.appendChild(h('article', { class: 'card reveal', 'aria-labelledby': 'latestTitle' },
      h('div', { class: 'card__top' },
        h('span', { class: 'card__gen', text: 'JARVIS Generation ' + latest.generation }),
        releaseBadges(latest)),
      h('h3', { class: 'card__ver', id: 'latestTitle', text: 'v' + latest.version }),
      h('p', { class: 'card__date', text: 'Released ' + formatDate(latest.releaseDate) }),
      detailsBlock(latest)));
    observeReveals(box);
  }

  function matches(r) {
    if (state.status !== 'all' && !releaseKeys(r).includes(state.status)) return false;
    if (!state.q) return true;
    const cl = r.changelog || {};
    const hay = [r.version, 'v' + r.version, 'generation ' + r.generation, r.releaseDate, r.description,
      (cl.added || []).join(' '), (cl.fixed || []).join(' '), (cl.changed || []).join(' ')]
      .join(' ').toLowerCase();
    return hay.indexOf(state.q) !== -1;
  }

  function releaseRow(r) {
    const det = h('details', { class: 'rel' + (r === latest ? ' rel--latest' : '') });
    const id = r.generation + '/' + r.version;
    if (openRels.has(id)) det.open = true;
    det.addEventListener('toggle', () => { if (det.open) openRels.add(id); else openRels.delete(id); });
    det.appendChild(h('summary', { class: 'rel__sum' },
      h('span', { class: 'rel__ver', text: 'v' + r.version }),
      h('span', { class: 'rel__date', text: formatDate(r.releaseDate) }),
      h('span', { class: 'rel__badges' }, releaseBadges(r)),
      h('span', { class: 'chev', 'aria-hidden': 'true' })));
    det.appendChild(h('div', { class: 'rel__body' }, detailsBlock(r)));
    return det;
  }

  function renderArchive() {
    const root = $('#libArchive');
    clear(root);
    const list = visibleReleases.filter(matches);
    $('#libCount').textContent = list.length + (list.length === 1 ? ' release' : ' releases');
    if (!list.length) {
      root.appendChild(h('p', { class: 'empty', text: visibleReleases.length ? 'No releases match your search.' : 'No releases have been published yet.' }));
      return;
    }
    const byGen = {};
    list.forEach((r) => { (byGen[r.generation] = byGen[r.generation] || []).push(r); });
    const gens = Object.keys(byGen).map(Number).sort((a, b) => (state.sort === 'desc' ? b - a : a - b));
    gens.forEach((g) => {
      const rels = byGen[g].slice().sort((a, b) => (state.sort === 'desc' ? cmpNewest(a, b) : cmpNewest(b, a)));
      const vers = rels.map((r) => r.version).sort(cmpVersion);
      const det = h('details', { class: 'gen' });
      if (openGens.has(g) || state.q || state.status !== 'all') det.open = true;
      det.addEventListener('toggle', () => { if (det.open) openGens.add(g); else openGens.delete(g); });
      det.appendChild(h('summary', { class: 'gen__sum' },
        h('span', { class: 'gen__title', text: 'GENERATION ' + g }),
        h('span', { class: 'gen__meta', text: rels.length + (rels.length === 1 ? ' release' : ' releases') }),
        h('span', { class: 'gen__meta', text: vers.length > 1 ? 'v' + vers[0] + ' — v' + vers[vers.length - 1] : 'v' + vers[0] }),
        h('span', { class: 'chev', 'aria-hidden': 'true' })));
      det.appendChild(h('div', { class: 'gen__body' }, rels.map(releaseRow)));
      root.appendChild(det);
    });
  }

  function initLibrary() {
    if (cfg.showSampleData && visibleReleases.some((r) => r.sample)) $('#libraryNote').hidden = false;
    renderLatest();
    renderArchive();
    $('#libSearch').addEventListener('input', (e) => { state.q = e.target.value.trim().toLowerCase(); renderArchive(); });
    $('#libStatus').addEventListener('change', (e) => { state.status = e.target.value; renderArchive(); });
    $('#libSort').addEventListener('change', (e) => { state.sort = e.target.value; renderArchive(); });
  }

  /* ---------- boot ------------------------------------------------------------------- */
  initBlocks();
  initStatements();
  renderCta();
  renderFunctions();
  initLibrary();
  initNotice();
  observeReveals(document);
  $('#year').textContent = new Date().getFullYear();

  // Deep links (#library, #functions): content is rendered by JS, so re-align after render.
  if (location.hash.length > 1) {
    requestAnimationFrame(() => {
      const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView();
    });
  }
})();
