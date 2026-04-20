import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import ChatWindow from './components/ChatWindow'; // Don't forget this import!

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); 

  const handleLogin = (userData) => {
    setUser(userData);
    // When logging in, we close the sidebar on mobile
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="flex h-screen bg-yellow-50 font-sans overflow-hidden">
      {/* Sidebar - We pass handleLogout so the user can sign out from the sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        user={user} 
        onLogout={handleLogout} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />

      <div className="flex-1 flex flex-col relative">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-4 left-4 z-[60] bg-purple-600 text-white p-3 rounded-2xl shadow-lg"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>

        {/* Top Header */}
        <header className="h-20 bg-white border-b-4 border-yellow-100 flex items-center px-8 justify-between">
           <div className="flex items-center gap-3">
             <span className="text-4xl">🤖</span>
             <h2 className="text-2xl font-black text-purple-600 italic">
               {user ? `Buddy & ${user.name}` : "AI Buddy Explorer"}
             </h2>
           </div>
           
           {/* Visual indicator for desktop if logged in */}
           {user && (
             <div className="hidden md:flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-200">
               <span className="text-xl">{user.avatar}</span>
               <span className="font-bold text-purple-700">{user.name}</span>
             </div>
           )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-yellow-50/50 relative">
          {!user ? (
            <LoginView onLogin={handleLogin} />
          ) : (
            <ChatWindow user={user} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;