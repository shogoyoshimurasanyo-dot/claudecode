# レンタルサーバへのデイリー更新 × Claude Code

ブラウザ（サーバパネルのファイルマネージャ）で手作業アップロードしている運用を、
**Claude Code がファイルを作る → GitHub に push → GitHub Actions が自動でサーバへアップロード**
という流れに置き換えるためのひな形です。

```
Claude Code ──(commit/push)──▶ GitHub (main) ──(Actions: FTP/SSH)──▶ レンタルサーバ public_html
   ▲
   └─ 毎朝: /daily-update  または  Routines（スケジュール実行）
```

Claude Code（特にクラウド版 claude.ai/code）はサーバへ FTP 直結できないことが多いため、
サーバへの転送は GitHub Actions に任せるのがポイントです。パスワードも GitHub Secrets にだけ置けば済みます。

## 構成

| パス | 役割 |
|---|---|
| `public/` | サーバの公開ディレクトリにそのまま反映される中身 |
| `public/updates/YYYY-MM-DD.html` | デイリー更新ファイル |
| `public/updates/_template.html` | デイリー更新のひな形（サーバには上がらない） |
| `scripts/build_index.py` | トップの「最新の更新」一覧と `updates/index.json` を再生成 |
| `.github/workflows/deploy.yml` | main への push で FTP(S) デプロイ（差分のみ転送） |
| `docs/deploy-ssh.yml.example` | SSH(rsync) で送りたい場合の代替 |
| `CLAUDE.md` | Claude Code が毎回読むルール |
| `.claude/commands/daily-update.md` | `/daily-update` スラッシュコマンド |
| `prompts/daily-routine-prompt.md` | スケジュール実行・コピペ用プロンプト |

## 初期設定（最初の 1 回だけ）

### 1. 今のサーバのファイルをリポジトリに取り込む
サーバパネルのファイルマネージャ（または FTP ソフト）で `public_html` 配下をダウンロードし、`public/` に置いて commit します。
既存サイトに `index.html` がある場合は、「最新の更新」を出したい位置に次のマーカーを入れてください。

```html
<!-- UPDATES:START (scripts/build_index.py が自動生成。手で編集しない) -->
<!-- UPDATES:END -->
```

> WordPress サイトの場合、この仕組みは静的ファイル（HTML・画像・CSS 等）の設置向けです。
> WordPress の投稿として毎日公開したいなら、REST API 経由の投稿に切り替える方が向いています。

### 2. サーバパネルで FTP 情報を確認
FTP ホスト名・ユーザー名・パスワード・公開ディレクトリのパス（例 `/example.com/public_html/`）を控えます。

- **Xserver**: 「FTP 制限設定」「海外アクセス制限」がオンだと GitHub Actions（海外 IP）から接続できません。FTP の国外 IP 制限をオフにしてください。
- FTPS 非対応のサーバなら `deploy.yml` の `protocol: ftps` を `ftp` に変更します。

### 3. GitHub Secrets を登録
GitHub のリポジトリ → **Settings → Secrets and variables → Actions → New repository secret** で以下を登録:

| Name | 例 |
|---|---|
| `FTP_SERVER` | `sv12345.xserver.jp` |
| `FTP_USERNAME` | FTP アカウント |
| `FTP_PASSWORD` | FTP パスワード |
| `FTP_SERVER_DIR` | `/example.com/public_html/`（**末尾 `/` 必須**） |

### 4. 動作確認
このリポジトリを `main` にマージ（または push）すると Actions の **Deploy to rental server** が走ります。
**Actions タブ → Deploy to rental server → Run workflow** で手動実行もできます。
初回は全ファイル、2 回目以降は差分だけが転送されます（サーバに `.ftp-deploy-sync-state.json` が作られます。消さないでください）。

## 毎日の使い方

### A. 手動で 1 日 1 回指示する
Claude Code でこのリポジトリを開き:

```
/daily-update 今日は〇〇について
```

テーマを省略すると、過去の更新と重複しないテーマを Claude が選びます。

### B. 完全自動（毎朝スケジュール実行）
claude.ai/code の **Routines** でこのリポジトリを対象に、毎日決まった時刻に
`prompts/daily-routine-prompt.md` の「---」以下を送るよう設定します。
（テーマの方針の行は自分のサイトに合わせて書き換えてください）

> クラウド版 Claude Code のセッションは `claude/...` という作業ブランチで動くことがあります。
> そのまま公開まで自動化したい場合は、プロンプトの「`main` に push する」の指示を残してください。
> 公開前に目で確認したい場合は「`main` ではなく作業ブランチに push し、PR を作成する」に書き換え、
> 確認後に PR をマージすれば公開されます。

## うまくいかないとき

| 症状 | 確認すること |
|---|---|
| Actions が `ECONNREFUSED` / timeout | サーバの海外 IP 制限・FTP 制限、`FTP_SERVER` のホスト名 |
| `530 Login incorrect` | `FTP_USERNAME` / `FTP_PASSWORD` |
| 変なディレクトリにアップされた | `FTP_SERVER_DIR` のパスと末尾の `/` |
| `ftps` で失敗 | `protocol: ftp` に変更 |
| トップの一覧が更新されない | `index.html` に `UPDATES:START` / `UPDATES:END` マーカーがあるか |
