import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // alt satır engelle
    sendMessage();
  }
};

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentMessage },
      { role: "assistant", content: "" },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          userId: "1",
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === "chunk") {
                aiText += parsed.content;

                let i = 0;
                const interval = setInterval(() => {
                setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = aiText.slice(0, i);
                return newMessages;
                });

                i++;

                if (i > aiText.length) {
                clearInterval(interval);
                  }
                }, 10);
                    }

              if (parsed.type === "done") {
                setLoading(false);
              }

              if (parsed.type === "error") {
                setLoading(false);
                alert(parsed.content);
              }

            } catch {}
          }
        }
      }

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gradient-to-r from-yellow-500 to-blue-500">
      
      <h1 className="text-center text-2xl font-bold mb-4">AI Chat</h1>

      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-25000 rounded-xl shadow">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%] ${
                msg.role === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              {msg.content || (loading && "...")}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mesaj yaz..."
          className="bg-white border border-gray-300 text-black placeholder:text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
        />
        <Button onClick={sendMessage}>Gönder</Button>
      </div>
    </div>
  );
}

export default App;