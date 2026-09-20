# Prime Video Speed Controller

Amazon Prime Videoの再生速度を自由に変更できるChrome拡張機能です。

## 機能
- Prime Videoの再生速度を0.25x～4.0xで調整（スライダー・±ボタン・プリセット 1.0/1.25/1.5/2.0/3.0）
- ポップアップUIで速度選択
- Shift+↑/↓で±0.25倍速変更
- 設定はchrome.storage.localに保存
- Prime Video動画ページでのみ動作
- プレイヤー側の速度リセットを無効化（ページ本体で playbackRate の setter を上書き）

## 使い方
1. Chromeで拡張機能をデベロッパーモードで読み込む
2. Prime Videoで動画再生
3. 拡張アイコンから速度選択
4. 速度が即時反映されることを確認

## ディレクトリ構成
- manifest.json
- inject.js（ページ本体で動作。playbackRate の setter を上書きしてサイト側のリセットを防ぐ）
- content.js（拡張側。保存済み速度・ポップアップ・ショートカットの指示を inject.js へ中継）
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
6. Amazon Prime Videoの動画ページ（https://www.amazon.co.jp/gp/video/* または primevideo.com）を開き、動画を再生します。
7. 拡張アイコンをクリックし、ポップアップから速度を選択してください。
8. または、動画再生中に「Shift + ↑」で+0.25倍、「Shift + ↓」で-0.25倍の速度調整ができます。

## 更新後の注意
- 拡張を更新したら chrome://extensions/ で「更新」（再読み込み）を押し、開いている Prime Video のタブも再読み込みしてください。
- Chrome 111 以上が必要です（content_scripts の `world: "MAIN"` を使用）。

## 変更履歴
- 1.1.0: Prime Video プレイヤーが再生中に速度を 1x へ戻す挙動に対応。MAIN world での setter 上書き方式に変更し、content script 未注入時はポップアップから自動注入するようにした。ポップアップをスライダー・±ボタン・プリセット付きの UI に刷新し、速度レンジを 0.25x〜4.0x に拡大。
- 1.0.0: 初版

---

何か問題があればREADMEやコードを見直してください。
