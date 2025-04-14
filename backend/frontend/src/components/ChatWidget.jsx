import React, { useState, useEffect } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // A flag to make sure the history is only loaded once per session
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Fetch chat history only when widget is opened and history isn't loaded
  useEffect(() => {
    if (open && userInfo && !historyLoaded) {
      // Fetch chat history only once
      fetch('http://localhost:8000/api/chatbot/chat-history/', {
        headers: {
          Authorization: `Bearer ${userInfo?.access}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.messages) {
            setMessages(data.messages);
          }
          // Mark history as loaded to prevent further fetching
          setHistoryLoaded(true);
        })
        .catch((err) => {
          console.error('Error loading chat history:', err);
          setMessages([]); // Set to empty if there's an error
          setHistoryLoaded(true); // Mark history as loaded even on error
        });
    }
  }, [open, userInfo, historyLoaded]);

  const handleSend = async () => {
    if (input.trim() && userInfo) {
      const userMessage = input;

      // Optimistically add the user's message to the chat
      setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
      setInput('');
      setIsTyping(true);

      try {
        debugger;
        // Send the user message to the backend to save it
        await fetch('http://localhost:8000/api/chatbot/save-message/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.access}`,
          },
          body: JSON.stringify({ message: userMessage, sender: 'user' }),
        });

        // Get bot's response from the chatbot API
        const response = await fetch('http://localhost:8000/api/chatbot/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.access}`,
          },
          body: JSON.stringify({ query: userMessage }),
        });

        debugger;
        const data = await response.json();

        // Send bot's message to the server to save it
        await fetch('http://localhost:8000/api/chatbot/save-message/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo?.access}`,
          },
          body: JSON.stringify({ message: data.response, sender: 'bot' }),
        });

        // Optimistically add the bot's response to the chat
        setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Oops! Something went wrong.' },
        ]);
      } finally {
        setIsTyping(false);
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
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender}`}>
                  <span>{msg.text}</span>
                </div>
              ))
            ) : (
              <div className="chat-message bot">
                <span>Welcome! How can I help you?</span>
              </div>
            )}
            {isTyping && (
              <div className="chat-message bot">
                <span>Bot is typing...</span>
              </div>
            )}
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
