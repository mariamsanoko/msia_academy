
import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const [dbStatus, setDbStatus] = useState<'healthy' | 'warning'>('healthy');
  
  useEffect(() => {
    try {
      localStorage.getItem('cs_vault');
      setDbStatus('healthy');
    } catch (e) {
      setDbStatus('warning');
    }
  }, []);

  const items = [
    { id: ViewType.DASHBOARD, label: 'Découvrir', icon: 'M4 6h16M4 12h16M4 18h16' },
    { id: ViewType.STUDIO, label: 'Studio Neural', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: ViewType.LIVE, label: 'Connexion Directe', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: ViewType.DATABASE, label: 'Coffre / BBD', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
    { id: ViewType.ACADEMY, label: 'L\'Académie', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: ViewType.FAQ, label: 'FAQ / Support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <aside className="w-20 md:w-64 glass border-r border-white/5 flex flex-col items-center md:items-stretch py-8 z-50">
      <div className="px-6 mb-12 text-center md:text-left">
        <h1 className="hidden md:block text-2xl font-bold tracking-tight bg-gradient-to-r from-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent italic">
          Connect Studio
        </h1>
        <div className="md:hidden w-10 h-10 accent-gradient rounded-xl flex items-center justify-center font-bold mx-auto text-black">C</div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl transition-all duration-200 ${
              activeView === item.id 
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30' 
                : 'text-neutral-400 hover:text-[#D4AF37] hover:bg-white/5'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="hidden md:block font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-6 mt-auto space-y-4">
        <div className="glass p-4 rounded-2xl hidden md:block border-[#D4AF37]/10">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'healthy' ? 'bg-[#D4AF37]' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest italic">Core Engine</span>
          </div>
          <p className="text-xs font-bold text-white mb-1 tracking-tighter italic">BBD : {dbStatus === 'healthy' ? 'LOCKED' : 'OFFLINE'}</p>
          <p className="text-[9px] text-[#D4AF37] font-medium">MS I.A GOLD V3</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;