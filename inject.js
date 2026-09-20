// ページ本体（MAIN world）で動くスクリプト。
// Prime Video のプレイヤーは再生中に playbackRate を 1 に戻してくるため、
// HTMLMediaElement.prototype.playbackRate の setter を上書きして、
// 拡張が指定した速度以外の値をサイト側が設定できないようにする。
(() => {
  if (window.__primeSpeedInjected) return;
  window.__primeSpeedInjected = true;

  const MSG_SOURCE = "primespeed";
  const proto = HTMLMediaElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, "playbackRate");
  if (!desc || !desc.set) return;

  let targetRate = null; // null の間はサイト側の設定に干渉しない

  const getRate = (el) => desc.get.call(el);
  const setRate = (el, v) => desc.set.call(el, v);

  Object.defineProperty(proto, "playbackRate", {
    configurable: true,
    enumerable: desc.enumerable,
    get() {
      return getRate(this);
    },
    set(v) {
      // 速度が指定されている間はサイト側の変更を無視して指定値を維持する
      setRate(this, targetRate ?? v);
    },
  });

  function applyAll() {
    if (targetRate == null) return;
    document.querySelectorAll("video").forEach((v) => {
      if (getRate(v) !== targetRate) setRate(v, targetRate);
    });
  }

  // 拡張（isolated world の content.js）からの指示を受け取る
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data || e.data.source !== MSG_SOURCE) return;
    if (e.data.type === "SET_RATE") {
      const r = Number(e.data.rate);
      targetRate = Number.isFinite(r) && r > 0 ? r : null;
      applyAll();
    }
  });

  // サイト側が値を書き換えた場合やvideoが再生成された場合に再適用する
  const reapply = (e) => {
    const el = e.target;
    if (targetRate != null && el instanceof HTMLMediaElement && getRate(el) !== targetRate) {
      setRate(el, targetRate);
    }
  };
  ["ratechange", "loadedmetadata", "play", "playing"].forEach((ev) =>
    document.addEventListener(ev, reapply, true)
  );

  // 準備完了を通知（content.js はこれを受けて保存済み速度を送る）
  window.postMessage({ source: MSG_SOURCE, type: "READY" }, "*");
})();
