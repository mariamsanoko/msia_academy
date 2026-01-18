
import React, { useState, useEffect } from 'react';
import { ViewType, User } from '../types';

interface HeaderProps {
  activeView: ViewType;
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, user, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getBreadcrumb = () => {
    switch (activeView) {
      case ViewType.DASHBOARD: return 'COMMANDE_CENTRALE / DÉCOUVRIR';
      case ViewType.STUDIO: return 'LABO_NEURAL / STUDIO_V3';
      case ViewType.LIVE: return 'SYNC_TEMPS_RÉEL / CONNEXION';
      case ViewType.ACADEMY: return 'BASE_CONNAISSANCES / ACADÉMIE';
      case ViewType.DATABASE: return 'STOCKAGE_SÉCURISÉ / COFFRE_BBD';
      case ViewType.FAQ: return 'PROTOCOLE_SUPPORT / FAQ';
      default: return 'SYSTÈME / RACINE';
    }
  };

  return (
    <header className="h-16 glass border-b border-white/5 px-8 flex items-center justify-between z-40 bg-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-black text-neutral-500 tracking-[0.3em]">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          {getBreadcrumb()}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[11px] font-black text-white tracking-widest uppercase">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">Système Synchronisé</span>
        </div>

        <div className="h-8 w-px bg-white/5"></div>

        <div className="flex items-center gap-3 group">
          <div className="text-right">
            <p className="text-[11px] font-black text-white uppercase tracking-wider">{user.username}</p>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-tighter">{user.level}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-[1px] hover:scale-110 transition-transform"
            title="Se déconnecter"
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
