"use client";
import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { ArrowLeft, Send, CheckCircle, ShieldAlert, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TicketDetailsPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/admin/support/tickets/${params.id}`);
      setTicket(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setSending(true);
    try {
      await apiRequest(`/admin/support/tickets/${params.id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText })
      });
      setReplyText('');
      fetchTicket();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setStatusUpdating(true);
    try {
      await apiRequest(`/admin/support/tickets/${params.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      fetchTicket();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <div className="text-neutral-500 py-10">Loading ticket...</div>;
  if (!ticket) return <div className="text-neutral-500 py-10">Ticket not found</div>;

  const isClosed = ticket.status === 'CLOSED' || ticket.status === 'RESOLVED';

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/support/tickets" className="p-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isClosed ? 'bg-neutral-800 text-neutral-400' : 'bg-green-500/20 text-green-500'
              }`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-neutral-400 mt-1">Ticket #{ticket.id} • User: {ticket.user?.username || ticket.user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isClosed && (
            <button 
              onClick={() => updateStatus('RESOLVED')}
              disabled={statusUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Resolved
            </button>
          )}
          {isClosed && (
            <button 
              onClick={() => updateStatus('OPEN')}
              disabled={statusUpdating}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Reopen
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-[#111] border border-neutral-800 rounded-xl overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {ticket.messages?.map((msg: any, idx: number) => {
            const isAdmin = !!msg.admin_id;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-neutral-500">
                    {isAdmin ? 'Support Agent' : ticket.user?.username || 'User'}
                  </span>
                  <span className="text-xs text-neutral-600">•</span>
                  <span className="text-[10px] text-neutral-600">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  isAdmin 
                    ? 'bg-[#ffdf00] text-black rounded-tr-sm' 
                    : 'bg-neutral-800 text-white rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-neutral-800 bg-[#151515] shrink-0">
          {isClosed ? (
            <div className="text-center text-neutral-500 text-sm py-2">
              This ticket is closed. Reopen it to send a message.
            </div>
          ) : (
            <form onSubmit={handleReply} className="flex gap-2">
              <input 
                type="text" 
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your response to the user..."
                className="flex-1 bg-black border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-[#ffdf00] focus:outline-none"
              />
              <button 
                type="submit"
                disabled={sending || !replyText.trim()}
                className="px-6 py-3 bg-[#ffdf00] text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {sending ? '...' : <Send className="w-5 h-5" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
