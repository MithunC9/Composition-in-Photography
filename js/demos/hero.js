/* Cover: Newman's Stravinsky as a print with a 3:2 viewfinder that follows the pointer. */
(function () {
  'use strict';
  var U = window.CIPU;
  var W = 823, H = 433;            // natural size of the print
  var CW = 430, CH = CW / 1.5;     // 3:2 crop
  var HEAD = { x: 60, y: 345 };    // Stravinsky's face in image pixels

  U.demo('hero', function (host) {
    var p = window.CIP.photo('stravinsky');
    host.innerHTML =
      '<div class="vf" role="img" aria-label="Arnold Newman, Igor Stravinsky, 1946. A viewfinder frame follows your pointer to show different crops.">' +
        '<img src="' + p.img.local + '" alt="" width="823" height="433">' +
        '<svg class="vf-shade" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
          '<path class="dim" fill-rule="evenodd" fill="rgba(10,9,8,.62)"/>' +
          '<g class="vf-lines"></g>' +
          '<rect class="vf-frame"/>' +
          '<path class="vf-corner"/>' +
        '</svg>' +
        '<span class="vf-readout">Move to reframe</span>' +
      '</div>' +
      '<p class="vf-caption mono"><span><i>Igor Stravinsky</i> · Arnold Newman, 1946</span><span>3:2 viewfinder</span></p>';

    var vf = host.querySelector('.vf');
    var dim = host.querySelector('.dim');
    var frame = host.querySelector('.vf-frame');
    var corner = host.querySelector('.vf-corner');
    var lines = host.querySelector('.vf-lines');
    var readout = host.querySelector('.vf-readout');
    var target = { x: W * .62, y: H * .42 }, pos = { x: target.x, y: target.y };
    var userActive = false, lastMove = 0;

    function draw() {
      var x = U.clamp(pos.x - CW / 2, 0, W - CW), y = U.clamp(pos.y - CH / 2, 0, H - CH);
      dim.setAttribute('d', 'M0 0H' + W + 'V' + H + 'H0Z M' + x + ' ' + y + 'h' + CW + 'v' + CH + 'h-' + CW + 'Z');
      frame.setAttribute('x', x); frame.setAttribute('y', y);
      frame.setAttribute('width', CW); frame.setAttribute('height', CH);
      var l = '';
      for (var i = 1; i < 3; i++) {
        l += '<line class="vf-grid" x1="' + (x + CW * i / 3) + '" y1="' + y + '" x2="' + (x + CW * i / 3) + '" y2="' + (y + CH) + '"/>';
        l += '<line class="vf-grid" x1="' + x + '" y1="' + (y + CH * i / 3) + '" x2="' + (x + CW) + '" y2="' + (y + CH * i / 3) + '"/>';
      }
      lines.innerHTML = l;
      var c = 22;
      corner.setAttribute('d',
        'M' + x + ' ' + (y + c) + 'V' + y + 'H' + (x + c) +
        'M' + (x + CW - c) + ' ' + y + 'H' + (x + CW) + 'V' + (y + c) +
        'M' + (x + CW) + ' ' + (y + CH - c) + 'V' + (y + CH) + 'H' + (x + CW - c) +
        'M' + (x + c) + ' ' + (y + CH) + 'H' + x + 'V' + (y + CH - c));
      // What does this crop do to the subject?
      var inside = HEAD.x > x && HEAD.x < x + CW && HEAD.y > y && HEAD.y < y + CH;
      var best = 1e9;
      for (var a = 1; a < 3; a++) for (var b = 1; b < 3; b++) {
        var d = Math.hypot(HEAD.x - (x + CW * a / 3), HEAD.y - (y + CH * b / 3));
        if (d < best) best = d;
      }
      readout.textContent = !inside ? 'Stravinsky cropped out · only the piano’s shape is left'
        : best < 40 ? 'Stravinsky on a power point'
        : 'Stravinsky in frame · try a power point';
    }

    function toImage(ev) {
      var r = vf.getBoundingClientRect();
      var pad = 8 * (r.width / (W + 16));
      return {
        x: (ev.clientX - r.left - pad) / (r.width - pad * 2) * W,
        y: (ev.clientY - r.top - pad) / (r.height - pad * 2) * H
      };
    }
    vf.addEventListener('pointermove', function (ev) { target = toImage(ev); userActive = true; lastMove = performance.now(); });
    vf.addEventListener('pointerdown', function (ev) { target = toImage(ev); userActive = true; lastMove = performance.now(); });

    var loop = U.loop(function (t) {
      if (!userActive || performance.now() - lastMove > 4000) {
        userActive = false;
        if (!U.reduced) {
          target.x = W * .5 + Math.sin(t * .23) * W * .26;
          target.y = H * .5 + Math.sin(t * .31 + 1) * H * .18;
        }
      }
      var k = userActive ? .22 : .04;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      draw();
    });
    draw();
    return { enter: loop.start, leave: loop.stop };
  });
})();
