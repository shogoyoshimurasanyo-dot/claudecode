/* ============================================================
   年齢確認（全ページ共通）
   使い方：
     1. ページ本文を <template id="site-content"> ～ </template> で囲む
     2. </body> の直前で <script src="/assets/js/age-gate.js"></script> を読み込む
   「はい」を押すまで <template> の中身（動画など）は一切読み込まれません。
   一度「はい」を押すと、ブラウザを閉じるまで全ページで再表示しません。
   ============================================================ */
(function () {
  var KEY = 'age_verified';

  function isVerified() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  function showSite(gate) {
    var tpl = document.getElementById('site-content');
    if (tpl) {
      tpl.parentNode.insertBefore(tpl.content.cloneNode(true), tpl);
      tpl.parentNode.removeChild(tpl);
    }
    if (gate) gate.parentNode.removeChild(gate);
  }

  if (isVerified()) { showSite(null); return; }

  var gate = document.createElement('div');
  gate.className = 'age-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'age-title');
  gate.innerHTML =
    '<div class="age-box">' +
      '<div class="age-mark">18</div>' +
      '<h2 id="age-title">あなたは18歳以上ですか？</h2>' +
      '<p>このサイトには、18歳未満の方の閲覧にふさわしくないアダルトコンテンツが含まれています。</p>' +
      '<div class="age-actions">' +
        '<button type="button" class="age-yes">はい</button>' +
        '<button type="button" class="age-no">いいえ</button>' +
      '</div>' +
      '<p class="age-denied">18歳未満の方はご利用いただけません。</p>' +
    '</div>';
  document.body.appendChild(gate);

  gate.querySelector('.age-yes').addEventListener('click', function () {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    showSite(gate);
  });
  gate.querySelector('.age-no').addEventListener('click', function () {
    gate.classList.add('is-denied');
  });
  gate.querySelector('.age-yes').focus();
})();
