#!/usr/bin/env python3
"""public/updates/YYYY-MM-DD*.html を集めて、トップページの更新一覧と updates/index.json を再生成する。"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public"
UPDATES = ROOT / "updates"
INDEX = ROOT / "index.html"
LIMIT = 10  # トップに表示する件数

entries = []
for f in sorted(UPDATES.glob("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*.html"), reverse=True):
    html = f.read_text(encoding="utf-8")
    m = re.search(r"<title>(.*?)</title>", html, re.S)
    title = m.group(1).strip() if m else f.stem
    entries.append({"date": f.name[:10], "title": title, "url": f"updates/{f.name}"})

(UPDATES / "index.json").write_text(
    json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

items = "\n".join(
    f'    <li><time datetime="{e["date"]}">{e["date"]}</time> <a href="{e["url"]}">{e["title"]}</a></li>'
    for e in entries[:LIMIT]
)
block = f"<!-- UPDATES:START (scripts/build_index.py が自動生成。手で編集しない) -->\n  <ul>\n{items}\n  </ul>\n  <!-- UPDATES:END -->"
page = INDEX.read_text(encoding="utf-8")
new_page, n = re.subn(r"<!-- UPDATES:START.*?<!-- UPDATES:END -->", block, page, flags=re.S)
if n != 1:
    raise SystemExit("index.html に UPDATES:START / UPDATES:END マーカーが見つかりません")
INDEX.write_text(new_page, encoding="utf-8")
print(f"{len(entries)} 件の更新を一覧に反映しました")
