/* Positive and negative space: Rubin's vase (figure and ground) and a "room to breathe"
   frame where the subject's size and direction change how much negative space it has. */
(function () {
  'use strict';
  var U = window.CIPU;

  // Right edge of the left face, as (y, x) pairs inside a 600 x 400 frame.
  var PROFILE = [[30, 214], [60, 226], [96, 236], [120, 244], [138, 236], [150, 238], [170, 260], [188, 276], [198, 270], [206, 258], [214, 262], [222, 270], [232, 262], [242, 266], [252, 272], [262, 262], [276, 252], [296, 262], [312, 252], [330, 238], [352, 232], [372, 236], [380, 232]];

  function facePath(mirror) {
    var pts = PROFILE.map(function (p) { return [mirror ? 600 - p[1] : p[1], p[0]]; });
    var edge = mirror ? 600 : 0;
    var d = 'M' + edge + ' 30 L' + pts[0][0] + ' 30';
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ' Q' + pts[i][0] + ' ' + pts[i][1] + ' ' + mx + ' ' + my;
    }
    d += ' L' + pts[pts.length - 1][0] + ' 380 L' + edge + ' 380 Z';
    return d;
  }

  U.demo('space', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen">' +
        '<svg class="stage sp-rubin" viewBox="0 0 600 400" role="img" aria-label="Rubin’s vase: two faces in profile, or a vase between them">' +
          '<rect class="sp-ground" width="600" height="400" style="transition:fill .7s"/>' +
          '<path class="sp-face" d="' + facePath(false) + '" style="transition:fill .7s"/>' +
          '<path class="sp-face" d="' + facePath(true) + '" style="transition:fill .7s"/>' +
          '<rect x="0" y="0" width="600" height="30" class="sp-edge" style="transition:fill .7s"/><rect x="0" y="380" width="600" height="20" class="sp-edge" style="transition:fill .7s"/>' +
          '<g font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing="2" class="sp-labels" style="transition:fill .7s">' +
            '<text x="300" y="20" text-anchor="middle" class="sp-l1">POSITIVE: THE VASE</text>' +
            '<text x="300" y="395" text-anchor="middle" class="sp-l2">NEGATIVE: THE FACES</text>' +
          '</g>' +
        '</svg>' +
        '<svg class="stage sp-room" viewBox="0 0 600 400" role="img" aria-label="A lone figure in a wide landscape" hidden>' +
          '<defs><linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d877f"/><stop offset="1" stop-color="#dcd6cc"/></linearGradient></defs>' +
          '<rect width="600" height="400" fill="url(#sp-sky)"/>' +
          '<rect y="300" width="600" height="100" fill="#d2cbc0"/>' +
          '<path d="M0 300H600" stroke="#9b958c"/>' +
          '<g class="sp-fig" fill="#111"><circle cx="5" cy="-91" r="9"/><path d="M-7 -80 Q5 -84 11 -77 L16 -50 Q15 -45 11 -47 L9 -62 L8 -42 L19 -3 Q18 2 12 1 L1 -32 L-10 0 Q-15 2 -17 -2 L-7 -42 L-8 -62 L-15 -49 Q-19 -49 -17 -54 Z"/></g>' +
          '<path class="sp-arrow" fill="none" stroke="#d6442f" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 7"/>' +
        '</svg>' +
        '<div class="hud"><span class="h-a"></span><span class="h-b hot"></span></div>' +
      '</div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var rubin = host.querySelector('.sp-rubin'), room = host.querySelector('.sp-room');
    var ground = host.querySelector('.sp-ground'), faces = host.querySelectorAll('.sp-face'), edges = host.querySelectorAll('.sp-edge');
    var l1 = host.querySelector('.sp-l1'), l2 = host.querySelector('.sp-l2'), labels = host.querySelector('.sp-labels');
    var fig = host.querySelector('.sp-fig'), arrow = host.querySelector('.sp-arrow');
    var hA = host.querySelector('.h-a'), hB = host.querySelector('.h-b'), readout = host.querySelector('.readout');
    var st = { view: 'rubin', flip: false, size: 22, facing: 'in' };

    var controls = host.querySelector('.controls');
    controls.appendChild(U.seg([{ v: 'rubin', label: 'Figure / ground' }, { v: 'room', label: 'Room to breathe' }], 'rubin', function (v) { st.view = v; update(); }, 'Experiment'));
    var flipB = U.h('button', { type: 'button', class: 'btn ghost' }, 'Flip figure and ground');
    flipB.addEventListener('click', function () { st.flip = !st.flip; update(); });
    controls.appendChild(flipB);
    var sizeR = U.range({ id: 'space-size', label: 'Subject size', min: 6, max: 92, value: st.size, grow: true,
      format: function (v) { return v + '% of frame height'; }, onInput: function (v) { st.size = v; update(); } });
    controls.appendChild(sizeR);
    var face = U.seg([{ v: 'in', label: 'Facing into space' }, { v: 'out', label: 'Facing out' }], 'in', function (v) { st.facing = v; update(); }, 'Direction');
    controls.appendChild(face);
    rubin.addEventListener('click', function () { st.flip = !st.flip; update(); });
    rubin.style.cursor = 'pointer';

    function update() {
      var isR = st.view === 'rubin';
      rubin.toggleAttribute('hidden', !isR); room.toggleAttribute('hidden', isR);
      screen.classList.toggle('no-hud', isR);
      flipB.hidden = !isR; sizeR.hidden = isR; face.hidden = isR;
      if (isR) {
        var dark = '#121110', light = '#ebe5db';
        ground.setAttribute('fill', st.flip ? dark : light);
        faces.forEach(function (f) { f.setAttribute('fill', st.flip ? light : dark); });
        edges.forEach(function (e) { e.setAttribute('fill', st.flip ? dark : light); });
        labels.setAttribute('fill', st.flip ? light : dark);
        l1.textContent = st.flip ? 'POSITIVE: THE FACES' : 'POSITIVE: THE VASE';
        l2.textContent = st.flip ? 'NEGATIVE: THE VASE' : 'NEGATIVE: THE FACES';
        hA.textContent = 'Rubin’s vase, 1915';
        hB.textContent = st.flip ? 'Faces read as figure' : 'Vase reads as figure';
        readout.innerHTML = '<span class="mono">Space</span><strong>A vase, or two faces?</strong> The same edge belongs to both. Whatever you read as the subject becomes positive space and the rest falls back as negative space. Click to flip.';
      } else {
        var hgt = 400 * st.size / 100, s = hgt / 100;
        var x = st.facing === 'in' ? 200 : 420;
        var flip = st.facing === 'in' ? 1 : -1;
        var baseY = 300 + Math.min(80, hgt * .25);
        fig.setAttribute('transform', 'translate(' + x + ' ' + baseY + ') scale(' + (s * flip) + ' ' + s + ')');
        var dir = st.facing === 'in' ? 1 : -1;
        var ax = x + dir * 30 * Math.max(1, s), ay = baseY - 70 * s;
        arrow.setAttribute('d', 'M' + ax + ' ' + ay + 'h' + (dir * 120));
        var area = (hgt * .42 * hgt * .38) / (600 * 400);
        var neg = Math.max(0, 100 - area * 100);
        hA.textContent = 'Positive ' + (100 - neg).toFixed(neg > 99 ? 1 : 0) + '%';
        hB.textContent = 'Negative ' + neg.toFixed(neg > 99 ? 1 : 0) + '%';
        var txt;
        if (st.size < 18) txt = '<strong>A small subject in a big empty frame</strong> feels alone and vulnerable. The negative space is the message, as in Tank Man or Pale Blue Dot.';
        else if (st.size < 55) txt = '<strong>Balanced.</strong> The subject is clear, and the space around it gives it room to breathe and shows its scale.';
        else txt = '<strong>The subject fills the frame.</strong> Negative space nearly disappears, so the picture becomes about the figure’s shape and detail.';
        txt += st.facing === 'in' ? ' Facing into the open space, the figure has somewhere to go. That is the rule of space.' : ' Facing out of the frame, the figure seems about to leave, which creates tension.';
        readout.innerHTML = '<span class="mono">Space</span>' + txt;
      }
    }
    update();
    return {};
  });
})();
