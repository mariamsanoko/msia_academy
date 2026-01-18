
import React, { useState, useEffect } from 'react';
import { ViewType, User } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';
import LiveConnect from './components/LiveConnect';
import Academy from './components/Academy';
import Database from './components/Database';
import FAQ from './components/FAQ';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cs_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (username: string, email: string, role: 'user' | 'admin' = 'user') => {
    const newUser: User = { 
      username, 
      email, 
      level: role === 'admin' ? 'Master Architect' : 'Architecte Lvl 01', 
      role,
      isLoggedIn: true 
    };
    setUser(newUser);
    localStorage.setItem('cs_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cs_user');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard onNavigate={setActiveView} />;
      case ViewType.STUDIO:
        return <Studio />;
      case ViewType.LIVE:
        return <LiveConnect />;
      case ViewType.ACADEMY:
        return <Academy user={user} />;
      case ViewType.DATABASE:
        return <Database />;
      case ViewType.FAQ:
        return <FAQ />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-neutral-100 overflow-hidden font-sans">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header activeView={activeView} user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;