import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Namaste! 🙏 I'm your spiritual assistant. How can I help you today?", sender: 'bot', intent: 'greeting' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle action from bot (navigation or scroll)
  const handleAction = (action) => {
    if (action?.type === 'navigate') {
      navigate(action.to);
      setIsOpen(false); // Close chatbot after navigation
    } else if (action?.type === 'scroll') {
      const element = document.getElementById(action.to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send to backend
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
        message: inputMessage,
        userId: localStorage.getItem('userId'),
        history: messages.slice(-10)
      });

      const botReply = response.data.reply;
      const intent = response.data.intent;
      const action = response.data.action;

      // Add bot response to chat
      const botMessage = { 
        text: botReply, 
        sender: 'bot',
        intent: intent,
        action: action
      };
      setMessages(prev => [...prev, botMessage]);

      // Auto-execute action if present
      if (action) {
        setTimeout(() => {
          handleAction(action);
        }, 1000);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting. Please try again in a moment. 🙏", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  // Suggested questions
  const suggestedQuestions = [
    "I want to book a pooja",
    "How can I donate?",
    "Order pooja samagri",
    "Find temples near me",
    "Tell me about Maha Shivaratri",
    "What is the significance of Puri?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
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

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-amber-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-800 to-amber-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-om text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold">Divine Assistant</h3>
                <p className="text-xs text-amber-100">Powered by Gemini AI</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50"
          >
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-amber-700 text-white rounded-br-none'
                        : 'bg-white text-gray-800 shadow rounded-bl-none border border-amber-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
                
                {/* Action Button - Show only for bot messages with actions */}
                {message.sender === 'bot' && message.action && (
                  <div className="flex justify-start mt-1 ml-2">
                    <button
                      onClick={() => handleAction(message.action)}
                      className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition flex items-center gap-1"
                    >
                      <i className="fas fa-arrow-right text-xs"></i>
                      {message.action.type === 'navigate' && 'Proceed →'}
                      {message.action.type === 'scroll' && 'Find Temples →'}
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow border border-amber-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div className="p-3 border-t border-amber-100 bg-white">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-amber-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything or say 'book a pooja'..."
                className="flex-1 px-4 py-2 border border-amber-300 rounded-full focus:outline-none focus:border-amber-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-amber-700 text-white w-10 h-10 rounded-full hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;






