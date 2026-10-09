/* Finds a URL for each photograph and renders "prints" (an <img> on a paper mount).
   Order of attempts: local copy in this repo -> exact Wikimedia Commons file ->
   lead image of the photograph's Wikipedia article -> Commons search.
   Anything that fails falls through to the next source, and finally to a labelled
   placeholder, so a missing picture never breaks a slide. */
(function () {
  'use strict';
  var PHOTOS = window.CIP.PHOTOS;
  var LOCAL = window.CIP_LOCAL_PHOTOS || {};
  var WIDTH = 1280; // a standard Wikimedia thumbnail step
  var byId = {};
  PHOTOS.forEach(function (p) { byId[p.id] = p; });

  function commonsFile(name) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/' +
      encodeURIComponent(name.replace(/ /g, '_')) + '?width=' + WIDTH;
  }

  // One batched request for every Wikipedia article lead image.
  var wikiPromise = null;
  function wikiImages() {
    if (wikiPromise) return wikiPromise;
    var titles = PHOTOS.filter(function (p) { return p.img.wiki; })
      .map(function (p) { return p.img.wiki.replace(/_/g, ' '); });
    var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*' +
      '&redirects=1&prop=pageimages&piprop=thumbnail%7Coriginal&pilicense=any&pithumbsize=' + WIDTH +
      '&titles=' + encodeURIComponent(titles.join('|'));
    wikiPromise = fetchJSON(url).then(function (j) {
      var q = (j && j.query) || {};
      var hop = {};
      (q.normalized || []).forEach(function (n) { hop[n.from] = n.to; });
      (q.redirects || []).forEach(function (r) { hop[r.from] = r.to; });
      var images = {};
      (q.pages || []).forEach(function (pg) {
        var src = (pg.thumbnail && pg.thumbnail.source) || (pg.original && pg.original.source);
        if (src) images[pg.title] = src;
      });
      var out = {};
      titles.forEach(function (t) {
        var final = t, guard = 0;
        while (hop[final] && guard++ < 4) final = hop[final];
        if (images[final]) out[t] = images[final];
      });
      return out;
    }).catch(function () { return {}; });
    return wikiPromise;
  }

  var searchCache = {};
  function commonsSearch(query) {
    if (searchCache[query]) return searchCache[query];
    var url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*' +
      '&generator=search&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=' + WIDTH +
      '&gsrsearch=' + encodeURIComponent(query);
    searchCache[query] = fetchJSON(url).then(function (j) {
      var pages = (j && j.query && j.query.pages) || [];
      var info = pages[0] && pages[0].imageinfo && pages[0].imageinfo[0];
      return info ? (info.thumburl || info.url) : null;
    }).catch(function () { return null; });
    return searchCache[query];
  }

  function fetchJSON(url) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 9000) : null;
    return fetch(url, ctrl ? { signal: ctrl.signal } : undefined).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  // A list of functions, each resolving to a URL or null.
  function sources(p) {
    var list = [];
    if (LOCAL[p.id]) list.push(function () { return Promise.resolve(LOCAL[p.id]); });
    if (p.img.local) list.push(function () { return Promise.resolve(p.img.local); });
    if (p.img.file) list.push(function () { return Promise.resolve(commonsFile(p.img.file)); });
    if (p.img.wiki) list.push(function () {
      return wikiImages().then(function (m) { return m[p.img.wiki.replace(/_/g, ' ')] || null; });
    });
    if (p.img.search) list.push(function () { return commonsSearch(p.img.search); });
    return list;
  }

  var resolved = {}; // id -> working URL, so later prints of the same photo load instantly

  function tryLoad(url) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error('img')); };
      im.src = url;
    });
  }

  function findURL(p) {
    if (resolved[p.id]) return Promise.resolve(resolved[p.id]);
    var list = sources(p), i = 0;
    function next() {
      if (i >= list.length) return Promise.reject(new Error('none'));
      var fn = list[i++];
      return fn().then(function (url) {
        if (!url) return next();
        return tryLoad(url).then(function () { resolved[p.id] = url; return url; }, next);
      }, next);
    }
    return next();
  }

  var GRIDS = {
    thirds: '<line x1="33.333" y1="0" x2="33.333" y2="100"/><line x1="66.667" y1="0" x2="66.667" y2="100"/><line x1="0" y1="33.333" x2="100" y2="33.333"/><line x1="0" y1="66.667" x2="100" y2="66.667"/>',
    phi: '<line x1="38.2" y1="0" x2="38.2" y2="100"/><line x1="61.8" y1="0" x2="61.8" y2="100"/><line x1="0" y1="38.2" x2="100" y2="38.2"/><line x1="0" y1="61.8" x2="100" y2="61.8"/>',
    diag: '<line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><line x1="0" y1="100" x2="50" y2="0"/><line x1="100" y1="100" x2="50" y2="0"/>'
  };

  // Builds <span class="print-img"> and fills it when the picture arrives.
  function print(p, opts) {
    opts = opts || {};
    var wrap = document.createElement('span');
    wrap.className = 'print-img is-loading';
    var img = document.createElement('img');
    img.alt = p.title + ', ' + p.by + ', ' + p.year;
    img.decoding = 'async';
    wrap.appendChild(img);
    Object.keys(GRIDS).forEach(function (k) {
      wrap.insertAdjacentHTML('beforeend',
        '<svg class="ov g-' + k + '" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + GRIDS[k] + '</svg>');
    });
    findURL(p).then(function (url) {
      img.onload = function () {
        wrap.classList.remove('is-loading');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { wrap.classList.add('is-developed'); });
        });
      };
      img.onerror = function () { missing(wrap, p); };
      img.src = url;
    }).catch(function () { missing(wrap, p); });
    return wrap;
  }

  function missing(wrap, p) {
    wrap.classList.remove('is-loading');
    wrap.classList.add('is-missing');
    var box = document.createElement('span');
    box.className = 'missing';
    box.innerHTML = '<i></i><span class="mono"></span><span class="mono">Image loads from Wikipedia when online</span>';
    box.querySelector('i').textContent = p.title;
    box.querySelectorAll('.mono')[0].textContent = p.by + ' · ' + p.year;
    wrap.appendChild(box);
  }

  window.CIP.photo = function (id) { return byId[id]; };
  window.CIP.print = print;
  window.CIP.preloadPhoto = function (id) { var p = byId[id]; if (p) findURL(p).catch(function () {}); };
})();
