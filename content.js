(() => {
  console.log("[PrimeSpeed] content script active");

  let lastRate = 1.0;

  // video要素を常時監視してplaybackRateを適用
  function keepApplyingSpeed(rate) {
    lastRate = rate;
    const apply = () => {
      const videos = document.querySelectorAll("video");
      if (videos.length === 0) {
        // videoが無い場合は何もしない
        return;
      }
      videos.forEach((video) => {
        if (video.playbackRate !== rate) {
          video.playbackRate = rate;
          console.log(`[PrimeSpeed] playbackRate set to ${rate}`);
        }
      });
    };

    // 初回即時適用
    apply();

    // 定期的に再適用（videoの再生成やSPA遷移対策）
    if (window.__primeSpeedInterval) clearInterval(window.__primeSpeedInterval);
    window.__primeSpeedInterval = setInterval(apply, 1000);

    // MutationObserverでDOM変化も監視
    if (!window.__primeSpeedObserver) {
      window.__primeSpeedObserver = new MutationObserver(apply);
      window.__primeSpeedObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  // 設定済み速度を適用
  chrome.storage.local.get("playbackRate", (data) => {
    const rate = data.playbackRate || 1.0;
    console.log(`[PrimeSpeed] apply stored playbackRate: ${rate}`);
    keepApplyingSpeed(rate);
  });

  // ショートカットキーで速度変更
  document.addEventListener("keydown", (e) => {
    if (!e.shiftKey) return;
    const video = document.querySelector("video");
    if (!video) {
      console.log("[PrimeSpeed] video element not found (keydown)");
      return;
    }

    let rate = video.playbackRate;
    if (e.key === "ArrowUp") {
      rate = Math.min(rate + 0.25, 2.0);
    } else if (e.key === "ArrowDown") {
      rate = Math.max(rate - 0.25, 0.5);
    } else return;

    chrome.storage.local.set({ playbackRate: rate });
    keepApplyingSpeed(rate);
    console.log(`[PrimeSpeed] playbackRate changed to ${rate}`);
  });

  // popup.jsからのメッセージを受信
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    console.log("[PrimeSpeed] onMessage received", req);
    if (req.type === "SET_SPEED") {
      chrome.storage.local.set({ playbackRate: req.value });
      keepApplyingSpeed(req.value);
      sendResponse({ result: "ok" });
    }
  });
})();
