import React from 'react';

// Added onLogout and toggleSidebar to the props here!
const Sidebar = ({ isOpen, user, onLogout, toggleSidebar }) => {
  const pastAdventures = [
    { id: 1, title: "The Blue Whale", icon: "🐋" },
    { id: 2, title: "Space Journey", icon: "🚀" },
    { id: 3, title: "Dino World", icon: "🦖" },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-purple-600 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 flex flex-col shadow-2xl`}>
      
      {/* App Logo / Name */}
      <div className="p-6">
        <div className="bg-yellow-400 p-3 rounded-2xl border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0 transition-all cursor-pointer">
          <h1 className="text-purple-900 font-black text-xl text-center tracking-tighter">✨ DISCOVERY BUDDY</h1>
        </div>
        
        <button className="mt-8 w-full bg-green-400 hover:bg-green-300 text-white font-bold py-4 px-4 rounded-2xl shadow-[0_4px_0_0_#15803d] active:shadow-none active:translate-y-1 transition-all text-lg">
          + New Adventure
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 px-4 overflow-y-auto mt-4">
        <p className="text-purple-200 text-xs font-black uppercase mb-4 ml-2 tracking-widest">Your Adventures</p>
        <div className="space-y-3">
          {pastAdventures.map((chat) => (
            <div key={chat.id} className="group flex items-center p-3 rounded-2xl bg-purple-500 hover:bg-yellow-400 hover:text-purple-900 transition-all cursor-pointer border-b-4 border-purple-700 hover:border-yellow-600">
              <span className="text-2xl mr-3">{chat.icon}</span>
              <span className="font-bold truncate">{chat.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Section at Bottom (Now inside the main div) */}
      <div className="p-6 bg-purple-700 rounded-t-3xl mt-4">
        {user ? (
          <button 
            onClick={onLogout} 
            className="flex items-center gap-3 w-full hover:bg-red-500 p-2 rounded-xl transition-all group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl border-2 border-purple-300 group-hover:bg-red-100">
              {user.avatar || '🤖'}
            </div>
            <div className="text-left">
              <p className="font-black text-sm text-white">{user.name}</p>
              <p className="text-xs text-purple-300 font-bold group-hover:text-white underline">Sign Out</p>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full p-2">
            <div className="w-12 h-12 bg-purple-800 rounded-full flex items-center justify-center text-2xl text-purple-400">
              ❓
            </div>
            <p className="font-bold text-purple-400 text-sm italic">Waiting for an explorer...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;