import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Code2, BookOpenText, CheckSquare, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPlayerStats, getHunterClass } from '../../api/statsService';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getPlayerStats().then(setStats).catch(() => {});
  }, []);

  const overallLevel = stats
    ? Math.floor((stats.strengthLevel + stats.intelligenceLevel + stats.wisdomLevel + stats.agilityLevel) / 4)
    : 1;
  const hunterClass = getHunterClass(overallLevel);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Workouts', icon: <Dumbbell size={20} />, path: '/workouts' },
    { name: 'DSA Tracker', icon: <Code2 size={20} />, path: '/dsa' },
    { name: 'Daily Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { name: 'Daily Journal', icon: <BookOpenText size={20} />, path: '/journal' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col p-4 shadow-2xl z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* System Title */}
      <div className="flex justify-between items-start mb-6 px-2">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-mana-blue italic">
            SYSTEM <span className="text-white">RANK: {hunterClass}</span>
          </h1>
          <div className="h-1 w-full bg-gradient-to-r from-mana-blue to-transparent mt-1" />
        </div>
        <button 
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      {/* User Profile Card */}
      {user && (
        <Link to="/profile" className="block mb-6 px-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-mana-blue/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-mana-blue/20 border-2 border-mana-blue/50 flex items-center justify-center text-mana-blue font-black text-sm overflow-hidden group-hover:shadow-[0_0_10px_rgba(0,210,255,0.4)] transition-all">
              {user.avatarId ? (
                <img src={`/avatars/${user.avatarId}.png`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-bold truncate group-hover:text-mana-blue transition-colors">{user.username}</div>
              <div className="text-zinc-500 text-xs truncate">{user.email}</div>
            </div>
          </div>
        </Link>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 group"
          >
            <span className="group-hover:text-mana-blue group-hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]">
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-zinc-800 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;