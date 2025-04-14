import {
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    FETCH_CHAT_HISTORY_REQUEST,
    FETCH_CHAT_HISTORY_SUCCESS,
    FETCH_CHAT_HISTORY_FAIL,
    RESET_CHAT_HISTORY,
  } from '../constants/chatConstants';

  const initialState = {
    messages: [],
    loading: false,
    error: null,
  };

  export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CHAT_HISTORY_REQUEST:
      case SEND_MESSAGE_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_CHAT_HISTORY_SUCCESS:
        return {
          ...state,
          messages: action.payload,
          loading: false,
        };
      case SEND_MESSAGE_SUCCESS:
        return {
          ...state,
          messages: [
            ...state.messages,
            { sender: 'user', text: action.payload.userMessage },
            { sender: 'bot', text: action.payload.botMessage },
          ],
          loading: false,
        };
      case FETCH_CHAT_HISTORY_FAIL:
      case SEND_MESSAGE_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case RESET_CHAT_HISTORY:
        return {
          ...state,
          messages: [],
        };
      default:
        return state;
    }
  };