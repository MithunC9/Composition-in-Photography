/* Shared helpers: DOM building, dragging, canvas sizing, demo registry, film grain, shutter sound. */
(function () {
  'use strict';
  var U = {};

  U.h = function (tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  };
  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  U.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  U.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  U.svgNS = 'http://www.w3.org/2000/svg';
  U.s = function (tag, attrs) {
    var e = document.createElementNS(U.svgNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  };

  // Pointer position in an element's own coordinate space (SVG viewBox or CSS px).
  U.svgPoint = function (svg, ev) {
    var pt = svg.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    var m = svg.getScreenCTM();
    return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 };
  };

  // Generic drag: calls move(ev) while the pointer is down. Returns nothing.
  U.drag = function (target, handlers) {
    target.addEventListener('pointerdown', function (ev) {
      if (ev.button !== undefined && ev.button !== 0) return;
      ev.preventDefault();
      try { target.setPointerCapture(ev.pointerId); } catch (e) {}
      if (handlers.start) handlers.start(ev);
      if (handlers.move) handlers.move(ev);
      function mv(e) { if (handlers.move) handlers.move(e); }
      function up(e) {
        target.removeEventListener('pointermove', mv);
        target.removeEventListener('pointerup', up);
        target.removeEventListener('pointercancel', up);
        if (handlers.end) handlers.end(e);
      }
      target.addEventListener('pointermove', mv);
      target.addEventListener('pointerup', up);
      target.addEventListener('pointercancel', up);
    });
  };

  // Keeps a canvas backing store matched to its CSS size. Returns {w, h, dpr}.
  U.fitCanvas = function (canvas, aspect, maxDpr) {
    var dpr = Math.min(window.devicePixelRatio || 1, maxDpr || 2);
    var w = canvas.clientWidth || canvas.parentNode.clientWidth || 600;
    var h = aspect ? Math.round(w / aspect) : (canvas.clientHeight || 400);
    if (aspect) canvas.style.height = h + 'px';
    var bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
    return { w: w, h: h, dpr: dpr };
  };

  // Animation loop that only runs while its slide is on screen.
  U.loop = function (fn) {
    var id = 0, running = false, last = 0;
    function tick(t) {
      if (!running) return;
      var dt = last ? Math.min(.05, (t - last) / 1000) : 0;
      last = t;
      fn(t / 1000, dt);
      id = requestAnimationFrame(tick);
    }
    return {
      start: function () { if (running) return; running = true; last = 0; id = requestAnimationFrame(tick); },
      stop: function () { running = false; cancelAnimationFrame(id); }
    };
  };

  // Viewfinder corner brackets for demo screens.
  U.corners = function (el) {
    ['tl', 'tr', 'bl', 'br'].forEach(function (c) { el.appendChild(U.h('span', { class: 'corner ' + c, 'aria-hidden': 'true' })); });
  };

  U.seg = function (items, current, onPick, label) {
    var g = U.h('div', { class: 'seg', role: 'group', 'aria-label': label || 'Options' });
    items.forEach(function (it) {
      var b = U.h('button', { type: 'button', 'data-v': it.v, 'aria-pressed': String(it.v === current) }, U.esc(it.label));
      b.addEventListener('click', function () {
        g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        onPick(it.v);
      });
      g.appendChild(b);
    });
    g.set = function (v) { g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-v') === String(v))); }); };
    return g;
  };

  U.range = function (o) {
    var wrap = U.h('label', { class: 'range' + (o.grow ? ' grow' : '') });
    var top = U.h('span', { class: 'range-top' });
    top.appendChild(U.h('span', { class: 'mono', text: o.label }));
    var out = U.h('output');
    top.appendChild(out);
    var inp = U.h('input', { type: 'range', id: o.id, min: o.min, max: o.max, step: o.step || 1, value: o.value });
    wrap.appendChild(top);
    wrap.appendChild(inp);
    if (o.scale) {
      var sc = U.h('span', { class: 'range-scale', 'aria-hidden': 'true' });
      o.scale.forEach(function (t) { sc.appendChild(U.h('span', { text: t })); });
      wrap.appendChild(sc);
    }
    function upd() { out.textContent = o.format ? o.format(+inp.value) : inp.value; if (o.onInput) o.onInput(+inp.value); }
    inp.addEventListener('input', upd);
    wrap.input = inp; wrap.update = upd; wrap.output = out;
    out.textContent = o.format ? o.format(+inp.value) : inp.value;
    return wrap;
  };

  // Demo registry. Each demo gets mount(container) -> {enter, leave}.
  var demos = {};
  U.demo = function (name, factory) { demos[name] = factory; };
  U.getDemo = function (name) { return demos[name]; };

  // Film grain as a tiny tiled PNG.
  U.grain = function () {
    try {
      var c = document.createElement('canvas');
      c.width = c.height = 160;
      var x = c.getContext('2d');
      var d = x.createImageData(160, 160);
      for (var i = 0; i < d.data.length; i += 4) {
        var v = Math.random() * 255;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
        d.data[i + 3] = 255;
      }
      x.putImageData(d, 0, 0);
      document.documentElement.style.setProperty('--grain', 'url(' + c.toDataURL('image/png') + ')');
    } catch (e) { /* decorative only */ }
  };

  // Mechanical shutter click synthesized with WebAudio (off until the viewer turns it on).
  var ac = null;
  U.click = function () {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      var t = ac.currentTime;
      [0, 0.055].forEach(function (off, k) {
        var len = Math.floor(ac.sampleRate * 0.04);
        var buf = ac.createBuffer(1, len, ac.sampleRate);
        var ch = buf.getChannelData(0);
        for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, k ? 6 : 3);
        var src = ac.createBufferSource();
        src.buffer = buf;
        var bp = ac.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = k ? 2400 : 1500; bp.Q.value = 0.9;
        var g = ac.createGain();
        g.gain.value = k ? 0.35 : 0.55;
        src.connect(bp); bp.connect(g); g.connect(ac.destination);
        src.start(t + off);
      });
    } catch (e) { /* sound is optional */ }
  };

  // Rough, hand-drawn ellipse path (red china marker) around a box.
  U.markerRing = function (w, h, seed) {
    var r = seed || 1;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    var cx = w / 2, cy = h / 2, rx = w / 2 - 4, ry = h / 2 - 4, pts = [], n = 28, start = -0.9 + rnd() * .4;
    for (var i = 0; i <= n + 3; i++) {
      var a = start + (i / n) * Math.PI * 2.12;
      var j = 1 + (rnd() - .5) * .05;
      pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
    }
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var k = 1; k < pts.length - 1; k++) {
      var mx = (pts[k][0] + pts[k + 1][0]) / 2, my = (pts[k][1] + pts[k + 1][1]) / 2;
      d += ' Q' + pts[k][0].toFixed(1) + ' ' + pts[k][1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
    }
    return d;
  };

  window.CIPU = U;
})();
