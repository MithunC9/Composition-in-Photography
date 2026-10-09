/* Lines: five kinds of line, each drawn as a small abstract picture.
   "Trace the eye" animates the path a viewer's eye follows. Converging lines have a
   draggable vanishing point. */
(function () {
  'use strict';
  var U = window.CIPU;

  var KINDS = {
    horizontal: {
      label: 'Horizontal',
      text: '<strong>Horizontal lines</strong> feel calm and tranquil and suggest space. They are common in landscapes: the horizon, the sea, a field.',
      draw: function () {
        var o = '<rect width="600" height="400" fill="#b9b2a7"/><rect y="250" width="600" height="150" fill="#3d3a36"/>';
        [70, 120, 160, 190].forEach(function (y, i) { o += '<path class="ln" d="M' + (40 + i * 30) + ' ' + y + 'H' + (560 - i * 50) + '" stroke="#e8e2d8" stroke-width="' + (2 - i * .3) + '"/>'; });
        o += '<path class="ln main" d="M0 250H600" stroke="#efe9df" stroke-width="2.4"/>';
        [290, 320, 355].forEach(function (y, i) { o += '<path class="ln" d="M0 ' + y + 'H600" stroke="#6e6861" stroke-width="' + (1 + i * .6) + '"/>'; });
        o += '<path d="M352 250l6-16 5 16z" fill="#151412"/>';
        return o;
      },
      eye: 'M20 250 C 200 248, 300 252, 350 246'
    },
    vertical: {
      label: 'Vertical',
      text: '<strong>Vertical lines</strong> give an impression of height and grandeur, like tree trunks, columns and skyscrapers. A small figure at the base makes them feel even taller.',
      draw: function () {
        var o = '<rect width="600" height="400" fill="#cbc4b8"/>';
        [[40, 18], [96, 26], [150, 14], [208, 30], [262, 20], [330, 34], [396, 16], [446, 26], [508, 22], [560, 30]].forEach(function (t, i) {
          o += '<path class="ln' + (i === 5 ? ' main' : '') + '" d="M' + t[0] + ' 400V0" stroke="#1f1d1a" stroke-width="' + t[1] + '"/>';
        });
        o += '<rect y="372" width="600" height="28" fill="#2c2a27"/><circle cx="300" cy="352" r="4" fill="#d6442f"/><path d="M297 356h6l2 16h-10z" fill="#d6442f"/>';
        return o;
      },
      eye: 'M300 372 C 302 300, 326 200, 330 20'
    },
    diagonal: {
      label: 'Diagonal',
      text: '<strong>Diagonal lines</strong> convey movement and energy. Strongly angled lines create tension, which is why a staircase or a slanted pole feels alive.',
      draw: function () {
        var o = '<rect width="600" height="400" fill="#c2bbaf"/><path d="M0 400L600 40V400Z" fill="#2c2a27"/>';
        for (var i = 0; i < 12; i++) {
          var x = 40 + i * 46, y = 376 - i * 27.6;
          o += '<path class="ln" d="M' + x + ' ' + y + 'h46v-27.6" fill="none" stroke="#8a8378" stroke-width="1.6"/>';
        }
        o += '<path class="ln main" d="M20 400L600 52" stroke="#efe9df" stroke-width="3"/>';
        o += '<g transform="translate(372 214) rotate(-8)"><circle cy="-30" r="6" fill="#d6442f"/><path d="M-4 -24h8l3 20 6 14h-6l-6-12-4 12h-6l4-16z" fill="#d6442f"/></g>';
        return o;
      },
      eye: 'M40 388 L 372 190'
    },
    converging: {
      label: 'Converging',
      text: '<strong>Converging lines</strong> create depth and lead the eye straight to the point where they meet. Put your subject there. Drag the vanishing point to move it.',
      draw: function (vp) {
        var o = '<rect width="600" height="' + vp.y + '" fill="#b1aa9e"/><rect y="' + vp.y + '" width="600" height="' + (400 - vp.y) + '" fill="#3e3b37"/>';
        o += '<path d="M' + vp.x + ' ' + vp.y + 'L130 400H470Z" fill="#26241f"/>';
        var edges = [[0, 400], [130, 400], [470, 400], [600, 400], [0, 300], [600, 300], [0, 220], [600, 220]];
        edges.forEach(function (e, i) { o += '<path class="ln' + (i === 1 ? ' main' : '') + '" d="M' + e[0] + ' ' + e[1] + 'L' + vp.x + ' ' + vp.y + '" stroke="' + (i === 1 || i === 2 ? '#efe9df' : '#7c766d') + '" stroke-width="' + (i === 1 || i === 2 ? 2.4 : 1.2) + '"/>'; });
        for (var k = 1; k < 9; k++) {
          var t = Math.pow(k / 9, 2.2);
          var y = vp.y + (400 - vp.y) * t;
          var x = vp.x + (300 - vp.x) * t;
          o += '<path d="M' + (x - 2 * t) + ' ' + y + 'v' + (8 * t + 1) + '" stroke="#e8e2d8" stroke-width="' + (1 + 5 * t) + '"/>';
        }
        o += '<g class="vp drag" tabindex="0" aria-label="Vanishing point, draggable" transform="translate(' + vp.x + ' ' + vp.y + ')"><circle r="22" fill="transparent"/><circle r="7" fill="#d6442f"/><circle r="12" fill="none" stroke="#d6442f" stroke-opacity=".5"/></g>';
        return o;
      },
      eye: function (vp) { return 'M130 400 L ' + vp.x + ' ' + vp.y; }
    },
    curved: {
      label: 'Curved',
      text: '<strong>Curved lines</strong> create flow and harmony. They feel soft and natural, and an S-curve carries the eye gently through the whole picture, like the river in Ansel Adams’s Tetons.',
      draw: function () {
        var o = '<rect width="600" height="400" fill="#4a4743"/><path d="M0 0H600V120L520 92 470 118 420 70 380 110 330 40 290 104 240 76 200 112 150 80 100 116 40 90 0 110Z" fill="#cfc8bc"/>';
        o += '<path d="M0 120H600V400H0Z" fill="#2a2825"/>';
        o += '<path class="ln main" d="M210 400 C 120 330, 470 300, 380 240 S 160 180, 300 128" stroke="#e8e2d8" stroke-width="16" fill="none" stroke-linecap="round" opacity=".9"/>';
        o += '<path class="ln" d="M210 400 C 120 330, 470 300, 380 240 S 160 180, 300 128" stroke="#9c958a" stroke-width="2" fill="none"/>';
        return o;
      },
      eye: 'M210 400 C 120 330, 470 300, 380 240 S 160 180, 300 128 L 330 44'
    }
  };

  U.demo('lines', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen"><svg class="stage" viewBox="0 0 600 400" role="img" aria-label="Kinds of line">' +
        '<g class="l-scene"></g>' +
        '<path class="l-eye" fill="none" stroke="#ff6a52" stroke-width="3" stroke-linecap="round" opacity="0"/>' +
        '<circle class="l-dot" r="8" fill="#ff6a52" opacity="0"/>' +
      '</svg>' +
      '<div class="hud"><span class="h-kind"></span><span class="h-feel hot"></span></div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var svg = host.querySelector('svg'), scene = host.querySelector('.l-scene');
    var eye = host.querySelector('.l-eye'), dot = host.querySelector('.l-dot');
    var readout = host.querySelector('.readout'), hKind = host.querySelector('.h-kind'), hFeel = host.querySelector('.h-feel');
    var FEEL = { horizontal: 'Calm · space', vertical: 'Height · grandeur', diagonal: 'Movement · tension', converging: 'Depth · direction', curved: 'Flow · harmony' };
    var kind = 'diagonal', vp = { x: 300, y: 170 }, raf = 0;

    function render(animate) {
      var K = KINDS[kind];
      scene.innerHTML = K.draw(vp);
      hKind.textContent = K.label + ' lines';
      hFeel.textContent = FEEL[kind];
      readout.innerHTML = '<span class="mono">Line</span>' + K.text;
      if (animate && !U.reduced) {
        scene.querySelectorAll('.ln').forEach(function (p, i) {
          var len = p.getTotalLength ? p.getTotalLength() : 600;
          p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
          p.getBoundingClientRect();
          p.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.2,.7,.1,1) ' + (i * 40) + 'ms';
          p.style.strokeDashoffset = 0;
        });
      }
      var v = scene.querySelector('.vp');
      if (v) bindVP(v);
      eye.setAttribute('opacity', 0); dot.setAttribute('opacity', 0);
    }

    function bindVP(v) {
      U.drag(v, {
        move: function (ev) {
          var p = U.svgPoint(svg, ev);
          vp.x = U.clamp(p.x, 40, 560); vp.y = U.clamp(p.y, 60, 300);
          scene.innerHTML = KINDS.converging.draw(vp);
          bindVP(scene.querySelector('.vp'));
        }
      });
      v.addEventListener('keydown', function (e) {
        var d = 10;
        if (e.key === 'ArrowLeft') vp.x -= d; else if (e.key === 'ArrowRight') vp.x += d;
        else if (e.key === 'ArrowUp') vp.y -= d; else if (e.key === 'ArrowDown') vp.y += d; else return;
        e.preventDefault(); e.stopPropagation();
        vp.x = U.clamp(vp.x, 40, 560); vp.y = U.clamp(vp.y, 60, 300);
        scene.innerHTML = KINDS.converging.draw(vp);
        var nv = scene.querySelector('.vp'); bindVP(nv); nv.focus();
      });
    }

    function trace() {
      cancelAnimationFrame(raf);
      var K = KINDS[kind];
      eye.setAttribute('d', typeof K.eye === 'function' ? K.eye(vp) : K.eye);
      var len = eye.getTotalLength();
      eye.style.strokeDasharray = len;
      eye.setAttribute('opacity', 1); dot.setAttribute('opacity', 1);
      var t0 = performance.now(), dur = U.reduced ? 1 : 1800;
      (function step(now) {
        var k = U.clamp((now - t0) / dur, 0, 1), e = U.ease(k);
        eye.style.strokeDashoffset = len * (1 - e);
        var pt = eye.getPointAtLength(len * e);
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
        if (k < 1) raf = requestAnimationFrame(step);
      })(t0);
    }

    var controls = host.querySelector('.controls');
    controls.appendChild(U.seg(Object.keys(KINDS).map(function (k) { return { v: k, label: KINDS[k].label }; }), kind, function (v) {
      kind = v; render(true);
    }, 'Kind of line'));
    var tb = U.h('button', { type: 'button', class: 'btn ghost' }, 'Trace the eye');
    tb.addEventListener('click', trace);
    controls.appendChild(tb);

    render(false);
    var shown = false;
    return {
      enter: function () { if (!shown) { shown = true; render(true); setTimeout(trace, 1300); } },
      leave: function () { cancelAnimationFrame(raf); }
    };
  });
})();
