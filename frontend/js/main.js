document.addEventListener("DOMContentLoaded", function () {
  const chatMessages = document.querySelector(".chat-messages");
  const textarea = document.querySelector("textarea");
  const sendButton = document.querySelector(".send-btn");

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addMessage = (message, isUser = false) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`;

    // Check if code
    const formattedMessage = message.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match, language, code) => {
        const highlightedCode = hljs.highlight(code.trim(), {
          language: language || "plaintext",
        }).value;
        return `
            <div class="code-block">
                <div class="code-header">
                    <span class="code-language">${
                      language || "plaintext"
                    }</span>
                    <button class="copy-button">
                        <span class="copy-icon">📋</span>
                        <span class="copy-text">Copy</span>
                    </button>
                </div>
                <pre><code class="hljs ${
                  language || ""
                }">${highlightedCode}</code></pre>
            </div>
        `;
      }
    );

    const html = `
        ${!isUser ? '<div class="message-avatar">🤖</div>' : ""}
        <div class="message-content">
            <div class="message-author">${
              isUser ? "Miki" : "AI Assistant"
            }</div>
            <div class="message-text">${formattedMessage}</div>
            <div class="message-time">${getFormattedTime()}</div>
        </div>
        ${
          isUser
            ? '<div class="message-avatar"><img src="./assets/miki.jpg" alt="miki" /></div>'
            : ""
        }
    `;

    messageDiv.innerHTML = html;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendMessage = async (message) => {
    const response = await fetch("http://localhost:3000/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.data.message;
  };

  // copy button
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".copy-button")) {
      const codeBlock = e.target.closest(".code-block");
      const code = codeBlock.querySelector("code").textContent;

      try {
        await navigator.clipboard.writeText(code);
        const button = codeBlock.querySelector(".copy-button");
        button.innerHTML =
          '<span class="copy-icon">✅</span><span class="copy-text">Copied!</span>';

        setTimeout(() => {
          button.innerHTML =
            '<span class="copy-icon">📋</span><span class="copy-text">Copy</span>';
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  });

  const handleSendMessage = async () => {
    const message = textarea.value.trim();
    if (!message) return;

    // add user message to chat
    addMessage(message, true);
    textarea.value = "";

    try {
      // Show typing indicator
      const typingDiv = document.createElement("div");
      typingDiv.className = "message ai-message typing";
      typingDiv.innerHTML =
        '<div class="message-avatar">🤖</div><div class="message-content">...</div>';
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Send message to API and get response
      const response = await sendMessage(message);

      // Remove typing indicator
      chatMessages.removeChild(typingDiv);

      // Add AI response
      addMessage(response, false);
    } catch (error) {
      // Remove typing indicator in case of error
      if (document.querySelector(".typing")) {
        chatMessages.removeChild(document.querySelector(".typing"));
      }
      addMessage("Sorry, an error occurred. Please try again later.", false);
    }
  };

  // Event listeners
  sendButton.addEventListener("click", handleSendMessage);

  textarea.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Auto-resize textarea
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});
