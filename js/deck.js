/* Builds every slide, then runs navigation: keyboard, filmstrip, contact sheet,
   swipe, deep links (#thirds, #thirds-photos ...), theme, sound, full screen. */
(function () {
  'use strict';
  var C = window.CIP, U = window.CIPU, h = U.h, esc = U.esc;
  var deck = document.getElementById('deck');
  var slides = []; // {id, label, kind, el, num, mounted, demo}
  var current = -1;
  var soundOn = false;

  function elByKey(k) { return C.ELEMENTS.filter(function (e) { return e.key === k; })[0]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function add(id, label, kind, build, extra) {
    var sec = h('section', { class: 'slide s-' + kind, id: id, 'aria-roledescription': 'slide', 'aria-label': label });
    var inner = h('div', { class: 'slide-inner' });
    sec.appendChild(inner);
    deck.appendChild(sec);
    var s = { id: id, label: label, kind: kind, el: sec, inner: inner, build: build, mounted: false, demo: null };
    if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
    slides.push(s);
    return s;
  }

  /* ---------- slide builders ---------- */

  function buildCover(s) {
    s.inner.innerHTML =
      '<div class="cover-text">' +
        '<p class="kicker mono rise"><b>Frame 00</b><span class="line"></span>A presentation in ten elements</p>' +
        '<h1 class="cover-title rise">Composition <span class="l2">in Photography</span><span class="l3">Ten elements, thirty photographs</span></h1>' +
        '<p class="cover-sub rise">Every photograph is a decision about what goes inside the frame and where. Move across the print to frame it yourself, then step through the ten elements that photographers use to arrange a picture.</p>' +
        '<div class="cover-meta rise"><p class="mono">Presented by</p><ul>' +
          C.GROUP.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') +
        '</ul></div>' +
        '<div class="cover-actions rise"><button type="button" class="btn" data-next>Begin <span aria-hidden="true">→</span></button>' +
        '<span class="hint mono">or press <kbd>→</kbd> <kbd>space</kbd> · <kbd>G</kbd> for all frames</span></div>' +
      '</div>' +
      '<div class="vf-wrap rise" data-demo-host></div>';
    s.demo = mountDemo('hero', s.inner.querySelector('[data-demo-host]'));
  }

  function buildDefine(s) {
    s.inner.innerHTML =
      '<div>' +
        '<p class="kicker mono"><b>01</b><span class="line"></span>Definition</p>' +
        '<h2 class="title">What is <em>composition</em>?</h2>' +
        '<div class="etym"><span class="word">com·po·si·tion</span><span class="mono gloss">from Latin componĕre, “to put together”</span></div>' +
        '<p class="lede">In photography, composition is the placement or arrangement of visual elements inside the frame, as distinct from the subject itself. It is the conscious organization of line, shape, light, space and texture so that they work together as a whole and lead the viewer’s eye.</p>' +
        '<ul class="points">' +
          '<li>The same subject can be <strong>composed many ways</strong>, and each arrangement changes what the picture says.</li>' +
          '<li>The photographer chooses a <strong>center of interest</strong> and arranges everything else to support it. When it all works together, the result is called <strong>unity</strong>.</li>' +
        '</ul>' +
        '<blockquote class="quote">Composition is the strongest way of seeing.<cite>Edward Weston</cite></blockquote>' +
      '</div>' +
      '<div data-demo-host></div>';
    s.demo = mountDemo('compose', s.inner.querySelector('[data-demo-host]'));
  }

  var GLYPHS = {
    thirds: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><path class="g-stroke" d="M40.7 2v76M79.3 2v76M2 27.3h116M2 52.7h116"/><circle class="g-red anim a-move" cx="79.3" cy="27.3" r="5"/>',
    framing: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><path class="g-stroke anim a-grow" d="M30 74V22q30-22 60 0v52"/><circle class="g-fill" cx="60" cy="52" r="5"/><path class="g-stroke" d="M60 57v14"/>',
    light: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><circle class="g-red anim a-move" cx="22" cy="18" r="6"/><rect class="g-fill" x="56" y="34" width="10" height="34"/><path class="g-faint" d="M2 68h116"/><path d="M66 68l40-18v18z" fill="currentColor" opacity=".22"/>',
    lines: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><path class="g-stroke" d="M10 78L58 30M110 78L62 30M36 78l22-48M84 78L62 30"/><circle class="g-red" cx="60" cy="28" r="4"/>',
    shape: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><path class="g-fill anim a-spin" d="M30 66L62 12l32 54z"/><circle class="g-red" cx="86" cy="22" r="7"/>',
    form: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><defs><radialGradient id="gform" cx=".34" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".55" stop-color="#8a8378"/><stop offset="1" stop-color="#1a1917"/></radialGradient></defs><circle cx="60" cy="40" r="27" fill="url(#gform)" class="anim a-grow"/>',
    space: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><circle class="g-red anim a-shrink" cx="92" cy="54" r="4"/>',
    texture: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><path class="g-stroke" d="M8 20q8-6 16 0t16 0 16 0 16 0 16 0 16 0 16 0M8 34q8-6 16 0t16 0 16 0 16 0 16 0 16 0 16 0M8 48q8-6 16 0t16 0 16 0 16 0 16 0 16 0 16 0M8 62q8-6 16 0t16 0 16 0 16 0 16 0 16 0 16 0"/>',
    pattern: '<rect class="g-faint" x="2" y="2" width="116" height="76"/>' + (function () {
      var o = ''; for (var y = 0; y < 4; y++) for (var x = 0; x < 7; x++) {
        var red = x === 4 && y === 1;
        o += '<rect class="' + (red ? 'g-red anim a-spin' : 'g-fill') + '" x="' + (12 + x * 15) + '" y="' + (12 + y * 15) + '" width="7" height="7"/>';
      } return o; })(),
    simplicity: '<rect class="g-faint" x="2" y="2" width="116" height="76"/><path class="g-faint" d="M2 56h116"/><circle class="g-red" cx="40" cy="56" r="5"/>'
  };

  function buildIndex(s) {
    var items = C.ELEMENTS.map(function (e) {
      return '<li><button type="button" class="idx" data-goto="' + e.key + '">' +
        '<span class="n mono">' + pad(e.num) + '</span>' +
        '<svg class="glyph" viewBox="0 0 120 80" aria-hidden="true">' + GLYPHS[e.key] + '</svg>' +
        '<span class="name">' + esc(e.name) + (e.sub ? '<small>' + esc(e.sub) + '</small>' : '') + '</span>' +
      '</button></li>';
    }).join('');
    s.inner.innerHTML =
      '<div class="index-head">' +
        '<div><p class="kicker mono"><b>02</b><span class="line"></span>Contents</p>' +
        '<h2 class="title">The ten <em>elements</em></h2></div>' +
        '<p>These are the tools of composition. For each one: a definition, an experiment you can try, and three famous photographs that use it. Pick one to jump straight there.</p>' +
      '</div>' +
      '<ol class="index-grid">' + items + '</ol>';
  }

  function buildElement(s) {
    var e = s.element;
    var others = C.PHOTOS.filter(function (p) { return p.el === e.key; });
    s.inner.innerHTML =
      '<div class="el-text">' +
        '<span class="el-num" aria-hidden="true">' + pad(e.num) + '</span>' +
        '<p class="kicker mono"><b>Element ' + pad(e.num) + '</b><span class="line"></span>of ten</p>' +
        '<h2 class="title">' + esc(e.name) + '</h2>' +
        (e.sub ? '<p class="subtitle">' + esc(e.sub) + '</p>' : '') +
        '<p class="lede">' + esc(e.lede) + '</p>' +
        '<ul class="points">' + e.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
        '<div class="also"><button type="button" class="chip" data-next>' +
          '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9"/><path d="M5.5 3.5v9M10.5 3.5v9"/></svg>' +
          'See it in ' + others.length + ' famous photographs</button></div>' +
      '</div>' +
      '<div data-demo-host></div>';
    s.demo = mountDemo(e.demo, s.inner.querySelector('[data-demo-host]'));
  }

  function buildPhotos(s) {
    var e = s.element;
    var list = C.PHOTOS.filter(function (p) { return p.el === e.key; });
    var head = h('div', { class: 'photos-head' });
    head.innerHTML =
      '<div><p class="kicker mono"><b>Element ' + pad(e.num) + '</b><span class="line"></span>' + esc(e.name) + ' in practice</p>' +
      '<h2 class="title">' + esc(e.name) + ', <em>in three photographs</em></h2></div>' +
      '<div class="head-tools"><span class="mono" style="color:var(--muted)">Overlay</span></div>';
    var grid = 'none';
    var seg = U.seg([{ v: 'none', label: 'None' }, { v: 'thirds', label: 'Thirds' }, { v: 'phi', label: 'Golden' }, { v: 'diag', label: 'Diagonals' }], grid, function (v) {
      s.el.setAttribute('data-grid', v);
    }, 'Composition overlay on all three photographs');
    head.querySelector('.head-tools').appendChild(seg);
    if (e.key === 'thirds') { s.el.setAttribute('data-grid', 'thirds'); seg.set('thirds'); }

    var row = h('div', { class: 'prints' });
    list.forEach(function (p) {
      var fig = h('figure', { class: 'print' + (p.featured ? ' featured' : '') });
      var btn = h('button', { type: 'button', class: 'print-btn', 'aria-label': 'Open ' + p.title + ' by ' + p.by });
      btn.appendChild(C.print(p));
      btn.addEventListener('click', function () { C.openLightbox(p.id, list.map(function (x) { return x.id; })); });
      fig.appendChild(btn);
      var cap = h('figcaption');
      cap.innerHTML =
        '<p class="p-title">' + esc(p.title) + '</p>' +
        '<p class="p-by mono" style="margin:0"><b>' + esc(p.by) + '</b> · ' + esc(p.year) + (p.note ? ' · <span class="note-badge">' + esc(p.note) + '</span>' : '') + '</p>' +
        '<p class="p-look">' + esc(p.look) + '</p>';
      var more = h('button', { type: 'button', class: 'p-more mono' }, 'The story →');
      more.addEventListener('click', function () { C.openLightbox(p.id, list.map(function (x) { return x.id; })); });
      cap.appendChild(more);
      fig.appendChild(cap);
      row.appendChild(fig);
    });
    s.inner.appendChild(head);
    s.inner.appendChild(row);
  }

  function buildVideo(s) {
    var v = C.VIDEO;
    var tips = v.tips.map(function (t, i) {
      var e = elByKey(t.el);
      return '<li><button type="button" data-goto="' + t.el + '"><span class="t-n">' + pad(i + 1) + '</span><span class="t-name">' + esc(t.name) + '</span><span class="t-go">' + pad(e.num) + ' ' + esc(e.short) + ' →</span></button></li>';
    }).join('');
    s.inner.innerHTML =
      '<div>' +
        '<div class="video" id="video-box">' +
          '<button type="button" class="video-poster" id="video-poster" aria-label="Play the video: ' + esc(v.title) + '">' +
            '<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg></span>' +
            '<span class="v-label"><b>' + esc(v.title) + '</b><span>' + esc(v.channel) + '</span></span>' +
          '</button>' +
        '</div>' +
        '<p class="video-note mono"><span>Video · about 4 minutes</span><a href="' + v.url + '" target="_blank" rel="noopener">Watch on YouTube ↗</a></p>' +
      '</div>' +
      '<div>' +
        '<p class="kicker mono"><b>Watch</b><span class="line"></span>Rule of thirds and beyond</p>' +
        '<h2 class="title" style="font-size:clamp(2rem,3.6vw,3.6rem)">Nine tips, <em>one master</em></h2>' +
        '<p class="lede" style="font-size:var(--fs-body)">COOPH walks through nine composition tips using Steve McCurry’s photographs, starting with the rule of thirds. Each tip maps onto one of our ten elements. Click a tip to jump to it.</p>' +
        '<ol class="tips">' + tips + '</ol>' +
      '</div>';
    var poster = s.inner.querySelector('#video-poster');
    // Thumbnail is optional; the poster is designed to work without it.
    var thumb = new Image();
    thumb.onload = function () { poster.style.backgroundImage = 'url(' + thumb.src + ')'; };
    thumb.src = 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
    poster.addEventListener('click', function () {
      var box = s.inner.querySelector('#video-box');
      var f = h('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + v.id + '?autoplay=1&rel=0&modestbranding=1',
        title: v.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: ''
      });
      box.innerHTML = '';
      box.appendChild(f);
    });
    s.leaveHook = function () {
      var f = s.inner.querySelector('#video-box iframe');
      if (f) { f.src = 'about:blank'; buildVideo(s); }
    };
  }

  function buildRules(s) {
    s.inner.innerHTML =
      '<div>' +
        '<p class="kicker mono"><b>Afterword</b><span class="line"></span>Breaking the rules</p>' +
        '<blockquote class="big-quote" style="margin:0">There are no rules for good photographs, there are only <em>good photographs.</em></blockquote>' +
        '<cite>Attributed to Ansel Adams</cite>' +
        '<p class="lede">Our reading says it directly: breaking the rules can create tension or unease, yet it can add interest to the picture if used carefully. Every element here is a guideline. The masters learned them first, then broke them on purpose.</p>' +
      '</div>' +
      '<div class="breaks">' +
        breakRow('<rect x="1" y="1" width="94" height="62" fill="none" stroke="currentColor" opacity=".35"/><path d="M1 32h94" stroke="currentColor"/><path d="M1 32h94v31H1z" fill="currentColor" opacity=".12"/>',
          'A centered horizon', 'Hiroshi Sugimoto’s Seascapes split the frame exactly in half, breaking the rule of thirds to make the sea feel still and timeless.') +
        breakRow('<rect x="1" y="1" width="94" height="62" fill="none" stroke="currentColor" opacity=".35"/><circle cx="12" cy="52" r="5" fill="var(--marker)"/><path d="M30 10l54 4 6 44H46z" fill="currentColor" opacity=".8"/>',
          'A subject in the corner', 'Arnold Newman pushed Stravinsky into the bottom-left corner and gave the frame to a piano. The imbalance is the portrait.') +
        breakRow('<rect x="1" y="1" width="94" height="62" fill="none" stroke="currentColor" opacity=".35"/><circle cx="48" cy="32" r="12" fill="none" stroke="currentColor"/><circle cx="48" cy="32" r="3" fill="var(--marker)"/>',
          'Dead center', 'Steve McCurry ends his own tips by saying rules are made to be broken. A centered face with a direct gaze can hit harder than any power point.') +
      '</div>';
    function breakRow(svg, t, d) {
      return '<div class="break"><svg viewBox="0 0 96 64" aria-hidden="true">' + svg + '</svg><div><h3>' + esc(t) + '</h3><p>' + esc(d) + '</p></div></div>';
    }
  }

  function buildQuiz(s) { s.demo = C.mountQuiz(s.inner); }

  function buildCredits(s) {
    var credits = C.PHOTOS.map(function (p) {
      return '<li><b>' + esc(p.title) + '</b><br>' + esc(p.by) + (p.org ? ', ' + esc(p.org) : '') + ', ' + esc(p.year) +
        '<br><span class="r">' + (p.rights === 'pd' ? 'Public domain' : '© Photographer or estate · classroom use') + '</span></li>';
    }).join('');
    var sources = C.SOURCES.map(function (x) {
      return '<span>' + (x.href ? '<a href="' + x.href + '" target="_blank" rel="noopener">' + esc(x.label) + '</a>' : esc(x.label)) + '</span>';
    }).join('');
    s.inner.innerHTML =
      '<div class="credits-top">' +
        '<div><p class="kicker mono"><b>End of roll</b><span class="line"></span>Thank you</p>' +
          '<h2 class="title">Composition <em>in Photography</em></h2>' +
          '<ul class="names">' + C.GROUP.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="sources"><p class="mono" style="color:var(--muted);margin:0 0 4px">Sources</p>' + sources + '</div>' +
      '</div>' +
      '<ol class="credit-list">' + credits + '</ol>' +
      '<p class="fine">Photographs are shown for non-commercial, educational classroom use. Rights stay with the photographers, their estates and agencies. Public domain works are marked. Images load from Wikimedia Commons and Wikipedia.</p>';
  }

  /* ---------- demo mounting ---------- */
  function mountDemo(name, host) {
    var f = U.getDemo(name);
    if (!f || !host) return null;
    try { return f(host) || null; } catch (err) {
      if (window.console) console.error('Demo "' + name + '" failed:', err);
      host.innerHTML = '<p class="readout">This interactive could not start in this browser.</p>';
      return null;
    }
  }

  /* ---------- slide list ---------- */
  add('cover', 'Composition in Photography', 'cover', buildCover);
  add('definition', 'Definition of composition', 'define', buildDefine);
  add('elements', 'The ten elements', 'index', buildIndex);
  C.ELEMENTS.forEach(function (e) {
    add(e.key, pad(e.num) + ' ' + e.name, 'element', buildElement, { element: e, elNum: e.num });
    add(e.key + '-photos', pad(e.num) + ' ' + e.name + ': photographs', 'photos', buildPhotos, { element: e, elNum: e.num });
    if (e.key === 'thirds') add('video', 'Video: 9 composition tips', 'video', buildVideo, { elNum: 1 });
  });
  add('rules', 'Breaking the rules', 'rules', buildRules);
  add('quiz', 'Quiz: name the element', 'quiz', buildQuiz);
  add('credits', 'Credits and sources', 'credits', buildCredits);

  function indexOf(id) { for (var i = 0; i < slides.length; i++) if (slides[i].id === id) return i; return -1; }

  function ensureMounted(i) {
    var s = slides[i];
    if (!s || s.mounted) return;
    s.mounted = true;
    s.build(s);
    s.inner.querySelectorAll('.rise').length; // keep
  }

  /* ---------- filmstrip + contact sheet ---------- */
  var strip = document.getElementById('strip');
  var frames = slides.map(function (s, i) {
    var b = h('button', { type: 'button', class: 'frame' + (s.kind === 'photos' ? ' is-photos' : ''), role: 'tab', 'aria-label': pad(i) + ' ' + s.label });
    b.innerHTML = '<span class="fn">' + pad(i) + '</span><span class="tip-label">' + esc(s.label) + '</span>';
    b.addEventListener('click', function () { go(i); });
    strip.appendChild(b);
    return b;
  });

  var sheet = document.getElementById('sheet');
  var sheetGrid = document.getElementById('sheet-grid');
  function kindLabel(s) {
    return { cover: 'Title', define: 'Definition', index: 'Contents', element: 'Definition + experiment', photos: 'Three photographs', video: 'Video', rules: 'Afterword', quiz: 'Quiz', credits: 'Credits' }[s.kind];
  }
  function openSheet() {
    sheetGrid.innerHTML = '';
    slides.forEach(function (s, i) {
      var li = h('li');
      var b = h('button', { type: 'button', class: 'cs', 'aria-label': 'Frame ' + pad(i) + ': ' + s.label, 'aria-current': i === current ? 'true' : false });
      b.innerHTML =
        '<span class="cs-edge">▸ ' + pad(i) + (i % 2 ? 'A' : '') + '</span>' +
        '<span class="cs-frame">' + (s.elNum ? '<span class="cs-big">' + pad(s.elNum) + '</span>' : '') +
        '<span>' + esc(kindLabel(s)) + '</span><b>' + esc(s.label.replace(/^\d\d /, '').replace(/: photographs$/, '')) + '</b></span>';
      if (i === current) {
        b.insertAdjacentHTML('beforeend', '<svg class="ring" viewBox="0 0 220 152" preserveAspectRatio="none" aria-hidden="true"><path d="' + U.markerRing(220, 152, i + 7) + '"/></svg>');
      }
      b.addEventListener('click', function () { closeSheet(); go(i); });
      li.appendChild(b);
      sheetGrid.appendChild(li);
    });
    sheet.hidden = false;
    var cur = sheetGrid.querySelector('[aria-current="true"]');
    if (cur) setTimeout(function () { cur.focus(); cur.scrollIntoView({ block: 'center' }); }, 30);
  }
  function closeSheet() { sheet.hidden = true; deck.focus({ preventScroll: true }); }
  document.getElementById('btn-sheet').addEventListener('click', function () { sheet.hidden ? openSheet() : closeSheet(); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.closest('[data-close-sheet]')) closeSheet(); });

  /* ---------- navigation ---------- */
  var shutter = document.getElementById('shutter');
  var busy = false;

  function go(i, instant) {
    i = U.clamp(i, 0, slides.length - 1);
    if (i === current || busy) return;
    var prev = slides[current];
    var next = slides[i];
    ensureMounted(i);
    // Mount neighbours ahead of time so photos start loading.
    setTimeout(function () { ensureMounted(i + 1); }, 400);

    function swap() {
      if (prev) {
        prev.el.classList.remove('is-active');
        prev.el.setAttribute('aria-hidden', 'true');
        if (prev.demo && prev.demo.leave) prev.demo.leave();
        if (prev.leaveHook) prev.leaveHook();
      }
      next.el.removeAttribute('aria-hidden');
      next.el.classList.add('is-entering');
      next.el.classList.add('is-active');
      next.el.scrollTop = 0;
      void next.el.offsetWidth;
      next.el.classList.remove('is-entering');
      if (next.demo && next.demo.enter) next.demo.enter();
      current = i;
      updateChrome();
    }

    if (instant || !prev || U.reduced) { swap(); return; }
    if (soundOn) U.click();
    busy = true;
    shutter.className = 'shutter close';
    setTimeout(function () {
      swap();
      shutter.className = 'shutter open';
      setTimeout(function () { shutter.className = 'shutter'; busy = false; }, 270);
    }, 165);
  }

  function updateChrome() {
    var s = slides[current];
    document.getElementById('counter-now').textContent = pad(current);
    document.getElementById('counter-total').textContent = pad(slides.length - 1);
    document.getElementById('counter-title').textContent = current ? s.label : '';
    document.getElementById('btn-prev').disabled = current === 0;
    document.getElementById('btn-next').disabled = current === slides.length - 1;
    frames.forEach(function (f, k) {
      f.classList.toggle('is-current', k === current);
      f.setAttribute('aria-selected', String(k === current));
      if (k === current) f.classList.add('is-seen');
    });
    var f = frames[current];
    if (f && f.scrollIntoView) {
      var sl = strip.scrollLeft, fr = f.offsetLeft - strip.clientWidth / 2 + f.clientWidth / 2;
      if (Math.abs(sl - fr) > 4) strip.scrollTo({ left: fr, behavior: U.reduced ? 'auto' : 'smooth' });
    }
    var hash = '#' + s.id;
    if (location.hash !== hash) {
      try { history.replaceState(null, '', current === 0 ? location.pathname + location.search : hash); } catch (e) {}
    }
    document.title = current === 0 ? 'Composition in Photography' : s.label + ' · Composition in Photography';
  }

  document.getElementById('btn-prev').addEventListener('click', function () { go(current - 1); });
  document.getElementById('btn-next').addEventListener('click', function () { go(current + 1); });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-next],[data-goto],[data-go]');
    if (!t) return;
    if (t.hasAttribute('data-next')) go(current + 1);
    else if (t.hasAttribute('data-goto')) go(indexOf(t.getAttribute('data-goto')));
    else go(+t.getAttribute('data-go'));
  });

  function typing(e) {
    var t = e.target;
    return t && (t.tagName === 'INPUT' && t.type !== 'range' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || typing(e)) return;
    var lb = document.getElementById('lightbox');
    if (!lb.hidden) return; // lightbox has its own keys
    if (!sheet.hidden) {
      if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') { e.preventDefault(); closeSheet(); }
      return;
    }
    var onRange = e.target && e.target.type === 'range';
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.target.closest('button'))) {
      if (onRange && k === 'ArrowRight') return;
      e.preventDefault(); go(current + 1);
    } else if (k === 'ArrowLeft' || k === 'PageUp') {
      if (onRange) return;
      e.preventDefault(); go(current - 1);
    } else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(slides.length - 1); }
    else if (k === 'g' || k === 'G' || k === 'Escape') { if (k !== 'Escape') { e.preventDefault(); openSheet(); } }
    else if (k === 't' || k === 'T') toggleTheme();
    else if (k === 'f' || k === 'F') toggleFull();
    else if (k === 's' || k === 'S') toggleSound();
    else if (/^[0-9]$/.test(k)) {
      var n = k === '0' ? 10 : +k;
      var el = C.ELEMENTS[n - 1];
      if (el) go(indexOf(el.key));
    }
  });

  // Swipe between frames on touch screens, ignoring gestures that start on controls.
  var sx = 0, sy = 0, st = 0, tracking = false;
  deck.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    var t = e.target;
    tracking = !t.closest('input,button,canvas,svg.stage,.vf,.drag,iframe,a');
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
  }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Date.now() - st < 600 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) go(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- theme, sound, full screen ---------- */
  function effectiveTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function toggleTheme() {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('cip-theme', next); } catch (e) {}
    themeLabel();
    window.dispatchEvent(new CustomEvent('cip-theme'));
  }
  function themeLabel() {
    var b = document.getElementById('btn-theme');
    var t = effectiveTheme();
    b.setAttribute('aria-label', t === 'dark' ? 'Darkroom theme on. Switch to light table (T)' : 'Light table theme on. Switch to darkroom (T)');
    b.title = t === 'dark' ? 'Darkroom · switch to light table (T)' : 'Light table · switch to darkroom (T)';
  }
  document.getElementById('btn-theme').addEventListener('click', toggleTheme);
  themeLabel();

  function toggleSound() {
    soundOn = !soundOn;
    var b = document.getElementById('btn-sound');
    b.setAttribute('aria-pressed', String(soundOn));
    b.setAttribute('aria-label', soundOn ? 'Shutter sound on (S)' : 'Shutter sound off (S)');
    if (soundOn) U.click();
  }
  document.getElementById('btn-sound').addEventListener('click', toggleSound);

  function toggleFull() {
    try {
      if (!document.fullscreenElement) { var p = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(function () {}); }
      else if (document.exitFullscreen) document.exitFullscreen();
    } catch (e) {}
  }
  document.getElementById('btn-full').addEventListener('click', toggleFull);
  if (!document.documentElement.requestFullscreen) document.getElementById('btn-full').hidden = true;

  window.addEventListener('hashchange', function () {
    var i = indexOf(location.hash.slice(1));
    if (i >= 0) go(i);
  });

  C.go = function (id) { var i = indexOf(id); if (i >= 0) go(i); };
  C.goIndex = go;

  /* ---------- start ---------- */
  U.grain();
  document.getElementById('counter-total').textContent = pad(slides.length - 1);
  slides.forEach(function (s) { s.el.setAttribute('aria-hidden', 'true'); });
  var start = indexOf(location.hash.slice(1));
  go(start >= 0 ? start : 0, true);
  ensureMounted(1);
  deck.focus({ preventScroll: true });
})();
