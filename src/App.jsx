import { useState } from "react";

function App() {
  const [jobTitle, setJobTitle] = useState("");
  const [inputJobTitle, setInputJobTitle] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startChat = () => {
    if (inputJobTitle.trim()) {
      setJobTitle(inputJobTitle.trim());
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ Simulated response for local testing
      await new Promise((res) => setTimeout(res, 500)); // fake delay

      const botMessage = {
        role: "bot",
        text: `This is a test response to "${input}" from the AI (job title: ${jobTitle}).`,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Mock error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!jobTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg p-6 rounded-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>
          <p className="mb-4">Enter your job title to begin:</p>
          <input
            className="w-full border rounded p-2 mb-3"
            placeholder="e.g. Marketing Manager"
            value={inputJobTitle}
            onChange={(e) => setInputJobTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startChat()}
          />
          <button
            onClick={startChat}
            className="w-full bg-green-600 text-white rounded p-2"
          >
            Start Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 items-center p-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded p-4 mb-4 flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-2 rounded max-w-[80%] ${
              msg.role === "user"
                ? "bg-green-100 self-end ml-auto"
                : "bg-gray-200 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-sm text-gray-500 mt-2">Bot is typing...</div>
        )}
      </div>

      <div className="w-full max-w-xl flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
