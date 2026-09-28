# このリポジトリについて

レンタルサーバで公開しているサイトのソース。`public/` の中身がそのままサーバの公開ディレクトリ（public_html 等）に反映される。

- `main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）が FTP でサーバへアップロードする。
- Claude はサーバに直接接続しない。**ファイルを作って commit → push するところまで**が Claude の仕事。

## ディレクトリ

- `public/` … 公開ファイル。ここ以外はサーバに上がらない。
- `public/updates/YYYY-MM-DD.html` … デイリー更新ファイル。1日1ファイル（同日2本目は `YYYY-MM-DD-2.html`）。
- `public/updates/_template.html` … デイリー更新のひな形。`{{TITLE}}` `{{DESCRIPTION}}` `{{DATE}}` `{{BODY}}` を置き換えて使う。
- `scripts/build_index.py` … トップの更新一覧と `public/updates/index.json` を再生成する。

## デイリー更新のルール

1. 日付は日本時間（`TZ=Asia/Tokyo date +%F`）で決める。
2. `_template.html` をコピーして `public/updates/<日付>.html` を作る。
3. `python3 scripts/build_index.py` を実行して一覧を更新する。
4. HTML が壊れていないか確認する（タグの閉じ忘れ、`{{...}}` の置き換え漏れがないこと: `grep -n '{{' public/updates/<日付>.html` が空）。
5. `git add public/ && git commit -m "daily: <日付> <タイトル>" && git push origin main`。

## やってはいけないこと

- 既存の更新ファイルを消す・上書きする（明示的に頼まれた場合を除く）。
- `public/index.html` の `UPDATES:START`〜`UPDATES:END` の間を手で編集する（スクリプトが上書きする）。
- パスワードや FTP 情報をファイルに書く（GitHub Secrets にだけ置く）。
