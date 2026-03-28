'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { 
 ArrowRight, 
 Layout, 
 CheckCircle2, 
 Zap, 
 Users, 
 Globe,
 Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
 const container = {
 hidden: { opacity: 0 },
 show: {
 opacity: 1,
 transition: {
 staggerChildren: 0.1
 }
 }
 };

 const item = {
 hidden: { opacity: 0, y: 20 },
 show: { opacity: 1, y: 0 }
 };

 return (
 <div className="min-h-screen bg-white dark:bg-[#1E293B]">
 <nav className="h-20 flex items-center justify-between px-10 fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-gray-100 dark:border-[#1E293B]">
 <Link href="/" className="flex items-center gap-2 text-2xl font-black text-[#1F2937] dark:text-gray-100">
 <div className="bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] p-1.5 rounded-lg text-white">
 <Layout size={24} />
 </div>
 FixNest
 </Link>
 <div className="flex items-center gap-8 font-semibold text-sm text-gray-500 dark:text-gray-400">
 <Link href="#" className="hover:text-[#6A3DE8] transition-colors">Features</Link>
 <Link href="#" className="hover:text-[#6A3DE8] transition-colors">Pricing</Link>
 <Link href="#" className="hover:text-[#6A3DE8] transition-colors">About</Link>
 <Link href="/dashboard" className="bg-[#6A3DE8] text-white px-6 py-2.5 rounded-full hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#6A3DE8]/20">
 Open App
 </Link>
 </div>
 </nav>

 {/* Hero Section */}
 <section className="pt-40 pb-24 px-10 max-w-7xl mx-auto text-center">
 <motion.div
 variants={container}
 initial="hidden"
 animate="show"
 >
 <motion.div variants={item} className="inline-flex items-center gap-2 bg-[#F6F7FB] dark:bg-[#0F172A] px-4 py-1.5 rounded-full text-[#6A3DE8] font-bold text-xs uppercase tracking-widest mb-6 border border-[#6A3DE8]/10 shadow-sm">
 <Star size={14} fill="currentColor" />
 Voted #1 Task Management Tool
 </motion.div>
 
 <motion.h1 variants={item} className="text-7xl font-black text-[#1F2937] dark:text-gray-100 leading-[1.1] mb-8">
 Organize work, <br />
 <span className="bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] bg-clip-text text-transparent">defy gravity.</span>
 </motion.h1>
 
 <motion.p variants={item} className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
 FixNest brings the power of focus to your team with beautiful Kanban boards, seamless automation, and deep integrations.
 </motion.p>
 
 <motion.div variants={item} className="flex items-center justify-center gap-4">
 <Link href="/dashboard" className="bg-[#1F2937] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center gap-2 group">
 Start Building Now
 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
 </Link>
 <button className="bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-gray-100 border-2 border-gray-100 dark:border-[#1E293B] px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-200 transition-all">
 Watch Demo
 </button>
 </motion.div>
 </motion.div>

 {/* Mock App Preview */}
 <motion.div 
 initial={{ opacity: 0, y: 100 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5, duration: 0.8 }}
 className="mt-20 relative"
 >
 <div className="absolute -inset-4 bg-gradient-to-r from-[#8E2DE2]/20 to-[#4A00E0]/20 blur-3xl opacity-30"></div>
 <div className="bg-[#F6F7FB] dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-2xl p-4 shadow-2xl relative">
 <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-gray-100 dark:border-[#1E293B] h-[500px] flex overflow-hidden">
 <div className="w-48 border-r border-gray-100 dark:border-[#1E293B] p-4 space-y-4">
 <div className="w-full h-8 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 <div className="w-full h-4 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 <div className="w-full h-4 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 <div className="w-full h-4 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 <div className="mt-8 space-y-2">
 <div className="w-12 h-3 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 <div className="w-full h-6 bg-[#6A3DE8]/10 rounded border border-[#6A3DE8]/5"></div>
 <div className="w-full h-6 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 <div className="w-full h-6 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 </div>
 </div>
 <div className="flex-1 p-6 flex gap-6 overflow-hidden">
 {[1, 2, 3].map(i => (
 <div key={i} className="w-72 flex-shrink-0 bg-gray-50/50 border border-gray-100 dark:border-[#1E293B] rounded-xl p-4">
 <div className="flex justify-between mb-4">
 <div className="w-24 h-4 bg-gray-200 rounded"></div>
 <div className="w-4 h-4 bg-gray-200 rounded"></div>
 </div>
 <div className="space-y-3">
 {[1, 2, 3].map(j => (
 <div key={j} className="bg-white dark:bg-[#1E293B] p-4 rounded-lg shadow-sm border border-gray-100 dark:border-[#1E293B]">
 <div className="w-full h-3 bg-gray-100 rounded mb-3"></div>
 <div className="w-2/3 h-3 bg-gray-50 dark:bg-[#1A2333] rounded mb-4"></div>
 <div className="flex justify-between items-center">
 <div className="flex -space-x-2">
 <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
 <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white"></div>
 </div>
 <div className="w-12 h-2 bg-gray-50 dark:bg-[#1A2333] rounded"></div>
 </div>
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 </section>

 {/* Feature Section */}
 <section className="py-24 px-10 bg-gray-50 dark:bg-[#1A2333]">
 <div className="max-w-7xl mx-auto">
 <div className="grid md:grid-cols-3 gap-12">
 {[
 { icon: <Zap />, title: "Instant Sync", desc: "Collaborate in real-time with team members anywhere in the world." },
 { icon: <Users />, title: "Team Management", desc: "Easily manage permissions, roles, and guest access for every project." },
 { icon: <Globe />, title: "Global Search", desc: "Find anything instantly across boards, cards, and attachments." }
 ].map((feature, i) => (
 <div key={i} className="space-y-4">
 <div className="w-12 h-12 bg-white dark:bg-[#1E293B] rounded-2xl flex items-center justify-center text-[#6A3DE8] shadow-sm border border-gray-100 dark:border-[#1E293B]">
 {feature.icon}
 </div>
 <h3 className="text-xl font-bold text-[#1F2937] dark:text-gray-100">{feature.title}</h3>
 <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>
 </div>
 );
}
