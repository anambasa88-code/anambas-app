"use client";

import Link from "next/link";
import { 
  Recycle, Scale, Wallet, 
  ArrowRight, Sparkles, 
  CheckCircle2, Circle, 
  ArrowUpRight, Star,
  Clock, Award, TrendingUp,
  Package, Truck,
  Coins, Zap, Gift,
  Leaf, Shield, Users, Heart
} from "lucide-react";
import { useState } from "react";

export default function CaraKerja() {
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const steps = [
    {
      id: 1,
      icon: Recycle,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50/50",
      lightBg: "bg-emerald-50",
      title: "Pilah Sampah",
      short: "Pisahkan sampah sesuai kategori di rumah.",
      description: "Langkah pertama dimulai dari rumah Anda. Sebelum membawa sampah ke Bank Sampah, pastikan Anda telah memisahkan material berharga agar tidak tercampur.",
      details: [
        { icon: Package, text: "Kertas: Kardus, buku, HVS, duplek (kering & tidak berminyak)" },
        { icon: Package, text: "Plastik: Botol bening (PET), botol warna, wadah HDPE, cup plastik" },
        { icon: Package, text: "Logam: Kaleng susu, kaleng soda, besi, seng bekas" },
        { icon: CheckCircle2, text: "Kosongkan sisa cairan, bilas jika perlu, dan pipihkan untuk hemat ruang" }
      ],
      stats: [
        { icon: Clock, label: "Estimasi Waktu", value: "5-10 menit" },
        { icon: Leaf, label: "Manfaat", value: "Lingkungan bersih" }
      ]
    },
    {
      id: 2,
      icon: Scale,
      color: "orange",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50/50",
      lightBg: "bg-orange-50",
      title: "Setor & Timbang",
      short: "Bawa sampah ke Bank Sampah terdekat.",
      description: "Setelah sampah terkumpul dan terpilah rapi, saatnya melakukan penyetoran.",
      details: [
        { icon: Truck, text: "Datangi titik Bank Sampah atau agen DWEP pada jam operasional" },
        { icon: CheckCircle2, text: "Petugas melakukan pemeriksaan cepat (sortir akhir)" },
        { icon: Scale, text: "Penimbangan transparan di hadapan Anda per kategori" },
        { icon: Shield, text: "Berat dihitung secara akurat dalam satuan Kilogram" }
      ],
      stats: [
        { icon: Clock, label: "Proses", value: "10-15 menit" },
        { icon: Users, label: "Layanan", value: "Ramah & profesional" }
      ]
    },
    {
      id: 3,
      icon: Wallet,
      color: "sky",
      gradient: "from-sky-500 to-blue-500",
      bgGradient: "from-sky-50 to-blue-50/50",
      lightBg: "bg-sky-50",
      title: "Dapatkan Saldo",
      short: "Saldo masuk otomatis ke akun digital Anda.",
      description: "Terima hasil dari kepedulian lingkungan Anda secara instan.",
      details: [
        { icon: Coins, text: "Petugas input berat sampah ke sistem DWEP" },
        { icon: TrendingUp, text: "Kalkulasi otomatis berdasarkan harga pasaran hari itu" },
        { icon: Wallet, text: "Saldo masuk real-time ke akun digital Anda" },
        { icon: Gift, text: "Bisa dicek kapan saja dan dicairkan sesuai kebijakan" }
      ],
      stats: [
        { icon: Zap, label: "Kecepatan", value: "Proses cepat" },
        { icon: Heart, label: "Kepuasan", value: "Prioritas utama" }
      ]
    }
  ];

  return (
    <section 
      id="cara-kerja" 
      className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full text-sm font-semibold text-slate-700 mb-6 shadow-lg">
            
            3 LANGKAH MUDAH MENABUNG SAMPAH
            
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Ubah Sampah Jadi{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Berkah
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Proses sederhana, transparan, dan menguntungkan
          </p>
        </div>

        {/* CARDS - Horizontal Grid */}
             {/* CARDS - Horizontal Grid */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
       {steps.map((step, index) => {
         const Icon = step.icon;
         const isActive = activeCard === step.id;
         const isHovered = hoveredCard === step.id;
         
         // Bersihkan spasi pada string color agar class Tailwind terbaca sempurna
         const cleanColor = step.color.trim();
         const cleanGradient = step.gradient.trim();
         const cleanBgGradient = step.bgGradient.trim();

         return (
           <div
             key={step.id}
             className="relative perspective-1000"
             style={{ perspective: '1000px' }}
           >
             {/* 1. OUTER CONTAINER (Hanya mengatur Scale & Z-Index) */}
             <div
               className={`relative transition-transform duration-500 ease-out transform-gpu cursor-pointer ${
                 isActive ? 'scale-105 z-20' : 'scale-100 z-10'
               } ${isHovered && !isActive ? 'scale-[1.02]' : ''}`}
               onClick={() => setActiveCard(isActive ? null : step.id)}
               onMouseEnter={() => setHoveredCard(step.id)}
               onMouseLeave={() => setHoveredCard(null)}
             >
               {/* 2. 3D FLIP WRAPPER (Khusus mengatur rotasi Y-Axis) */}
               <div
                 className="relative w-full transition-transform duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
                 style={{
                   transformStyle: 'preserve-3d',
                   minHeight: '420px',
                   transform: isActive ? 'rotateY(180deg)' : 'rotateY(0deg)',
                   willChange: 'transform' // Memberitahu GPU untuk bersiap merender
                 }}
               >
                 {/* FRONT FACE */}
                 <div
                   className={`absolute inset-0 backface-hidden p-8 rounded-3xl bg-white border-2 transition-colors duration-300 ${
                     isHovered && !isActive
                       ? `border-${cleanColor}-300 shadow-xl`
                       : 'border-slate-200 shadow-lg'
                   }`}
                   style={{ backfaceVisibility: 'hidden' }}
                 >
                   <div className="flex flex-col items-center text-center h-full">
                     <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${cleanGradient} flex items-center justify-center shadow-lg mb-6 transition-transform duration-500 ${
                       isHovered ? 'scale-110 rotate-6' : ''
                     }`}>
                       <Icon className="w-12 h-12 text-white" />
                     </div>
                     <div className="text-sm font-semibold text-slate-400 mb-2">
                       STEP 0{step.id}
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">
                       {step.title}
                     </h3>
                     <p className="text-slate-600 leading-relaxed flex-1">
                       {step.short}
                     </p>
                     <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                       <span>Klik untuk detail</span>
                       <ArrowUpRight className="w-4 h-4" />
                     </div>
                     <div className="mt-6 w-full flex justify-center gap-6 pt-4 border-t border-slate-100">
                       {step.stats.map((stat, i) => (
                         <div key={i} className="text-center">
                           <stat.icon className={`w-4 h-4 text-${cleanColor}-500 mx-auto mb-1`} />
                           <div className="text-xs text-slate-500">{stat.label}</div>
                           <div className="text-sm font-semibold text-slate-700">{stat.value}</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>

                 {/* BACK FACE */}
                 <div
                   className={`absolute inset-0 backface-hidden p-8 rounded-3xl bg-gradient-to-br ${cleanBgGradient} border-2 border-${cleanColor}-500 shadow-2xl`}
                   style={{ 
                     backfaceVisibility: 'hidden',
                     transform: 'rotateY(180deg)' // Statis terbalik, akan terlihat saat wrapper berputar
                   }}
                 >
                   <div className="flex flex-col h-full">
                     <div className="flex items-center gap-3 mb-4">
                       <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cleanGradient} flex items-center justify-center flex-shrink-0`}>
                         <Icon className="w-6 h-6 text-white" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-900">{step.title}</h4>
                         <p className="text-sm text-slate-600">Detail lengkap</p>
                       </div>
                     </div>
                     <p className="text-slate-700 text-sm leading-relaxed mb-4">
                       {step.description}
                     </p>
                     <div className="flex-1 space-y-2">
                       {step.details.map((detail, i) => (
                         <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                           <detail.icon className={`w-4 h-4 text-${cleanColor}-500 flex-shrink-0 mt-0.5`} />
                           <span>{detail.text}</span>
                         </div>
                       ))}
                     </div>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setActiveCard(null);
                       }}
                       className="mt-4 w-full py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-medium text-sm transition-all duration-300 border border-slate-200"
                     >
                       Tutup
                     </button>
                   </div>
                 </div>
               </div>
               
               {/* Glow Effect for Active Card */}
               {isActive && (
                 <div className={`absolute -inset-2 bg-gradient-to-r ${cleanGradient} rounded-3xl blur-xl opacity-20 -z-10 animate-pulse`}></div>
               )}
             </div>

             {/* Connection Line (horizontal) */}
             {index < steps.length - 1 && (
               <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 z-0">
                 <ArrowRight className="absolute -right-2 -top-1.5 w-3 h-3 text-slate-400" />
               </div>
             )}
           </div>
         );
       })}
     </div>

        {/* CTA */}
        <div className="mt-16 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative group">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <span>Mulai Menabung Sekarang</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
            
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
          </div>
          
          <p className="mt-4 text-sm text-slate-500">
            Bergabunglah dengan ribuan nasabah yang sudah merasakan manfaatnya
          </p>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}