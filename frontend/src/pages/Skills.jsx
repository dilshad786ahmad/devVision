import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, Server, Layout, Cpu, Zap, Box, GitBranch, 
  MessageSquare, Brain, MessageCircle, Link, Globe, 
  Share2, Lock, Activity, Layers, Ship, RefreshCw, 
  Terminal, UploadCloud, Cloud, Shield, Wind, Grid, 
  Clock, ShieldAlert, Key, ShieldCheck, CheckSquare, 
  Monitor, TrendingUp, Search, Code, Rocket, Sparkles, ChevronRight,
  ChevronLeft, Cpu as CpuIcon
} from 'lucide-react';
import Breadcrumb from "../components/Breadcrumb";
import { CardSkeleton } from "../components/Skeleton";
import { useTheme } from "../context/ThemeContext";
import { API_BASE_URL } from "../apiConfig";

const IconMap = { 
  Database, Server, Layout, Cpu, Zap, Box, GitBranch, 
  MessageSquare, Brain, MessageCircle, Link, Globe, 
  Share2, Lock, Activity, Layers, Ship, RefreshCw, 
  Terminal, UploadCloud, Cloud, Shield, Wind, Grid, 
  Clock, ShieldAlert, Key, ShieldCheck, CheckSquare, 
  Monitor, TrendingUp, Search, Code, Rocket, Sparkles
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Code;
  return <IconComponent className={className} />;
};

