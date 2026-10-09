/* Definition slide: one subject (a lone tree and the sun), four compositions. */
(function () {
  'use strict';
  var U = window.CIPU;

  var LAYOUTS = {
    center: { label: 'Centered', horizon: 200, tree: [300, 200, 1], sun: [300, 78, 1], grid: false,
      text: '<strong>Centered, horizon in the middle.</strong> Stable and formal, but the eye has nowhere to travel. The frame is cut exactly in half.' },
    thirds: { label: 'Thirds', horizon: 267, tree: [400, 267, 1.05], sun: [200, 133, 1], grid: true,
      text: '<strong>Rule of thirds.</strong> Tree on the right third, sun on the upper-left power point, horizon on the lower third. The eye moves between them.' },
    space: { label: 'Big sky', horizon: 340, tree: [120, 340, .55], sun: [470, 96, .8], grid: false,
      text: '<strong>Low horizon, lots of negative space.</strong> The sky takes over and the small tree feels solitary. The mood changes completely.' },
    close: { label: 'Fill the frame', horizon: 318, tree: [430, 318, 2.7], sun: [120, 70, .7], grid: false,
      text: '<strong>Move closer.</strong> The tree fills the frame and runs off the edges. Its shape and texture become the subject, not the landscape.' }
  };

  U.demo('compose', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen">' +
        '<svg class="stage" viewBox="0 0 600 375" role="img" aria-label="A lone tree and the sun, rearranged in four different compositions">' +
          '<defs><linearGradient id="cmp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f8a82"/><stop offset="1" stop-color="#d9d4cb"/></linearGradient></defs>' +
          '<rect width="600" height="375" fill="url(#cmp-sky)"/>' +
          '<circle class="c-sun" r="26" fill="#f6f2ea" style="transition:transform 1s cubic-bezier(.2,.7,.1,1)"/>' +
          '<rect class="c-ground" x="-20" y="0" width="640" height="420" fill="#2a2825" style="transition:transform 1s cubic-bezier(.2,.7,.1,1)"/>' +
          '<g class="c-tree" style="transition:transform 1s cubic-bezier(.2,.7,.1,1)">' +
            '<path d="M-7 0 L-3 -50 L3 -50 L7 0 Z" fill="#121110"/><path d="M-2 -46 Q-14 -58 -26 -62 M2 -46 Q12 -56 24 -60 M0 -48 Q0 -62 0 -74" stroke="#121110" stroke-width="4" fill="none" stroke-linecap="round"/>' +
            '<path d="M-48 -62 C-62 -86 -40 -112 -18 -106 C-14 -132 20 -134 28 -110 C52 -116 64 -88 48 -68 C58 -48 30 -38 14 -50 C2 -38 -24 -40 -30 -52 C-44 -46 -58 -52 -48 -62Z" fill="#121110"/>' +
          '</g>' +
          '<g class="c-grid" stroke="#fff" stroke-opacity=".6" stroke-width="1" style="transition:opacity .6s"><line x1="200" y1="0" x2="200" y2="375"/><line x1="400" y1="0" x2="400" y2="375"/><line x1="0" y1="125" x2="600" y2="125"/><line x1="0" y1="250" x2="600" y2="250"/></g>' +
        '</svg>' +
      '</div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var sun = host.querySelector('.c-sun'), ground = host.querySelector('.c-ground'), tree = host.querySelector('.c-tree');
    var grid = host.querySelector('.c-grid'), readout = host.querySelector('.readout');

    function apply(k) {
      var L = LAYOUTS[k];
      // the thirds grid of a 600x375 frame sits at y = 125 / 250
      sun.style.transform = 'translate(' + L.sun[0] + 'px,' + L.sun[1] + 'px) scale(' + L.sun[2] + ')';
      ground.style.transform = 'translate(0px,' + L.horizon + 'px)';
      tree.style.transform = 'translate(' + L.tree[0] + 'px,' + L.tree[1] + 'px) scale(' + L.tree[2] + ')';
      grid.style.opacity = L.grid ? 1 : 0;
      readout.innerHTML = '<span class="mono">Same subject</span>' + L.text;
    }
    // thirds layout uses the true thirds of a 375-high frame
    LAYOUTS.thirds.horizon = 250; LAYOUTS.thirds.tree[1] = 250; LAYOUTS.thirds.sun = [200, 125, 1];

    var keys = Object.keys(LAYOUTS);
    var seg = U.seg(keys.map(function (k) { return { v: k, label: LAYOUTS[k].label }; }), 'center', function (v) { cur = keys.indexOf(v); apply(v); stopAuto(); }, 'Composition');
    host.querySelector('.controls').appendChild(seg);
    var cur = 0;
    apply('center');

    // Gentle autoplay through the four layouts until the viewer picks one.
    var timer = null, auto = true;
    function stopAuto() { auto = false; clearInterval(timer); }
    return {
      enter: function () {
        if (!auto || U.reduced) return;
        clearInterval(timer);
        timer = setInterval(function () { cur = (cur + 1) % keys.length; seg.set(keys[cur]); apply(keys[cur]); }, 3400);
      },
      leave: function () { clearInterval(timer); }
    };
  });
})();
