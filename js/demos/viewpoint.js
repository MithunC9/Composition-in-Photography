/* Framing and viewpoint: a small 3D scene with a child, a wall and trees.
   Raise or lower the camera and optionally shoot through a doorway. */
(function () {
  'use strict';
  var U = window.CIPU;

  function v3(x, y, z) { return { x: x, y: y, z: z }; }
  function sub(a, b) { return v3(a.x - b.x, a.y - b.y, a.z - b.z); }
  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function cross(a, b) { return v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x); }
  function norm(a) { var l = Math.hypot(a.x, a.y, a.z) || 1; return v3(a.x / l, a.y / l, a.z / l); }

  U.demo('viewpoint', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen"><canvas aria-label="A child photographed from a camera whose height you control"></canvas>' +
      '<span class="tip">Drag up and down on the picture, or use the slider</span>' +
      '<div class="hud"><span class="h-cam"></span><span class="h-view hot"></span></div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var canvas = host.querySelector('canvas'), ctx = canvas.getContext('2d');
    var readout = host.querySelector('.readout'), hCam = host.querySelector('.h-cam'), hView = host.querySelector('.h-view');
    var tip = host.querySelector('.tip');

    var st = { h: 1.7, target: 1.7, door: false, doorAmt: 0 };
    var D = 4.2, FOV = 48 * Math.PI / 180;
    var trees = [];
    (function () {
      var r = 7;
      function rnd() { r = (r * 16807) % 2147483647; return r / 2147483647; }
      for (var i = 0; i < 16; i++) trees.push({ x: -16 + rnd() * 32, z: 9 + rnd() * 16, h: 3.5 + rnd() * 4, r: 1 + rnd() * 1.3 });
      trees.sort(function (a, b) { return b.z - a.z; });
    })();

    var controls = host.querySelector('.controls');
    var slider = U.range({
      id: 'vp-height', label: 'Camera height', min: 15, max: 520, value: 170, grow: true,
      format: function (v) { return (v / 100).toFixed(2) + ' m'; },
      scale: ['Worm’s-eye', 'Child', 'Adult', 'Bird’s-eye'],
      onInput: function (v) { st.target = v / 100; tip.classList.add('gone'); }
    });
    controls.appendChild(slider);
    controls.appendChild(U.seg([{ v: 'open', label: 'Open view' }, { v: 'door', label: 'Through a doorway' }], 'open', function (v) { st.door = v === 'door'; }, 'Framing'));

    U.drag(canvas, {
      start: function (ev) { tip.classList.add('gone'); canvas._y0 = ev.clientY; canvas._h0 = st.target; },
      move: function (ev) {
        var dh = (canvas._y0 - ev.clientY) / canvas.clientHeight * 5.5;
        st.target = U.clamp(canvas._h0 + dh, .15, 5.2);
        slider.input.value = Math.round(st.target * 100);
        slider.update();
      }
    });

    var cam, right, up, fwd, f, cx, cy, W, H;
    function setCam() {
      cam = v3(0, st.h, -D);
      var look = v3(0, .62, 0);
      fwd = norm(sub(look, cam));
      right = norm(cross(v3(0, 1, 0), fwd));
      up = cross(fwd, right);
    }
    function toCam(p) { var d = sub(p, cam); return v3(dot(d, right), dot(d, up), dot(d, fwd)); }
    function proj(c) { return [cx + f * c.x / c.z, cy - f * c.y / c.z]; }
    var NEAR = .06;
    function clipSeg(a, b) {
      var ca = toCam(a), cb = toCam(b);
      if (ca.z < NEAR && cb.z < NEAR) return null;
      if (ca.z < NEAR) { var t = (NEAR - ca.z) / (cb.z - ca.z); ca = v3(ca.x + (cb.x - ca.x) * t, ca.y + (cb.y - ca.y) * t, NEAR); }
      if (cb.z < NEAR) { var t2 = (NEAR - cb.z) / (ca.z - cb.z); cb = v3(cb.x + (ca.x - cb.x) * t2, cb.y + (ca.y - cb.y) * t2, NEAR); }
      return [proj(ca), proj(cb), Math.min(ca.z, cb.z)];
    }
    function clipPoly(pts) {
      var c = pts.map(toCam), out = [];
      for (var i = 0; i < c.length; i++) {
        var a = c[i], b = c[(i + 1) % c.length];
        var ain = a.z >= NEAR, bin = b.z >= NEAR;
        if (ain) out.push(a);
        if (ain !== bin) {
          var t = (NEAR - a.z) / (b.z - a.z);
          out.push(v3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, NEAR));
        }
      }
      return out.map(proj);
    }
    function fillPoly(list, style) {
      if (!list || list.length < 3) return;
      ctx.beginPath();
      list.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.closePath();
      ctx.fillStyle = style; ctx.fill();
    }

    function viewText(hh) {
      if (hh < .6) return ['Worm’s-eye view', 'From below, the child towers over the camera and looks <strong>powerful and dominant</strong>.'];
      if (hh < 1.25) return ['Child’s eye level', 'At the child’s own height the camera treats them <strong>as an equal</strong>.'];
      if (hh < 2.3) return ['Adult eye level', 'Looking down from an adult’s height, the child seems <strong>smaller, diminished in stature</strong>.'];
      return ['Bird’s-eye view', 'High above, the child becomes <strong>a small shape on the ground</strong> and the setting takes over.'];
    }

    function draw() {
      var size = U.fitCanvas(canvas, 3 / 2);
      W = size.w; H = size.h;
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      cx = W / 2; cy = H / 2;
      f = (H / 2) / Math.tan(FOV / 2);
      setCam();

      // horizon: where a level direction projects
      var hd = v3(dot(v3(0, 0, 1), right), dot(v3(0, 0, 1), up), dot(v3(0, 0, 1), fwd));
      var horizonY = hd.z > .01 ? cy - f * hd.y / hd.z : (fwd.y < 0 ? -1e4 : 1e4);
      var sky = ctx.createLinearGradient(0, Math.min(horizonY, H) - H * .9, 0, Math.min(horizonY, H));
      sky.addColorStop(0, '#4a4743'); sky.addColorStop(1, '#bdb6aa');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      var g = ctx.createLinearGradient(0, Math.max(horizonY, 0), 0, H);
      g.addColorStop(0, '#77716a'); g.addColorStop(1, '#2d2b28');
      ctx.fillStyle = g; ctx.fillRect(0, Math.max(0, horizonY), W, H);

      // ground grid
      ctx.lineWidth = 1;
      for (var x = -20; x <= 20; x += 1.5) {
        var s1 = clipSeg(v3(x, 0, -D + .2), v3(x, 0, 60));
        if (s1) { ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.moveTo(s1[0][0], s1[0][1]); ctx.lineTo(s1[1][0], s1[1][1]); ctx.stroke(); }
      }
      for (var z = -D + .5; z < 60; z += 1.5) {
        var s2 = clipSeg(v3(-20, 0, z), v3(20, 0, z));
        if (s2) { ctx.strokeStyle = 'rgba(255,255,255,' + (0.09 * Math.max(0, 1 - z / 50)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(s2[0][0], s2[0][1]); ctx.lineTo(s2[1][0], s2[1][1]); ctx.stroke(); }
      }

      // trees (far to near)
      trees.forEach(function (t) {
        var base = toCam(v3(t.x, 0, t.z)), top = toCam(v3(t.x, t.h, t.z)), crown = toCam(v3(t.x, t.h - t.r * .6, t.z));
        if (base.z < NEAR || top.z < NEAR) return;
        var pb = proj(base), pt = proj(top), pc = proj(crown), r = f * t.r / crown.z;
        var fade = U.clamp(1 - (t.z - 9) / 22, .35, 1);
        ctx.strokeStyle = 'rgba(28,27,25,' + fade + ')'; ctx.lineWidth = Math.max(1, f * .14 / base.z);
        ctx.beginPath(); ctx.moveTo(pb[0], pb[1]); ctx.lineTo(pt[0], pt[1]); ctx.stroke();
        ctx.fillStyle = 'rgba(38,37,34,' + (fade * .95) + ')';
        ctx.beginPath(); ctx.ellipse(pc[0], pc[1], r, r * 1.05 * Math.abs(pt[1] - pb[1]) / Math.max(1, f * t.h / base.z) + r * .1, 0, 0, Math.PI * 2); ctx.fill();
      });

      // wall behind the child: front face, top face
      var wz = 3, wh = 1.35, wt = .3;
      fillPoly(clipPoly([v3(-7, wh, wz), v3(7, wh, wz), v3(7, wh, wz + wt), v3(-7, wh, wz + wt)]), '#cfc8bd');
      fillPoly(clipPoly([v3(-7, 0, wz), v3(7, 0, wz), v3(7, wh, wz), v3(-7, wh, wz)]), '#a49d92');
      ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1;
      for (var bx = -7; bx <= 7; bx += .7) {
        var sb = clipSeg(v3(bx, 0, wz), v3(bx, wh, wz));
        if (sb) { ctx.beginPath(); ctx.moveTo(sb[0][0], sb[0][1]); ctx.lineTo(sb[1][0], sb[1][1]); ctx.stroke(); }
      }

      // child's shadow
      var sh = [];
      for (var a = 0; a < 18; a++) { var ang = a / 18 * Math.PI * 2; sh.push(v3(Math.cos(ang) * .32 + .12, 0, Math.sin(ang) * .22 + .1)); }
      fillPoly(clipPoly(sh), 'rgba(0,0,0,.35)');

      // child (billboard with projected joints)
      var J = {
        feet: toCam(v3(0, 0, 0)), knee: toCam(v3(0, .28, 0)), hip: toCam(v3(0, .5, 0)),
        sh: toCam(v3(0, .84, 0)), head: toCam(v3(0, .99, 0))
      };
      if (J.feet.z > NEAR && J.head.z > NEAR) {
        var P = {}; Object.keys(J).forEach(function (k) { P[k] = proj(J[k]); });
        var wpx = function (m, c) { return f * m / c.z; };
        ctx.fillStyle = '#121110'; ctx.strokeStyle = '#121110'; ctx.lineCap = 'round';
        // legs
        ctx.lineWidth = wpx(.09, J.hip);
        [-1, 1].forEach(function (s) {
          ctx.beginPath();
          ctx.moveTo(P.hip[0] + s * wpx(.06, J.hip), P.hip[1]);
          ctx.lineTo(P.feet[0] + s * wpx(.09, J.feet), P.feet[1]);
          ctx.stroke();
        });
        // torso (a coat)
        var tw = wpx(.17, J.sh), bw = wpx(.21, J.hip);
        ctx.beginPath();
        ctx.moveTo(P.sh[0] - tw, P.sh[1]); ctx.lineTo(P.sh[0] + tw, P.sh[1]);
        ctx.lineTo(P.hip[0] + bw, P.hip[1] + (P.feet[1] - P.hip[1]) * .18); ctx.lineTo(P.hip[0] - bw, P.hip[1] + (P.feet[1] - P.hip[1]) * .18);
        ctx.closePath(); ctx.fill();
        // arms
        ctx.lineWidth = wpx(.065, J.sh);
        [-1, 1].forEach(function (s) {
          ctx.beginPath(); ctx.moveTo(P.sh[0] + s * tw * .9, P.sh[1] + 2);
          ctx.lineTo(P.hip[0] + s * bw * 1.25, P.hip[1] + (P.feet[1] - P.hip[1]) * .05); ctx.stroke();
        });
        // head
        var hr = wpx(.115, J.head);
        ctx.beginPath(); ctx.arc(P.head[0], P.head[1] - Math.max(0, (P.sh[1] - P.head[1]) * .1), hr, 0, Math.PI * 2); ctx.fill();
        // a red balloon string makes the subject easy to find
        var bal = toCam(v3(.28, 1.55, 0)), hand = toCam(v3(.24, .5, 0));
        if (bal.z > NEAR) {
          var pb2 = proj(bal), ph = proj(hand);
          ctx.strokeStyle = 'rgba(20,19,17,.7)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(ph[0], ph[1]); ctx.quadraticCurveTo(pb2[0] + 6, (pb2[1] + ph[1]) / 2, pb2[0], pb2[1]); ctx.stroke();
          ctx.fillStyle = '#d6442f';
          var br = wpx(.13, bal);
          ctx.beginPath(); ctx.ellipse(pb2[0], pb2[1] - br, br * .86, br, 0, 0, Math.PI * 2); ctx.fill();
        }
      }

      // doorway frame in the foreground
      if (st.doorAmt > .01) {
        var dz = -D + 2.1, ow = .62, oh = 2.05;
        var outer = clipPoly([v3(-8, -1, dz), v3(8, -1, dz), v3(8, 6, dz), v3(-8, 6, dz)]);
        var inner = clipPoly([v3(-ow, 0, dz), v3(ow, 0, dz), v3(ow, oh, dz), v3(-ow, oh, dz)]);
        if (outer.length > 2) {
          ctx.save();
          ctx.globalAlpha = st.doorAmt;
          ctx.beginPath();
          outer.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
          ctx.closePath();
          if (inner.length > 2) {
            inner.slice().reverse().forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
            ctx.closePath();
          }
          ctx.fillStyle = '#141311'; ctx.fill('evenodd');
          // door jamb edge highlight
          if (inner.length > 2) {
            ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2;
            ctx.beginPath(); inner.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.stroke();
          }
          ctx.restore();
        }
      }

      // vignette
      var vg = ctx.createRadialGradient(cx, cy, H * .3, cx, cy, H * .95);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.35)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

      var tilt = Math.asin(U.clamp(fwd.y, -1, 1)) * 180 / Math.PI;
      hCam.textContent = 'Camera ' + st.h.toFixed(2) + ' m · tilt ' + (tilt > 0 ? '+' : '') + tilt.toFixed(0) + '°';
      var vt = viewText(st.h);
      hView.textContent = vt[0];
      var html = '<span class="mono">Viewpoint</span>' + vt[1];
      if (st.door) html += ' The <strong>doorway frames the child</strong> and adds a dark foreground layer, so the picture gains depth.';
      if (readout._last !== html) { readout.innerHTML = html; readout._last = html; }
    }

    var dirty = true;
    var loop = U.loop(function () {
      var dh = st.target - st.h, dd = (st.door ? 1 : 0) - st.doorAmt;
      if (Math.abs(dh) > .001 || Math.abs(dd) > .002 || dirty) {
        st.h += dh * .18; st.doorAmt += dd * .14; dirty = false;
        draw();
      }
    });
    window.addEventListener('resize', function () { dirty = true; });
    draw();
    return { enter: function () { dirty = true; loop.start(); }, leave: loop.stop };
  });
})();
