
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO',
  LIVE = 'LIVE',
  ACADEMY = 'ACADEMY',
  DATABASE = 'DATABASE',
  FAQ = 'FAQ'
}

export interface User {
  username: string;
  email: string;
  level: string;
  role: 'user' | 'admin';
  isLoggedIn: boolean;
}

export interface MediaPart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface Message {
  id?: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  type?: 'text' | 'image' | 'status';
  timestamp?: number;
}

export interface SavedItem extends Message {
  id: string;
  slug: string;
  model: string;
  category: string;
  timestamp: number;
}

export interface AcademyLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  icon: string;
}
