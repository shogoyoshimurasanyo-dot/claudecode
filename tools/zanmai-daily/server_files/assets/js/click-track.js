/* ============================================================
   動画クリック計測（tools/zanmai-daily が毎朝アップロードする）
   DMM のプレイヤーは別サイトの iframe なので、クリックそのものは取れない。
   代わりに「ページのフォーカスがどの iframe に移ったか」を見て、
   クリックされた動画の cid を /api/click.php に送る（1 表示につき 1 作品 1 回）。
   ============================================================ */
(function () {
  var sent = {};
  var last = null;

  function check() {
    var el = document.activeElement;
    if (!el || el === last || el.tagName !== 'IFRAME') { last = el; return; }
    last = el;
    var m = /cid=([A-Za-z0-9_]+)/.exec(el.getAttribute('src') || '');
    if (!m || sent[m[1]]) return;
    sent[m[1]] = true;
    var url = '/api/click.php?cid=' + encodeURIComponent(m[1]);
    if (navigator.sendBeacon) navigator.sendBeacon(url);
    else if (window.fetch) fetch(url, { method: 'POST', keepalive: true });
  }

  // iframe をクリックすると親ページの window が blur する
  window.addEventListener('blur', function () { setTimeout(check, 0); });
  // iframe → 別の iframe へ直接移ったときは blur が出ないので定期的にも見る
  setInterval(function () { if (!document.hidden) check(); }, 700);
})();
