import axios from 'axios'
import {
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,

    FETCH_CHAT_HISTORY_REQUEST,
    FETCH_CHAT_HISTORY_SUCCESS,
    FETCH_CHAT_HISTORY_FAIL,

    RESET_CHAT_HISTORY
} from '../constants/chatConstants'


// Action to send a user message
export const sendMessage = (message, token) => async (dispatch) => {
    try {
      dispatch({ type: SEND_MESSAGE_REQUEST });
  
      // 1. Save user message
      await fetch('http://localhost:8000/api/chatbot/save-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, sender: 'user' }),
      });
  
      // 2. Get bot response
      const response = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: message }),
      });
  
      const data = await response.json();
  
      // 3. Save bot message
      await fetch('http://localhost:8000/api/chatbot/save-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: data.response, sender: 'bot' }),
      });
  
      // 4. Dispatch success to reducer
      dispatch({
        type: SEND_MESSAGE_SUCCESS,
        payload: { userMessage: message, botMessage: data.response },
      });
  
    } catch (error) {
      dispatch({
        type: SEND_MESSAGE_FAIL,
        payload: error.message || 'Something went wrong!',
      });
    }
  };
  
  
  // Action to fetch chat history when the widget opens
  export const fetchChatHistory = (token) => async (dispatch) => {
    try {
      dispatch({ type: FETCH_CHAT_HISTORY_REQUEST });
  
      const response = await fetch('http://localhost:8000/api/chatbot/chat-history/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      dispatch({
        type: FETCH_CHAT_HISTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_CHAT_HISTORY_FAIL,
        payload: error.response ? error.response.data : error.message,
      });
    }
  };
  
  // Action to reset chat history on logout
  export const resetChatHistory = () => (dispatch) => {
    dispatch({ type: RESET_CHAT_HISTORY });
  };