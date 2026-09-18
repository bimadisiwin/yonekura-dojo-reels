# yonekura-dojo-reels

米倉道場 Instagram 投稿素材の**公開ストック**（正本）。  
Instagram Graph API 用の公開URL（jsDelivr）もここから出します。

## 運用

| 置き場 | 役割 |
|---|---|
| **このリポジトリ** | 素材の正本（ストック） |
| **Desktop** `~/Desktop/米倉道場_投稿用/YYYY-MM-DD_案件名/` | 作業・スマホ投稿用の**コピー** |

Desktop 直下には案件フォルダを増やさず、親フォルダ `米倉道場_投稿用` の中にまとめる。正本はリポジトリのみ。

## フォルダ

- `videos/` … リール動画（mp4）
- `stories/` … ストーリー画像（png など）

## 公開URL（jsDelivr）

```
https://cdn.jsdelivr.net/gh/bimadisiwin/yonekura-dojo-reels@main/videos/<filename>
https://cdn.jsdelivr.net/gh/bimadisiwin/yonekura-dojo-reels@main/stories/<filename>
```

## 追加手順

```bash
# 例: ストーリー画像を正本へ
cp story.png stories/YYYY-MM-DD_name.png
git add stories/ && git commit -m "..." && git push

# Desktop にコピー（親フォルダ配下）
mkdir -p ~/Desktop/米倉道場_投稿用/YYYY-MM-DD_案件名
cp stories/YYYY-MM-DD_name.png ~/Desktop/米倉道場_投稿用/YYYY-MM-DD_案件名/
```

リール動画は Vault 側の `python3 tools/upload_reel.py ...` でも可。
