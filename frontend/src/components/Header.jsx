import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { 
  User, LogOut, AlertCircle, Menu, X, Sun, Moon,
  Home, Info, Laptop, Cpu, FolderGit2, Banknote, 
  MessageSquareHeart, Mail, LayoutDashboard, ChevronRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute('data-menu-open', 'true');
    } else {
      document.body.style.overflow = "unset";
      document.body.removeAttribute('data-menu-open');
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.removeAttribute('data-menu-open');
    };
  }, [open]);

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Services", path: "/services", icon: Laptop },
    { name: "Skills", path: "/skills", icon: Cpu },
    { name: "Projects", path: "/projects", icon: FolderGit2 },
    { name: "Prices", path: "/Prices", icon: Banknote },
    { name: "Feedback", path: "/Clients-feedback", icon: MessageSquareHeart },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  if (user?.role === "admin") {
    links.push({ name: "Admin", path: "/admin", icon: LayoutDashboard });
  }

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setOpen(false);
  };

  return (
    <div className="fixed top-2 md:top-6 left-0 w-full z-50 px-6">
      <div className={`max-w-7xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl px-4 lg:px-4 py-2.5 lg:py-3 flex items-center justify-between transition-all duration-300 ${isDarkMode ? 'shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]' : 'shadow-none'}`}>

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <span className="text-white font-black text-xl italic">DV</span>
          </div>
          <h1 className="text-white font-bold text-xl tracking-tight hidden sm:block">
            Dev<span className="text-orange-500">Vision</span>
          </h1>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-2.5 lg:gap-2.5 xl:gap-4 items-center">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `cursor-pointer text-[11px] font-bold tracking-wider uppercase transition-all duration-300 relative py-2 ${isActive ? "text-orange-500" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative flex flex-col items-center">
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 w-full h-[2px] bg-orange-500 rounded-full"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-3 lg:gap-3 xl:gap-6">
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="text-right leading-tight">
                <p className="text-[11px] font-black text-white uppercase tracking-widest">{user.username || user.name}</p>
                <p className="text-[10px] text-gray-500 lowercase">{user.email}</p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar || null} alt={user.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-orange-500 text-sm font-black uppercase">
                      {(user.username || user.email || 'U').charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all duration-300"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all duration-300 mr-2"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <NavLink to="/signin">
                <button className="text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition">
                  Sign In
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:translate-y-0">
                  Join Now
                </button>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white relative z-[70] hover:bg-white/10 transition-colors"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* --- PREMIUM LOGOUT MODAL --- */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-[#080808] border border-white/10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-12 w-full max-w-md overflow-hidden group"
            >
              {/* Animated Accent Line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
              
              <div className="flex flex-col items-center text-center">
                {/* Icon with complex glow */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-orange-600 blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/30 rounded-[2rem] flex items-center justify-center shadow-inner">
                    <LogOut className="w-10 h-10 text-orange-500" />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase mb-3">
                  Ready to Leave?
                </h3>
                
                <p className="text-gray-400 text-sm font-medium px-4 leading-relaxed">
                  Kya aap waqai logout karna chahte hain? <br /> 
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mt-2 block">All active sessions will be terminated</span>
                </p>

                {/* Glass Action Buttons */}
                <div className="flex w-full gap-3 mt-12">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-5 px-4 bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-[1.5rem] border border-white/5 transition-all"
                  >
                    Not Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(249,115,22,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmLogout}
                    className="flex-1 py-5 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-[1.5rem] shadow-[0_15px_30px_rgba(249,115,22,0.2)] transition-all flex items-center justify-center gap-2"
                  >
                    Logout Account
                  </motion.button>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- COMPACT MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
            />
            <motion.div
              initial={{ x: "100%", borderRadius: "50px 0 0 50px" }}
              animate={{ x: 0, borderRadius: "0px 0 0 0px" }}
              exit={{ x: "100%", borderRadius: "50px 0 0 50px" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#050505] border-l border-white/10 z-[60] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Decorative background elements */}
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-orange-600/10 rounded-full blur-[100px] -z-10"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

              {/* Mobile Menu Header - More compact and higher */}
              <div className="p-3 pt-2 flex items-center justify-between border-b border-white/5 relative">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Sparkles className="text-white w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white italic">DevVision</h2>
                  </div>
                </div>
                {/* Close Button */}
                <button 
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Links Grid Area - Smaller cards and higher positioning */}
              <div className="flex-grow overflow-y-auto px-5 py-4 no-scrollbar">
                <div className="grid grid-cols-2 gap-2.5">
                  {links.map((item, i) => (
                    <NavLink 
                      key={item.name} 
                      to={item.path} 
                      onClick={() => setOpen(false)}
                      className="block"
                    >
                      {({ isActive }) => (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className={`group relative flex flex-col items-center justify-center p-4 rounded-[1.5rem] transition-all duration-500 ${
                            isActive 
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                              : "bg-white/[0.03] border border-white/5 text-gray-400 hover:bg-white/[0.08]"
                          }`}
                        >
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-white/5 group-hover:scale-110'}`}>
                              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                           </div>
                           <span className="font-bold tracking-wide text-[13px]">{item.name}</span>
                        </motion.div>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* User Profile / Auth Section at Bottom - Compact */}
              <div className="p-6 bg-[#0a0a0a] border-t border-white/10 rounded-t-[2.5rem]">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1">
                         <div className="w-full h-full rounded-lg overflow-hidden bg-orange-500/10 flex items-center justify-center">
                            {user.avatar ? (
                              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-orange-500 font-black text-lg">{(user.username || 'U').charAt(0)}</span>
                            )}
                         </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-white font-black text-sm leading-none">{user.username || user.name}</h4>
                        <p className="text-[9px] text-gray-500 mt-1">{user.email}</p>
                      </div>
                      <button onClick={toggleTheme} className="p-2.5 bg-white/5 rounded-xl text-gray-400 border border-white/10">
                         {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                      </button>
                    </div>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full py-4 bg-red-500/10 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest border border-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} /> Logout Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-center mb-2">
                      <button onClick={toggleTheme} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 border border-white/10">
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <NavLink to="/signin" onClick={() => setOpen(false)} className="w-full">
                          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Sign In</button>
                       </NavLink>
                       <NavLink to="/signup" onClick={() => setOpen(false)} className="w-full">
                          <button className="w-full py-4 bg-orange-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Join Now</button>
                       </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
