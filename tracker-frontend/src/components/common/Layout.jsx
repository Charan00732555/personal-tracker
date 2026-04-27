import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 z-50 flex items-center justify-between px-4">
        <h1 className="text-xl font-black tracking-tighter text-mana-blue italic">
          SYSTEM
        </h1>
        <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 w-full md:ml-64 p-4 pt-20 md:p-8 md:pt-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto overflow-x-hidden">
          <Outlet /> {/* This is where the specific page content will render */}
        </div>
      </main>
    </div>
  );
};

export default Layout;