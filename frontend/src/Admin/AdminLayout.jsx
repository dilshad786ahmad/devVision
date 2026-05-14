import React, { useState } from 'react';
import { NavLink, Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, X, UserCircle, Users, LogOut, Layout, Sparkles, Box, Cpu, 
  FolderGit2, Contact, BadgeDollarSign, Settings, Sun, Moon, Shield,
  ChevronRight, Bell, Search, Home, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: Sparkles, color: 'text-orange-500' },
    { name: 'Home Manager', path: '/admin/my/home', icon: Layout, color: 'text-blue-400' },
    { name: 'About Page', path: '/admin/my/about', icon: UserCircle, color: 'text-emerald-400' },
    { name: 'Service Cards', path: '/admin/my/services', icon: Box, color: 'text-purple-400' },
    { name: 'Skills Engine', path: '/admin/my/skills', icon: Cpu, color: 'text-yellow-400' },
    { name: 'Projects', path: '/admin/my/projects', icon: FolderGit2, color: 'text-pink-400' },
    { name: 'Price Plans', path: '/admin/my/prices', icon: BadgeDollarSign, color: 'text-cyan-400' },
    { name: 'Why Website', path: '/admin/my/why-website', icon: Zap, color: 'text-orange-400' },
    { name: 'Team Matrix', path: '/admin/my/team', icon: Users, color: 'text-indigo-400' },
    { name: 'Inquiries', path: '/admin/my/contact', icon: Contact, color: 'text-rose-400' },
    { name: 'Feedback', path: '/admin/my/feedback', icon: Sparkles, color: 'text-teal-400' },
    { name: 'Legal Center', path: '/admin/my/legal', icon: Shield, color: 'text-slate-400' },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/signin";
  };

  const activeLink = adminLinks.find(link => link.path === location.pathname) || { name: 'Admin Console' };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      
      {/* --- Desktop Sidebar --- */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col bg-[#080808] border-r border-white/5 relative z-50 h-screen sticky top-0"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 mb-6">
           <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <div className="min-w-[40px] h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Settings className="text-white w-5 h-5 animate-spin-slow" />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col whitespace-nowrap"
                  >
                    <span className="text-lg font-black text-white tracking-tighter leading-none uppercase">
                      Admin<span className="text-orange-500">Hub</span>
                    </span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">Control Center</span>
                  </motion.div>
                )}
              </AnimatePresence>
           </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
           {adminLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.icon && <link.icon className={`w-5 h-5 flex-shrink-0 ${link.color}`} />}
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-xs font-black uppercase tracking-widest whitespace-nowrap"
                        >
                          {link.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && isSidebarOpen && (
                      <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
           ))}
        </nav>

        {/* Sidebar Toggle & Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-4">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="w-full flex items-center justify-center p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors border border-white/5"
           >
             {isSidebarOpen ? <ChevronRight className="rotate-180" /> : <ChevronRight />}
           </button>
           
           <button 
              onClick={handleLogout}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} gap-4 py-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 group`}
           >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Terminate</span>}
           </button>
        </div>
      </motion.aside>

      {/* --- Main Content Container --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* --- Top Header --- */}
        <header className="h-20 bg-[#050505]/50 backdrop-blur-3xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-6">
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 bg-white/5 rounded-xl border border-white/10 text-white"
              >
                <Menu size={20} />
              </button>

              <div className="hidden sm:flex flex-col">
                 <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <span>System</span>
                    <ChevronRight size={10} />
                    <span className="text-orange-500/80">{activeLink.name}</span>
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tight">{activeLink.name}</h2>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5">
                 <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-white uppercase leading-none">{user?.username || 'Admin'}</span>
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter mt-1">Status: Operational</span>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20 border border-white/10">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <button onClick={toggleTheme} className="p-3 bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 hover:text-orange-500 transition-all shadow-lg">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
                 <button className="p-3 bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 transition-all relative">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-orange-500 rounded-full border-2 border-[#050505]"></span>
                 </button>
              </div>
           </div>
        </header>

        {/* --- Page Content --- */}
        <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#050505] relative">
           {/* Ambient background glows */}
           <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
           <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
           
           <div className="p-8">
              <Outlet />
           </div>
        </main>
      </div>

      {/* --- Mobile Sidebar Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0d0d0d] z-[101] flex flex-col border-r border-white/10 lg:hidden shadow-2xl"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                 <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                       <Settings className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-black uppercase">Admin<span className="text-orange-500">Hub</span></span>
                 </Link>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500"><X size={24} /></button>
              </div>
              <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                 {adminLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.path === '/admin'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      {link.icon && <link.icon size={20} />}
                      {link.name}
                    </NavLink>
                 ))}
              </nav>
              <div className="p-6 border-t border-white/5">
                 <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 font-black text-xs uppercase tracking-widest">
                    <LogOut size={18} /> Logout Session
                 </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
