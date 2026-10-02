import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, User, Headset, Menu, X, Paperclip, Image as ImageIcon, Gift } from 'lucide-react';

const AUTO_REPLIES = [
  {
    text: "Thank you for reaching out. Have a great day, and may good fortune always be with you! 🌟",
    delay: 1500
  },
  {
    text: "Send me screenshot of your issue",
    delay: 3500
  },
  {
    text: "Mohtaram customer, Assalam-o-Alaikum! 🌸 Aapka message humein mil gaya hai. Filhal customer service dusre customers ki queries handle kar rahi hai. Meherbani karke thora sabr karein, hum jald hi aapko reply karenge. Aapki samajh aur support ka shukriya! 💗",
    delay: 6000
  }
];

export default function LiveChatPopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "🎉 Welcome to 8111C.COM Official Support 🎉\n\nHello! You are now connected to 8111C.COM live support.\nStart your earning journey with us 💰\n\nIf you have any issues related to your account, deposit, or withdrawal don't worry, we're here to help!\n\nSend your message and our team will assist you, Thank you",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);
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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    if (!hasReplied) {
      setHasReplied(true);
      setIsTyping(true);

      // Send auto replies one by one
      AUTO_REPLIES.forEach((reply, index) => {
        setTimeout(() => {
          if (index > 0) setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
              id: Date.now() + index + 1,
              sender: 'agent',
              text: reply.text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            if (index < AUTO_REPLIES.length - 1) {
              setTimeout(() => setIsTyping(true), 300);
            }
          }, 1200);
        }, reply.delay);
      });
    } else {
      // After first round, just send the Urdu reply
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'agent',
          text: "Mohtaram customer, Assalam-o-Alaikum! 🌸 Aapka message humein mil gaya hai. Filhal customer service dusre customers ki queries handle kar rahi hai. Meherbani karke thora sabr karein, hum jald hi aapko reply karenge. Aapki samajh aur support ka shukriya! 💗",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 2000);
    }
  };

  return (
    <div className="fixed top-0 h-[100dvh] left-1/2 -translate-x-1/2 w-full max-w-[400px] z-[10000] bg-[#0a0a0a] flex flex-col font-sans">
      {/* Header - Blue like reference */}
      <div className="flex items-center justify-between h-14 px-4 bg-[#4a8af4] shrink-0 shadow-md z-10">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 flex items-center ml-2">
          <h1 className="text-[18px] font-bold text-white tracking-wide">8111C Support</h1>
        </div>
        <button onClick={() => setShowQuickLinks(!showQuickLinks)} className="w-8 h-8 flex items-center justify-center -mr-2 rounded-full hover:bg-white/20 transition-colors">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Quick Links Dropdown */}
      <AnimatePresence>
        {showQuickLinks && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 right-0 z-20 bg-white rounded-b-2xl shadow-2xl border-b border-neutral-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold text-neutral-800">Quick Links</h2>
                <button onClick={() => setShowQuickLinks(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100">
                  <X className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
              <div className="w-full h-[3px] bg-gradient-to-r from-green-400 to-green-500 rounded-full mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {/* Telegram */}
                <a href="https://t.me/Game8111c" target="_blank" rel="noopener noreferrer" onClick={() => setShowQuickLinks(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </div>
                  <span className="text-[13px] font-medium text-neutral-700">Telegram</span>
                </a>
                {/* WhatsApp */}
                <a href="https://whatsapp.com/channel/0029VbDJdVw7j6gCK3T1YG0i" target="_blank" rel="noopener noreferrer" onClick={() => setShowQuickLinks(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <span className="text-[13px] font-medium text-neutral-700">WhatsApp</span>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/share/1JzvPey4hQ/" target="_blank" rel="noopener noreferrer" onClick={() => setShowQuickLinks(false)} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1877F2] to-[#0C5DC7] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span className="text-[13px] font-medium text-neutral-700">Facebook</span>
                </a>
                {/* Bonus Claim */}
                <a href="/promo" onClick={() => { setShowQuickLinks(false); onClose(); }} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[13px] font-medium text-neutral-700">Bonus Claim</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close quick links */}
      {showQuickLinks && (
        <div className="absolute top-14 left-0 right-0 bottom-0 z-10 bg-black/40" onClick={() => setShowQuickLinks(false)} />
      )}

      {/* Chat Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#0a0a0a] flex flex-col gap-4">

        <div className="text-center">
          <span className="text-[10px] text-neutral-500 bg-[#1c1c1c] px-3 py-1 rounded-full">Chat started at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${msg.sender === 'user' ? 'bg-[#2a2a2a]' : 'bg-[#4a8af4]'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Headset className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-md whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#1c1c1c] border border-[#ffdf00]/30 text-white rounded-br-sm'
                  : 'bg-[#cc0000] border border-[#ff0b0b] text-white rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
            <span className="text-[9px] text-neutral-500 mt-1 px-10">{msg.time}</span>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 self-start">
            <div className="w-8 h-8 rounded-full bg-[#4a8af4] flex items-center justify-center shrink-0 shadow-md">
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
