# zanmai-daily：トップの動画 100 枠を毎朝入れ替える

Excel ファイルは PC の中にあるため、**PC 上で動かすスクリプト**を
Windows の**タスクスケジューラ**で毎日 8:00 に実行します。Claude は毎日動かす必要がありません。

```
[毎朝 8:00] タスクスケジューラ → run_daily.bat → zanmai_daily.py
  1. Excel（シート API）を読む … C 列＝タイトル、D 列＝品番(cid)
  2. サーバから index.html とクリックログ（/api/clicks.log）をダウンロード（index.html は backups\ に保存）
  3. 直近 7 日でクリックされた動画を、多い順に最大 30 件「残す」
  4. 残りの 70 枠以上を Excel からランダムに選ぶ（直近 3 日に出した動画は後回し）
  5. 動画グリッド（STAGE 区間）を丸ごと作り直して index.html をアップロード
```

## クリックの数え方

DMM のプレイヤーは別サイトの埋め込み（iframe）なので、クリックを直接は数えられません。
そこで、ページのフォーカスがどの動画枠に移ったかを見て、クリックとして記録します。

| ファイル | サーバ上の場所 | 役割 |
|---|---|---|
| `server_files/assets/js/click-track.js` | `/assets/js/click-track.js` | 動画枠のクリックを検知して送信（1 表示につき 1 作品 1 回） |
| `server_files/api/click.php` | `/api/click.php` | 受け取った品番を `clicks.log` に 1 行追記 |
| `server_files/api/.htaccess` | `/api/.htaccess` | `clicks.log` をブラウザから見えなくする |

- この 3 ファイルは毎朝のスクリプトが自動でアップロードします。index.html への `<script>` タグの追加も自動です。
- PHP が使えるサーバ（Xserver・ロリポップ・ConoHa WING など）が前提です。
- 計測は正確な数ではなく「どの動画が人気か」の目安です（再生ボタン以外のクリックも数えます）。

## 設定（config.json）

| 項目 | 既定値 | 意味 |
|---|---|---|
| `count` | 100 | 掲載する動画の総数 |
| `keep_top` | 30 | クリックが多い動画を最大何件残すか |
| `min_clicks` | 1 | 残す対象になる最低クリック数 |
| `click_window_days` | 7 | 何日分のクリックで判定するか |
| `avoid_recent_days` | 3 | 直近この日数に出した動画は、入れ替え候補として後回しにする |
| `order` | `kept_first` | `kept_first`＝人気の動画を上に並べる、`shuffle`＝全体をランダムに並べる |
| `tracking` | true | false にするとクリック計測をやめ、毎日すべてランダムに入れ替える |

- 同じ作品が二重に載ることはありません（品番で判定）。
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
   `preview.html` ができるので、ブラウザで開いて入れ替え後の内容を確認する
6. 本番を 1 回実行してサイトを確認: `run_daily.bat`
7. 毎日 8:00 の自動実行を登録（PowerShell）:
   ```
   powershell -ExecutionPolicy Bypass -File .\register_task.ps1
   ```

## 注意

- **8:00 に PC が起動している（スリープは可）必要があります。** 電源オフで逃した場合は、次に PC を起動したときに実行されます。
- 既存の `scripts/build.py`（knowledge/config.json）で STAGE 区間を作り直すと、この入れ替え結果が上書きされます。どちらか一方の仕組みに寄せてください。
- 失敗したら `logs\YYYY-MM.log` を見る。元に戻したいときは `backups\` の直前のファイルを index.html としてアップロードする。
