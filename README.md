# Prime Video Speed Controller

Amazon Prime Videoの再生速度を自由に変更できるChrome拡張機能です。

## 機能
- Prime Videoの再生速度を0.5x～2.0xで調整
- ポップアップUIで速度選択
- Shift+↑/↓で±0.25倍速変更
- 設定はchrome.storage.localに保存
- Prime Video動画ページでのみ動作

## 使い方
1. Chromeで拡張機能をデベロッパーモードで読み込む
2. Prime Videoで動画再生
3. 拡張アイコンから速度選択
4. 速度が即時反映されることを確認

## ディレクトリ構成
- manifest.json
- content.js
- popup.html
- popup.js
- style.css
- icons/

## 動作手順
1. このリポジトリのフォルダをそのままPC上に展開します。
2. Chromeで「chrome://extensions/」にアクセスします。
3. 右上の「デベロッパーモード」をONにします。
4. 「パッケージ化されていない拡張機能を読み込む」ボタンをクリックし、本フォルダを選択します。
5. 拡張機能が追加され、ツールバーにアイコンが表示されます。
6. Amazon Prime Videoの動画ページ（https://www.amazon.co.jp/gp/video/detail/*）を開き、動画を再生します。
7. 拡張アイコンをクリックし、ポップアップから速度を選択してください。
8. または、動画再生中に「Shift + ↑」で+0.25倍、「Shift + ↓」で-0.25倍の速度調整ができます。

---

何か問題があればREADMEやコードを見直してください。
