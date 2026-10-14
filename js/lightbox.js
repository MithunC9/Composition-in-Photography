/* Lightbox: one photograph large, with its story, facts and composition overlays. */
(function () {
  'use strict';
  var C = window.CIP, U = window.CIPU, esc = U.esc;
  var lb = document.getElementById('lightbox');
  var media = document.getElementById('lb-media');
  var list = [], idx = 0, lastFocus = null, grid = 'none';

  function elOf(k) { return C.ELEMENTS.filter(function (e) { return e.key === k; })[0]; }

  function render() {
    var p = C.photo(list[idx]);
    var e = elOf(p.el);
    media.innerHTML = '';
    media.appendChild(C.print(p, { eager: true }));
    lb.setAttribute('data-grid', grid);
    document.getElementById('lb-kicker').textContent = 'Element ' + (e.num < 10 ? '0' : '') + e.num + ' · ' + e.name;
    document.getElementById('lb-title').textContent = p.title;
    document.getElementById('lb-by').textContent = p.by + (p.org ? ', ' + p.org : '') + ' · ' + p.year;
    var facts = [['Date', p.date], ['Place', p.place], ['Camera', p.camera]];
    document.getElementById('lb-facts').innerHTML = facts.filter(function (f) { return f[1]; }).map(function (f) {
      return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>';
    }).join('');
    var tags = [p.el].concat(p.tags || []).map(function (k) {
      var t = elOf(k);
      return '<button type="button" class="chip" data-lb-go="' + k + '">' + (t.num < 10 ? '0' : '') + t.num + ' ' + esc(t.short) + '</button>';
    }).join('');
    document.getElementById('lb-text').innerHTML =
      '<h3>The story</h3><p>' + esc(p.story) + '</p>' +
      '<h3>' + (p.note ? esc(p.note) : 'How it uses ' + esc(e.name.toLowerCase())) + '</h3><p class="lb-note">' + esc(p.look) + '</p>' +
      (p.extra ? '<p>' + esc(p.extra) + '</p>' : '') +
      '<h3>Elements at work</h3><div class="lb-links">' + tags + '</div>' +
      '<div class="lb-links"><a class="chip" href="' + p.link + '" target="_blank" rel="noopener">Read more ↗</a></div>';
    document.getElementById('lb-prev').disabled = list.length < 2;
    document.getElementById('lb-next').disabled = list.length < 2;
  }

  C.openLightbox = function (id, ids) {
    list = ids && ids.length ? ids : [id];
    idx = Math.max(0, list.indexOf(id));
    lastFocus = document.activeElement;
    render();
    lb.hidden = false;
    document.getElementById('lb-close').focus({ preventScroll: true });
  };
  function close() {
    lb.hidden = true;
    media.innerHTML = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function step(d) { idx = (idx + d + list.length) % list.length; render(); }

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', function () { step(-1); });
  document.getElementById('lb-next').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-stage')) close();
    var go = e.target.closest('[data-lb-go]');
    if (go) { close(); C.go(go.getAttribute('data-lb-go')); }
  });
  document.getElementById('lb-grid').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-grid]');
    if (!b) return;
    grid = b.getAttribute('data-grid');
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    lb.setAttribute('data-grid', grid);
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'Tab') {
      // keep focus inside the dialog
      var f = lb.querySelectorAll('button:not([disabled]), a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
