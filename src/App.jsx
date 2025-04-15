import React, { useState } from "react";
import "./App.css";
// Import the arrow icon for the send button
import arrowIcon from "./assets/arrow.png";

function App() {
  // Whether we've set the job title yet
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
      const response = await fetch("https://capps-backend-aiconnect.niceocean-c2d9e758.eastus.azurecontainerapps.io/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Replace with your real API key, if needed
          "X-API-KEY": "f3282794f91208416abfb687683a6de9416217e0d6defeb20e19cb15eb00619f"
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

      // Format followups as separate items rather than joined with |
      let followupsSection = "";
      if (Array.isArray(data.followups) && data.followups.length > 0) {
        followupsSection = (
          <div className="followups-section">
            <p className="followups-title">You might also want to ask:</p>
            <ul className="followups-list">
              {data.followups.map((item, index) => (
                <li key={index} className="followup-item">{item}</li>
              ))}
            </ul>
          </div>
        );
      }

      // Format sources as hyperlinks
      let sourcesSection = "";
      if (Array.isArray(data.sources) && data.sources.length > 0) {
        sourcesSection = (
          <div className="sources-section">
            <p className="sources-title">Sources:</p>
            <ul className="sources-list">
              {data.sources.map((source, index) => {
                const url = source.startsWith('http://') || source.startsWith('https://')
                  ? source
                  : `https://${source}`;
                return (
                  <li key={index} className="source-item">
                   <a href={url} target="_blank" rel="noopener noreferrer">{source}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }

      // Display bot's answer with formatted components
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: mainAnswer,
          followups: data.followups || [],
          sources: data.sources || []
        }
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

  // Function to render message content with potential HTML
  const renderMessageContent = (message) => {
    return (
      <>
        <div className="message-text">{message.text}</div>

        {/* Render sources if they exist */}
        {message.sources && message.sources.length > 0 && (
          <div className="sources-section">
            <p className="sources-title">Sources:</p>
            <ul className="sources-list">
              {message.sources.map((source, index) => {
                const url = source.startsWith('http://') || source.startsWith('https://')
                  ? source
                  : `https://${source}`;
                return (
                  <li key={index} className="source-item">
                    <a href={url} target="_blank" rel="noopener noreferrer">{source}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Render followups if they exist */}
        {message.followups && message.followups.length > 0 && (
          <div className="followups-section">
            <p className="followups-title">You might also want to ask:</p>
            <ul className="followups-list">
              {message.followups.map((item, index) => (
                <li key={index} className="followup-item">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
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
            {renderMessageContent(msg)}
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