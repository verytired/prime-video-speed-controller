const PRIME_URL = /^https?:\/\/(www\.amazon\.(co\.jp|com)\/gp\/video\/|www\.primevideo\.com\/)/;
const MIN_RATE = 0.25;
const MAX_RATE = 4.0;
const STEP = 0.25;

const clamp = (r) => Math.min(MAX_RATE, Math.max(MIN_RATE, Math.round(r * 100) / 100));
const format = (r) => (Number.isInteger(r) ? r.toFixed(1) : String(r)) + "x";

document.addEventListener("DOMContentLoaded", async () => {
  const rateEl = document.getElementById("rate");
  const slider = document.getElementById("slider");
  const status = document.getElementById("status");
  const presetButtons = [...document.querySelectorAll(".preset button[data-speed]")];

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isPrime = tab && tab.id != null && PRIME_URL.test(tab.url || "");

  const showStatus = (msg) => {
    status.textContent = msg;
  };

  // UI だけ更新（送信しない）
  const render = (rate) => {
    rateEl.textContent = format(rate);
    slider.value = rate;
    presetButtons.forEach((b) => b.classList.toggle("active", parseFloat(b.dataset.speed) === rate));
  };

  // 保存 + ページへ反映
  const apply = async (rate) => {
    rate = clamp(rate);
    render(rate);
    chrome.storage.local.set({ playbackRate: rate });
    if (!isPrime) return;
    const res = await sendMessageWithInject(tab.id, { type: "SET_SPEED", value: rate });
    showStatus(res ? "" : "反映できませんでした。ページを再読み込みしてください");
  };

  // 初期表示
  chrome.storage.local.get("playbackRate", (data) => {
    render(clamp(Number(data.playbackRate) || 1.0));
  });
  if (!isPrime) {
    showStatus("Prime Video の再生ページで開いてください");
  } else {
    const res = await sendMessageWithInject(tab.id, { type: "GET_SPEED" });
    if (res && res.rate) render(clamp(res.rate));
    if (res && !res.hasVideo) showStatus("動画が見つかりません（再生後に反映されます）");
  }

  // スライダー: ドラッグ中は表示のみ、離したら反映
  slider.addEventListener("input", () => render(parseFloat(slider.value)));
  slider.addEventListener("change", () => apply(parseFloat(slider.value)));

  document.getElementById("dec").addEventListener("click", () => apply(parseFloat(slider.value) - STEP));
  document.getElementById("inc").addEventListener("click", () => apply(parseFloat(slider.value) + STEP));

  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => apply(parseFloat(btn.dataset.speed)));
  });
});

// content script が未注入（拡張更新直後など）の場合は注入してから再送する
async function sendMessageWithInject(tabId, msg) {
  const trySend = () => chrome.tabs.sendMessage(tabId, msg).catch(() => null);

  let res = await trySend();
  if (res) return res;

  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ["inject.js"],
      world: "MAIN",
    });
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ["content.js"],
    });
  } catch (e) {
    console.warn("[PrimeSpeed] inject failed", e);
    return null;
  }
  return trySend();
}
