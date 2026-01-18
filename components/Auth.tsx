
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: (username: string, email: string, role: 'user' | 'admin') => void;
}

type AuthStep = 'FORM' | 'CAPTCHA' | 'TWO_FACTOR';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('FORM');
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [captchaOffset, setCaptchaOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setStep('CAPTCHA');
  };

  const handleCaptchaSuccess = () => {
    setStep('TWO_FACTOR');
  };

  const handleTwoFactorChange = (index: number, value: string) => {
    const val = value.replace(/[^0-9]/g, '').slice(-1);
    const newCode = [...twoFactorCode];
    newCode[index] = val;
    setTwoFactorCode(newCode);

    if (val && index < 5) {
      const nextInput = document.getElementById(`2fa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyFinalCode = async () => {
    setIsVerifying(true);
    // Simulation d'une vérification sécurisée
    await new Promise(r => setTimeout(r, 1500));
    const role = isAdminMode ? 'admin' : 'user';
    const finalUsername = username || (isAdminMode ? 'Administrateur' : email.split('@')[0]);
    onLogin(finalUsername, email, role);
  };

  useEffect(() => {
    if (twoFactorCode.every(digit => digit !== '')) {
      verifyFinalCode();
    }
  }, [twoFactorCode]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const track = document.getElementById('captcha-track');
    if (track) {
      const rect = track.getBoundingClientRect();
      const handleWidth = 48;
      let offset = e.clientX - rect.left - handleWidth / 2;
      offset = Math.max(0, Math.min(offset, rect.width - handleWidth - 6));
      setCaptchaOffset(offset);
      
      if (offset >= rect.width - handleWidth - 12) {
        setIsDragging(false);
        handleCaptchaSuccess();
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (captchaOffset < 200) setCaptchaOffset(0);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Gold Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#B8860B]/10 rounded-full blur-[160px] animate-pulse delay-1000"></div>
      </div>

      <div className="glass w-full max-w-lg rounded-[3rem] p-10 md:p-14 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] relative z-10 overflow-hidden">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-3 mb-12">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 'FORM' ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/10'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 'CAPTCHA' ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/10'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 'TWO_FACTOR' ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/10'}`}></div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter bg-gradient-to-r from-[#D4AF37] via-[#F9E29C] to-[#B8860B] bg-clip-text text-transparent mb-2 text-glow-gold">
            CONNECT STUDIO
          </h1>
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] opacity-70">
            MS I.A ACADEMY // {isAdminMode ? 'ACCÈS MASTER' : 'PORTAIL ARCHITECTE'}
          </p>
        </div>

        {step === 'FORM' && (
          <div className="animate-fade-in space-y-8">
            <div className="flex p-1 bg-black/60 rounded-2xl border border-white/5">
              <button 
                onClick={() => {setIsLogin(true); setIsAdminMode(false);}}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin && !isAdminMode ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
              >
                Utilisateur
              </button>
              <button 
                onClick={() => {setIsLogin(true); setIsAdminMode(true);}}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAdminMode ? 'bg-[#B8860B] text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => {setIsLogin(false); setIsAdminMode(false);}}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
              >
                Rejoindre
              </button>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest ml-1">Canal E-mail</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@ia-academy.ms"
                  className="w-full bg-black/80 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all font-medium text-white placeholder-neutral-800"
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest ml-1">Nom d'Architecte</label>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Gold_Architect"
                    className="w-full bg-black/80 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all font-medium text-white placeholder-neutral-800"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest ml-1">Clé d'Accès</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/80 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all font-medium text-white placeholder-neutral-800"
                />
              </div>

              <button 
                type="submit"
                className="w-full accent-gradient py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
              >
                Initialiser la Séquence
              </button>
            </form>
          </div>
        )}

        {step === 'CAPTCHA' && (
          <div className="text-center animate-fade-in py-6">
            <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-3">Validation de Flux</h3>
            <p className="text-neutral-500 text-xs font-medium mb-12 italic">Glissez le lingot pour confirmer l'intégrité neurale.</p>

            <div 
              id="captcha-track"
              className="relative w-full h-16 bg-black/80 border border-white/10 rounded-full mb-12 overflow-hidden p-1.5"
            >
              <div 
                className="absolute inset-y-1.5 left-1.5 bg-[#D4AF37]/20 rounded-full transition-all pointer-events-none"
                style={{ width: `${captchaOffset + 48}px` }}
              ></div>
              
              <div 
                onMouseDown={() => setIsDragging(true)}
                className={`absolute inset-y-1.5 w-14 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] ${isDragging ? 'bg-[#F9E29C] scale-105' : 'bg-[#D4AF37]'}`}
                style={{ left: `${captchaOffset + 6}px` }}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black uppercase text-[#D4AF37]/50 tracking-[0.3em] select-none">
                  DEVERROUILLER
                </span>
              </div>
            </div>

            <button onClick={() => setStep('FORM')} className="text-neutral-500 hover:text-[#D4AF37] text-[10px] font-black uppercase tracking-widest transition-colors">
              ← Retour au formulaire
            </button>
          </div>
        )}

        {step === 'TWO_FACTOR' && (
          <div className="text-center animate-fade-in py-4">
            <div className="mb-10">
              <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-3">Vérification 2FA</h3>
              <p className="text-neutral-500 text-xs font-medium">
                Saisissez le code de transmission envoyé à <br/>
                <span className="text-[#D4AF37] font-bold tracking-tight">{email}</span>
              </p>
            </div>

            <div className="flex justify-between gap-3 mb-12">
              {twoFactorCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`2fa-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleTwoFactorChange(idx, e.target.value)}
                  className="w-12 h-16 bg-black/80 border border-white/10 rounded-2xl text-center text-2xl font-black text-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            {isVerifying ? (
              <div className="flex flex-col items-center gap-5">
                <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.4em] animate-pulse">SÉCURISATION DU FLUX...</p>
              </div>
            ) : (
              <button 
                onClick={() => setTwoFactorCode(['', '', '', '', '', ''])} 
                className="text-neutral-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Renvoyer le code
              </button>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest leading-relaxed">
            ACCÈS RÉSERVÉ AUX ARCHITECTES ACCRÉDITÉS MS I.A <br/>
            SÉCURITÉ ÉTABLIE VIA PROTOCOLE GOLD V3.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
