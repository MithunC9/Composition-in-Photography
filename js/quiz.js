/* "Name the element": eight photographs, four choices each. */
(function () {
  'use strict';
  var C = window.CIP, U = window.CIPU, esc = U.esc;
  var ROUNDS = 8;

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function elOf(k) { return C.ELEMENTS.filter(function (e) { return e.key === k; })[0]; }

  C.mountQuiz = function (inner) {
    var qs = [], at = 0, results = [];

    function newGame() {
      // one photo from each of eight different elements
      var els = shuffle(C.ELEMENTS.map(function (e) { return e.key; })).slice(0, ROUNDS);
      qs = els.map(function (k) {
        var p = shuffle(C.PHOTOS.filter(function (x) { return x.el === k; }))[0];
        var avoid = [p.el].concat(p.tags || []);
        var wrong = shuffle(C.ELEMENTS.filter(function (e) { return avoid.indexOf(e.key) < 0; })).slice(0, 3).map(function (e) { return e.key; });
        return { p: p, options: shuffle([p.el].concat(wrong)) };
      });
      qs.forEach(function (q) { C.preloadPhoto(q.p.id); });
      at = 0; results = [];
      show();
    }

    function progress() {
      return '<div class="quiz-progress" aria-hidden="true">' + qs.map(function (_, i) {
        return '<i class="' + (results[i] === true ? 'right' : results[i] === false ? 'wrong' : i === at ? 'now' : '') + '"></i>';
      }).join('') + '</div>';
    }

    function show() {
      var q = qs[at];
      inner.innerHTML =
        '<div class="quiz-photo"></div>' +
        '<div class="quiz-side">' +
          '<p class="kicker mono" style="margin:0"><b>Quiz</b><span class="line"></span>Photograph ' + (at + 1) + ' of ' + qs.length + '</p>' +
          progress() +
          '<h2 class="quiz-q">Which element does this photograph show best?</h2>' +
          '<div class="answers">' + q.options.map(function (k) {
            var e = elOf(k);
            return '<button type="button" class="answer" data-k="' + k + '"><small>' + (e.num < 10 ? '0' : '') + e.num + '</small>' + esc(e.name) + '</button>';
          }).join('') + '</div>' +
          '<div class="quiz-feedback" aria-live="polite">Look at the frame before you answer: lines, light, space, shapes?</div>' +
        '</div>';
      inner.querySelector('.quiz-photo').appendChild(C.print(q.p, { eager: true }));
      inner.querySelectorAll('.answer').forEach(function (b) {
        b.addEventListener('click', function () { answer(b.getAttribute('data-k')); });
      });
    }

    function answer(k) {
      var q = qs[at], right = k === q.p.el;
      results[at] = right;
      inner.querySelectorAll('.answer').forEach(function (b) {
        var bk = b.getAttribute('data-k');
        b.disabled = true;
        if (bk === q.p.el) {
          b.classList.add('is-right');
          b.insertAdjacentHTML('beforeend', '<svg class="ring" viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true"><path d="' + U.markerRing(200, 70, at + 3) + '"/></svg>');
        } else if (bk === k) b.classList.add('is-wrong');
      });
      var e = elOf(q.p.el);
      inner.querySelector('.quiz-feedback').innerHTML =
        '<strong>' + (right ? 'Right.' : 'Not quite. It is ' + esc(e.name) + '.') + '</strong> ' +
        '<em>' + esc(q.p.title) + '</em>, ' + esc(q.p.by) + ', ' + esc(q.p.year) + '. ' + esc(q.p.look) +
        '<div style="margin-top:12px"><button type="button" class="btn" data-quiz-next>' + (at + 1 < qs.length ? 'Next photograph →' : 'See my score →') + '</button></div>';
      inner.querySelector('.quiz-progress').outerHTML = progress();
      var nb = inner.querySelector('[data-quiz-next]');
      nb.addEventListener('click', function () { at++; if (at < qs.length) show(); else end(); });
      nb.focus({ preventScroll: true });
    }

    function end() {
      var score = results.filter(Boolean).length;
      var verdict = score === qs.length ? 'A perfect eye. You could teach this class.'
        : score >= qs.length - 2 ? 'A sharp eye for composition.'
        : score >= qs.length / 2 ? 'Good instincts. A second look at a few elements will lock them in.'
        : 'Composition takes practice. Step back through the elements and try again.';
      inner.innerHTML =
        '<div class="quiz-end">' +
          '<p class="kicker mono" style="margin:0"><b>Quiz</b><span class="line"></span>Results</p>' +
          '<p class="quiz-score">' + score + '<small> / ' + qs.length + '</small></p>' +
          '<p class="lede" style="margin:0">' + verdict + '</p>' +
          progress() +
          '<div style="display:flex;gap:12px;flex-wrap:wrap"><button type="button" class="btn" data-quiz-again>Play again</button><button type="button" class="btn ghost" data-goto="elements">Review the elements</button></div>' +
        '</div>' +
        '<div class="quiz-side"><ol class="tips">' + qs.map(function (q, i) {
          var e = elOf(q.p.el);
          return '<li><button type="button" data-goto="' + q.p.el + '-photos"><span class="t-n">' + (results[i] ? '✓' : '×') + '</span><span class="t-name">' + esc(q.p.title) + '</span><span class="t-go">' + esc(e.short) + ' →</span></button></li>';
        }).join('') + '</ol></div>';
      inner.querySelector('[data-quiz-again]').addEventListener('click', newGame);
    }

    newGame();
    return {};
  };
})();
