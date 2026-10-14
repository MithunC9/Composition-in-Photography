/* Light and shadows: a colonnade and pedestrians under a sun you can move.
   Shadows are projected onto the ground; soft light blends several shadows (a penumbra). */
(function () {
  'use strict';
  var U = window.CIPU;
  function v3(x, y, z) { return { x: x, y: y, z: z }; }
  function sub(a, b) { return v3(a.x - b.x, a.y - b.y, a.z - b.z); }
  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function cross(a, b) { return v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x); }
  function norm(a) { var l = Math.hypot(a.x, a.y, a.z) || 1; return v3(a.x / l, a.y / l, a.z / l); }

  function hull(pts) {
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], hi = [];
    pts.forEach(function (p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
    pts.slice().reverse().forEach(function (p) { while (hi.length > 1 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); });
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }

  U.demo('light', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen"><canvas aria-label="A plaza with columns and people. Move the sun to change the shadows."></canvas>' +
      '<span class="tip">Drag across the picture to move the sun</span>' +
      '<div class="hud"><span class="h-sun"></span><span class="h-len hot"></span></div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var canvas = host.querySelector('canvas'), ctx = canvas.getContext('2d');
    var tip = host.querySelector('.tip'), hSun = host.querySelector('.h-sun'), hLen = host.querySelector('.h-len');
    var readout = host.querySelector('.readout');
    var acc = document.createElement('canvas'), accx = acc.getContext('2d');
    var tmp = document.createElement('canvas'), tmpx = tmp.getContext('2d');

    var st = { elev: 14, az: -55, soft: false };
    var boxes = [];
    for (var i = 0; i < 6; i++) boxes.push({ c: v3(-7.5 + i * 3, 0, 7), s: v3(.95, 5.2, .95), tone: 172 });
    boxes.push({ c: v3(0, 0, 8.4), s: v3(18, 6.4, .6), tone: 120 }); // building wall behind
    [[-4.2, 2.4], [-1.4, 1.2], [1.7, 3.1], [4.4, 1.8], [-6.3, 3.6], [6.6, 3.9]].forEach(function (p, k) {
      boxes.push({ c: v3(p[0], 0, p[1]), s: v3(.46, 1.75 - (k % 3) * .06, .3), tone: 54, person: true });
    });

    var controls = host.querySelector('.controls');
    var elevR = U.range({ id: 'light-elev', label: 'Sun height', min: 4, max: 85, value: st.elev, grow: true,
      format: function (v) { return v + '°'; }, scale: ['Low', 'Midday'],
      onInput: function (v) { st.elev = v; dirty = true; } });
    var azR = U.range({ id: 'light-az', label: 'Sun direction', min: -170, max: 170, value: st.az, grow: true,
      format: function (v) { var a = Math.abs(v); return a < 15 ? 'Front light' : a > 140 ? 'Backlight' : v < 0 ? 'Left side' : 'Right side'; },
      scale: ['Back', 'Left', 'Front', 'Right', 'Back'],
      onInput: function (v) { st.az = v; dirty = true; } });
    controls.appendChild(elevR);
    controls.appendChild(azR);
    controls.appendChild(U.seg([{ v: 'hard', label: 'Hard light' }, { v: 'soft', label: 'Soft light' }], 'hard', function (v) { st.soft = v === 'soft'; dirty = true; }, 'Light quality'));

    U.drag(canvas, {
      start: function () { tip.classList.add('gone'); },
      move: function (ev) {
        var r = canvas.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        st.az = Math.round(U.clamp((x - .5) * 340, -170, 170));
        st.elev = Math.round(U.clamp((1 - y) * 95, 4, 85));
        elevR.input.value = st.elev; elevR.update();
        azR.input.value = st.az; azR.update();
        dirty = true;
      }
    });

    var cam = v3(0, 7.5, -13), look = v3(0, 1.4, 4.5), fwd, right, up, f, W, H, cx, cy;
    function toCam(p) { var d = sub(p, cam); return v3(dot(d, right), dot(d, up), dot(d, fwd)); }
    function proj(p) { var c = toCam(p); return [cx + f * c.x / c.z, cy - f * c.y / c.z]; }

    function sunDir(elevDeg, azDeg) {
      var e = elevDeg * Math.PI / 180, a = azDeg * Math.PI / 180;
      // azimuth 0 = sun behind the camera (shadows fall away from us)
      return norm(v3(Math.sin(a) * Math.cos(e), Math.sin(e), -Math.cos(a) * Math.cos(e)));
    }
    function corners(b) {
      var hx = b.s.x / 2, hz = b.s.z / 2, o = [];
      [0, b.s.y].forEach(function (y) { [-hx, hx].forEach(function (x) { [-hz, hz].forEach(function (z) { o.push(v3(b.c.x + x, y, b.c.z + z)); }); }); });
      return o;
    }

    function drawShadows(L, alpha) {
      tmpx.setTransform(1, 0, 0, 1, 0, 0);
      tmpx.clearRect(0, 0, tmp.width, tmp.height);
      tmpx.setTransform(acc._dpr, 0, 0, acc._dpr, 0, 0);
      tmpx.fillStyle = '#000';
      boxes.forEach(function (b) {
        var pts = corners(b).map(function (P) {
          var t = P.y / L.y;
          return proj(v3(P.x - L.x * t, 0, P.z - L.z * t));
        });
        var hp = hull(pts);
        tmpx.beginPath();
        hp.forEach(function (p, i) { if (i) tmpx.lineTo(p[0], p[1]); else tmpx.moveTo(p[0], p[1]); });
        tmpx.closePath(); tmpx.fill();
      });
      accx.globalAlpha = alpha;
      accx.drawImage(tmp, 0, 0);
      accx.globalAlpha = 1;
    }

    function shade(tone, k) { var v = Math.round(tone * k); return 'rgb(' + v + ',' + Math.round(v * .97) + ',' + Math.round(v * .92) + ')'; }

    function draw() {
      var size = U.fitCanvas(canvas, 3 / 2);
      W = size.w; H = size.h; cx = W / 2; cy = H / 2;
      [acc, tmp].forEach(function (c) { c.width = canvas.width; c.height = canvas.height; });
      acc._dpr = size.dpr;
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      fwd = norm(sub(look, cam)); right = norm(cross(v3(0, 1, 0), fwd)); up = cross(fwd, right);
      f = (H / 2) / Math.tan(40 * Math.PI / 360);
      var L = sunDir(st.elev, st.az);
      var e = st.elev / 85;

      // sky and ground
      var hd = v3(dot(v3(0, 0, 1), right), dot(v3(0, 0, 1), up), dot(v3(0, 0, 1), fwd));
      var horizonY = cy - f * hd.y / hd.z;
      var sky = ctx.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, shade(70 + e * 60, 1)); sky.addColorStop(1, shade(170 + e * 40, 1));
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, Math.max(0, horizonY));
      var groundLit = .42 + .58 * Math.max(0, L.y);
      var gg = ctx.createLinearGradient(0, horizonY, 0, H);
      gg.addColorStop(0, shade(150, groundLit)); gg.addColorStop(1, shade(196, groundLit));
      ctx.fillStyle = gg; ctx.fillRect(0, horizonY, W, H - horizonY);
      // paving joints
      ctx.strokeStyle = 'rgba(0,0,0,.08)'; ctx.lineWidth = 1;
      for (var x = -14; x <= 14; x += 1.2) { var a = proj(v3(x, 0, -6)), b = proj(v3(x, 0, 8)); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      for (var z = -6; z <= 8; z += 1.2) { var c = proj(v3(-14, 0, z)), d = proj(v3(14, 0, z)); ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke(); }

      // shadows
      accx.setTransform(1, 0, 0, 1, 0, 0); accx.clearRect(0, 0, acc.width, acc.height);
      var n = st.soft ? 9 : 1;
      for (var k = 0; k < n; k++) {
        var j = st.soft ? (k - (n - 1) / 2) / ((n - 1) / 2) : 0;
        var Lj = st.soft ? sunDir(U.clamp(st.elev + j * 5, 2, 89), st.az + Math.sin(k * 2.4) * 9) : L;
        drawShadows(Lj, 1 / n);
      }
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = .62 * (.55 + .45 * Math.max(0, L.y) + .25);
      ctx.drawImage(acc, 0, 0); ctx.restore();

      // boxes, far to near
      var order = boxes.slice().sort(function (a, b) { return toCam(b.c).z - toCam(a.c).z; });
      order.forEach(function (b) {
        var hx = b.s.x / 2, hz = b.s.z / 2, y1 = b.s.y, X = b.c.x, Z = b.c.z;
        var faces = [
          { n: v3(0, 0, -1), p: [v3(X - hx, 0, Z - hz), v3(X + hx, 0, Z - hz), v3(X + hx, y1, Z - hz), v3(X - hx, y1, Z - hz)] },
          { n: v3(-1, 0, 0), p: [v3(X - hx, 0, Z + hz), v3(X - hx, 0, Z - hz), v3(X - hx, y1, Z - hz), v3(X - hx, y1, Z + hz)] },
          { n: v3(1, 0, 0), p: [v3(X + hx, 0, Z - hz), v3(X + hx, 0, Z + hz), v3(X + hx, y1, Z + hz), v3(X + hx, y1, Z - hz)] },
          { n: v3(0, 1, 0), p: [v3(X - hx, y1, Z - hz), v3(X + hx, y1, Z - hz), v3(X + hx, y1, Z + hz), v3(X - hx, y1, Z + hz)] }
        ];
        faces.forEach(function (fc) {
          var center = fc.p.reduce(function (s, p) { return v3(s.x + p.x / 4, s.y + p.y / 4, s.z + p.z / 4); }, v3(0, 0, 0));
          if (dot(fc.n, sub(cam, center)) <= 0) return;
          var lit = .3 + .7 * Math.max(0, dot(fc.n, L));
          ctx.fillStyle = shade(b.tone, lit);
          ctx.beginPath();
          fc.p.forEach(function (p, i) { var q = proj(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
          ctx.closePath(); ctx.fill();
        });
        if (b.person) {
          var hp = proj(v3(X, y1 + .13, Z)), hr = f * .12 / toCam(v3(X, y1, Z)).z;
          ctx.fillStyle = shade(b.tone, .3 + .7 * Math.max(0, L.y));
          ctx.beginPath(); ctx.arc(hp[0], hp[1], hr, 0, Math.PI * 2); ctx.fill();
        }
      });

      // the sun itself, if it is in view
      var sp = toCam(v3(cam.x + L.x * 100, cam.y + L.y * 100, cam.z + L.z * 100));
      if (sp.z > 0) {
        var spx = cx + f * sp.x / sp.z, spy = cy - f * sp.y / sp.z;
        if (spy > -40 && spy < horizonY && spx > -40 && spx < W + 40) {
          var glow = ctx.createRadialGradient(spx, spy, 2, spx, spy, 60);
          glow.addColorStop(0, 'rgba(255,250,240,.95)'); glow.addColorStop(.2, 'rgba(255,245,230,.5)'); glow.addColorStop(1, 'rgba(255,245,230,0)');
          ctx.fillStyle = glow; ctx.fillRect(spx - 60, spy - 60, 120, 120);
        }
      }

      var len = 1.75 / Math.tan(st.elev * Math.PI / 180);
      hSun.textContent = 'Sun ' + st.elev + '° above the horizon';
      hLen.textContent = '1.75 m person → ' + (len >= 10 ? len.toFixed(0) : len.toFixed(1)) + ' m shadow';
      var html;
      if (st.elev < 12) html = '<strong>Golden hour.</strong> Long shadows, like in Paul Strand’s Wall Street.';
      else if (st.elev < 35) html = '<strong>Morning or afternoon.</strong> Shadows are long enough to show depth.';
      else if (st.elev < 60) html = '<strong>High sun.</strong> Shadows shrink and the scene flattens out.';
      else html = '<strong>Midday.</strong> Shadows fall straight down. Harsh, flat light.';
      if (st.soft) html += ' Soft light, like a cloudy sky, blurs the shadow edges.';
      else html += ' Hard light, like direct sun, makes crisp shadow edges.';
      if (Math.abs(st.az) < 15) html += ' With the sun behind you, the front light flattens everything.';
      else if (Math.abs(st.az) > 140) html += ' With backlight the shadows run toward you and the columns turn into silhouettes.';
      if (readout._last !== html) { readout.innerHTML = '<span class="mono">Light</span>' + html; readout._last = html; }
    }

    var dirty = true;
    var loop = U.loop(function () { if (dirty) { dirty = false; draw(); } });
    window.addEventListener('resize', function () { dirty = true; });
    draw();
    return { enter: function () { dirty = true; loop.start(); }, leave: loop.stop };
  });
})();
