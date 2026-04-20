import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWindow = ({ user }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Hi ${user.name}! I'm your AI Buddy. Ready for an adventure? 🚀`, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  // Real-time typing effect logic
  const simulateStreaming = (fullText) => {
    setIsTyping(true);
    let currentText = "";
    let index = 0;
    
    const aiMessageId = Date.now();
    setMessages(prev => [...prev, { id: aiMessageId, text: "", sender: 'ai' }]);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index];
        setMessages(prev => 
          prev.map(m => m.id === aiMessageId ? { ...m, text: currentText } : m)
        );
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25); // Adjust speed here (lower is faster)
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    const userMsgObj = { id: Date.now(), text: userMessage, sender: 'user' };
    
    setMessages(prev => [...prev, userMsgObj]);
    setInput('');
    setIsTyping(true);

    try {
      // Build the payload dynamically to avoid sending 'null' session IDs
      const payload = { message: userMessage };
      if (sessionId) {
        payload.session_id = sessionId;
      }

      // Call your FastAPI backend
      const response = await axios.post('http://localhost:8000/chat', payload);

      const { response: aiText, session_id: newSessionId } = response.data;
      
      setSessionId(newSessionId); 
      setIsTyping(false); 
      simulateStreaming(aiText); 

    } catch (error) {
      console.error("Backend Error:", error);
      setIsTyping(false);
      
      // Remove the empty bubble if it was created, then show error
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Oops! My brain is a little sleepy. Can you try saying that again? 😴", 
        sender: 'ai' 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-end gap-2 max-w-[85%]">
              {msg.sender === 'ai' && (
                <div className="w-10 h-10 bg-purple-100 rounded-full flex-shrink-0 flex items-center justify-center text-xl border-2 border-purple-300">
                  🤖
                </div>
              )}
              
              <div className={`p-5 rounded-[30px] text-lg font-medium shadow-sm border-4 ${
                msg.sender === 'user' 
                ? 'bg-green-400 border-green-500 text-white rounded-br-none' 
                : 'bg-white border-purple-100 text-gray-800 rounded-bl-none'
              }`}>
                {msg.text}
                {msg.text === "" && <span className="animate-pulse">...</span>}
              </div>

              {msg.sender === 'user' && (
                <div className="w-10 h-10 bg-yellow-200 rounded-full flex-shrink-0 flex items-center justify-center text-xl border-2 border-yellow-400">
                  {user.avatar || '👤'}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Thinking Indicator */}
        {isTyping && messages[messages.length - 1].sender !== 'ai' && (
           <div className="flex justify-start animate-pulse ml-12">
             <span className="text-purple-400 font-bold text-sm italic">Buddy is thinking...</span>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={handleSend} className="p-6">
        <div className="relative flex items-center bg-white rounded-[30px] border-8 border-yellow-100 shadow-lg focus-within:border-yellow-200 transition-all">
          <input
            type="text"
            value={input}
            disabled={isTyping}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTyping ? "Wait for Buddy..." : "Ask me anything..."}
            className="flex-1 p-5 rounded-[30px] outline-none text-xl font-bold bg-transparent disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isTyping} 
            className={`mr-3 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg ${
              isTyping ? 'bg-gray-300' : 'bg-purple-500 hover:bg-purple-600 text-white active:scale-90'
            }`}
          >
            {isTyping ? "⌛" : "🚀"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;