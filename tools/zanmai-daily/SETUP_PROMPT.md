# Claude Code（PC 版）にそのまま貼るプロンプト

Windows の Claude Code（デスクトップアプリ or ターミナル）を
`C:\Users\shogo\Desktop\claude\zanmai-time` で開き、下の「---」以下を貼り付けてください。
FTP パスワードはチャットに書かず、途中で `config.json` を自分で編集してください。

---

GitHub リポジトリ shogoyoshimurasanyo-dot/claudecode のブランチ claude/fervent-ride-981r29 にある
`tools/zanmai-daily/` を、この PC で毎朝 8:00 に動くようにセットアップしてください。
手順は `tools/zanmai-daily/README.md` に従うこと。

1. `tools/zanmai-daily/` の中身を `C:\Users\shogo\Desktop\claude\zanmai-time\zanmai-daily\` に置く
   （git が使えれば clone、使えなければ GitHub から raw ファイルを取得）。
2. Python 3 と openpyxl が入っているか確認し、なければインストール方法を案内する。
3. `C:\Users\shogo\Desktop\claude\zanmai-time` の Excel を開き、シート「API」の C 列（タイトル）と D 列の先頭 5 件を見せて、
   D 列が「品番(cid)」「HTML」「その他」のどれかを判定する。「その他」なら、config.json の item_template をどう直すべきか提案する。
4. config.example.json から config.json を作る。FTP の host / user / password / remote_html は私が自分で入力するので、
   入力が終わるまで待つ（パスワードを聞き返したり、ログに表示したりしない）。
5. `run_daily.bat --dry-run` を実行し、ログ（残す件数・入れ替え件数）と preview.html の動画グリッドの最初の 3 件を見せる。
6. 私が OK したら `run_daily.bat` を 1 回本番実行し、ログを確認する。
   あわせて、サイトを開いて動画を 1 つクリックし、`/api/clicks.log` に 1 行増えるか FTP で確認する
   （サーバが PHP に対応しているかの確認）。
7. `register_task.ps1` でタスクスケジューラに毎日 8:00 のタスクを登録し、登録内容を表示して終了。
