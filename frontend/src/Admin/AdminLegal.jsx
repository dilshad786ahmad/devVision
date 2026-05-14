import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";
import { Shield, FileText, Lock, Edit3, Save, AlertCircle, CheckCircle, ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AdminGridSkeleton, AdminFormSkeleton, SkeletonBase } from "../components/Skeleton";

export default function AdminLegal() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/legal`);
      if (res.data.success) {
        setPages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageDetails = async (slug) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/legal/${slug}`);
      if (res.data.success) {
        setSelectedPage(res.data.data);
        setEditData({ title: res.data.data.title, content: res.data.data.content });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/legal/${selectedPage.slug}`,
        editData,
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessage({ type: "success", text: "Legal content updated successfully!" });
        fetchPages();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] p-6 lg:p-10">
         <div className="max-w-6xl mx-auto space-y-10">
            <div className="space-y-4">
                <SkeletonBase className="h-10 w-64 rounded-xl" />
                <SkeletonBase className="h-4 w-96 rounded-md" />
            </div>
            {selectedPage ? <AdminFormSkeleton /> : <AdminGridSkeleton count={3} />}
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Legal & Privacy Management</h1>
            <p className="text-gray-500">Manage your website's legal documents and policies.</p>
          </div>
          {selectedPage && (
            <button 
              onClick={() => setSelectedPage(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to list
            </button>
          )}
        </div>

        {!selectedPage ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["privacy-policy", "terms-of-service", "security", "cookie-settings"].map((slug) => {
              const page = pages.find(p => p.slug === slug);
              return (
                <div 
                  key={slug}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {slug === "privacy-policy" ? <Shield className="w-6 h-6 text-orange-500" /> :
                     slug === "security" ? <Lock className="w-6 h-6 text-orange-500" /> :
                     <FileText className="w-6 h-6 text-orange-500" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2 capitalize">{slug.replace(/-/g, ' ')}</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {page ? `Last updated: ${new Date(page.lastUpdated).toLocaleDateString()}` : "Not yet initialized"}
                  </p>
                  <button 
                    onClick={() => fetchPageDetails(slug)}
                    className="w-full py-3 bg-white/5 hover:bg-orange-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Content
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
            <form onSubmit={handleUpdate} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Page Title</label>
                <input 
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Content (HTML Supported)</label>
                <textarea 
                  rows="15"
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all font-mono text-sm"
                  required
                  placeholder="<h1>Title</h1><p>Your content here...</p>"
                />
              </div>

              {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setSelectedPage(null)}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
