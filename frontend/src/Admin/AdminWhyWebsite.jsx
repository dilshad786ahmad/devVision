import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../apiConfig";
import { 
  Globe, Users, Clock, Award, Zap, Coffee, BarChart, TrendingUp, 
  Layout, Save, Plus, Trash2, Edit, Sparkles, ArrowRight
} from "lucide-react";
import { SkeletonBase, AdminFormSkeleton, AdminGridSkeleton } from "../components/Skeleton";

const IconMap = { 
  Globe, Users, Clock, Award, Zap, Coffee, BarChart, TrendingUp, Layout 
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

const AdminWhyWebsite = () => {
  const [activeTab, setActiveTab] = useState("header"); // "header", "points"
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  
  const [headerForm, setHeaderForm] = useState({ badgeText: "", heading: "", description: "" });
  const [points, setPoints] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modals
  const [pointModal, setPointModal] = useState({ isOpen: false, isEdit: false, data: { title: "", description: "", icon: "Globe" }, index: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/why-website`);
      const data = res.data.data;
      setContent(data);
      if (data) {
        setHeaderForm({
          badgeText: data.badgeText || "",
          heading: data.heading || "",
          description: data.description || ""
        });
        setPoints(data.points || []);
      }
    } catch (error) {
      toast.error("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateContent = async (updatedPoints = points) => {
    setIsUpdating(true);
    try {
      await axios.put(`${API_BASE_URL}/api/why-website`, {
        ...headerForm,
        points: updatedPoints
      }, { withCredentials: true });
      toast.success("Content updated successfully!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSavePoint = (e) => {
    e.preventDefault();
    let newPoints = [...points];
    if (pointModal.isEdit) newPoints[pointModal.index] = pointModal.data;
    else newPoints.push(pointModal.data);

    setPoints(newPoints);
    setPointModal({ ...pointModal, isOpen: false });
    handleUpdateContent(newPoints);
  };

  const handleDeletePoint = (index) => {
    if (!window.confirm("Delete this point?")) return;
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    handleUpdateContent(newPoints);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] p-12 space-y-12">
      <header className="mb-12">
        <SkeletonBase className="h-4 w-32 rounded-full mb-4" />
        <SkeletonBase className="h-10 w-64 rounded-lg" />
      </header>
      <div className="flex gap-2 mb-10 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {[1,2].map(i => <SkeletonBase key={i} className="h-12 w-32 rounded-xl" />)}
      </div>
      <AdminFormSkeleton />
    </div>
  );

  return (
    <div className="relative">
      <div className="max-w-6xl">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Strategic Content</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Why Website Importance
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          <button onClick={() => setActiveTab("header")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "header" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Sparkles className="w-4 h-4" /> Header
          </button>
          <button onClick={() => setActiveTab("points")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "points" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Layout className="w-4 h-4" /> Strategic Points
          </button>
        </div>

        {activeTab === "header" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <h2 className="text-xl font-bold mb-8 text-orange-500">Main Section Content</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateContent(); }} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Badge Text</label>
                    <input type="text" value={headerForm.badgeText} onChange={e => setHeaderForm({...headerForm, badgeText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Main Heading</label>
                    <input type="text" value={headerForm.heading} onChange={e => setHeaderForm({...headerForm, heading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-colors" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Section Description</label>
                    <textarea rows="3" value={headerForm.description} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50 transition-colors"></textarea>
                  </div>
               </div>
               <div className="flex justify-end pt-4 border-t border-white/5">
                  <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
                    <Save size={18} /> {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
               </div>
            </form>
          </motion.div>
        )}

        {activeTab === "points" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                 <div className="flex flex-col">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-orange-500"><Layout className="w-5 h-5" /> Strategic Points</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Manage the 8 key reasons</p>
                 </div>
                 <button onClick={() => setPointModal({ isOpen: true, isEdit: false, data: { title: "", description: "", icon: "Globe" }, index: null })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all active:scale-95">
                    <Plus size={16} className="text-orange-500" /> New Point
                 </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {points.map((point, i) => (
                    <div key={i} className="group bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl hover:bg-white/[0.04] transition-all flex flex-col">
                       <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 group-hover:rotate-3 transition-all group-hover:bg-orange-500/10 border border-white/10">
                          <DynamicIcon name={point.icon} className="w-6 h-6" />
                       </div>
                       <h3 className="font-bold text-lg text-white mb-2">{point.title}</h3>
                       <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-3 mb-6">{point.description}</p>
                       
                       <div className="mt-auto flex gap-2 pt-6 border-t border-white/5">
                          <button onClick={() => setPointModal({ isOpen: true, isEdit: true, data: point, index: i })} className="flex-1 flex justify-center items-center gap-2 py-3 bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-blue-400 hover:bg-blue-400/10 transition-all"><Edit size={14}/> Edit</button>
                          <button onClick={() => handleDeletePoint(i)} className="flex-1 flex justify-center items-center gap-2 py-3 bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={14}/> Delete</button>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
        )}
      </div>

      <AnimatePresence>
        {pointModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPointModal({ ...pointModal, isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[3rem] shadow-2xl p-10 w-full max-w-lg">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />
                <h3 className="text-2xl font-black mb-8 italic">{pointModal.isEdit ? "Refine Point" : "New Strategic Point"}</h3>
                <form onSubmit={handleSavePoint} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Visual Symbol (Icon)</label>
                         <select value={pointModal.data.icon} onChange={e => setPointModal({...pointModal, data: {...pointModal.data, icon: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50">
                            {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                         </select>
                      </div>
                      <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Point Title</label>
                         <input required type="text" value={pointModal.data.title} onChange={e => setPointModal({...pointModal, data: {...pointModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50" />
                      </div>
                      <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Detail Description</label>
                         <textarea required rows="4" value={pointModal.data.description} onChange={e => setPointModal({...pointModal, data: {...pointModal.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-orange-500/50"></textarea>
                      </div>
                   </div>
                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setPointModal({ ...pointModal, isOpen: false })} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                      <button type="submit" className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95">Save Point</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminWhyWebsite;
