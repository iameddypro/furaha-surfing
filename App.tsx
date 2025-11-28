import React, { useState } from 'react';
import { Portal } from './pages/Portal';
import { AdminDashboard } from './pages/Admin';
import { AppView } from './types';
import { LayoutDashboard, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PORTAL);

  // Simple floating toggle for demo purposes
  // In production, the admin route would be protected and on a separate path
  return (
    <div className="relative">
      {currentView === AppView.PORTAL ? <Portal /> : <AdminDashboard />}
      
      <div className="fixed bottom-6 right-6 z-40 group">
        <button 
          onClick={() => setCurrentView(currentView === AppView.PORTAL ? AppView.ADMIN : AppView.PORTAL)}
          className="bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
          title={currentView === AppView.PORTAL ? "Switch to Admin Dashboard" : "Switch to Portal"}
        >
          {currentView === AppView.PORTAL ? <LayoutDashboard className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
        </button>
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {currentView === AppView.PORTAL ? "Admin View" : "Portal View"}
        </span>
      </div>
    </div>
  );
};

export default App;