export default function SkillsSection() {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/skills`);
        setContent(res.data.data);
      } catch (error) {
        console.error("Failed to load skills", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className={`${isDarkMode ? 'bg-[#050505]' : 'bg-[#f8fafc]'} min-h-screen pt-32 pb-16 px-4`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col items-center space-y-4">
          <div className={`h-6 w-32 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-full animate-pulse`} />
          <div className={`h-12 w-96 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-2xl animate-pulse`} />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64"><CardSkeleton /></div>)}
        </div>
      </div>
    </div>
  );

  const { header, categories, bestCombo } = content || {
    header: { badgeText: "Roadmap", title: "Full Stack + AI", description: "Loading roadmap details..." },
    categories: [],
    bestCombo: { items: [] }
  };

  return (
    <div className={`${isDarkMode ? 'bg-[#030303] text-white' : 'bg-[#f1f5f9] text-[#050505]'} min-h-screen pt-24 md:pt-32 pb-24 px-4 font-sans relative overflow-hidden transition-colors duration-500`}>
      {/* Background ambient effects */}
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[150px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumb />

        {/* --- HERO HEADER --- */}
        <div className="text-center mb-16 md:mb-24 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-3 px-5 py-2 rounded-full ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} mb-8 backdrop-blur-2xl`}
          >
            <Sparkles className="text-orange-500 w-3.5 h-3.5" />
            <span className={`text-[9px] font-black tracking-[0.3em] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} uppercase`}>{header?.badgeText || "Expertise"}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1] md:leading-[0.9]"
          >
            <span className={`text-transparent bg-clip-text bg-gradient-to-b ${isDarkMode ? 'from-white via-gray-100 to-gray-500' : 'from-[#050505] via-gray-700 to-gray-400'}`}>
              {header?.title?.split(" ").slice(0, -1).join(" ")} 
              <br/>
              <span className="text-orange-500">{header?.title?.split(" ").slice(-1)}</span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium opacity-80`}
          >
            {header?.description}
          </motion.p>
        </div>

        {/* --- X-AXIS SCROLLABLE NAVIGATION --- */}
        <div className="relative mb-12 md:mb-20 px-2 md:px-12 group">
          {/* Left Arrow - centered vertically */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-white backdrop-blur-md hidden md:flex items-center justify-center shadow-lg shadow-orange-500/10"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 gap-3 no-scrollbar custom-scroll-x scroll-smooth"
          >
            {categories?.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(idx)}
                className={`flex-shrink-0 px-6 py-4 md:px-8 md:py-5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                  activeCategory === idx 
                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_15px_30px_-5px_rgba(249,115,22,0.4)]" 
                    : isDarkMode 
                      ? "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                      : "bg-black/5 border-black/10 text-gray-500 hover:text-black"
                }`}
              >
                {cat.title.replace(/^\d+\.\s*/, '')}
              </button>
            ))}
          </div>

          {/* Right Arrow - centered vertically */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-[40%] -translate-y-1/2 z-20 p-3 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-white backdrop-blur-md hidden md:flex items-center justify-center shadow-lg shadow-orange-500/10"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* --- DYNAMIC SHOWCASE --- */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 min-h-[500px]">
          {/* Panel Info (Stacks on mobile) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-8 md:p-12 ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.03] border-black/10'} rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-3xl relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                
                <h2 className={`text-3xl md:text-4xl font-black mb-6 md:mb-8 ${isDarkMode ? 'text-white' : 'text-[#050505]'} leading-tight`}>
                  {categories?.[activeCategory]?.title}
                </h2>
                
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-lg leading-relaxed font-light mb-8 md:mb-12`}>
                  {categories?.[activeCategory]?.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} rounded-2xl border`}>
                      <Rocket size={18} className="text-orange-500" />
                      <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-widest`}>Industry Ready</span>
                   </div>
                   <div className={`flex items-center gap-3 p-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} rounded-2xl border`}>
                      <CpuIcon size={18} className="text-blue-500" />
                      <span className={`text-[9px] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-widest`}>Scalable Tech</span>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Skills Grid */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid sm:grid-cols-2 gap-4 md:gap-6"
              >
                {categories?.[activeCategory]?.skills?.map((skill, sIdx) => (
                  <motion.div
                    key={sIdx}
                    whileHover={{ y: -5 }}
                    className={`p-6 md:p-8 ${isDarkMode ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/10 hover:bg-black/[0.05]'} rounded-[2rem] md:rounded-[2.5rem] hover:border-orange-500/30 transition-all duration-500 group`}
                  >
                    <div className="flex items-center justify-between mb-6">
                       <div className={`w-12 h-12 md:w-14 md:h-14 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500`}>
                          <DynamicIcon name={skill.icon} className="w-6 h-6 md:w-7 md:h-7" />
                       </div>
                       <span className="text-[8px] font-black text-gray-700 tracking-widest uppercase">
                          {String(sIdx + 1).padStart(2, '0')}
                       </span>
                    </div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#050505]'} mb-3 group-hover:text-orange-500 transition-colors`}>
                      {skill.name}
                    </h3>
                    <p className="text-[11px] md:text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                      {skill.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- PREMIUM COMBO BANNER --- */}
        {bestCombo && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 md:mt-32 p-1 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[2.5rem] md:rounded-[4rem] blur-2xl opacity-10"></div>
            
            <div className={`relative ${isDarkMode ? 'bg-[#080808] border-white/10' : 'bg-white border-black/10'} border rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 overflow-hidden text-center`}>
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.05),transparent)]"></div>
               
               <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} mb-8 md:mb-12 border`}>
                  <Rocket className="text-orange-500" size={16} />
                  <span className={`text-[8px] md:text-[10px] font-black tracking-[0.2em] ${isDarkMode ? 'text-white' : 'text-[#050505]'} uppercase`}>{bestCombo.title}</span>
               </div>

               <h2 className={`text-3xl md:text-7xl font-black ${isDarkMode ? 'text-white' : 'text-[#050505]'} mb-6 md:mb-10 tracking-tight leading-[1.2] md:leading-none`}>
                  Ready for the <br className="hidden md:block" /> <span className="text-orange-500">New Era</span>
               </h2>

               <p className="text-gray-500 text-xs md:text-lg max-w-2xl mx-auto mb-10 md:mb-16 font-light leading-relaxed">
                  {bestCombo.description || "Synthesizing the most powerful technologies into a cohesive, production-ready ecosystem."}
               </p>

               <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-20">
                  {bestCombo.items?.map((item, idx) => (
                    <div key={idx} className={`px-5 py-3 md:px-8 md:py-5 ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.03] border-black/10'} border rounded-xl md:rounded-2xl backdrop-blur-xl`}>
                      <span className={`text-[10px] md:text-sm font-black ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} tracking-widest uppercase`}>
                        {item}
                      </span>
                    </div>
                  ))}
               </div>

               <button className="w-full sm:w-auto px-10 py-5 md:px-14 md:py-6 bg-orange-500 rounded-2xl md:rounded-full font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 hover:scale-105 transition-all duration-500">
                  <span className="flex items-center justify-center gap-3">
                    Start Project <ChevronRight size={18} />
                  </span>
               </button>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Custom Horizontal Scrollbar thumb */
        .custom-scroll-x::-webkit-scrollbar {
          height: 3px;
        }
        .custom-scroll-x::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scroll-x::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
