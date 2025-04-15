import React, { useState } from "react";
import "./App.css";

function App() {
  // State to store the user’s job title
  const [jobTitle, setJobTitle] = useState("");
  // Whether we've already asked & saved the job title
  const [isJobTitleSet, setIsJobTitleSet] = useState(false);

  // The conversation messages displayed in the UI
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'd like to know your job title before we continue. Enter your just your job title below."
    }
  ]);

  // The user’s current text input
  const [inputValue, setInputValue] = useState("");

  // Send a message (either capture job title or do normal chat)
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return; // Don’t send empty messages

    // Add user’s message to our local state
    const userMessage = { sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    const userText = inputValue.trim();
    setInputValue("");

    // If job title not yet set, then treat the user’s message as the job title
    if (!isJobTitleSet) {
      setJobTitle(userText);
      setIsJobTitleSet(true);

      // Bot confirms success
      const successMsg = {
        sender: "bot",
        text: `Thanks! Your job title is set to "${userText}". How can I help you next?`
      };
      setMessages((prev) => [...prev, successMsg]);
      return;
    }

    // If job title is already set, we proceed with normal chat logic
    try {
      // Example: call your backend with user’s message + jobTitle
      const response = await fetch("/api/v1/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Replace with your real API key if needed
          "X-API-KEY": "YOUR_API_KEY_HERE"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: userText
            }
          ],
          context: {
            job_title: jobTitle
          },
          sessionState: null
        })
      });

      const data = await response.json();

      // Suppose the bot's reply is in data.messages[0].content (adjust as needed)
      const botReply =
        data.messages && data.messages.length > 0
          ? data.messages[0].content
          : "No bot reply found.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Error fetching bot response:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not fetch response from the server." }
      ]);
    }
  };

  // Send on pressing "Enter"
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Header (Optional) */}
      <div className="chat-header">
        <div className="header-star">&#x2605;</div>
      </div>

      {/* Chat messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble ${
              msg.sender === "user" ? "user-bubble" : "bot-bubble"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
