"use client";

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { Plus, Edit2, Trash2, Save, X, Calendar, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', desc: '', highlight: '', icon: '??', category: 'All' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiRequest('/admin/marketing/events');
      setEvents(res || []);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const saveEventsToServer = async (newEvents: any[]) => {
    setSaving(true);
    try {
      await apiRequest('/admin/marketing/events', {
        method: 'POST',
        body: JSON.stringify(newEvents)
      });
      setEvents(newEvents);
      toast.success('Events updated successfully');
    } catch (err) {
      toast.error('Failed to update events');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setForm({ title: '', desc: '', highlight: '', icon: '??', category: 'All' });
    setEditingIndex(-1);
  };

  const handleSave = () => {
    if (!form.title) return toast.error('Title is required');
    
    let newEvents = [...events];
    if (editingIndex === -1) {
      newEvents.push({ ...form, id: Date.now() });
    } else if (editingIndex !== null) {
      newEvents[editingIndex] = { ...events[editingIndex], ...form };
    }
    
    setEditingIndex(null);
    saveEventsToServer(newEvents);
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const newEvents = events.filter((_, i) => i !== index);
    saveEventsToServer(newEvents);
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-[#ffdf00]" />
            Promo Events
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Manage events shown on the Promo page.</p>
        </div>
        <button onClick={handleAdd} className="bg-[#ffdf00] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#ffdf00]/90">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Modal / Section */}
        {editingIndex !== null && (
          <div className="lg:col-span-1 bg-[#1a1a1a] rounded-xl border border-neutral-800 p-5 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white">{editingIndex === -1 ? 'New Event' : 'Edit Event'}</h2>
              <button onClick={() => setEditingIndex(null)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white" placeholder="e.g. Invitation Event" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Description</label>
                <input type="text" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white" placeholder="e.g. Each player you invite" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Highlight (Red Text)</label>
                <input type="text" value={form.highlight} onChange={e => setForm({...form, highlight: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white" placeholder="e.g. Get Rs 600" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Icon (Emoji)</label>
                <input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white" placeholder="e.g. ??" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Category Tab</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white">
                  <option value="All">All</option>
                  <option value="Cooperation">Cooperation</option>
                  <option value="Channel">Channel</option>
                  <option value="Daily">Daily</option>
                  <option value="Sport">Sport</option>
                  <option value="Casino">Casino</option>
                  <option value="Slots">Slots</option>
                  <option value="Games">Games</option>
                  <option value="Fishing">Fishing</option>
                </select>
              </div>

              <button onClick={handleSave} disabled={saving} className="w-full bg-[#ffdf00] text-black py-2.5 rounded-lg font-bold mt-2">
                {saving ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </div>
        )}

        {/* List Section */}
        <div className={`lg:col-span-${editingIndex !== null ? '2' : '3'} space-y-3`}>
          {events.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-8 text-center text-neutral-500">
              No events found. Add your first event!
            </div>
          ) : (
            events.map((ev, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-xl border border-neutral-800 p-4 flex items-center justify-between hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg border border-neutral-800 flex items-center justify-center text-2xl">
                    {ev.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      {ev.title}
                      <span className="bg-[#333] text-xs px-2 py-0.5 rounded text-neutral-300 font-normal">{ev.category}</span>
                    </h3>
                    <div className="text-sm text-neutral-400 mt-0.5">{ev.desc}</div>
                    {ev.highlight && <div className="text-xs text-[#ff5555] mt-1 font-bold">{ev.highlight}</div>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={() => { setForm(ev); setEditingIndex(i); }} className="w-8 h-8 bg-black rounded-lg border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(i)} className="w-8 h-8 bg-[#ff0b0b]/10 rounded-lg border border-[#ff0b0b]/20 flex items-center justify-center text-[#ff0b0b] hover:bg-[#ff0b0b]/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
