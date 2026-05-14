import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";
import { Shield, FileText, Lock, ChevronLeft, Clock } from "lucide-react";
import { SkeletonBase, TextSkeleton } from "../components/Skeleton";

export default function LegalPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLegalContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/legal/${slug}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchLegalContent();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <SkeletonBase className="h-12 w-12 rounded-xl mb-6" />
          <SkeletonBase className="h-12 md:h-16 w-3/4 rounded-2xl" />
          <div className="flex gap-4">
             <SkeletonBase className="h-4 w-32 rounded" />
             <SkeletonBase className="h-4 w-32 rounded" />
          </div>
          <div className="space-y-8 pt-10">
            <TextSkeleton lines={6} />
            <TextSkeleton lines={4} />
            <TextSkeleton lines={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-8">{error || "Page not found"}</p>
        <Link to="/" className="px-6 py-3 bg-orange-500 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  const getIcon = (slug) => {
    switch (slug) {
      case "privacy-policy": return <Shield className="w-8 h-8 text-orange-500" />;
      case "terms-of-service": return <FileText className="w-8 h-8 text-orange-500" />;
      case "security": return <Lock className="w-8 h-8 text-orange-500" />;
      default: return <FileText className="w-8 h-8 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-12 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="mb-16">
          <div className="mb-6">{getIcon(slug)}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{data.title}</h1>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
            <span className="text-orange-500/80 font-medium">Freelance Services</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-orange max-w-none 
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
          prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-6
          prose-ul:text-gray-400 prose-li:mb-2">
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>

        {/* Contact CTA */}
        <div className="mt-24 p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Questions about these terms?</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">If you have any questions or need clarification regarding these policies, feel free to reach out.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors">
            Contact Support <ChevronLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
