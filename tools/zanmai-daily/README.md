# zanmai-daily：Excel の D 列を毎朝 100 件、トップページに追記する

Excel ファイルは PC の中にあるため、**PC 上で動かすスクリプト**を
Windows の**タスクスケジューラ**で毎日 8:00 に実行します。Claude は毎日動かす必要がありません。

```
[毎朝 8:00] タスクスケジューラ
   └ run_daily.bat → zanmai_daily.py
        1. C:\Users\shogo\Desktop\claude\zanmai-time の Excel（シート API）の D 列を読む
        2. サーバの index.html を FTP でダウンロード（backups\ に保存）
        3. まだ載っていない値を最大 100 件、STAGE 区間の末尾に追記
        4. index.html を FTP でサーバにアップロード（＝ページが更新される）
```

- 追記済みかどうかは `cid=...` で判定するので、同じ作品が二重に載ることはありません。
  Excel が毎日入れ替わる場合も、下に行が増えていく場合も、どちらでも動きます。
- D 列が `<li>…</li>` のような HTML なら、そのまま追記します。
  `sone00272` のような品番（cid）なら、`config.json` の `item_template` に当てはめて動画枠を作ります。
- 同じ日に 2 回動いても 2 回目はスキップします（やり直しは `run_daily.bat --force`）。

## セットアップ（PC で 1 回だけ）

1. Python 3 をインストール（https://www.python.org/ 。「Add python.exe to PATH」にチェック）
2. このフォルダ（`tools\zanmai-daily`）を PC の好きな場所に置く
   例: `C:\Users\shogo\Desktop\claude\zanmai-time\zanmai-daily\`
3. コマンドプロンプトでそのフォルダに移動して:
   ```
   py -3 -m pip install -r requirements.txt
   copy config.example.json config.json
   ```
4. `config.json` を開いて FTP 情報を書く（このファイルは GitHub には上げない）
   - `host` / `user` / `password` … サーバパネルの FTP アカウント情報
   - `remote_html` … 例: `/zanmai-time.com/public_html/index.html`（Xserver の場合）
   - Excel が同じフォルダに複数あるときは `excel_path` にファイル名まで書く
5. 試しに実行（アップロードはしない）:
   ```
   run_daily.bat --dry-run
   ```
   `preview.html` ができるので、ブラウザで開いて追記内容を確認する
6. 本番を 1 回実行してサイトを確認: `run_daily.bat`
7. 毎日 8:00 の自動実行を登録（PowerShell）:
   ```
   powershell -ExecutionPolicy Bypass -File .\register_task.ps1
   ```

## 注意

- **8:00 に PC が起動している（スリープは可）必要があります。** 電源オフで逃した場合は、次に PC を起動したときに実行されます。
- 動画枠が毎日 100 件ずつ増え続けるので、ページが重くなってきたら件数や古い枠の整理を検討してください。
- 既存の `scripts/build.py`（knowledge/config.json）で STAGE 区間を作り直すと、追記分は消えます。どちらか一方の仕組みに寄せてください。
- 失敗したら `logs\YYYY-MM.log` を見る。元に戻したいときは `backups\` の直前のファイルを index.html としてアップロードする。
