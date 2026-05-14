import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Globe, Users, Clock, Award, Zap, Coffee, BarChart, TrendingUp, 
  Layout, ArrowRight, Sparkles 
} from "lucide-react";
import { API_BASE_URL } from "../apiConfig";
import { SkeletonBase, CardSkeleton } from "./Skeleton";

const IconMap = { 
  Globe, Users, Clock, Award, Zap, Coffee, BarChart, TrendingUp, Layout 
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

export default function WhyWebsite() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/why-website`);
        if (res.data.success) {
          setContent(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching WhyWebsite content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#050505] py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <SkeletonBase className="h-6 w-32 rounded-full" />
            <SkeletonBase className="h-12 w-3/4 rounded-2xl" />
            <SkeletonBase className="h-6 w-1/2 rounded-xl" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64">
                <CardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <section className="bg-[#050505] text-white py-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
              {content.badgeText}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight leading-tight">
            {content.heading}
          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed font-light italic">
            "{content.description}"
          </p>
        </motion.div>

        {/* Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-500 flex flex-col"
            >
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:bg-orange-500/10 group-hover:border-orange-500/20">
                <DynamicIcon name={point.icon} className="w-6 h-6 text-orange-500" />
              </div>

              <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-orange-400 transition-colors">
                {point.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {point.description}
              </p>
              
              <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500/40 group-hover:text-orange-500 transition-colors">
                Key Benefit <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
