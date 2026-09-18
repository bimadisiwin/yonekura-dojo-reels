# yonekura-dojo-reels

米倉道場 Instagram 投稿素材の**公開ストック**（正本）。  
Instagram Graph API 用の公開URL（jsDelivr）もここから出します。

## 運用

| 置き場 | 役割 |
|---|---|
| **このリポジトリ** | 素材の正本（ストック） |
| **Desktop** `~/Desktop/米倉道場_◯◯_投稿用/` | 作業・スマホ投稿用の**コピー** |

Desktop には正本を置かない。必要なときだけコピーする。

## フォルダ

- `videos/` … リール動画（mp4）
- `stories/` … ストーリー画像（png など）

## 公開URL（jsDelivr）

```
https://cdn.jsdelivr.net/gh/bimadisiwin/yonekura-dojo-reels@main/videos/<filename>
https://cdn.jsdelivr.net/gh/bimadisiwin/yonekura-dojo-reels@main/stories/<filename>
```

例（今夜キッズ・ストーリー）:
`https://cdn.jsdelivr.net/gh/bimadisiwin/yonekura-dojo-reels@main/stories/2026-09-18_kids_tonight.png`

## 追加手順

```bash
# 例: ストーリー画像
cp story.png /tmp/.../stories/YYYY-MM-DD_name.png
git add stories/ && git commit -m "..." && git push

# Desktop にコピー
mkdir -p ~/Desktop/米倉道場_◯◯_投稿用
cp stories/YYYY-MM-DD_name.png ~/Desktop/米倉道場_◯◯_投稿用/
```

リール動画は Vault 側の `python3 tools/upload_reel.py ...` でも可。
