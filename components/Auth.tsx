
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: (username: string, email: string, role: 'user' | 'admin') => void;
}

type AuthStep = 'FORM' | 'CAPTCHA' | 'TWO_FACTOR';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('FORM');
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Form values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Captcha
  const [captchaOffset, setCaptchaOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // 2FA
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('CAPTCHA');
  };

  const handleCaptchaSuccess = () => {
    setStep('TWO_FACTOR');
  };

  const handleTwoFactorChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) value = value.slice(-1);
    
    const newCode = [...twoFactorCode];
    newCode[index] = value;
    setTwoFactorCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyFinalCode = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 1200));
    const role = isAdminMode ? 'admin' : 'user';
    onLogin(username || (isAdminMode ? 'Administrator' : 'Explorateur'), email, role);
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
      offset = Math.max(0, Math.min(offset, rect.width - handleWidth - 4));
      setCaptchaOffset(offset);
      
      if (offset >= rect.width - handleWidth - 10) {
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
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B8860B]/20 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>

      <div className="glass w-full max-w-lg rounded-[3rem] p-10 md:p-14 border border-[#D4AF37]/20 shadow-2xl relative z-10 overflow-hidden">
        
        <div className="flex justify-center gap-2 mb-10">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 'FORM' ? 'w-10 bg-[#D4AF37]' : 'w-4 bg-white/10'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 'CAPTCHA' ? 'w-10 bg-[#D4AF37]' : 'w-4 bg-white/10'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 'TWO_FACTOR' ? 'w-10 bg-[#D4AF37]' : 'w-4 bg-white/10'}`}></div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent mb-2">
            CONNECT STUDIO
          </h1>
          <p className="text-[#D4AF37]/60 text-[10px] font-black uppercase tracking-[0.4em]">
            Protocole {isAdminMode ? 'ADMINISTRATEUR' : 'SÉCURISÉ'}
          </p>
        </div>

        {step === 'FORM' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5">
              <button 
                onClick={() => {setIsLogin(true); setIsAdminMode(false);}}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin && !isAdminMode ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
              >
                User
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
                Join
              </button>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest ml-1">E-mail</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@ia-academy.ms"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#D4AF37] transition-all font-medium text-white placeholder-neutral-700"
                />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Architecte_Gold"
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#D4AF37] transition-all font-medium text-white placeholder-neutral-700"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#D4AF37] transition-all font-medium text-white placeholder-neutral-700"
                />
              </div>

              <button 
                type="submit"
                className="w-full accent-gradient py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Initialize {isAdminMode ? 'Admin' : 'Session'}
              </button>
            </form>
          </div>
        )}

        {step === 'CAPTCHA' && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-500 py-4">
            <h3 className="text-xl font-black italic text-white uppercase tracking-tight mb-2">Vérification Neurale</h3>
            <p className="text-neutral-500 text-xs font-medium mb-8 italic">Glissez la clé d'or pour continuer.</p>

            <div 
              id="captcha-track"
              className="relative w-full h-14 bg-black/60 border border-white/10 rounded-full mb-10 overflow-hidden p-1"
            >
              <div 
                className="absolute inset-y-1 left-1 bg-[#D4AF37]/20 rounded-full transition-all pointer-events-none"
                style={{ width: `${captchaOffset + 48}px` }}
              ></div>
              
              <div 
                onMouseDown={() => setIsDragging(true)}
                className={`absolute inset-y-1 w-12 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-shadow shadow-lg ${isDragging ? 'bg-[#D4AF37] scale-105' : 'bg-[#B8860B]'}`}
                style={{ left: `${captchaOffset + 4}px` }}
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black uppercase text-[#D4AF37]/40 tracking-[0.2em] select-none">
                  Activation du Flux
                </span>
              </div>
            </div>

            <button onClick={() => setStep('FORM')} className="text-neutral-500 hover:text-[#D4AF37] text-[10px] font-black uppercase tracking-widest transition-colors">
              ← Back
            </button>
          </div>
        )}

        {step === 'TWO_FACTOR' && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="mb-10">
              <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-black italic text-white uppercase tracking-tight mb-2 italic">2FA Verified Access</h3>
              <p className="text-neutral-500 text-xs font-medium">
                Saisissez le code envoyé à <br/>
                <span className="text-[#D4AF37] font-bold">{email || 'votre email'}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2 mb-10">
              {twoFactorCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`2fa-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleTwoFactorChange(idx, e.target.value)}
                  className="w-12 h-16 bg-black/60 border border-white/10 rounded-2xl text-center text-xl font-black text-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all"
                />
              ))}
            </div>

            {isVerifying ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest animate-pulse italic">Synchronisation...</p>
              </div>
            ) : (
              <button onClick={() => setTwoFactorCode(['', '', '', '', '', ''])} className="text-neutral-500 hover:text-white text-[10px] font-black uppercase tracking-widest">
                Resend Code
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;