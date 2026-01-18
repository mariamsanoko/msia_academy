
import React, { useState, useEffect } from 'react';
import { SavedItem } from '../types';

const Database: React.FC = () => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFormation, setActiveFormation] = useState<string>('All');

  useEffect(() => {
    const vault = JSON.parse(localStorage.getItem('cs_vault') || '[]');
    setItems(vault);
    if (vault.length > 0) setSelectedId(vault[0].id);
  }, []);

  const deleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('cs_vault', JSON.stringify(updated));
    if (selectedId === id) setSelectedId(updated.length > 0 ? updated[0].id : null);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormation = activeFormation === 'All' || item.category === activeFormation;
    return matchesSearch && matchesFormation;
  });

  const selectedItem = items.find(i => i.id === selectedId);
  const formations = ['All', ...new Set(items.map(i => i.category))];

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent italic">Document Studio</h2>
          <p className="text-neutral-400 text-sm">Managing Formations & Visual Assets</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass p-2 px-4 rounded-2xl flex items-center gap-3 w-64 border border-white/5">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by slug..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden rounded-[2.5rem] border border-white/5 glass shadow-2xl">
        {/* Left Pane: Desk List */}
        <div className="w-80 border-r border-white/5 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/5 overflow-x-auto flex gap-2 custom-scrollbar">
            {formations.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFormation(f)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                  activeFormation === f ? 'bg-indigo-600 text-white' : 'bg-white/5 text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-5 cursor-pointer border-b border-white/5 transition-all group ${
                  selectedId === item.id ? 'bg-indigo-600/10 border-r-4 border-r-indigo-500' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{item.category}</span>
                  <span className="text-[9px] text-neutral-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <h4 className={`text-sm font-bold truncate ${selectedId === item.id ? 'text-white' : 'text-neutral-400'}`}>
                  /{item.slug}
                </h4>
                <p className="text-[11px] text-neutral-600 line-clamp-1 mt-1 italic">"{item.text}"</p>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-neutral-600 italic text-sm">No documents found.</div>
            )}
          </div>
        </div>

        {/* Right Pane: Document Preview */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-900/10 p-12">
          {selectedItem ? (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex items-start justify-between border-b border-white/5 pb-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase">
                      {selectedItem.model}
                    </span>
                    <span className="text-neutral-700 text-[10px] font-bold">STAMP: {selectedItem.timestamp}</span>
                  </div>
                  <h3 className="text-4xl font-extrabold text-white mb-2 italic tracking-tight">/{selectedItem.slug}</h3>
                  <p className="text-neutral-500 text-sm font-mono">DOCUMENT ID: {selectedItem.id}</p>
                </div>
                <button 
                  onClick={() => deleteItem(selectedItem.id)}
                  className="p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                  title="Wipe Record"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {selectedItem.image && (
                <div className="relative group rounded-[2rem] overflow-hidden border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-black/20">
                  <img src={selectedItem.image} alt="Visual Record" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
                </div>
              )}

              <div className="space-y-6">
                <h5 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">Generation Payload</h5>
                <div className="bg-white/5 rounded-3xl p-8 border border-white/5 shadow-inner">
                   <p className="text-lg text-neutral-200 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedItem.text}
                  </p>
                </div>
              </div>

              <div className="pt-12 grid grid-cols-2 gap-4">
                <button className="py-4 rounded-2xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-all border border-white/5 uppercase tracking-widest">
                  Export JSON Manifest
                </button>
                <button className="py-4 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-xl uppercase tracking-widest">
                  Deploy Formation
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-700 opacity-20">
               <svg className="w-24 h-24 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-xl font-bold uppercase tracking-widest italic">Document Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Database;
