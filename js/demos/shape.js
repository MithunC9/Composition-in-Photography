/* Shape: Arnold Newman's Stravinsky, reduced step by step from photograph to silhouette,
   to traced shapes, to the musical flat sign the piano lid resembles. */
(function () {
  'use strict';
  var U = window.CIPU;
  var W = 823, H = 433;
  // Outlines traced from the print (image pixel coordinates)
  var PIANO = 'M187 93 L318 43 L327 47 L428 165 C470 168 530 172 590 182 C650 193 720 228 770 268 C805 297 822 330 818 352 C814 374 796 390 772 398 L771 410 L476 410 Z';
  var FLAT = 'M318 38 L352 38 L352 232 C410 196 500 186 584 212 C664 238 676 300 624 338 C566 380 450 396 352 412 L318 412 Z';
  var COUNTER = 'M352 270 C404 244 494 238 548 258 C596 276 588 306 546 330 C494 358 414 370 352 380 Z';

  var MODES = {
    photo: { label: 'Photograph', text: '<strong>The photograph.</strong> Stravinsky in the corner, the piano everywhere else.' },
    silhouette: { label: 'Silhouette', text: '<strong>Squint at it.</strong> Everything turns black or white, and the picture still reads.' },
    trace: { label: 'Trace shapes', text: '<strong>The shapes.</strong> A slanted lid, a big curve, a circle for the head, a thin prop and the edge of the wall.' },
    flat: { label: 'Flat sign', text: '<strong>The flat sign.</strong> The lid and body make a giant ♭, a symbol from Stravinsky’s world of music.' }
  };

  function sample(path, n) {
    var len = path.getTotalLength(), pts = [];
    for (var i = 0; i < n; i++) { var p = path.getPointAtLength(len * i / n); pts.push([p.x, p.y]); }
    return pts;
  }
  function toD(pts) { return 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z'; }

  U.demo('shape', function (host) {
    var p = window.CIP.photo('stravinsky');
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen on-paper"><div class="sh-box" style="position:relative">' +
        '<img src="' + p.img.local + '" alt="Igor Stravinsky by Arnold Newman, 1946" width="823" height="433" style="width:100%;height:auto;transition:filter .5s, opacity .6s">' +
        '<svg viewBox="0 0 823 433" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible" aria-hidden="true">' +
          '<path class="sh-src" d="' + PIANO + '" fill="none" stroke="none"/>' +
          '<path class="sh-dst" d="' + FLAT + '" fill="none" stroke="none"/>' +
          '<g class="sh-trace" fill="none" stroke="#e2452e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#grease)" opacity="0">' +
            '<path class="tr" d="' + PIANO + '"/>' +
            '<path class="tr" d="M281 198 L163 406"/>' +
            '<circle class="tr" cx="62" cy="350" r="35"/>' +
            '<path class="tr" d="M260 4 L253 408"/>' +
            '<path class="tr" d="M187 93 L318 43 L327 47 L428 165 L333 251 Z" stroke-dasharray="6 7"/>' +
          '</g>' +
          '<g class="sh-labels" font-family="IBM Plex Mono, monospace" font-size="13" letter-spacing="1.2" fill="#e2452e" opacity="0">' +
            '<text x="92" y="58">LID · GEOMETRIC</text><text x="600" y="168">BODY · ORGANIC CURVE</text>' +
            '<text x="14" y="300">HEAD · CIRCLE</text><text x="246" y="300" transform="rotate(-60 246 300)">PROP · LINE</text><text x="268" y="28">WALL EDGE</text>' +
          '</g>' +
          '<g class="sh-morph" opacity="0"><path class="sh-shape" fill="#0d0c0b"/><path class="sh-counter" d="' + COUNTER + '" fill="#efeae1" opacity="0" style="transition:opacity .6s"/>' +
            '<text x="690" y="120" font-family="Bodoni Moda, Didot, serif" font-style="italic" font-size="46" fill="#0d0c0b" class="sh-cap" opacity="0" style="transition:opacity .6s">♭ flat</text></g>' +
        '</svg>' +
      '</div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var img = host.querySelector('img'), svg = host.querySelector('svg');
    var trace = host.querySelector('.sh-trace'), labels = host.querySelector('.sh-labels');
    var morph = host.querySelector('.sh-morph'), shapeP = host.querySelector('.sh-shape'), counter = host.querySelector('.sh-counter'), cap = host.querySelector('.sh-cap');
    var readout = host.querySelector('.readout');
    var mode = 'photo', thr = 1, raf = 0, A = null, B = null;

    var controls = host.querySelector('.controls');
    var seg = U.seg(Object.keys(MODES).map(function (k) { return { v: k, label: MODES[k].label }; }), mode, function (v) { setMode(v); }, 'View');
    controls.appendChild(seg);
    var thrR = U.range({ id: 'shape-thr', label: 'Threshold', min: 50, max: 160, value: 100, grow: true,
      format: function (v) { return v < 80 ? 'More black' : v > 120 ? 'More white' : 'Middle'; },
      onInput: function (v) { thr = v / 100; if (mode === 'silhouette') applyFilter(); } });
    controls.appendChild(thrR);
    thrR.hidden = true;

    function applyFilter() {
      img.style.filter = mode === 'silhouette' ? 'grayscale(1) brightness(' + (2 - thr).toFixed(2) + ') contrast(24)' : 'none';
    }

    function drawTrace() {
      trace.querySelectorAll('.tr').forEach(function (el, i) {
        var len = el.getTotalLength ? el.getTotalLength() : 1000;
        el.style.transition = 'none';
        el.style.strokeDasharray = el.getAttribute('stroke-dasharray') ? '' : len;
        if (!el.getAttribute('stroke-dasharray')) el.style.strokeDashoffset = len;
        el.getBoundingClientRect();
        el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.3,.6,.2,1) ' + (i * 180) + 'ms';
        el.style.strokeDashoffset = 0;
      });
    }

    function runMorph(forward) {
      cancelAnimationFrame(raf);
      if (!A) { A = sample(host.querySelector('.sh-src'), 180); B = sample(host.querySelector('.sh-dst'), 180); }
      var t0 = performance.now(), dur = U.reduced ? 1 : 1500;
      counter.setAttribute('opacity', 0); cap.setAttribute('opacity', 0);
      (function step(now) {
        var k = U.clamp((now - t0) / dur, 0, 1), e = U.ease(forward ? k : 1 - k);
        shapeP.setAttribute('d', toD(A.map(function (a, i) { return [U.lerp(a[0], B[i][0], e), U.lerp(a[1], B[i][1], e)]; })));
        if (k < 1) raf = requestAnimationFrame(step);
        else if (forward) { counter.setAttribute('opacity', 1); cap.setAttribute('opacity', 1); }
      })(t0);
    }

    function setMode(v) {
      mode = v;
      seg.set(v);
      thrR.hidden = v !== 'silhouette';
      applyFilter();
      img.style.opacity = v === 'flat' ? .22 : 1;
      trace.setAttribute('opacity', v === 'trace' ? 1 : 0);
      labels.setAttribute('opacity', v === 'trace' ? 1 : 0);
      morph.setAttribute('opacity', v === 'flat' ? 1 : 0);
      if (v === 'trace') drawTrace();
      if (v === 'flat') runMorph(true); else cancelAnimationFrame(raf);
      readout.innerHTML = '<span class="mono">Shape</span>' + MODES[v].text;
    }
    setMode('photo');
    return { leave: function () { cancelAnimationFrame(raf); } };
  });
})();
