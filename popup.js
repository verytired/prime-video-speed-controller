document.addEventListener("DOMContentLoaded", async () => {
  const current = document.getElementById("current");

  // 現在の設定速度を表示
  chrome.storage.local.get("playbackRate", (data) => {
    if (data.playbackRate) current.textContent = `現在: ${data.playbackRate}x`;
  });

  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const rate = parseFloat(btn.dataset.speed);
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // content.jsにメッセージ送信
      chrome.tabs.sendMessage(tab.id, { type: "SET_SPEED", value: rate });

      chrome.storage.local.set({ playbackRate: rate });
      current.textContent = `現在: ${rate}x`;
    });
  });
});
