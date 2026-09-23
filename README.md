# Prime Video Speed Controller

A Chrome extension that lets you freely change the playback speed of Amazon Prime Video.

## Features
- Adjust Prime Video playback speed from 0.25x to 4.0x (slider, +/- buttons, presets 1.0/1.25/1.5/2.0/3.0)
- Select the speed from the popup UI
- Change speed by ±0.25x with Shift+↑/↓
- Settings are saved in chrome.storage.local
- Works only on Prime Video video pages
- Prevents the player from resetting the speed (overrides the `playbackRate` setter in the page context)

## Usage
1. Load the extension in Chrome in developer mode
2. Play a video on Prime Video
3. Select a speed from the extension icon
4. Confirm that the speed is applied immediately

## Directory Structure
- manifest.json
- inject.js (runs in the page context; overrides the `playbackRate` setter to prevent the site from resetting the speed)
- content.js (extension side; relays the saved speed and instructions from the popup and shortcuts to inject.js)
- popup.html
- popup.js
- style.css
- icons/

## Installation
1. Place this repository's folder on your PC as is.
2. Open `chrome://extensions/` in Chrome.
3. Turn on "Developer mode" in the top right corner.
4. Click "Load unpacked" and select this folder.
5. The extension is added and its icon appears in the toolbar.
6. Open an Amazon Prime Video page (https://www.amazon.co.jp/gp/video/* or primevideo.com) and play a video.
7. Click the extension icon and select a speed from the popup.
8. Alternatively, while a video is playing, press "Shift + ↑" to increase the speed by 0.25x or "Shift + ↓" to decrease it by 0.25x.

## Notes After Updating
- After updating the extension, click "Reload" on `chrome://extensions/` and also reload any open Prime Video tabs.
- Chrome 111 or later is required (uses `world: "MAIN"` for content_scripts).

## Changelog
- 1.1.0: Handled the Prime Video player resetting the speed to 1x during playback. Switched to overriding the setter in the MAIN world, and the popup now injects the content script automatically if it has not been injected. Redesigned the popup with a slider, +/- buttons and presets, and expanded the speed range to 0.25x–4.0x.
- 1.0.0: Initial release

---

If you run into any problems, please review the README and the code.
