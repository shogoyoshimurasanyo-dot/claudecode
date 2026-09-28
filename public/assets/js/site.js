/* ============================================================
   サイト共通の小さな動き（全ページで読み込む）
   - 説明文（.cell-text）が長いときだけ 3 行で折りたたみ、
     「続きを読む」で開閉できるようにする（見た目は common.css）
   年齢確認のあとに本文が差し込まれるので、差し込みを見張って処理する。
   ============================================================ */
(function () {
  var OPEN = '閉じる';
  var CLOSED = '続きを読む';

  function measure(p, body, btn) {
    if (p.classList.contains('is-open')) return;
    p.classList.add('is-collapsible');
    var long = body.scrollHeight > body.clientHeight + 2;
    if (!long) p.classList.remove('is-collapsible');
    btn.hidden = !long;
  }

  function setup(p) {
    if (p.dataset.more) return;
    p.dataset.more = '1';
    // 中身を .cell-body で包み、そちらを行数で切る（p の余白に次の行が見えないように）
    var body = document.createElement('span');
    body.className = 'cell-body';
    while (p.firstChild) body.appendChild(p.firstChild);
    p.appendChild(body);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cell-more';
    btn.textContent = CLOSED;
    btn.setAttribute('aria-expanded', 'false');
    btn.hidden = true;
    btn.addEventListener('click', function () {
      var open = p.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? OPEN : CLOSED;
    });
    p.appendChild(btn);
    measure(p, body, btn);
  }

  function scan(root) {
    var list = (root || document).querySelectorAll('.cell-text');
    for (var i = 0; i < list.length; i++) setup(list[i]);
  }

  function remeasure() {
    var list = document.querySelectorAll('.cell-text[data-more]');
    for (var i = 0; i < list.length; i++) {
      var body = list[i].querySelector('.cell-body');
      var btn = list[i].querySelector('.cell-more');
      if (body && btn) measure(list[i], body, btn);
    }
  }

  scan();
  if (window.MutationObserver) {
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        if (records[i].addedNodes.length) { scan(); return; }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(remeasure, 150);
  });
  // Web フォントの読み込みで行数が変わるので、読み込み後にもう一度測る
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
})();
