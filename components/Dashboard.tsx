
import React from 'react';
import { ViewType } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Video Section */}
      <section className="relative h-[60vh] md:h-[70vh] rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-10000 ease-linear opacity-60"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-loop-with-blue-and-purple-lights-31846-large.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

        <div className="relative h-full flex flex-col justify-end p-8 md:p-16 space-y-8 max-w-4xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Connect Studio V3.1 Live</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
              CONSTRUISEZ L' <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white">AVENIR</span> DE L'I.A.
            </h1>
            <p className="text-lg md:text-2xl text-neutral-400 font-medium max-w-2xl leading-relaxed">
              Découvrez la nouvelle frontière de la synergie multimodale. De la synthèse neurale à la synchronisation temps réel, votre architecture commence ici.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => onNavigate(ViewType.STUDIO)}
              className="accent-gradient px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:scale-105 transition-all"
            >
              Entrer dans le Studio
            </button>
            <button 
              onClick={() => onNavigate(ViewType.ACADEMY)}
              className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white glass border-white/20 hover:bg-white/10 transition-all backdrop-blur-xl"
            >
              Parcours de Formation
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate(ViewType.STUDIO)}
          className="glass p-10 rounded-[2.5rem] hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden bg-white/[0.01]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] -mr-16 -mt-16"></div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-4 italic tracking-tight uppercase">Studio Multimodal</h3>
          <p className="text-neutral-500 font-medium leading-relaxed">Moteur de synthèse haute fidélité pour données visuelles et textuelles. Archivez vos formations dans le Coffre BBD.</p>
        </div>

        <div 
          onClick={() => onNavigate(ViewType.LIVE)}
          className="glass p-10 rounded-[2.5rem] hover:border-purple-500/50 transition-all cursor-pointer group relative overflow-hidden bg-white/[0.01]"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] -mr-16 -mt-16"></div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-4 italic tracking-tight uppercase">Sync Temps-Réel</h3>
          <p className="text-neutral-500 font-medium leading-relaxed">Interaction voix et vision à faible latence via Gemini 2.5 Flash. Boucle de rétroaction neurale interactive.</p>
        </div>

        <div 
          onClick={() => onNavigate(ViewType.ACADEMY)}
          className="glass p-10 rounded-[2.5rem] hover:border-teal-500/50 transition-all cursor-pointer group relative overflow-hidden bg-white/[0.01]"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-[60px] -mr-16 -mt-16"></div>
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-8 text-teal-400 group-hover:scale-110 transition-transform shadow-inner">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-4 italic tracking-tight uppercase">Académie MS I.A</h3>
          <p className="text-neutral-500 font-medium leading-relaxed">Parcours éducatifs pour les architectes d'intelligence. Maîtrisez le prompt engineering et le design système.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
