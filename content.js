// 拡張側（isolated world）の content script。
// 保存済みの速度やポップアップ／ショートカットからの指示を inject.js（MAIN world）へ中継する。
(() => {
  if (window.__primeSpeedLoaded) return;
  window.__primeSpeedLoaded = true;

  const MSG_SOURCE = "primespeed";
  const MIN_RATE = 0.25;
  const MAX_RATE = 4.0;
  const STEP = 0.25;
  let currentRate = 1.0;

  function sendToPage(rate) {
    window.postMessage({ source: MSG_SOURCE, type: "SET_RATE", rate }, "*");
  }

  // MAIN world を経由しないフォールバック（setter 上書きと併用）
  function applyDirect(rate) {
    document.querySelectorAll("video").forEach((v) => {
      if (v.playbackRate !== rate) v.playbackRate = rate;
    });
  }

  function setRate(rate, { save = true } = {}) {
    currentRate = rate;
    sendToPage(rate);
    applyDirect(rate);
    if (save) chrome.storage.local.set({ playbackRate: rate });
  }

  function getVideoRate() {
    const v = [...document.querySelectorAll("video")].find((el) => el.readyState > 0) || document.querySelector("video");
    return v ? v.playbackRate : currentRate;
  }

  // 保存済み速度を読み込んで適用
  chrome.storage.local.get("playbackRate", (data) => {
    const rate = Number(data.playbackRate) || 1.0;
    setRate(rate, { save: false });
  });

  // inject.js の準備完了通知を受けたら再送（読み込み順の差異に備える）
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data || e.data.source !== MSG_SOURCE) return;
    if (e.data.type === "READY") sendToPage(currentRate);
  });

  // video 要素の再生成・SPA遷移対策として定期再適用
  setInterval(() => applyDirect(currentRate), 1000);

  // ショートカット: Shift+↑ / Shift+↓
  document.addEventListener(
    "keydown",
    (e) => {
      if (!e.shiftKey || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
      const base = getVideoRate();
      const next =
        e.key === "ArrowUp"
          ? Math.min(base + STEP, MAX_RATE)
          : Math.max(base - STEP, MIN_RATE);
      setRate(Math.round(next * 100) / 100);
      e.preventDefault();
      e.stopPropagation();
    },
    true
  );

  // ポップアップからのメッセージ
  chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.type === "SET_SPEED") {
      setRate(Number(req.value));
      sendResponse({ result: "ok", rate: currentRate });
    } else if (req.type === "GET_SPEED") {
      sendResponse({ result: "ok", rate: getVideoRate(), hasVideo: !!document.querySelector("video") });
    }
    return false;
  });
})();
