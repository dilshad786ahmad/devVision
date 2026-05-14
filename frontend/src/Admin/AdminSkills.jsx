import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../apiConfig";
import { 
  Database, Server, Layout, Cpu, Zap, Box, GitBranch, 
  MessageSquare, Brain, MessageCircle, Link, Globe, 
  Share2, Lock, Activity, Layers, Ship, RefreshCw, 
  Terminal, UploadCloud, Cloud, Shield, Wind, Grid, 
  Clock, ShieldAlert, Key, ShieldCheck, CheckSquare, 
  Monitor, TrendingUp, Search, Code, Rocket, Sparkles,
  Plus, Trash2, Edit, Save, X, ChevronRight, List
} from "lucide-react";
import { SkeletonBase, AdminFormSkeleton, AdminGridSkeleton } from "../components/Skeleton";

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

const AdminSkills = () => {
  const [activeTab, setActiveTab] = useState("header"); // header, categories, combo
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Forms
  const [headerForm, setHeaderForm] = useState({ badgeText: "", title: "", description: "" });
  const [comboForm, setComboForm] = useState({ title: "", description: "", items: "" });

  // Modals
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, isEdit: false, data: { title: "", description: "" }, index: null });
  const [skillModal, setSkillModal] = useState({ isOpen: false, isEdit: false, data: { name: "", description: "", icon: "Code" }, categoryIndex: null, skillIndex: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/skills`);
      const data = res.data.data;
      setContent(data);
      if (data) {
        setHeaderForm(data.header || { badgeText: "", title: "", description: "" });
        setComboForm({
          title: data.bestCombo?.title || "",
          description: data.bestCombo?.description || "",
          items: data.bestCombo?.items?.join(", ") || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch roadmap data", error);
      toast.error("Skills data sync failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateHeader = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put(`${API_BASE_URL}/api/skills/header`, headerForm, { withCredentials: true });
      toast.success("Header updated!");
      fetchData();
    } catch (error) { toast.error("Update failed"); }
    finally { setIsUpdating(false); }
  };

  const handleUpdateCombo = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = { 
        bestCombo: { 
          ...comboForm, 
          items: comboForm.items.split(",").map(i => i.trim()).filter(Boolean) 
        } 
      };
      await axios.put(`${API_BASE_URL}/api/skills/best-combo`, payload, { withCredentials: true });
      toast.success("Best Combo updated!");
      fetchData();
    } catch (error) { toast.error("Update failed"); }
    finally { setIsUpdating(false); }
  };

  // Category Actions
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!content) return toast.error("Data not loaded yet");
    
    const updatedCategories = content.categories ? [...content.categories] : [];
    if (categoryModal.isEdit) {
      updatedCategories[categoryModal.index] = { ...updatedCategories[categoryModal.index], ...categoryModal.data };
    } else {
      updatedCategories.push({ ...categoryModal.data, skills: [] });
    }

    try {
      await axios.put(`${API_BASE_URL}/api/skills/categories`, { categories: updatedCategories }, { withCredentials: true });
      toast.success("Category saved!");
      setCategoryModal({ ...categoryModal, isOpen: false });
      fetchData();
    } catch (error) { toast.error("Operation failed"); }
  };

  const handleDeleteCategory = async (index) => {
    if (!window.confirm("Delete this entire category and all its skills?")) return;
    if (!content) return;

    const updatedCategories = content.categories.filter((_, i) => i !== index);
    try {
      await axios.put(`${API_BASE_URL}/api/skills/categories`, { categories: updatedCategories }, { withCredentials: true });
      toast.success("Category deleted!");
      fetchData();
    } catch (error) { toast.error("Delete failed"); }
  };

  // Skill Actions
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!content) return;

    const updatedCategories = [...content.categories];
    const category = { ...updatedCategories[skillModal.categoryIndex] };
    const skills = category.skills ? [...category.skills] : [];

    if (skillModal.isEdit) {
      skills[skillModal.skillIndex] = skillModal.data;
    } else {
      skills.push(skillModal.data);
    }

    category.skills = skills;
    updatedCategories[skillModal.categoryIndex] = category;

    try {
      await axios.put(`${API_BASE_URL}/api/skills/categories`, { categories: updatedCategories }, { withCredentials: true });
      toast.success("Skill saved!");
      setSkillModal({ ...skillModal, isOpen: false });
      fetchData();
    } catch (error) { toast.error("Operation failed"); }
  };

  const handleDeleteSkill = async (catIndex, skillIndex) => {
    if (!window.confirm("Delete this skill?")) return;
    if (!content) return;

    const updatedCategories = [...content.categories];
    const category = { ...updatedCategories[catIndex] };
    category.skills = category.skills.filter((_, i) => i !== skillIndex);
    updatedCategories[catIndex] = category;

    try {
      await axios.put(`${API_BASE_URL}/api/skills/categories`, { categories: updatedCategories }, { withCredentials: true });
      toast.success("Skill deleted!");
      fetchData();
    } catch (error) { toast.error("Delete failed"); }
  };

  if (loading) return (
    <div className="p-8 space-y-12">
      <AdminFormSkeleton />
      <AdminGridSkeleton count={4} />
    </div>
  );

  return (
    <div className="relative">
      <div className="max-w-6xl">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Expertise Architect</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Roadmap Manager
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          {[
            { id: "header", label: "Branding", icon: Sparkles },
            { id: "categories", label: "Knowledge Domains", icon: List },
            { id: "combo", label: "Best Combo", icon: Rocket }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          {activeTab === "header" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
               <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Sparkles className="text-orange-500" /> Section Branding</h2>
               <form onSubmit={handleUpdateHeader} className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Badge Text</label>
                    <input type="text" value={headerForm.badgeText} onChange={e => setHeaderForm({...headerForm, badgeText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Main Heading</label>
                    <input type="text" value={headerForm.title} onChange={e => setHeaderForm({...headerForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Subtext / Rationale</label>
                    <textarea rows="3" value={headerForm.description} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20">
                      <Save size={18} /> {isUpdating ? "Processing..." : "Update Branding"}
                    </button>
                  </div>
               </form>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="space-y-12">
               <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                  <h2 className="text-xl font-bold flex items-center gap-3"><List className="text-orange-500" /> Domains of Expertise</h2>
                  <button onClick={() => setCategoryModal({ isOpen: true, isEdit: false, data: { title: "", description: "" }, index: null })} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-orange-500"><Plus size={20}/></button>
               </div>

               {content?.categories?.map((cat, cIdx) => (
                 <div key={cIdx} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl space-y-8 group/card hover:bg-white/[0.04] transition-all">
                    <div className="flex justify-between items-start">
                       <div>
                          <h3 className="text-2xl font-black text-white group-hover/card:text-orange-500 transition-colors">{cat.title}</h3>
                          <p className="text-sm text-gray-500 mt-2 max-w-2xl">{cat.description}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setCategoryModal({ isOpen: true, isEdit: true, data: { title: cat.title, description: cat.description }, index: cIdx })} className="p-3 bg-white/5 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all border border-white/10"><Edit size={16}/></button>
                          <button onClick={() => handleDeleteCategory(cIdx)} className="p-3 bg-white/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-white/10"><Trash2 size={16}/></button>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {cat.skills?.map((skill, sIdx) => (
                         <div key={sIdx} className="group p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all relative overflow-hidden">
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="text-orange-500 group-hover:scale-110 transition-transform"><DynamicIcon name={skill.icon} className="w-5 h-5" /></div>
                               <span className="font-bold text-sm">{skill.name}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all relative z-10">
                               <button onClick={() => setSkillModal({ isOpen: true, isEdit: true, data: skill, categoryIndex: cIdx, skillIndex: sIdx })} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><Edit size={12}/></button>
                               <button onClick={() => handleDeleteSkill(cIdx, sIdx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={12}/></button>
                            </div>
                         </div>
                       ))}
                       <button onClick={() => setSkillModal({ isOpen: true, isEdit: false, data: { name: "", description: "", icon: "Code" }, categoryIndex: cIdx, skillIndex: null })} className="p-6 border border-dashed border-white/20 rounded-3xl flex items-center justify-center gap-2 text-gray-500 hover:border-orange-500/50 hover:text-orange-500 transition-all">
                          <Plus size={16} /> Add Expertise
                       </button>
                    </div>
                 </div>
               ))}
               
               {(!content?.categories || content.categories.length === 0) && (
                 <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                    <p className="text-gray-500 font-bold">No expertise domains defined yet.</p>
                    <button onClick={() => setCategoryModal({ isOpen: true, isEdit: false, data: { title: "", description: "" }, index: null })} className="mt-4 text-orange-500 font-black uppercase text-xs tracking-widest hover:underline">Create First Domain</button>
                 </div>
               )}
            </div>
          )}

          {activeTab === "combo" && (
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
               <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Rocket className="text-orange-500" /> Strategic Combination</h2>
               <form onSubmit={handleUpdateCombo} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Banner Heading</label>
                      <input type="text" value={comboForm.title} onChange={e => setComboForm({...comboForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Key Technologies (CSV)</label>
                      <input type="text" value={comboForm.items} onChange={e => setComboForm({...comboForm, items: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" placeholder="MERN, Next.js, AI" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Description / Market Analysis</label>
                      <textarea rows="3" value={comboForm.description} onChange={e => setComboForm({...comboForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end pt-6 border-t border-white/5">
                    <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20">
                      <Save size={18} /> {isUpdating ? "Syncing..." : "Commit Combo"}
                    </button>
                  </div>
               </form>
            </div>
          )}
        </motion.div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {categoryModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCategoryModal({ ...categoryModal, isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
              <h3 className="text-2xl font-black mb-8">{categoryModal.isEdit ? "Refine Domain" : "Register Domain"}</h3>
              <form onSubmit={handleSaveCategory} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Domain Title</label>
                    <input required type="text" value={categoryModal.data.title} onChange={e => setCategoryModal({...categoryModal, data: {...categoryModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Mission Summary</label>
                    <textarea rows="3" required value={categoryModal.data.description} onChange={e => setCategoryModal({...categoryModal, data: {...categoryModal.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                 </div>
                 <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}

        {skillModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSkillModal({ ...skillModal, isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
              <h3 className="text-2xl font-black mb-8">{skillModal.isEdit ? "Update Expertise" : "Launch Expertise"}</h3>
              <form onSubmit={handleSaveSkill} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Name</label>
                       <input required type="text" value={skillModal.data.name} onChange={e => setSkillModal({...skillModal, data: {...skillModal.data, name: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Symbol</label>
                       <select value={skillModal.data.icon} onChange={e => setSkillModal({...skillModal, data: {...skillModal.data, icon: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none">
                          {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Technical Brief</label>
                    <textarea rows="3" required value={skillModal.data.description} onChange={e => setSkillModal({...skillModal, data: {...skillModal.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                 </div>
                 <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Commit Expertise</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSkills;
