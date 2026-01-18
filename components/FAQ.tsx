
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);

  const faqItems = [
    {
      q: "Qu'est-ce que l'Académie MS I.A propose ?",
      a: "L'Académie propose des formations pointues en ingénierie de prompt, en conception de systèmes multimodaux et en gestion de bases de données neurales (BBD). Chaque module est conçu pour faire de vous un expert de l'écosystème Gemini."
    },
    {
      q: "Comment fonctionne le Coffre BBD ?",
      a: "Le Coffre BBD (Base de Données) est votre espace de stockage persistant. Toutes les créations générées dans le Studio peuvent y être archivées avec des métadonnées personnalisées pour une utilisation ultérieure."
    },
    {
      q: "Qu'est-ce que la Connexion Directe ?",
      a: "C'est un flux temps réel utilisant Gemini 2.5 Flash Native Audio. Il permet une interaction multimodale fluide (voix et vision) avec une latence minimale, idéale pour le prototypage rapide."
    },
    {
      q: "Comment devenir un 'Architecte Lvl 04' ?",
      a: "La progression dépend de votre engagement dans l'Académie et de la complexité des formations que vous validez dans le Studio. Plus vous archivez de projets complexes, plus votre niveau d'accréditation augmente."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    // Simulation de connexion Airtable (Logic)
    // Dans un environnement réel, vous feriez :
    // fetch('https://api.airtable.com/v0/YOUR_BASE_ID/Feedback', { ... })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Transmission Airtable réussie :", formState);
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
    } catch (e) {
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700">
      <section className="text-center space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase">Questions Fréquentes</h2>
        <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-sm">Protocole d'assistance et Support Neural</p>
      </section>

      <div className="space-y-4">
        {faqItems.map((item, i) => (
          <div key={i} className="glass rounded-3xl p-8 border border-white/5 hover:border-indigo-500/30 transition-all group">
            <h3 className="text-xl font-black text-white mb-4 italic group-hover:text-indigo-400 transition-colors">
              {item.q}
            </h3>
            <p className="text-neutral-400 leading-relaxed font-medium">
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <section className="glass rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">Support Direct</h3>
              <p className="text-neutral-400 font-medium">
                Vous n'avez pas trouvé de réponse dans les clusters de données ? Envoyez une requête directe à nos agents d'intelligence.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="font-bold tracking-tight">contact@ia-academy.ms</span>
              </div>
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className="font-bold tracking-tight">Cluster Central, Silicon Matrix</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              required
              placeholder="Votre Identifiant"
              value={formState.name}
              onChange={e => setFormState({...formState, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-white"
            />
            <input 
              type="email" 
              required
              placeholder="Canal de Communication (Email)"
              value={formState.email}
              onChange={e => setFormState({...formState, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-white"
            />
            <textarea 
              required
              rows={4}
              placeholder="Détails du Signal / Message"
              value={formState.message}
              onChange={e => setFormState({...formState, message: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-white resize-none"
            />
            <button 
              disabled={isSending}
              type="submit"
              className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] text-white transition-all shadow-xl ${
                isSending ? 'bg-neutral-800' : 'accent-gradient hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSending ? 'Transmission en cours...' : 'Envoyer au Cluster Airtable'}
            </button>
            
            {status === 'success' && (
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
                Signal transmis avec succès au Coffre Airtable
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
