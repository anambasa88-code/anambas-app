"use client";

import Link from "next/link";
import {
  Home, ClipboardList, Users,
  CheckCircle2, Scale, PenTool,
  ArrowRight,
  Clock, Award, Shield,
  Calendar, FileText, DollarSign,
  Package, Coins,
  Zap, Leaf,
  Droplet, AlertCircle, Settings, ArrowUpRight, X,
} from "lucide-react";
import { useState } from "react";

export default function ProsedurDetail() {
  const [activeCard, setActiveCard] = useState(null);

  const steps = [
    {
      id: 1,
      icon: Home,
      title: "Persiapan di Rumah",
      short: "Pemilahan awal oleh nasabah sebelum datang ke Bank Sampah.",
      description:
        "Nasabah melakukan pemilahan awal secara mandiri untuk memastikan sampah siap setor dan bernilai optimal.",
      details: [
        {
          icon: ClipboardList,
          text: "Pilah Berdasarkan Jenis: Pisahkan menjadi 4 kategori utama (Kertas, Plastik, Logam, dan Lainnya) sesuai SOP Pemilahan.",
        },
        {
          icon: Droplet,
          text: "3M (Membersihkan, Mengeringkan, Mengosongkan): Botol plastik/kaleng dibilas dari sisa manis atau sabun.",
        },
        {
          icon: Leaf,
          text: "Pastikan kardus/kertas dalam kondisi kering dan tidak berminyak.",
        },
        {
          icon: Settings,
          text: "Lipat kardus hingga pipih (flat) untuk menghemat ruang.",
        },
        {
          icon: Package,
          text: "Wadah Mandiri: Masukkan sampah terpilah ke kantong/karung agar tidak bercampur.",
        },
      ],
      stats: [
        { icon: Clock, label: "Estimasi Waktu", value: "10-15 menit" },
        { icon: Home, label: "Lokasi", value: "Di rumah Anda" },
      ],
    },
    {
      id: 2,
      icon: Users,
      title: "Kedatangan & Penerimaan",
      short: "Nasabah datang ke Bank Sampah dan disambut petugas.",
      description:
        "Nasabah datang ke lokasi Bank Sampah pada jam operasional yang telah ditentukan.",
      details: [
        {
          icon: Calendar,
          text: "Datang pada jam operasional yang telah ditentukan di Bank Sampah.",
        },
        {
          icon: FileText,
          text: "Bawa Buku Tabungan Bank Sampah (nasabah lama) atau isi Formulir Pendaftaran (nasabah baru).",
        },
        {
          icon: Users,
          text: "Petugas penerima menyambut dan mengarahkan sampah ke Meja Pemeriksaan/Sortir.",
        },
      ],
      stats: [
        { icon: Clock, label: "Proses", value: "5-10 menit" },
        { icon: Users, label: "Layanan", value: "Ramah & profesional" },
      ],
    },
    {
      id: 3,
      icon: CheckCircle2,
      title: "Pemeriksaan & Sortir Akhir",
      short: "Quality Control untuk memastikan kualitas sampah.",
      description:
        "Petugas melakukan pemeriksaan cepat terhadap sampah yang dibawa untuk memastikan kualitas.",
      details: [
        {
          icon: Shield,
          text: "Petugas melakukan pemeriksaan cepat (Quality Control) terhadap sampah yang dibawa.",
        },
        {
          icon: AlertCircle,
          text: "Jika sampah belum bersih, petugas berhak meminta pembersihan ulang atau menolak residu.",
        },
        {
          icon: ClipboardList,
          text: "Sampah dikelompokkan ke wadah penimbangan berdasarkan kode harga/jenis komoditas.",
        },
      ],
      stats: [
        { icon: Shield, label: "Kontrol Kualitas", value: "Ketat & terstandar" },
        { icon: Award, label: "Kriteria", value: "Jelas & transparan" },
      ],
    },
    {
      id: 4,
      icon: Scale,
      title: "Penimbangan",
      short: "Proses timbang yang transparan di depan nasabah.",
      description:
        "Petugas melakukan penimbangan secara transparan di depan nasabah menggunakan timbangan terkalibrasi.",
      details: [
        {
          icon: Scale,
          text: "Penimbangan transparan di depan nasabah menggunakan timbangan terkalibrasi.",
        },
        {
          icon: Users,
          text: "Petugas menyebutkan berat sampah dengan lantang (contoh: 'Plastik PET Bening, 2.5 Kilogram').",
        },
        {
          icon: Droplet,
          text: "Satuan: Kilogram (kg) untuk umum, Liter (L) atau kg untuk minyak jelantah sesuai kebijakan lokal.",
        },
        {
          icon: Award,
          text: "Akurasi hingga satu atau dua digit di belakang koma tergantung jenis timbangan.",
        },
      ],
      stats: [
        { icon: Scale, label: "Satuan Umum", value: "Kilogram (kg)" },
        { icon: Droplet, label: "Satuan Khusus", value: "Liter (L)" },
      ],
    },
    {
      id: 5,
      icon: PenTool,
      title: "Pencatatan Transaksi",
      short: "Pencatatan saldo ke buku tabungan nasabah.",
      description:
        "Petugas Admin menghitung nilai konversi rupiah dan mencatat transaksi ke sistem.",
      details: [
        {
          icon: DollarSign,
          text: "Rumus: Berat Sampah (kg) × Harga per kg Jenis Sampah",
        },
        {
          icon: FileText,
          text: "Data wajib: Tanggal transaksi, Kode/Jenis sampah, Berat (kg), Nilai rupiah per kg, Total nominal",
        },
        {
          icon: Coins,
          text: "Dicatat ke Buku Tabungan Nasabah dan Buku Besar/Aplikasi Sistem Bank Sampah.",
        },
        {
          icon: CheckCircle2,
          text: "Nasabah menandatangani atau memvalidasi nota dan menerima kembali Buku Tabungan.",
        },
      ],
      stats: [
        { icon: Zap, label: "Kecepatan", value: "Proses cepat" },
        { icon: Shield, label: "Keamanan", value: "Data terlindungi" },
      ],
    },
  ];

  return (
    <section id="prosedur-detail" className="py-24 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-teal-200 bg-teal-50 text-xs sm:text-sm font-semibold tracking-wide text-teal-700 mb-6">
            PROSEDUR & LANGKAH KERJA PENYETORAN
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Standar Operasional{" "}
            <span className="text-teal-600">Bank Sampah</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Setiap tahap dirancang untuk memastikan kualitas, transparansi, dan
            akurasi dalam setiap transaksi
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeCard === step.id;

            return (
              <div key={step.id} className="relative">
                <div
                  className="relative w-full transition-transform duration-500 [transform-style:preserve-3d]"
                  style={{
                    minHeight: "420px",
                    transform: isActive ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT FACE */}
                  <button
                    type="button"
                    onClick={() => setActiveCard(step.id)}
                    aria-label={`Lihat detail ${step.title}`}
                    className="absolute inset-0 w-full text-left [backface-visibility:hidden] p-6 rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-lg hover:border-teal-300 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center h-full">
                      <span className="text-xs font-semibold text-teal-600 tracking-widest mb-4">
                        TAHAP 0{step.id}
                      </span>

                      <div className="w-16 h-16 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-5">
                        <Icon className="w-8 h-8 text-teal-600" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed flex-1">
                        {step.short}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600">
                        Lihat detail
                        <ArrowUpRight className="w-4 h-4" />
                      </span>

                      <div className="mt-5 w-full flex justify-center gap-6 pt-4 border-t border-slate-100">
                        {step.stats.map((stat, i) => (
                          <div key={i} className="text-center">
                            <stat.icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                            <div className="text-[11px] text-slate-500">
                              {stat.label}
                            </div>
                            <div className="text-xs font-semibold text-slate-800">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* BACK FACE */}
                  <div
                    className="absolute inset-0 [backface-visibility:hidden] p-6 rounded-2xl bg-white border border-slate-200 shadow-lg overflow-y-auto"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {step.title}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Detail lengkap
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveCard(null)}
                          aria-label="Tutup detail"
                          className="text-slate-400 hover:text-slate-900 transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed mb-3">
                        {step.description}
                      </p>

                      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                        {step.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-700"
                          >
                            <detail.icon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{detail.text}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCard(null)}
                        className="mt-3 w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors duration-200 border border-slate-200"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>

                {/* Connection line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 items-center z-0">
                    <div className="w-6 h-px bg-slate-300" />
                    <ArrowRight className="w-3 h-3 text-slate-300 -ml-1" />
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
            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base sm:text-lg rounded-xl transition-colors duration-300 shadow-lg shadow-teal-900/10"
          >
            <span>Mulai Menabung Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="mt-4 text-sm text-slate-500">
            Bergabunglah dengan ribuan nasabah yang sudah merasakan manfaatnya
          </p>
        </div>
      </div>
    </section>
  );
} 