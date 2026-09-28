<?php
// 動画クリックを 1 行ずつ clicks.log に記録する（click-track.js から呼ばれる）
// 形式: YYYY-MM-DD<TAB>cid
header('Cache-Control: no-store');
$cid = isset($_GET['cid']) ? $_GET['cid'] : '';
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !preg_match('/^[A-Za-z0-9_]{3,40}$/', $cid)) {
    http_response_code(400);
    exit;
}
$date = gmdate('Y-m-d', time() + 9 * 3600); // 日本時間
file_put_contents(__DIR__ . '/clicks.log', $date . "\t" . $cid . "\n", FILE_APPEND | LOCK_EX);
http_response_code(204);
