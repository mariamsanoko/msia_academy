
import React, { useState, useEffect } from 'react';
import { AcademyLesson, User } from '../types';

interface AcademyProps {
  user: User;
}

const INITIAL_LESSONS: AcademyLesson[] = [
  {
    id: '1',
    title: 'Fondamentaux du Design de Prompt',
    description: 'Maîtrisez l\'art de structurer les instructions pour obtenir des résultats fiables des LLM.',
    content: '## Introduction à l\'Ingénierie de Prompt\n\nL\'ingénierie de prompt est le processus de structuration du texte qui peut être interprété et compris par un modèle d\'IA générative.\n\n### Concepts Clés :\n1. **Prompting Zero-shot** : Fournir une tâche sans exemples.\n2. **Prompting Few-shot** : Fournir quelques exemples pour guider le modèle.\n3. **Chaîne de Pensée (CoT)** : Encourager le modèle à expliquer son raisonnement.\n\nDans cette leçon, nous explorerons comment un seul mot peut changer la précision de la réponse jusqu\'à 40%.',
    difficulty: 'Débutant',
    category: 'Texte',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  },
  {
    id: '2',
    title: 'Architectures Multimodales',
    description: 'Apprenez à connecter les flux visuels, auditifs et textuels pour des workflows complexes.',
    content: '## Combler le fossé entre les modalités\n\nLes modèles d\'IA multimodaux peuvent traiter simultanément plusieurs types de données.\n\n### Stratégies de Workflow :\n* **Fusion Tardive** : Traiter les entrées séparément et les combiner à la fin.\n* **Fusion Précoce** : Combiner les caractéristiques brutes avant le traitement profond.\n\nLes modèles Vision-Langage (VLM) sont l\'épine dorsale des assistants IA modernes.',
    difficulty: 'Intermédiaire',
    category: 'Systèmes',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
  }
];

const Academy: React.FC<AcademyProps> = ({ user }) => {
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<AcademyLesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<AcademyLesson>>({
    difficulty: 'Débutant',
    category: 'Général',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  });

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const stored = localStorage.getItem('academy_lessons');
    if (stored) {
      try {
        setLessons(JSON.parse(stored));
      } catch (e) {
        setLessons(INITIAL_LESSONS);
      }
    } else {
      setLessons(INITIAL_LESSONS);
      localStorage.setItem('academy_lessons', JSON.stringify(INITIAL_LESSONS));
    }
  }, []);

  const persistToBBD = (newLessons: AcademyLesson[]) => {
    setLessons(newLessons);
    localStorage.setItem('academy_lessons', JSON.stringify(newLessons));
  };

  const handleSaveLesson = () => {
    if (!formData.title || !formData.description || !formData.content) return;

    const lessonData: AcademyLesson = {
      id: formData.id || crypto.randomUUID(),
      title: formData.title!,
      description: formData.description!,
      content: formData.content!,
      difficulty: formData.difficulty as any || 'Débutant',
      category: formData.category || 'Général',
      icon: formData.icon || 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    };

    if (formData.id) {
      persistToBBD(lessons.map(l => l.id === formData.id ? lessonData : l));
    } else {
      persistToBBD([...lessons, lessonData]);
    }
    setIsEditing(false);
  };

  const handleDeleteLesson = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Supprimer définitivement cette formation du BBD ?')) {
      persistToBBD(lessons.filter(l => l.id !== id));
    }
  };

  if (activeLesson) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
        <button 
          onClick={() => setActiveLesson(null)}
          className="mb-8 flex items-center gap-2 text-neutral-500 hover:text-[#D4AF37] transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          ← Retour au Coffre
        </button>

        <div className="glass rounded-[3rem] p-8 md:p-12 border border-[#D4AF37]/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg className="w-48 h-48 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={activeLesson.icon} />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase">
                {activeLesson.category}
              </span>
              <span className="text-neutral-600 text-[10px] font-bold tracking-widest uppercase italic">• {activeLesson.difficulty}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 italic tracking-tighter text-white">
              {activeLesson.title}
            </h2>

            <div className="prose prose-invert max-w-none space-y-6 text-neutral-300 leading-relaxed font-medium">
              {activeLesson.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setActiveLesson(null)}
                className="accent-gradient px-8 py-4 rounded-2xl font-black text-black shadow-xl hover:scale-105 transition-all text-[10px] tracking-widest uppercase"
              >
                Terminer la Séquence Maître
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent italic tracking-tighter uppercase mb-2">Formation BBD</h2>
          <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-widest">Infrastructure du Hub de Connaissances</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => { setFormData({ difficulty: 'Débutant', category: 'Général' }); setIsEditing(true); }}
            className="accent-gradient px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-black shadow-lg"
          >
            Nouvelle Entrée de Formation
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass rounded-[2.5rem] p-8 md:p-12 border border-[#D4AF37]/20 animate-in zoom-in-95 duration-300 shadow-2xl">
          <h3 className="text-2xl font-black italic mb-8 uppercase text-[#D4AF37]">Saisie d'Architecte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Titre</label>
              <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Catégorie</label>
              <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-white" />
            </div>
          </div>
          <div className="space-y-2 mb-8">
            <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Payload (Markdown)</label>
            <textarea rows={6} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] text-white" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-[10px] font-black text-neutral-500 uppercase">Annuler</button>
            <button onClick={handleSaveLesson} className="accent-gradient px-8 py-3 rounded-xl text-[10px] font-black text-black">Valider</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {lessons.map(lesson => (
            <div key={lesson.id} className="glass p-8 rounded-[2.5rem] hover:bg-white/5 transition-all group border border-white/5 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-neutral-900 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={lesson.icon} /></svg>
                </div>
                {isAdmin && (
                  <button onClick={(e) => handleDeleteLesson(lesson.id, e)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
              <h3 className="text-2xl font-black mb-2 text-white italic">{lesson.title}</h3>
              <p className="text-neutral-500 text-sm mb-8 line-clamp-2">{lesson.description}</p>
              <button onClick={() => setActiveLesson(lesson)} className="w-full py-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded-xl font-black text-[10px] tracking-widest uppercase transition-all border border-[#D4AF37]/20">
                Charger Données Neurales
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Academy;
