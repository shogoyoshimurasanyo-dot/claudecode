# 毎日の自動実行用プロンプト

claude.ai/code の「Routines（スケジュール実行）」や、Claude Code に毎朝そのまま貼り付けて使うプロンプト。
（リポジトリ内なら `/daily-update テーマ` でも同じことができる）

---

このリポジトリ（レンタルサーバ公開用サイト）に、今日のデイリー更新ファイルを追加して公開してください。

- まず CLAUDE.md を読み、その「デイリー更新のルール」と「やってはいけないこと」に従うこと。
- 日付は日本時間で決める（`TZ=Asia/Tokyo date +%F`）。今日のファイルが既にあれば何もせず「作成済み」と報告して終了。
- 直近 5 件の `public/updates/*.html` を読んで、トーンと構成を揃え、テーマは重複させない。
- テーマ: 〈ここに毎日のテーマの方針を書く。例：「季節の話題を1つ取り上げ、初心者向けに解説する」〉
- `public/updates/_template.html` を元に `public/updates/<日付>.html` を作り、`python3 scripts/build_index.py` を実行。
- `grep -n '{{' public/updates/<日付>.html` が空であることを確認してから、`main` に commit & push する。
- push 後、GitHub Actions の「Deploy to rental server」が成功したか確認し、失敗していればログを読んで原因を報告する。
- 最後に、ファイル名・タイトル・URL を 3 行で報告する。
