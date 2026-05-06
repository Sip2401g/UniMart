import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

const AIChatbot = ({ product }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the UniMart AI assistant for this listing. I can answer questions about the **${product.title}** listed for ₹${product.price.toLocaleString()}. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    const list = messagesRef.current;
    if (list) {
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/products/ai/chat", {
        product: {
          title: product.title,
          price: product.price,
          category: product.category,
          condition: product.condition,
          description: product.description,
          sellerName: product.seller?.name,
          sellerCollege: product.seller?.college,
          isSold: product.isSold,
        },
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const reply = data.reply || "Sorry, I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: backendMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const QUICK_QUESTIONS = [
    "Is the price negotiable?",
    "What's included with this item?",
    "How do I contact the seller?",
    "Is this still available?",
  ];

  return (
    <div className="chatbot-container">
      <div className="chatbot-header" onClick={() => setOpen(!open)}>
        <div className="chatbot-header-left">
          <div className="chatbot-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z"/>
              <circle cx="9" cy="13" r="1" fill="#fff"/>
              <circle cx="15" cy="13" r="1" fill="#fff"/>
            </svg>
          </div>
          <div>
            <p className="chatbot-title">UniMart AI Assistant</p>
            <p className="chatbot-subtitle">Ask me anything about this listing</p>
          </div>
        </div>
        <div className="chatbot-toggle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {open && (
        <div className="chatbot-body">
          {messages.length <= 1 && (
            <div className="chatbot-quick">
              <p className="chatbot-quick-label">Quick questions</p>
              <div className="chatbot-quick-btns">
                {QUICK_QUESTIONS.map((q) => (
                  <button type="button" key={q} className="chatbot-quick-btn"
                    onClick={() => setInput(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chatbot-messages" ref={messagesRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="chat-msg-avatar">AI</div>
                )}
                <div className="chat-msg-bubble">
                  {msg.content.split("**").map((part, j) =>
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-msg-avatar">AI</div>
                <div className="chat-msg-bubble chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about this listing..."
              className="chatbot-input"
              disabled={loading}
            />
            <button type="button" className="chatbot-send" onClick={sendMessage} disabled={loading || !input.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="chatbot-footer-note">Powered by Groq AI (Llama 3) — responses are AI-generated</p>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;