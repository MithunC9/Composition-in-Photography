/* Pattern: a repeating field of umbrellas (from above) or windows. Click any item to break
   the pattern and watch it become the subject. */
(function () {
  'use strict';
  var U = window.CIPU;

  function umbrella(cx, cy, r, i) {
    var o = '<g class="pt-item" data-i="' + i + '" transform="translate(' + cx + ' ' + cy + ')"><g class="pt-rot" style="transition:transform .6s cubic-bezier(.2,.7,.1,1)">';
    for (var k = 0; k < 8; k++) {
      var a1 = k / 8 * Math.PI * 2, a2 = (k + 1) / 8 * Math.PI * 2;
      o += '<path class="pt-panel ' + (k % 2 ? 'a' : 'b') + '" d="M0 0L' + (Math.cos(a1) * r).toFixed(1) + ' ' + (Math.sin(a1) * r).toFixed(1) + 'L' + (Math.cos(a2) * r).toFixed(1) + ' ' + (Math.sin(a2) * r).toFixed(1) + 'Z"/>';
    }
    return o + '<circle r="2.2" fill="#0b0a09"/></g><circle r="' + (r + 6) + '" fill="transparent"/></g>';
  }
  function windowEl(x, y, w, h, i) {
    return '<g class="pt-item" data-i="' + i + '" transform="translate(' + x + ' ' + y + ')">' +
      '<rect class="pt-win" width="' + w + '" height="' + h + '"/>' +
      '<path d="M' + (w / 2) + ' 0V' + h + 'M0 ' + (h * .38) + 'H' + w + '" stroke="#24221f" stroke-width="2"/>' +
      '<rect class="pt-blind" width="' + w + '" height="' + (h * .2) + '" fill="#36332f"/>' +
      '</g>';
  }

  U.demo('pattern', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen"><svg class="stage" viewBox="0 0 600 400" role="application" aria-label="A repeating pattern. Click any item to break the pattern."><g class="pt-field"></g></svg>' +
      '<span class="tip">Click any item to break the pattern</span>' +
      '<div class="hud"><span class="h-n"></span><span class="h-s hot"></span></div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var field = host.querySelector('.pt-field'), tip = host.querySelector('.tip');
    var hN = host.querySelector('.h-n'), hS = host.querySelector('.h-s'), readout = host.querySelector('.readout');
    var motif = 'umbrellas', broken = {}, count = 0;

    var style = document.createElement('style');
    style.textContent =
      '.pt-panel.a{fill:#2a2825}.pt-panel.b{fill:#46423d}' +
      '.pt-item{cursor:pointer}.pt-item:hover .pt-panel.b{fill:#5a554e}' +
      '.pt-item.broken .pt-panel.a{fill:#b8321f}.pt-item.broken .pt-panel.b{fill:#e2452e}' +
      '.pt-win{fill:#8f897f;transition:fill .4s}.pt-item:hover .pt-win{fill:#a29b90}' +
      '.pt-item.broken .pt-win{fill:#f0b34a}.pt-item.broken .pt-blind{opacity:0}' +
      '.pt-item{transition:opacity .5s}.pt-field.intro .pt-item{opacity:0}';
    host.appendChild(style);

    function build() {
      broken = {}; count = 0;
      var o = '', i = 0;
      if (motif === 'umbrellas') {
        o += '<rect width="600" height="400" fill="#77716a"/>';
        for (var row = 0; row < 7; row++) for (var col = 0; col < 10; col++) {
          var cx = 34 + col * 60 + (row % 2 ? 30 : 0) + Math.sin(row * 3 + col) * 3, cy = 30 + row * 57 + Math.cos(col * 2 + row) * 3;
          if (cx > 640) continue;
          o += umbrella(cx, cy, 27, i++);
        }
      } else {
        o += '<rect width="600" height="400" fill="#5c5852"/>';
        for (var r = 0; r < 7; r++) for (var c = 0; c < 12; c++) {
          o += windowEl(18 + c * 48.5, 16 + r * 55, 30, 38, i++);
          o += '<rect x="' + (14 + c * 48.5) + '" y="' + (56 + r * 55) + '" width="38" height="3" fill="#3f3c38"/>';
        }
      }
      field.innerHTML = o;
      field.querySelectorAll('.pt-item').forEach(function (it) {
        it.setAttribute('tabindex', '0');
        it.setAttribute('role', 'button');
        it.setAttribute('aria-label', 'Item ' + (+it.getAttribute('data-i') + 1) + ', break the pattern here');
        it.addEventListener('click', function () { toggle(it); });
        it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggle(it); } });
      });
      describe();
    }

    function toggle(it) {
      tip.classList.add('gone');
      var i = it.getAttribute('data-i');
      broken[i] = !broken[i];
      it.classList.toggle('broken', broken[i]);
      var rot = it.querySelector('.pt-rot');
      if (rot) rot.style.transform = broken[i] ? 'rotate(22deg) scale(1.08)' : '';
      count = Object.keys(broken).filter(function (k) { return broken[k]; }).length;
      describe();
    }

    function describe() {
      var n = field.querySelectorAll('.pt-item').length;
      hN.textContent = n + ' repeats';
      var t, s;
      if (count === 0) { s = 'Pure pattern'; t = '<strong>A perfect pattern.</strong> Nice rhythm, but nothing to look at first. Click any item to break it.'; }
      else if (count === 1) { s = 'One break'; t = '<strong>One break, and your eye goes straight to it.</strong> Now the pattern has a subject.'; }
      else if (count <= 3) { s = count + ' breaks'; t = '<strong>' + count + ' breaks</strong> start to compete, and your eye jumps between them.'; }
      else { s = count + ' breaks'; t = '<strong>Too many breaks.</strong> The pattern turns into clutter.'; }
      hS.textContent = s;
      readout.innerHTML = '<span class="mono">Pattern</span>' + t;
    }

    var controls = host.querySelector('.controls');
    controls.appendChild(U.seg([{ v: 'umbrellas', label: 'Umbrellas from above' }, { v: 'windows', label: 'Windows' }], motif, function (v) { motif = v; build(); intro(); }, 'Motif'));
    var rnd = U.h('button', { type: 'button', class: 'btn ghost' }, 'Break one at random');
    rnd.addEventListener('click', function () {
      build();
      var items = field.querySelectorAll('.pt-item');
      toggle(items[Math.floor(items.length * (.25 + Math.random() * .5))]);
    });
    controls.appendChild(rnd);

    function intro() {
      if (U.reduced) return;
      var items = field.querySelectorAll('.pt-item');
      field.classList.add('intro');
      items.forEach(function (it, k) { it.style.transitionDelay = (k * 9) + 'ms'; });
      requestAnimationFrame(function () { requestAnimationFrame(function () { field.classList.remove('intro'); }); });
      setTimeout(function () { items.forEach(function (it) { it.style.transitionDelay = ''; }); }, 1400);
    }

    build();
    var first = true;
    return { enter: function () { if (first) { first = false; intro(); } } };
  });
})();
