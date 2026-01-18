
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message, SavedItem } from '../types';

interface UploadedImage {
  data: string;
  mimeType: string;
  preview: string;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode; position?: 'top' | 'bottom' }> = ({ text, children, position = 'top' }) => (
  <div className="group relative inline-block">
    {children}
    <div className={`pointer-events-none absolute ${position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[60] shadow-2xl backdrop-blur-md text-center`}>
      {text}
      <div className={`absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent ${position === 'top' ? 'top-full border-t-slate-900' : 'bottom-full border-b-slate-900'}`}></div>
    </div>
  </div>
);

const Studio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTarget, setSaveTarget] = useState<Message | null>(null);
  const [customSlug, setCustomSlug] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .slice(0, 50) || 'asset-sans-titre';
  };

  const initiateSave = (msg: Message) => {
    const userPrompt = messages.find(m => m.role === 'user')?.text || 'Formation Visuelle';
    setSaveTarget(msg);
    setCustomSlug(generateSlug(userPrompt));
    setCustomCategory(mode === 'image' ? 'Formation Visuelle' : 'Formation Textuelle');
    setShowSaveModal(true);
  };

  const commitToBBD = () => {
    if (!saveTarget) return;
    try {
      const existing = JSON.parse(localStorage.getItem('cs_vault') || '[]');
      const newItem: SavedItem = {
        ...saveTarget,
        id: crypto.randomUUID(),
        slug: `${customSlug}-${Date.now().toString().slice(-4)}`,
        model: mode === 'image' ? 'Gemini 2.5 Flash Image' : 'Gemini 3 Flash',
        category: customCategory || (mode === 'image' ? 'Formation Visuelle' : 'Formation Textuelle'),
        timestamp: Date.now()
      };
      localStorage.setItem('cs_vault', JSON.stringify([newItem, ...existing]));
      setShowSaveModal(false);
      setSaveTarget(null);
      alert(`Enregistrement BBD Archivé : /vault/${newItem.slug}`);
    } catch (e) {
      alert("Erreur de Sécurité : Échec de l'écriture sur le stockage persistant.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type,
          preview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!prompt.trim() && !selectedImage) return;
    const currentPrompt = prompt;
    const currentMode = mode;
    const currentRatio = aspectRatio;
    const currentImage = selectedImage;
    const userMsg: Message = { 
      role: 'user', 
      text: currentPrompt || (currentImage ? "[Requête d'analyse visuelle]" : ""), 
      image: currentImage?.preview,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (currentMode === 'text') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: currentImage 
            ? { 
                parts: [
                  { text: currentPrompt || "Identifiez et analysez les composants structurels de cette image." }, 
                  { inlineData: { data: currentImage.data, mimeType: currentImage.mimeType } }
                ] 
              }
            : currentPrompt
        });
        setMessages(prev => [...prev, { role: 'model', text: response.text || 'Aucune donnée reçue.', timestamp: Date.now() }]);
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: currentPrompt }] },
          config: { imageConfig: { aspectRatio: currentRatio } }
        });
        let imageUrl = '';
        let modelText = 'Synthèse neurale terminée. Asset généré :';
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            } else if (part.text) {
              modelText = part.text;
            }
          }
        }
        if (imageUrl) {
          setMessages(prev => [...prev, { role: 'model', text: modelText, image: imageUrl, type: 'image', timestamp: Date.now() }]);
        } else {
          setMessages(prev => [...prev, { role: 'model', text: 'Le protocole de synthèse visuelle a échoué.', type: 'status' }]);
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Erreur Système : Connexion au backend neural impossible.', type: 'status' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] relative bg-slate-50/40 rounded-[3rem] p-4 md:p-8 border border-slate-200/60 shadow-inner">
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Configuration de l'Archive</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Définir les métadonnées pour le protocole BBD</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Identifiant Unique (Slug)</label>
                <input 
                  type="text" 
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm font-semibold"
                  placeholder="Ex: analyse-creative"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Catégorie de Formation</label>
                <input 
                  type="text" 
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm font-semibold"
                  placeholder="Ex: Recherche Visuelle"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Tooltip text="Annuler et quitter le protocole d'archivage">
                <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all">Annuler</button>
              </Tooltip>
              <Tooltip text="Finaliser et synchroniser vers le stockage">
                <button onClick={commitToBBD} className="flex-1 accent-gradient py-3.5 rounded-2xl text-[11px] font-black uppercase text-white shadow-xl hover:scale-105 transition-all">Archiver BBD</button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent italic">STUDIO NEURAL</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">BBD CONNECTÉ // MODE CLAIR HAUTE-LUMINOSITÉ</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-300/40">
          <Tooltip text="Mode Conversation & Analyse Vision" position="bottom">
            <button onClick={() => setMode('text')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'text' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Vision & Texte</button>
          </Tooltip>
          <Tooltip text="Mode Génération d'Image & Synthèse Neurale" position="bottom">
            <button onClick={() => setMode('image')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'image' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>Synthèse Neurale</button>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 mb-6 pr-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6">
            <div className="w-32 h-32 rounded-[3rem] bg-white border border-slate-200 flex items-center justify-center relative shadow-sm">
              <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full animate-pulse"></div>
              <svg className="w-16 h-16 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-slate-400">Laboratoire Prêt pour l'Expérimentation</p>
              <p className="text-sm text-slate-400 mt-2 font-medium italic">Initiez la formation par un prompt textuel ou visuel.</p>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[90%] md:max-w-[75%] rounded-[2.5rem] overflow-hidden group/msg relative ${m.role === 'user' ? 'bg-indigo-50 p-6 px-8 border border-indigo-100 shadow-sm' : 'bg-white p-6 px-8 border border-slate-200 shadow-md'}`}>
              {m.role === 'model' && (
                <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover/msg:opacity-100 transition-all">
                  <Tooltip text="Archiver dans BBD">
                    <button onClick={() => initiateSave(m)} className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg transition-all">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </button>
                  </Tooltip>
                </div>
              )}
              {m.image && <img src={m.image} className="mb-6 rounded-2xl w-full h-auto object-contain max-h-[60vh] border border-slate-100 shadow-sm" alt="BBD Output" />}
              <p className={`whitespace-pre-wrap leading-relaxed text-[16px] font-medium ${m.role === 'model' ? 'text-slate-700' : 'text-slate-900'}`}>{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex flex-col gap-6 w-full max-w-lg shadow-md">
              <div className="flex items-center gap-4">
                <span className={`relative flex h-3 w-3 rounded-full ${mode === 'image' ? 'bg-purple-500 animate-pulse' : 'bg-indigo-500 animate-pulse'}`}></span>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{mode === 'image' ? 'Calcul des Pixels Neuraux...' : 'Interrogation de la Matrice...'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200/60">
        {mode === 'image' && !loading && (
          <div className="flex items-center gap-2 p-2 px-5 bg-white rounded-2xl border border-slate-200 self-start shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-3">Format Matrice</span>
            {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map(ratio => (
              <Tooltip key={ratio} text={`Format ${ratio}`}>
                <button onClick={() => setAspectRatio(ratio)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${aspectRatio === ratio ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{ratio}</button>
              </Tooltip>
            ))}
          </div>
        )}
        <div className="bg-white p-3 px-4 rounded-[3rem] border border-slate-200 shadow-xl relative transition-all focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5">
          <div className="flex items-end gap-3">
            <Tooltip text="Analyse Visuelle (Multimodale)">
              <button onClick={() => fileInputRef.current?.click()} className={`p-4 rounded-full transition-all ${selectedImage ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-400'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
            </Tooltip>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
            <div className="flex-1 relative pb-2 min-h-[4rem] flex items-center">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={mode === 'text' ? "Interroger la matrice..." : "Décrire l'asset visuel..."}
                className="w-full bg-transparent border-none focus:ring-0 resize-none py-4 text-[17px] h-14 max-h-48 leading-relaxed placeholder-slate-300 font-semibold text-slate-900"
              />
            </div>
            <Tooltip text="Transmettre le payload">
              <button disabled={loading || (!prompt.trim() && !selectedImage)} onClick={handleSend} className={`p-5 rounded-full transition-all ${loading || (!prompt.trim() && !selectedImage) ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:scale-105 shadow-xl'}`}>
                {loading ? <div className="w-6 h-6 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
