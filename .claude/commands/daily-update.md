---
description: 今日のデイリー更新ファイルを作ってサーバに反映する
argument-hint: [テーマや元ネタ（省略可）]
---

今日のデイリー更新を作成して公開してください。CLAUDE.md の「デイリー更新のルール」に従うこと。

テーマ・元ネタ: $ARGUMENTS
（空なら、既存の `public/updates/` の傾向と重複しないテーマを自分で選ぶ）

手順:
1. `TZ=Asia/Tokyo date +%F` で今日の日付を確認し、同じ日付のファイルが既にあるか調べる。
2. 直近 5 件の更新ファイルを読み、トーン・構成・長さを揃える。内容は重複させない。
3. `public/updates/_template.html` を元に `public/updates/<日付>.html` を作る（本文は見出し＋段落で 800〜1500 字程度）。
4. `python3 scripts/build_index.py` を実行する。
5. `grep -n '{{' public/updates/<日付>.html` で置き換え漏れがないことを確認する。
6. `main` に commit & push する（コミットメッセージ: `daily: <日付> <タイトル>`）。
7. 最後に、作ったファイル名・タイトル・公開予定 URL（`/updates/<日付>.html`）を報告する。
