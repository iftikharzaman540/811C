
"use client";
import React, { useState } from 'react';
import { Send, AlertCircle, Users, User } from 'lucide-react';
import { apiRequest } from '@/utils/api';
import toast from 'react-hot-toast';

export default function SendNotificationPage() {
  const [target, setTarget] = useState('ALL');
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('General');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendClick = () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }
    if (target === 'SINGLE' && !userId.trim()) {
      toast.error('User ID is required for single notification');
      return;
    }
    setIsConfirming(true);
  };

  const confirmSend = async () => {
    setIsConfirming(false);
    setIsSending(true);
    try {
      if (target === 'ALL') {
        await apiRequest('/admin/notifications/send-all', {
          method: 'POST',
          body: JSON.stringify({ title, message, type })
        });
        toast.success('Notification sent to all active users!');
      } else {
        await apiRequest('/admin/notifications/send-single', {
          method: 'POST',
          body: JSON.stringify({ userId, title, message, type })
        });
        toast.success('Notification sent to user!');
      }
      // Reset form
      setTitle('');
      setMessage('');
      setUserId('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Send className="w-6 h-6 text-[#ffdf00]" />
          Send Notification
        </h1>
      </div>

      <div className="bg-[#141414] border border-neutral-800 rounded-xl p-6 max-w-2xl">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTarget('ALL')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors ${target === 'ALL' ? 'bg-[#ffdf00] text-black' : 'bg-[#1c1c1c] text-neutral-400 hover:bg-[#2a2a2a]'}`}
          >
            <Users className="w-5 h-5" /> Send to All Users
          </button>
          <button
            onClick={() => setTarget('SINGLE')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors ${target === 'SINGLE' ? 'bg-[#ffdf00] text-black' : 'bg-[#1c1c1c] text-neutral-400 hover:bg-[#2a2a2a]'}`}
          >
            <User className="w-5 h-5" /> Send to Single User
          </button>
        </div>

        <div className="space-y-4">
          {target === 'SINGLE' && (
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter exact User ID"
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffdf00]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Important Update"
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffdf00]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Notification Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. We have added new games to the platform."
              rows={4}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffdf00] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Notification Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffdf00]"
            >
              <option value="General">General</option>
              <option value="Important">Important</option>
              <option value="Game">Game</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="Bonus">Bonus</option>
              <option value="Promotion">Promotion</option>
            </select>
          </div>

          <button
            onClick={handleSendClick}
            disabled={isSending}
            className="w-full mt-6 bg-[#ff0b0b] text-white font-bold py-3 rounded-lg hover:bg-[#cc0000] transition-colors shadow-lg disabled:opacity-50"
          >
            {isSending ? 'Sending...' : (target === 'ALL' ? 'Send to All Users' : 'Send Notification')}
          </button>
        </div>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#141414] border border-neutral-800 p-6 rounded-xl w-full max-w-md">
            <div className="flex items-center gap-3 text-[#ffdf00] mb-4">
              <AlertCircle className="w-8 h-8" />
              <h2 className="text-xl font-bold">Confirm Broadcast</h2>
            </div>
            <p className="text-neutral-300 mb-6">
              �Are you sure you want to send this notification to {target === 'ALL' ? 'all registered active users' : 'the specified user'}?�
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2 rounded-lg font-bold text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSend}
                className="px-4 py-2 rounded-lg font-bold bg-[#ff0b0b] text-white hover:bg-[#cc0000] transition-colors"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
