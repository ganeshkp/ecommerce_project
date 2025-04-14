import React, { useState } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
      setInput('');

      try {
        const response = await fetch('http://localhost:8000/api/chatbot/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userMessage }),
        });

        const data = await response.json();

        setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Oops! Something went wrong.' },
        ]);
      }
    }
  };

  return (
    <div className="chat-widget-container">
      {open ? (
        <div className="chat-box">
          <div className="chat-header" onClick={() => setOpen(false)}>
            ChatBot ✖
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
            />
            <button className="chat-send-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-toggle-button" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
