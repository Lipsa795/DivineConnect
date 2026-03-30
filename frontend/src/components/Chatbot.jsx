// 








import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Namaste! 🙏 I'm your spiritual assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ================= HANDLE ACTION =================
  const handleAction = (action) => {
    if (action?.type === 'navigate') {
      navigate(action.to);
      setIsOpen(false);
    } else if (action?.type === 'scroll') {
      const el = document.getElementById(action.to);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  // ================= SEND TO BACKEND =================
  const sendToBackend = async (text) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chatbot/message`,
        {
          message: text,
          userId: localStorage.getItem('userId'),

          // ✅ FIXED HISTORY FORMAT
          history: messages.slice(-10).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            text: msg.text
          }))
        }
      );

      const botReply = response?.data?.reply || "Something went wrong 🙏";
      const intent = response?.data?.intent;
      const action = response?.data?.action;

      const botMessage = {
        text: botReply,
        sender: 'bot',
        intent,
        action
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chatbot error:', error);

      setMessages(prev => [
        ...prev,
        {
          text: "I'm having trouble connecting. Please try again 🙏",
          sender: 'bot'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (isLoading) return;

    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    const userMessage = { text: trimmed, sender: 'user' };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    await sendToBackend(trimmed);
  };

  // ================= ENTER KEY =================
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  // ================= SUGGESTED QUESTIONS =================
  const suggestedQuestions = [
    "I want to book a pooja",
    "How can I donate?",
    "Order pooja samagri",
    "Find temples near me",
    "Tell me about Maha Shivratri",
    "What is the significance of Puri?"
  ];

  const handleSuggestedQuestion = async (question) => {
    if (isLoading) return;

    const userMessage = { text: question, sender: 'user' };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    await sendToBackend(question);
  };

  return (
    <>
      {/* ================= TOGGLE BUTTON ================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-amber-700 text-white rounded-full p-4 shadow-lg hover:bg-amber-800 transition z-50"
      >
        {isOpen ? (
          <i className="fas fa-times text-2xl"></i>
        ) : (
          <i className="fas fa-comment-dots text-2xl"></i>
        )}
      </button>

      {/* ================= CHAT WINDOW ================= */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-amber-200">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-amber-800 to-amber-600 text-white p-4">
            <h3 className="font-semibold">Divine Assistant</h3>
            <p className="text-xs text-amber-100">Powered by Gemini AI</p>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-amber-700 text-white rounded-br-none'
                        : 'bg-white text-gray-800 shadow rounded-bl-none border border-amber-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                {msg.sender === 'bot' && msg.action && (
                  <div className="ml-2 mt-1">
                    <button
                      onClick={() => handleAction(msg.action)}
                      className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200"
                    >
                      {msg.action.type === 'navigate' && 'Proceed →'}
                      {msg.action.type === 'scroll' && 'Find Temples →'}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* LOADING */}
            {isLoading && (
              <div className="bg-white p-3 rounded-xl shadow text-sm">
                Typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTIONS */}
          {messages.length < 3 && (
            <div className="p-3 border-t bg-white">
              <p className="text-xs mb-2">Suggested:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-xs bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              className="flex-1 px-4 py-2 border rounded-full text-sm"
              disabled={isLoading}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-amber-700 text-white w-10 h-10 rounded-full"
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;