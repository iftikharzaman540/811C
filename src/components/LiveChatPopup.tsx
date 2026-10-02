import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, User, Headset, MoreVertical, Paperclip, Image as ImageIcon } from 'lucide-react';

export default function LiveChatPopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hello! Welcome to 8111C Customer Support. How can I help you today?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Auto-reply simulation
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'agent',
        text: 'Thank you for your message. An agent will review this shortly. This is a demonstration of the live chat interface.',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1500);
  };

  return (
    <div className="fixed top-0 h-[100dvh] left-1/2 -translate-x-1/2 w-full max-w-[400px] z-[10000] bg-[#0a0a0a] flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 bg-[#141414] border-b border-neutral-800 shrink-0 shadow-md z-10">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6 text-[#ffdf00]" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-[16px] font-bold text-white tracking-wide flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Live Support
          </h1>
          <span className="text-[10px] text-green-500">Agent is Online</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center -mr-2 rounded-full hover:bg-white/10 transition-colors">
          <MoreVertical className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#0a0a0a] flex flex-col gap-4">
        
        <div className="text-center">
          <span className="text-[10px] text-neutral-500 bg-[#1c1c1c] px-3 py-1 rounded-full">Chat started at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>

        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${msg.sender === 'user' ? 'bg-[#2a2a2a]' : 'bg-[#cc0000]'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Headset className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-md ${
                msg.sender === 'user' 
                  ? 'bg-[#1c1c1c] border border-[#ffdf00]/30 text-white rounded-br-sm' 
                  : 'bg-[#cc0000] border border-[#ff0b0b] text-white rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
            <span className={`text-[9px] text-neutral-500 mt-1 px-10`}>{msg.time}</span>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 self-start">
            <div className="w-8 h-8 rounded-full bg-[#cc0000] flex items-center justify-center shrink-0 shadow-md">
              <Headset className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[#cc0000] p-3 rounded-2xl rounded-bl-sm border border-[#ff0b0b] flex items-center gap-1.5 h-[42px]">
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#141414] border-t border-neutral-800 shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex gap-1 shrink-0 pb-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-neutral-400">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-neutral-400">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 bg-[#0a0a0a] border border-neutral-700 rounded-2xl p-1 flex items-center shadow-inner focus-within:border-[#ffdf00] transition-colors">
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="w-full bg-transparent border-none outline-none text-white text-[13px] px-3 py-2 max-h-24 min-h-[40px] resize-none overflow-y-auto placeholder:text-neutral-600"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#cc0000] text-white shrink-0 shadow-md disabled:opacity-50 disabled:bg-neutral-800 mr-1 transition-all"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



