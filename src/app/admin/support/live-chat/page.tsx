"use client";
import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/utils/api';
import { MessageSquare, Send, CheckCircle, Clock, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLiveChatPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChats = async () => {
    try {
      const res = await apiRequest('/admin/support/tickets?page=1&limit=50');
      // Filter only open live chats
      const liveChats = (res.data || []).filter((t: any) => t.subject === 'Live Chat' && t.status !== 'CLOSED' && t.status !== 'RESOLVED');
      setChats(liveChats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveChat = async (id: string) => {
    try {
      const res = await apiRequest('/admin/support/tickets/' + id);
      setActiveChat(res);
      // scroll to bottom on load
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(() => {
      fetchChats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeChatId) {
      fetchActiveChat(activeChatId);
      const interval = setInterval(() => {
        fetchActiveChat(activeChatId);
      }, 3000); // poll active chat faster
      return () => clearInterval(interval);
    }
  }, [activeChatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChatId) return;

    const textToSend = replyText;
    setReplyText('');

    // Optimistic update
    setActiveChat((prev: any) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { id: Date.now().toString(), admin_id: 'me', message: textToSend, created_at: new Date().toISOString() }
      ]
    }));
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      await apiRequest('/admin/support/tickets/' + activeChatId + '/reply', {
        method: 'POST',
        body: JSON.stringify({ message: textToSend })
      });
      fetchActiveChat(activeChatId);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    }
  };

  const closeChat = async (id: string) => {
    if (!confirm('Are you sure you want to close this chat?')) return;
    try {
      await apiRequest('/admin/support/tickets/' + id + '/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      toast.success('Chat closed');
      setActiveChatId(null);
      setActiveChat(null);
      fetchChats();
    } catch (err) {
      toast.error('Failed to close chat');
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#111] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      
      {/* Sidebar: Chat List */}
      <div className="w-1/3 bg-[#1a1a1a] border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#141414]">
          <h2 className="text-white font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#ffdf00]" />
            Active Live Chats
          </h2>
          <span className="bg-[#cc0000] text-white text-xs px-2 py-0.5 rounded-full font-bold">{chats.length}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="p-4 text-neutral-500 text-sm text-center">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="p-10 text-neutral-500 text-sm text-center flex flex-col items-center">
              <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
              No active live chats
            </div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChatId(chat.id)}
                className={`p-4 border-b border-neutral-800 cursor-pointer hover:bg-neutral-800/50 transition-colors ${activeChatId === chat.id ? 'bg-neutral-800/80 border-l-4 border-l-[#ffdf00]' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-white text-sm truncate">{chat.user?.username || chat.user?.email || 'Unknown User'}</div>
                  <div className="text-xs text-neutral-500">{new Date(chat.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div className="text-xs text-neutral-400 truncate">
                  Ticket #{chat.id.substring(0,8)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#111] relative">
        {activeChatId && activeChat ? (
          <>
            <div className="p-4 border-b border-neutral-800 bg-[#141414] flex justify-between items-center shadow-sm z-10">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  {activeChat.user?.username || activeChat.user?.email || 'Unknown User'}
                </h3>
                <span className="text-xs text-neutral-500">User ID: {activeChat.user_id}</span>
              </div>
              <button 
                onClick={() => closeChat(activeChat.id)}
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Close Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages?.map((msg: any) => {
                const isAdmin = msg.admin_id !== null;
                const isSystem = msg.admin_id === 'system_bot';
                
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl p-3 ${isAdmin ? (isSystem ? 'bg-neutral-800 text-neutral-300' : 'bg-[#cc0000] text-white rounded-tr-sm') : 'bg-neutral-800 text-white rounded-tl-sm border border-neutral-700'}`}>
                      {isSystem && <div className="text-[10px] text-neutral-500 mb-1 font-bold">Auto-Reply Bot</div>}
                      {msg.attachment && (
                        <img src={msg.attachment} alt="attachment" className="rounded-lg mb-2 max-w-full" />
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      <div className={`text-[10px] mt-1 flex items-center gap-1 ${isAdmin ? 'text-white/60 justify-end' : 'text-neutral-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#141414] border-t border-neutral-800">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-[#1a1a1a] border border-neutral-700 rounded-lg px-4 py-3 text-white outline-none focus:border-[#ffdf00] transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-[#ffdf00] text-black px-6 rounded-lg font-bold hover:bg-[#ffdf00]/90 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 opacity-50">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p>Select a chat from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
