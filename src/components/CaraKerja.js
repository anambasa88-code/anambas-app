"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Recycle,
  Scale,
  Wallet,
  ArrowRight,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Package,
  Truck,
  Coins,
  Zap,
  Gift,
  Leaf,
  Shield,
  Users,
  Heart,
  X,
} from "lucide-react";
import { useState } from "react";

export default function CaraKerja() {
  const [activeCard, setActiveCard] = useState(null);

  const steps = [
    {
      id: 1,
      icon: Recycle,
      title: "Pilah Sampah",
      short: "Pisahkan sampah sesuai kategori di rumah.",
      description:
        "Langkah pertama dimulai dari rumah Anda. Sebelum membawa sampah ke Bank Sampah, pastikan Anda telah memisahkan material berharga agar tidak tercampur.",
      details: [
        {
          icon: Package,
          text: "Kertas: Kardus, buku, HVS, duplek (kering & tidak berminyak)",
        },
        {
          icon: Package,
          text: "Plastik: Botol bening (PET), botol warna, wadah HDPE, cup plastik",
        },
        {
          icon: Package,
          text: "Logam: Kaleng susu, kaleng soda, besi, seng bekas",
        },
        {
          icon: CheckCircle2,
          text: "Kosongkan sisa cairan, bilas jika perlu, dan pipihkan untuk hemat ruang",
        },
      ],
      stats: [
        { icon: Clock, label: "Estimasi Waktu", value: "5-10 menit" },
        { icon: Leaf, label: "Manfaat", value: "Lingkungan bersih" },
      ],
    },
    {
      id: 2,
      icon: Scale,
      title: "Setor & Timbang",
      short: "Bawa sampah ke Bank Sampah terdekat.",
      description:
        "Setelah sampah terkumpul dan terpilah rapi, saatnya melakukan penyetoran.",
      details: [
        {
          icon: Truck,
          text: "Datangi titik Bank Sampah pada jam operasional",
        },
        {
          icon: CheckCircle2,
          text: "Petugas melakukan pemeriksaan cepat (sortir akhir)",
        },
        {
          icon: Scale,
          text: "Penimbangan transparan di hadapan Anda per kategori",
        },
        {
          icon: Shield,
          text: "Berat dihitung secara akurat dalam satuan Kilogram",
        },
      ],
      stats: [
        { icon: Clock, label: "Proses", value: "10-15 menit" },
        { icon: Users, label: "Layanan", value: "Ramah & profesional" },
      ],
    },
    {
      id: 3,
      icon: Wallet,
      title: "Dapatkan Saldo",
      short: "Saldo masuk otomatis ke akun digital Anda.",
      description:
        "Terima hasil dari kepedulian lingkungan Anda secara instan.",
      details: [
        { icon: Coins, text: "Petugas input berat sampah ke sistem DWEP" },
        {
          icon: TrendingUp,
          text: "Kalkulasi otomatis berdasarkan harga pasaran hari itu",
        },
        { icon: Wallet, text: "Saldo masuk real-time ke akun digital Anda" },
        {
          icon: Gift,
          text: "Bisa dicek kapan saja dan dicairkan sesuai kebijakan",
        },
      ],
      stats: [
        { icon: Zap, label: "Kecepatan", value: "Proses cepat" },
        { icon: Heart, label: "Kepuasan", value: "Prioritas utama" },
      ],
    },
  ];

  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      {/* ===== BACKGROUND IMAGE (TIDAK TER-ZOOM & FIT PROPOSIONAL) ===== */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <Image
          src="/bg.webp"
          alt="Background Cara Kerja"
          fill
          priority
          sizes="100vw"
          className="object-fill object-center" // object-fill membuat gambar 1280x576 pas memenuhi area tanpa zoom in
        />
        {/* Shadow overlay transparan tipis agar TEKS PUTIH terlihat sangat kontras & jelas */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* ===== CONTENT AREA (SEMUA FONT PUTIH) ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-teal-400/40 bg-teal-500/20 backdrop-blur-md text-xs sm:text-sm font-bold tracking-wide text-teal-300 mb-6 shadow-md">
            3 LANGKAH MUDAH MENABUNG SAMPAH
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Ubah Sampah Jadi <span className="text-teal-400">Berkah</span>
          </h2>

          <p className="text-base sm:text-lg text-white font-medium max-w-xl mx-auto drop-shadow-md">
            Proses sederhana, transparan, dan menguntungkan
          </p>
        </div>

        {/* CARDS FONT PUTIH DENGAN GLASSMORPHISM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeCard === step.id;

            return (
              <div key={step.id} className="relative">
                <div
                  className="relative w-full transition-transform duration-500 [transform-style:preserve-3d]"
                  style={{
                    minHeight: "400px",
                    transform: isActive ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT FACE (KARTU KONTEN TEKS PUTIH) */}
                  <button
                    type="button"
                    onClick={() => setActiveCard(step.id)}
                    aria-label={`Lihat detail ${step.title}`}
                    className="absolute inset-0 w-full text-left [backface-visibility:hidden] p-6 sm:p-8 rounded-2xl bg-black/40 hover:bg-black/50 backdrop-blur-md border border-white/20 hover:border-teal-400 transition-all duration-300 shadow-2xl"
                  >
                    <div className="flex flex-col items-center text-center h-full">
                      <span className="text-xs font-bold text-teal-300 tracking-widest mb-4">
                        LANGKAH 0{step.id}
                      </span>

                      <div className="w-16 h-16 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center mb-5 shadow-sm">
                        <Icon className="w-8 h-8 text-teal-300" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 drop-shadow">
                        {step.title}
                      </h3>
                      <p className="text-white text-sm font-normal leading-relaxed flex-1 drop-shadow-sm">
                        {step.short}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-300 hover:text-teal-200">
                        Lihat detail
                        <ArrowUpRight className="w-4 h-4" />
                      </span>

                      <div className="mt-5 w-full flex justify-center gap-8 pt-4 border-t border-white/20">
                        {step.stats.map((stat, i) => (
                          <div key={i} className="text-center">
                            <stat.icon className="w-4 h-4 text-teal-300 mx-auto mb-1" />
                            <div className="text-[11px] font-medium text-white/80">
                              {stat.label}
                            </div>
                            <div className="text-xs font-bold text-white">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* BACK FACE */}
                  <div
                    className="absolute inset-0 [backface-visibility:hidden] p-6 sm:p-8 rounded-2xl bg-slate-900/90 backdrop-blur-lg border border-white/30 shadow-2xl overflow-y-auto"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">
                              {step.title}
                            </h4>
                            <p className="text-xs text-teal-300 font-semibold">
                              Detail lengkap
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveCard(null)}
                          aria-label="Tutup detail"
                          className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-white text-sm font-normal leading-relaxed mb-4">
                        {step.description}
                      </p>

                      <div className="flex-1 space-y-2.5">
                        {step.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-white font-normal"
                          >
                            <detail.icon className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                            <span>{detail.text}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCard(null)}
                        className="mt-4 w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors duration-200 border border-white/20"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>

                {/* Connection line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 items-center z-0">
                    <div className="w-6 h-px bg-white/40" />
                    <ArrowRight className="w-3 h-3 text-white/70 -ml-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 shadow-xl shadow-teal-950/50"
          >
            <span>Mulai Menabung Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="mt-4 text-sm font-medium text-white drop-shadow-md">
            Bergabunglah dengan ribuan nasabah yang sudah merasakan manfaatnya
          </p>
        </div>
      </div>
    </section>
  );
}