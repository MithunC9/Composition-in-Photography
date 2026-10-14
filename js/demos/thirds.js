/* Rule of thirds viewfinder: drag a walker, the moon and the horizon; the frame reports
   power points, bisected horizons and the rule of space. Grid switches thirds / golden. */
(function () {
  'use strict';
  var U = window.CIPU;
  var W = 600, H = 400;

  U.demo('thirds', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen">' +
        '<svg class="stage" viewBox="0 0 600 400" role="application" aria-label="Rule of thirds experiment. Drag the walker, the moon and the horizon line.">' +
          '<defs>' +
            '<linearGradient id="t-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3936"/><stop offset=".75" stop-color="#9d968b"/><stop offset="1" stop-color="#cfc8bc"/></linearGradient>' +
            '<linearGradient id="t-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d5852"/><stop offset="1" stop-color="#1f1d1a"/></linearGradient>' +
          '</defs>' +
          '<rect width="600" height="400" fill="url(#t-sky)"/>' +
          '<g class="t-moon drag" tabindex="0" aria-label="Moon, draggable"><circle r="34" fill="transparent"/><circle r="17" fill="#f3efe7"/><circle cx="-5" cy="-3" r="3" fill="#d8d2c6"/><circle cx="6" cy="5" r="2" fill="#d8d2c6"/></g>' +
          '<g class="t-ground">' +
            '<rect class="t-land" x="0" width="600" height="400" fill="url(#t-sea)"/>' +
            '<g class="t-ripples" stroke="#fff" stroke-opacity=".07"></g>' +
          '</g>' +
          '<line class="t-hline" x1="0" x2="600" stroke="#e8e2d8" stroke-opacity=".5" stroke-width="1"/>' +
          '<g class="t-grid" stroke="#fff" stroke-width="1" stroke-opacity=".7"></g>' +
          '<g class="t-points"></g>' +
          '<g class="t-walker drag" tabindex="0" aria-label="Walker, draggable">' +
            '<rect x="-30" y="-70" width="60" height="78" fill="transparent"/>' +
            '<g class="t-body" fill="#0c0b0a">' +
              '<circle cx="2" cy="-55" r="7"/>' +
              '<path d="M-4 -47 Q4 -49 8 -44 L10 -22 Q9 -18 6 -20 L5 -30 L4 -14 L12 4 Q11 7 7 6 L-1 -10 L-8 5 Q-11 7 -13 4 L-6 -14 L-6 -30 L-11 -24 Q-14 -24 -12 -28 Z"/>' +
            '</g>' +
            '<ellipse class="t-shadow" cx="0" cy="5" rx="12" ry="2.5" fill="#000" opacity=".35"/>' +
          '</g>' +
          '<path class="t-ring" fill="none" stroke="#ff6a52" stroke-width="2.4" stroke-linecap="round" filter="url(#grease)" opacity="0"/>' +
          '<g class="t-handle drag" tabindex="0" aria-label="Horizon line, drag up or down">' +
            '<rect x="556" y="-14" width="44" height="28" fill="transparent"/>' +
            '<path d="M566 -8 h24 a3 3 0 0 1 3 3 v10 a3 3 0 0 1 -3 3 h-24 l-8 -8 z" fill="#e8e2d8"/>' +
            '<path d="M572 -2 h14 M572 2 h14" stroke="#1d1b18" stroke-width="1.2"/>' +
          '</g>' +
        '</svg>' +
        '<span class="tip">Drag the walker, the moon and the horizon</span>' +
        '<div class="hud"><span class="h-grid">Grid · thirds</span><span class="h-pos"></span></div>' +
      '</div>' +
      '<div class="controls"></div>' +
      '<div class="readout" aria-live="polite"></div>';

    var screen = host.querySelector('.screen');
    U.corners(screen);
    var svg = host.querySelector('svg');
    var ground = host.querySelector('.t-ground'), hline = host.querySelector('.t-hline');
    var gridG = host.querySelector('.t-grid'), pointsG = host.querySelector('.t-points');
    var walker = host.querySelector('.t-walker'), moon = host.querySelector('.t-moon'), handle = host.querySelector('.t-handle');
    var ring = host.querySelector('.t-ring'), readout = host.querySelector('.readout');
    var tip = host.querySelector('.tip'), hGrid = host.querySelector('.h-grid'), hPos = host.querySelector('.h-pos');
    var ripples = host.querySelector('.t-ripples');

    var state = { mode: 'thirds', horizon: 200, wx: 300, wy: 300, mx: 300, my: 92 };
    var flipped = false; // walker facing direction

    function fr() { return state.mode === 'phi' ? [.382, .618] : [1 / 3, 2 / 3]; }
    function lines() { var f = fr(); return { xs: [W * f[0], W * f[1]], ys: [H * f[0], H * f[1]] }; }
    function scaleAt(y) { return .55 + (y - state.horizon) / Math.max(40, H - state.horizon) * 1.25; }
    function subj() { var s = scaleAt(state.wy); return { x: state.wx, y: state.wy - 34 * s }; }

    function drawGrid() {
      var L = lines(), g = '', p = '';
      if (state.mode !== 'none') {
        L.xs.forEach(function (x) { g += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="400"/>'; });
        L.ys.forEach(function (y) { g += '<line x1="0" y1="' + y + '" x2="600" y2="' + y + '"/>'; });
        L.xs.forEach(function (x) { L.ys.forEach(function (y) {
          p += '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="#ff6a52" opacity=".9"/>';
        }); });
      }
      gridG.innerHTML = g; pointsG.innerHTML = p;
      hGrid.textContent = 'Grid · ' + (state.mode === 'phi' ? 'golden 1 : 1.618' : state.mode === 'none' ? 'off' : 'thirds');
    }

    function drawRipples() {
      var o = '';
      for (var i = 1; i < 9; i++) {
        var y = state.horizon + Math.pow(i / 9, 1.8) * (H - state.horizon);
        o += '<line x1="0" x2="600" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/>';
      }
      ripples.innerHTML = o;
    }

    function render() {
      ground.setAttribute('transform', 'translate(0 ' + state.horizon + ')');
      ripples.setAttribute('transform', 'translate(0 ' + (-state.horizon) + ')');
      hline.setAttribute('y1', state.horizon); hline.setAttribute('y2', state.horizon);
      handle.setAttribute('transform', 'translate(0 ' + state.horizon + ')');
      var s = scaleAt(state.wy);
      walker.setAttribute('transform', 'translate(' + state.wx + ' ' + state.wy + ') scale(' + (flipped ? -s : s) + ' ' + s + ')');
      moon.setAttribute('transform', 'translate(' + state.mx + ' ' + state.my + ')');
      drawRipples();
      evaluate();
    }

    function nearestPoint(x, y) {
      var L = lines(), best = null;
      L.xs.forEach(function (px) { L.ys.forEach(function (py) {
        var d = Math.hypot(px - x, py - y);
        if (!best || d < best.d) best = { x: px, y: py, d: d };
      }); });
      return best;
    }

    function evaluate() {
      var L = lines(), sp = subj(), np = nearestPoint(sp.x, sp.y), msgs = [];
      var showRing = state.mode !== 'none' && np.d < 22;
      if (showRing) {
        ring.setAttribute('d', U.markerRing(64, 64, Math.round(np.x + np.y)));
        ring.setAttribute('transform', 'translate(' + (np.x - 32) + ' ' + (np.y - 32) + ')');
      }
      ring.setAttribute('opacity', showRing ? 1 : 0);

      if (state.mode === 'none') msgs.push('<span class="mono">Subject</span>Turn on a grid to check.');
      else if (np.d < 22) msgs.push('<span class="mono">Subject</span><strong>On a power point.</strong> Nice.');
      else if (Math.hypot(sp.x - 300, sp.y - 200) < 40) msgs.push('<span class="mono">Subject</span><strong>Dead center.</strong> Try a red power point instead.');
      else if (Math.min(Math.abs(sp.x - L.xs[0]), Math.abs(sp.x - L.xs[1])) < 14) msgs.push('<span class="mono">Subject</span><strong>On a line.</strong> Now move it to a red point.');
      else msgs.push('<span class="mono">Subject</span>Drag the walker to a red power point.');

      var hz = state.horizon;
      if (Math.abs(hz - 200) < 12) msgs.push('<span class="mono">Horizon</span><strong>Cuts the frame in half.</strong> Move it to a line.');
      else if (Math.abs(hz - L.ys[1]) < 12) msgs.push('<span class="mono">Horizon</span><strong>On the lower line.</strong> More sky.');
      else if (Math.abs(hz - L.ys[0]) < 12) msgs.push('<span class="mono">Horizon</span><strong>On the upper line.</strong> More land and water.');
      else msgs.push('<span class="mono">Horizon</span>Drag the handle on the right to a line.');

      var facingOut = flipped ? sp.x < W * .3 : sp.x > W * .7;
      if (facingOut) msgs.push('<span class="mono">Space</span>The walker is about to leave the frame. Give it room to walk into.');
      readout.innerHTML = msgs.join('<br>');
      hPos.textContent = 'Horizon ' + Math.round((1 - hz / H) * 100) + '% from bottom';
    }

    function snap(x, y, r) {
      if (state.mode === 'none') return { x: x, y: y };
      var np = nearestPoint(x, y);
      return np.d < r ? { x: np.x, y: np.y } : { x: x, y: y };
    }
    function hideTip() { tip.classList.add('gone'); }

    var lastX = 0;
    U.drag(walker, {
      start: function (ev) { hideTip(); lastX = U.svgPoint(svg, ev).x; },
      move: function (ev) {
        var p = U.svgPoint(svg, ev);
        if (Math.abs(p.x - lastX) > 3) { flipped = p.x < lastX; lastX = p.x; }
        var wy = U.clamp(p.y + 20, state.horizon + 12, H - 4);
        var wx = U.clamp(p.x, 16, W - 16);
        var s = scaleAt(wy);
        // snap using the subject point (the figure's middle)
        var sp = snap(wx, wy - 34 * s, 16);
        state.wx = sp.x;
        state.wy = U.clamp(sp.y + 34 * s, state.horizon + 12, H - 4);
        render();
      }
    });
    U.drag(moon, {
      start: hideTip,
      move: function (ev) {
        var p = U.svgPoint(svg, ev);
        var sp = snap(U.clamp(p.x, 20, W - 20), U.clamp(p.y, 20, state.horizon - 18), 16);
        state.mx = sp.x; state.my = sp.y; render();
      }
    });
    U.drag(handle, {
      start: hideTip,
      move: function (ev) {
        var p = U.svgPoint(svg, ev);
        var L = lines(), y = U.clamp(p.y, 70, H - 50);
        L.ys.concat([200]).forEach(function (g) { if (Math.abs(y - g) < 7) y = g; });
        state.horizon = y;
        state.my = Math.min(state.my, y - 18);
        state.wy = Math.max(state.wy, y + 12);
        render();
      }
    });
    // keyboard support for the three draggables
    function keys(el, fn) {
      el.addEventListener('keydown', function (e) {
        var d = e.shiftKey ? 20 : 6, dx = 0, dy = 0;
        if (e.key === 'ArrowLeft') dx = -d; else if (e.key === 'ArrowRight') dx = d;
        else if (e.key === 'ArrowUp') dy = -d; else if (e.key === 'ArrowDown') dy = d; else return;
        e.preventDefault(); e.stopPropagation(); hideTip(); fn(dx, dy); render();
      });
    }
    keys(walker, function (dx, dy) { state.wx = U.clamp(state.wx + dx, 16, W - 16); state.wy = U.clamp(state.wy + dy, state.horizon + 12, H - 4); if (dx) flipped = dx < 0; });
    keys(moon, function (dx, dy) { state.mx = U.clamp(state.mx + dx, 20, W - 20); state.my = U.clamp(state.my + dy, 20, state.horizon - 18); });
    keys(handle, function (dx, dy) { state.horizon = U.clamp(state.horizon + dy, 70, H - 50); state.my = Math.min(state.my, state.horizon - 18); state.wy = Math.max(state.wy, state.horizon + 12); });

    var controls = host.querySelector('.controls');
    controls.appendChild(U.seg([{ v: 'thirds', label: 'Thirds' }, { v: 'phi', label: 'Golden mean' }, { v: 'none', label: 'No grid' }], 'thirds', function (v) {
      state.mode = v; drawGrid(); render();
    }, 'Grid'));
    var reset = U.h('button', { type: 'button', class: 'btn ghost' }, 'Show me');
    reset.addEventListener('click', function () {
      // Animate to a textbook arrangement.
      var L = lines(), from = { h: state.horizon, wx: state.wx, wy: state.wy, mx: state.mx, my: state.my }, t0 = performance.now();
      var to = { h: L.ys[1], wx: L.xs[0], wy: 0, mx: L.xs[1], my: L.ys[0] };
      flipped = false;
      hideTip();
      (function step(now) {
        var k = U.ease(U.clamp((now - t0) / 900, 0, 1));
        state.horizon = U.lerp(from.h, to.h, k);
        state.mx = U.lerp(from.mx, to.mx, k); state.my = U.lerp(from.my, to.my, k);
        // walker: put its subject point on the lower-left power point
        var targetWy = (function () { var y = L.ys[1] + 40; for (var i = 0; i < 20; i++) { var s = .55 + (y - to.h) / Math.max(40, H - to.h) * 1.25; y = L.ys[1] + 34 * s; } return y; })();
        state.wx = U.lerp(from.wx, to.wx, k); state.wy = U.lerp(from.wy, targetWy, k);
        state.wy = Math.max(state.wy, state.horizon + 12);
        render();
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
    controls.appendChild(reset);

    drawGrid();
    render();
    return {};
  });
})();
