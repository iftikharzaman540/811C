const fs = require('fs');
let code = fs.readFileSync('src/components/LiveChatPopup.tsx', 'utf8');

// Replace everything inside the component with the new real API logic
const newComponent = `import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, User, Headset, Menu, X, Paperclip, Image as ImageIcon, Gift } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  image?: string;
}

export default function LiveChatPopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const API_URL = "https://8111c.com/api/v1";
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(API_URL + '/support/chat', {
        headers: { "Authorization": "Bearer " + token }
      });
      const data = await res.json();
      if (data && data.messages) {
        const msgs = data.messages.map((m: any) => ({
          id: m.id,
          sender: m.admin_id ? 'agent' : 'user',
          text: m.message,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          image: m.attachment || undefined
        }));
        
        // Add welcome message if chat is empty
        if (msgs.length === 0) {
           msgs.push({
             id: 'welcome',
             sender: 'agent',
             text: "Welcome to 8111C.COM Official Support\\n\\nHello! You are now connected to 8111C.COM live support.\\nStart your earning journey with us!\\n\\nIf you have any issues related to your account, deposit, or withdrawal don't worry, we're here to help!\\n\\nSend your message and our team will assist you, Thank you",
             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
           });
        }
        
        setMessages(msgs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000); // Poll for replies
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;
    
    // Optimistic UI
    const tempId = Date.now().toString();
    const newMsg = {
      id: tempId,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      await fetch(API_URL + '/support/chat/message', {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ message: text || "Image Attachment", attachment: image })
      });
      // Will be refreshed by fetchChat interval
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show typing indicator while uploading
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.url) {
         sendMessage("", data.url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[9999] bg-[#f5f5f5] flex flex-col font-sans"
    >
      {/* Header */}
      <div className="bg-[#cc0000] text-white flex items-center p-4 shadow-md z-10 relative">
        <button onClick={onClose} className="mr-3">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="font-bold text-[17px]">Online Customer Service</h1>
          <p className="text-[11px] opacity-90">We are providing 24/7 Service</p>
        </div>
        <div className="w-6" />
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-100 text-yellow-800 text-[11px] p-2 flex items-start gap-2 shadow-sm z-10 border-b border-yellow-200">
        <div className="mt-0.5">??</div>
        <p>Before recharging, please carefully copy the account number provided by the platform...</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <div className="text-center text-xs text-neutral-400 my-4">
          {new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={\`flex \${msg.sender === 'user' ? 'justify-end' : 'justify-start'}\`}>
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-[#cc0000] flex items-center justify-center text-white mr-2 shrink-0 shadow-md">
                <Headset className="w-5 h-5" />
              </div>
            )}
            
            <div className={\`max-w-[75%] rounded-2xl p-3 shadow-sm \${msg.sender === 'user' ? 'bg-[#ffdf00] text-black rounded-tr-sm' : 'bg-white text-neutral-800 rounded-tl-sm border border-neutral-100'}\`}>
              {msg.image ? (
                <div className="flex flex-col gap-2">
                  <img src={msg.image} alt="attachment" className="rounded-lg max-w-full" />
                  {msg.text && <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                </div>
              ) : (
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              )}
              <div className={\`text-[10px] mt-1.5 flex items-center gap-1 \${msg.sender === 'user' ? 'text-black/50 justify-end' : 'text-neutral-400'}\`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-[#cc0000] flex items-center justify-center text-white mr-2 shrink-0">
              <Headset className="w-5 h-5" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-neutral-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-neutral-200 p-3 flex items-center gap-2 absolute bottom-0 left-0 right-0 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
        <button className="text-neutral-500 hover:text-[#cc0000] p-2 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <button onClick={() => imageInputRef.current?.click()} className="text-neutral-500 hover:text-[#cc0000] p-2 transition-colors">
          <ImageIcon className="w-6 h-6" />
        </button>

        <div className="flex-1 bg-[#f5f5f5] rounded-full px-4 py-2 border border-neutral-200 focus-within:border-[#ffdf00] focus-within:bg-white transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Please enter your message..."
            className="w-full bg-transparent outline-none text-sm text-neutral-800 placeholder-neutral-400"
          />
        </div>
        
        <button 
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className={\`p-2.5 rounded-full flex items-center justify-center transition-all \${inputValue.trim() ? 'bg-[#ffdf00] text-black shadow-md hover:scale-105' : 'bg-neutral-100 text-neutral-400'}\`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/components/LiveChatPopup.tsx', newComponent);
console.log("Patched LiveChatPopup.tsx to use real Support API");
