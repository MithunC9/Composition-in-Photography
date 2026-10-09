/* Simplicity: a cluttered street. Slide (or click things) to remove distractions,
   then open the aperture so the background melts away and one subject is left. */
(function () {
  'use strict';
  var U = window.CIPU;
  var STOPS = [16, 11, 8, 5.6, 4, 2.8, 2, 1.4];

  function clutter() {
    var items = [], o;
    function add(svg, label) { items.push({ svg: svg, label: label }); }
    // facades and signs
    add('<rect x="380" y="40" width="150" height="230" fill="#55514b"/>' + (function () { var s = ''; for (var r = 0; r < 5; r++) for (var c = 0; c < 4; c++) s += '<rect x="' + (392 + c * 34) + '" y="' + (54 + r * 40) + '" width="20" height="24" fill="#2d2b28"/>'; return s; })(), 'building');
    add('<rect x="40" y="20" width="120" height="250" fill="#64605a"/>' + (function () { var s = ''; for (var r = 0; r < 6; r++) for (var c = 0; c < 3; c++) s += '<rect x="' + (54 + c * 36) + '" y="' + (34 + r * 38) + '" width="22" height="22" fill="#3a3733"/>'; return s; })(), 'building');
    add('<rect x="200" y="70" width="90" height="34" fill="#d9d3c9"/><rect x="210" y="80" width="54" height="5" fill="#2a2825"/><rect x="210" y="90" width="38" height="5" fill="#2a2825"/>', 'sign');
    add('<rect x="460" y="150" width="70" height="26" fill="#cfc8bd"/><rect x="468" y="158" width="44" height="4" fill="#2a2825"/><rect x="468" y="166" width="30" height="4" fill="#2a2825"/>', 'sign');
    add('<path d="M0 60 Q300 110 600 46" stroke="#1b1a18" stroke-width="1.5" fill="none"/><path d="M0 74 Q300 128 600 60" stroke="#1b1a18" stroke-width="1.2" fill="none"/>', 'wires');
    add('<rect x="330" y="30" width="6" height="270" fill="#1d1c1a"/><rect x="318" y="40" width="30" height="5" fill="#1d1c1a"/>', 'pole');
    add('<rect x="560" y="80" width="5" height="220" fill="#1d1c1a"/><rect x="548" y="100" width="22" height="50" rx="3" fill="#24221f"/><circle cx="559" cy="112" r="5" fill="#8a847a"/><circle cx="559" cy="126" r="5" fill="#8a847a"/><circle cx="559" cy="140" r="5" fill="#8a847a"/>', 'traffic light');
    add('<path d="M212 56 l6 -4 l6 4 M236 60 l5 -3 l5 3 M402 46 l6 -4 l6 4" stroke="#1b1a18" stroke-width="2" fill="none"/>', 'birds');
    add('<rect x="250" y="236" width="150" height="40" rx="12" fill="#3b3834"/><rect x="270" y="216" width="96" height="30" rx="10" fill="#4a4641"/><circle cx="282" cy="278" r="14" fill="#141312"/><circle cx="372" cy="278" r="14" fill="#141312"/>', 'car');
    add('<rect x="430" y="248" width="120" height="34" rx="10" fill="#45423d"/><rect x="448" y="230" width="74" height="26" rx="9" fill="#55514b"/><circle cx="458" cy="284" r="12" fill="#141312"/><circle cx="528" cy="284" r="12" fill="#141312"/>', 'car');
    add('<rect x="170" y="252" width="22" height="34" fill="#2c2a27"/><rect x="167" y="248" width="28" height="6" fill="#1d1c1a"/>', 'trash can');
    add('<rect x="10" y="262" width="70" height="8" fill="#2c2a27"/><rect x="14" y="270" width="4" height="16" fill="#2c2a27"/><rect x="72" y="270" width="4" height="16" fill="#2c2a27"/>', 'bench');
    [[300, 300, .8], [520, 296, .75], [255, 302, .7], [470, 305, .85], [95, 300, .7], [585, 302, .72]].forEach(function (p) {
      o = '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + p[2] + ')" fill="#262421"><circle cy="-62" r="8"/><path d="M-9 -52h18l4 34h-6l-2 18h-4l-2-18h-2l-2 18h-4l-2-18h-6z"/></g>';
      add(o, 'passer-by');
    });
    add('<rect x="208" y="140" width="64" height="44" fill="#a8a196"/><path d="M216 150h48M216 160h40M216 170h44" stroke="#3a3733" stroke-width="3"/>', 'poster');
    add('<path d="M130 300 l10 -40 l10 40z" fill="#c9442f" opacity=".8"/><rect x="128" y="298" width="24" height="4" fill="#c9442f"/>', 'traffic cone');
    add('<rect x="300" y="120" width="44" height="60" fill="#8e877c"/><rect x="306" y="126" width="32" height="48" fill="#6a645c"/>', 'shop window');
    return items;
  }

  U.demo('simplicity', function (host) {
    host.className = 'demo';
    var items = clutter();
    var html = items.map(function (it, i) { return '<g class="cl" data-i="' + i + '" style="transition:opacity .55s, transform .55s;transform-box:fill-box;transform-origin:center"><title>' + it.label + '</title>' + it.svg + '</g>'; }).join('');
    host.innerHTML =
      '<div class="screen"><svg class="stage" viewBox="0 0 600 400" role="application" aria-label="A busy street with one person holding a red umbrella">' +
        '<defs><filter id="simp-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur class="simp-sd" stdDeviation="0"/></filter>' +
        '<linearGradient id="simp-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a948a"/><stop offset="1" stop-color="#cdc6bb"/></linearGradient></defs>' +
        '<g class="simp-back" filter="url(#simp-blur)">' +
          '<rect width="600" height="300" fill="url(#simp-bg)"/>' +
          '<rect y="300" width="600" height="100" fill="#6f6a63"/>' +
          html +
        '</g>' +
        '<g class="simp-subject" transform="translate(200 318)">' +
          '<ellipse cx="2" cy="6" rx="22" ry="4" fill="#000" opacity=".25"/>' +
          '<path d="M0 -92 V-30" stroke="#111" stroke-width="2"/>' +
          '<circle cx="0" cy="-48" r="7" fill="#111"/>' +
          '<path d="M-8 -40h16l3 30h-5l-1 12 3 4h-6l-2-16h-2l-2 16h-6l3-4-1-12h-5z" fill="#111"/>' +
          '<path d="M-38 -60 Q-34 -92 0 -94 Q34 -92 38 -60 Q30 -66 19 -60 Q10 -67 0 -60 Q-10 -67 -19 -60 Q-30 -66 -38 -60Z" fill="#d6442f"/>' +
        '</g>' +
      '</svg>' +
      '<span class="tip">Slide to simplify, or click things to remove them</span>' +
      '<div class="hud"><span class="h-f"></span><span class="h-n hot"></span></div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var sd = host.querySelector('.simp-sd'), groups = host.querySelectorAll('.cl'), tip = host.querySelector('.tip');
    var hF = host.querySelector('.h-f'), hN = host.querySelector('.h-n'), readout = host.querySelector('.readout');
    var order = items.map(function (_, i) { return i; });
    // remove the busiest, nearest distractions first
    order.sort(function (a, b) { return ((a * 7) % 11) - ((b * 7) % 11); });
    var removedByClick = {}, val = 0;

    var controls = host.querySelector('.controls');
    var rng = U.range({ id: 'simp-amount', label: 'Simplify', min: 0, max: 100, value: 0, grow: true,
      format: function (v) { return v < 70 ? 'Remove distractions' : 'Open the aperture'; },
      scale: ['Cluttered', 'Fewer things', 'Limit focus'],
      onInput: function (v) { val = v; tip.classList.add('gone'); update(); } });
    controls.appendChild(rng);
    var reset = U.h('button', { type: 'button', class: 'btn ghost' }, 'Reset');
    reset.addEventListener('click', function () { removedByClick = {}; rng.input.value = 0; rng.update(); });
    controls.appendChild(reset);

    groups.forEach(function (g) {
      g.style.cursor = 'pointer';
      g.addEventListener('click', function () { removedByClick[g.getAttribute('data-i')] = true; tip.classList.add('gone'); update(); });
    });

    function update() {
      var cut = Math.round(U.clamp(val / 70, 0, 1) * items.length);
      var visible = 0;
      order.forEach(function (idx, rank) {
        var g = groups[idx];
        var gone = rank < cut || removedByClick[idx];
        g.style.opacity = gone ? 0 : 1;
        g.style.transform = gone ? 'scale(.92)' : '';
        g.style.pointerEvents = gone ? 'none' : '';
        if (!gone) visible++;
      });
      var b = U.clamp((val - 70) / 30, 0, 1);
      sd.setAttribute('stdDeviation', (b * 7).toFixed(2));
      var stop = STOPS[Math.round(b * (STOPS.length - 1))];
      hF.textContent = 'f/' + stop + (b > 0 ? ' · shallow focus' : ' · everything sharp');
      hN.textContent = (visible + 1) + (visible ? ' things in frame' : ' subject');
      var t;
      if (visible > items.length * .8) t = '<strong>Cluttered.</strong> ' + (visible + 1) + ' things compete for attention. Signs, wires, cars and people all pull the eye. Can you even find the subject?';
      else if (visible > 0) t = '<strong>Removing distractions.</strong> ' + visible + ' left. With every element gone, the red umbrella gets stronger.';
      else if (b === 0) t = '<strong>Every distraction is gone.</strong> Keep sliding to open the aperture and soften what is left of the background.';
      else if (b < .99) t = '<strong>Limiting focus at f/' + stop + '.</strong> A wider aperture makes the depth of field shallow, so the background softens and stops competing.';
      else t = '<strong>Simplicity.</strong> One subject, one soft background, nothing to distract. The viewer goes straight to what matters.';
      readout.innerHTML = '<span class="mono">Simplicity</span>' + t;
    }
    update();
    return {};
  });
})();
