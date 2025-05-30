const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("message-input");
const button = document.getElementById("send-button");

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;
  appendMessage("user", message);
  input.value = "";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    appendMessage("bot", data.reply || "Có lỗi xảy ra.");
  } catch {
    appendMessage("bot", "Không thể kết nối đến server.");
  }
}

button.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
// Optional: Clear input on focus
input.addEventListener("focus", () => {
  input.value = "";
});
// Optional: Clear chat window on double-click
chatWindow.addEventListener("dblclick", () => {
  chatWindow.innerHTML = "";
});
// Optional: Add a welcome message
appendMessage("bot", "Chào mừng bạn đến với chatbot! Hãy bắt đầu trò chuyện nào.");
// Optional: Add a loading indicator
const loadingIndicator = document.createElement("div");
loadingIndicator.classList.add("loading");
loadingIndicator.textContent = "Đang tải...";
chatWindow.appendChild(loadingIndicator);
// Optional: Remove loading indicator after a delay 