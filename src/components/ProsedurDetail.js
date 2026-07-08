"use client";

import Link from "next/link";
import { 
  Home, ClipboardList, Users, 
  CheckCircle2, Scale, PenTool,
  ArrowRight, Sparkles, 
  Clock, Award, Shield,
  Calendar, FileText, DollarSign,
  Package, Truck, Coins, 
  Zap, Gift, Leaf, Heart,
  Droplet, AlertCircle, Settings,ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

export default function ProsedurDetail() {
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const steps = [
    {
      id: 1,
      icon: Home,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50/50",
      title: "Persiapan di Rumah",
      short: "Pemilahan awal oleh nasabah sebelum datang ke Bank Sampah.",
      description: "Nasabah melakukan pemilahan awal secara mandiri untuk memastikan sampah siap setor dan bernilai optimal.",
      details: [
        { 
          icon: ClipboardList, 
          text: "Pilah Berdasarkan Jenis: Pisahkan menjadi 4 kategori utama (Kertas, Plastik, Logam, dan Lainnya) sesuai SOP Pemilahan." 
        },
        { 
          icon: Droplet, 
          text: "3M (Membersihkan, Mengeringkan, Mengosongkan): Botol plastik/kaleng dibilas dari sisa manis atau sabun." 
        },
        { 
          icon: Leaf, 
          text: "Pastikan kardus/kertas dalam kondisi kering dan tidak berminyak." 
        },
        { 
          icon: Settings, 
          text: "Lipat kardus hingga pipih (flat) untuk menghemat ruang." 
        },
        { 
          icon: Package, 
          text: "Wadah Mandiri: Masukkan sampah terpilah ke kantong/karung agar tidak bercampur." 
        }
      ],
      stats: [
        { icon: Clock, label: "Estimasi Waktu", value: "10-15 menit" },
        { icon: Home, label: "Lokasi", value: "Di rumah Anda" }
      ]
    },
    {
      id: 2,
      icon: Users,
      color: "orange",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50/50",
      title: "Kedatangan & Penerimaan",
      short: "Nasabah datang ke Bank Sampah dan disambut petugas.",
      description: "Nasabah datang ke lokasi Bank Sampah pada jam operasional yang telah ditentukan.",
      details: [
        { 
          icon: Calendar, 
          text: "Datang pada jam operasional yang telah ditentukan di Bank Sampah." 
        },
        { 
          icon: FileText, 
          text: "Bawa Buku Tabungan Bank Sampah (nasabah lama) atau isi Formulir Pendaftaran (nasabah baru)." 
        },
        { 
          icon: Users, 
          text: "Petugas penerima menyambut dan mengarahkan sampah ke Meja Pemeriksaan/Sortir." 
        }
      ],
      stats: [
        { icon: Clock, label: "Proses", value: "5-10 menit" },
        { icon: Users, label: "Layanan", value: "Ramah & profesional" }
      ]
    },
    {
      id: 3,
      icon: CheckCircle2,
      color: "sky",
      gradient: "from-sky-500 to-blue-500",
      bgGradient: "from-sky-50 to-blue-50/50",
      title: "Pemeriksaan & Sortir Akhir",
      short: "Quality Control untuk memastikan kualitas sampah.",
      description: "Petugas melakukan pemeriksaan cepat terhadap sampah yang dibawa untuk memastikan kualitas.",
      details: [
        { 
          icon: Shield, 
          text: "Petugas melakukan pemeriksaan cepat (Quality Control) terhadap sampah yang dibawa." 
        },
        { 
          icon: AlertCircle, 
          text: "Jika sampah belum bersih, petugas berhak meminta pembersihan ulang atau menolak residu." 
        },
        { 
          icon: ClipboardList, 
          text: "Sampah dikelompokkan ke wadah penimbangan berdasarkan kode harga/jenis komoditas." 
        }
      ],
      stats: [
        { icon: Shield, label: "Kontrol Kualitas", value: "Ketat & terstandar" },
        { icon: Award, label: "Kriteria", value: "Jelas & transparan" }
      ]
    },
    {
      id: 4,
      icon: Scale,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50/50",
      title: "Penimbangan",
      short: "Proses timbang yang transparan di depan nasabah.",
      description: "Petugas melakukan penimbangan secara transparan di depan nasabah menggunakan timbangan terkalibrasi.",
      details: [
        { 
          icon: Scale, 
          text: "Penimbangan transparan di depan nasabah menggunakan timbangan terkalibrasi." 
        },
        { 
          icon: Users, 
          text: "Petugas menyebutkan berat sampah dengan lantang (contoh: 'Plastik PET Bening, 2.5 Kilogram')." 
        },
        { 
          icon: Droplet, 
          text: "Satuan: Kilogram (kg) untuk umum, Liter (L) atau kg untuk minyak jelantah sesuai kebijakan lokal." 
        },
        { 
          icon: Award, 
          text: "Akurasi hingga satu atau dua digit di belakang koma tergantung jenis timbangan." 
        }
      ],
      stats: [
        { icon: Scale, label: "Satuan Umum", value: "Kilogram (kg)" },
        { icon: Droplet, label: "Satuan Khusus", value: "Liter (L)" }
      ]
    },
    {
      id: 5,
      icon: PenTool,
      color: "rose",
      gradient: "from-rose-500 to-red-500",
      bgGradient: "from-rose-50 to-red-50/50",
      title: "Pencatatan Transaksi",
      short: "Pencatatan saldo ke buku tabungan nasabah.",
      description: "Petugas Admin menghitung nilai konversi rupiah dan mencatat transaksi ke sistem.",
      details: [
        { 
          icon: DollarSign, 
          text: "Rumus: Berat Sampah (kg) × Harga per kg Jenis Sampah" 
        },
        { 
          icon: FileText, 
          text: "Data wajib: Tanggal transaksi, Kode/Jenis sampah, Berat (kg), Nilai rupiah per kg, Total nominal" 
        },
        { 
          icon: Coins, 
          text: "Dicatat ke Buku Tabungan Nasabah dan Buku Besar/Aplikasi Sistem Bank Sampah." 
        },
        { 
          icon: CheckCircle2, 
          text: "Nasabah menandatangani atau memvalidasi nota dan menerima kembali Buku Tabungan." 
        }
      ],
      stats: [
        { icon: Zap, label: "Kecepatan", value: "Proses cepat" },
        { icon: Shield, label: "Keamanan", value: "Data terlindungi" }
      ]
    }
  ];

  return (
    <section 
      id="prosedur-detail" 
      className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-emerald-100 to-purple-100 rounded-full text-sm font-semibold text-slate-700 mb-6 shadow-lg">
           
            PROSEDUR & LANGKAH KERJA PENYETORAN
       
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Standar Operasional{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-purple-500 bg-clip-text text-transparent">
              Bank Sampah
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Setiap tahap dirancang untuk memastikan kualitas, transparansi, dan akurasi dalam setiap transaksi
          </p>
        </div>

        {/* CARDS - Horizontal Grid */}
             {/* CARDS - Horizontal Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
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
             className="relative"
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
                   minHeight: '460px',
                   transform: isActive ? 'rotateY(180deg)' : 'rotateY(0deg)',
                   willChange: 'transform'
                 }}
               >
                 {/* FRONT FACE */}
                 <div
                   className={`absolute inset-0 backface-hidden p-6 rounded-3xl bg-white border-2 transition-colors duration-300 ${
                     isHovered && !isActive
                       ? `border-${cleanColor}-300 shadow-xl`
                       : 'border-slate-200 shadow-lg'
                   }`}
                   style={{ backfaceVisibility: 'hidden' }}
                 >
                   <div className="flex flex-col items-center text-center h-full">
                     <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cleanGradient} flex items-center justify-center shadow-lg mb-4 transition-transform duration-500 ${
                       isHovered ? 'scale-110 rotate-6' : ''
                     }`}>
                       <Icon className="w-10 h-10 text-white" />
                     </div>
                     <div className="text-xs font-semibold text-slate-400 mb-1">
                       TAHAP 0{step.id}
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-2">
                       {step.title}
                     </h3>
                     <p className="text-slate-600 text-sm leading-relaxed flex-1">
                       {step.short}
                     </p>
                     <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                       <span>Klik untuk detail</span>
                       <ArrowUpRight className="w-3 h-3" />
                     </div>
                     <div className="mt-4 w-full flex justify-center gap-4 pt-3 border-t border-slate-100">
                       {step.stats.map((stat, i) => (
                         <div key={i} className="text-center">
                           <stat.icon className={`w-3 h-3 text-${cleanColor}-500 mx-auto mb-1`} />
                           <div className="text-[10px] text-slate-500">{stat.label}</div>
                           <div className="text-xs font-semibold text-slate-700">{stat.value}</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>

                 {/* BACK FACE */}
                 <div
                   className={`absolute inset-0 backface-hidden p-6 rounded-3xl bg-gradient-to-br ${cleanBgGradient} border-2 border-${cleanColor}-500 shadow-2xl`}
                   style={{ 
                     backfaceVisibility: 'hidden',
                     transform: 'rotateY(180deg)'
                   }}
                 >
                   <div className="flex flex-col h-full">
                     <div className="flex items-center gap-2 mb-3">
                       <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cleanGradient} flex items-center justify-center flex-shrink-0`}>
                         <Icon className="w-5 h-5 text-white" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-slate-900 text-sm truncate">{step.title}</h4>
                         <p className="text-xs text-slate-600">Detail lengkap</p>
                       </div>
                     </div>
                     <p className="text-slate-700 text-xs leading-relaxed mb-3">
                       {step.description}
                     </p>
                     <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                       {step.details.map((detail, i) => (
                         <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                           <detail.icon className={`w-3.5 h-3.5 text-${cleanColor}-500 flex-shrink-0 mt-0.5`} />
                           <span className="leading-snug">{detail.text}</span>
                         </div>
                       ))}
                     </div>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setActiveCard(null);
                       }}
                       className="mt-3 w-full py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-medium text-xs transition-all duration-300 border border-slate-200"
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

             {/* Connection Line (horizontal) - hanya tampil jika bukan card terakhir dan di desktop */}
             {index < steps.length - 1 && (
               <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 z-0">
                 <ArrowRight className="absolute -right-2 -top-1.5 w-3 h-3 text-slate-400" />
               </div>
             )}
           </div>
         );
       })}
     </div>

       

        {/* CTA */}
        <div className="mt-12 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative group">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <span>Mulai Menabung Sekarang</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
            
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
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