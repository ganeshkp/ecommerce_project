import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, sendMessage, resetChatHistory } from '../actions/chatActions';
import './ChatWidget.css';

const ChatWidget = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { userInfo } = useSelector((state) => state.userLogin);
  const { messages, loading, error } = useSelector((state) => state.chat);

  // A flag to make sure the history is only loaded once per session
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Load chat history when the widget is opened
  useEffect(() => {
    if (open && userInfo) {
      dispatch(fetchChatHistory(userInfo.access));
    }
  }, [open, userInfo, dispatch]);

  const handleSend = () => {
    if (input.trim() && userInfo) {
      dispatch(sendMessage(input, userInfo.access));
      setInput('');
      setIsTyping(true);
    }
  };

  debugger;

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
                  <span>{msg.message}</span>
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
