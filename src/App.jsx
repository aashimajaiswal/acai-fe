import React, { useState } from "react";
import "./App.css";

// Import the arrow icon for the send button
import arrowIcon from "./assets/arrow.png";

function App() {
  // Whether we’ve set the job title yet
  const [jobTitle, setJobTitle] = useState("");
  const [isJobTitleSet, setIsJobTitleSet] = useState(false);

  // Chat messages
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'd like to know your job title before we continue. Please type it below."
    }
  ]);

  // Current input text
  const [inputValue, setInputValue] = useState("");

  // Send logic
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();

    // 1) Display user's message
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");

    // 2) If job title not yet set, treat this message as the job title
    if (!isJobTitleSet) {
      setJobTitle(userText);
      setIsJobTitleSet(true);

      // Bot confirms success
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Great! Your job title is now set to "${userText}". How can I help you next?`
        }
      ]);
      return;
    }

    // 3) Otherwise, we have a job title, do a normal chat request
    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Replace with your real API key, if needed
          "X-API-KEY": "YOUR_API_KEY_HERE"
        },
        body: JSON.stringify({
          messages: [
            {
              content: userText,
              role: "user"
            }
          ],
          context: {
            job_title: jobTitle
            // overrides: { retrieval_mode: "hybrid", semantic_ranker: "True" } // optional
          },
          sessionState: null
        })
      });

      const data = await response.json();

      // The backend might return { followups, message, role, sources, session_state }
      const mainAnswer = data.message || "(No main message)";
      const followups = Array.isArray(data.followups)
        ? data.followups.join(" | ")
        : "";
      const sources = Array.isArray(data.sources) ? data.sources.join(", ") : "";

      // Combine them into one text bubble for demo
      let combinedReply = mainAnswer;
      if (sources) {
        combinedReply += `\n\nSources: ${sources}`;
      }
      if (followups) {
        combinedReply += `\n\nFollowups: ${followups}`;
      }

      // Display bot's answer
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: combinedReply }
      ]);
    } catch (error) {
      console.error("Error: ", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not fetch response." }
      ]);
    }
  };

  // Send on Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Header uses a background image in CSS (see App.css) */}
      <div className="chat-header"></div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.sender === "user"
                ? "message-bubble user-bubble"
                : "message-bubble bot-bubble"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input bar with arrow icon */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage} className="send-button">
          <img src={arrowIcon} alt="Send" className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default App;
