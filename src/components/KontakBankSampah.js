"use client";
import Link from "next/link";
import {
  Building2, Phone, User, MapPin,
  Search, Globe, Mail, Clock, Shield,
  Sparkles, ArrowRight, Filter, CheckCircle2,
  MessageCircle, Navigation, Zap,CalendarCheck
} from "lucide-react";
import { useState } from "react";

export default function KontakBankSampah() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const banks = [
    {
      id: 1,
      name: "PDU KUALA MARAS",
      contact: "SYAIRUL",
      phone: "+62 821-7212-8384",
      address: "Kuala Maras",
      type: "PDU",
      status: "Aktif"
    },
    {
      id: 2,
      name: "PDU KIABU",
      contact: "RAZALI",
      phone: "+62 812-6733-1515",
      address: "Kiabu",
      type: "PDU",
      status: "Aktif"
    },
    {
      id: 3,
      name: "BANK SAMPAH TELAGA",
      contact: "HUSNI",
      phone: "+62 812-6163-9231",
      address: "Telaga",
      type: "Bank Sampah",
      status: "Aktif"
    },
    {
      id: 4,
      name: "BANK SAMPAH TELAGA KECIL",
      contact: "AGUS",
      phone: "+62 813-7803-5633",
      address: "Telaga Kecil",
      type: "Bank Sampah",
      status: "Aktif"
    },
    {
      id: 5,
      name: "BANK SAMPAH CANDI",
      contact: "GAYATRI / DINA",
      phone: "+62 821-7107-1588 / +62 823-6425-7306",
      address: "Candi",
      type: "Bank Sampah",
      status: "Aktif"
    },
    {
      id: 6,
      name: "BANK SAMPAH LANGIR",
      contact: "GAYATRI / AISYAH",
      phone: "+62 821-7107-1588 / +62 823-8993-9465",
      address: "Langir",
      type: "Bank Sampah",
      status: "Aktif"
    },
    {
      id: 7,
      name: "BANK SAMPAH PIASAN",
      contact: "IRWANTO",
      phone: "+62 812-6718-3055",
      address: "Piasan",
      type: "Bank Sampah",
      status: "Aktif"
    },
    {
      id: 8,
      name: "BANK SAMPAH LANDAK",
      contact: "RIO",
      phone: "+62 852-1182-5180",
      address: "Landak",
      type: "Bank Sampah",
      status: "Aktif"
    },
    {
      id: 9,
      name: "BANK SAMPAH KELILING PULAU MATAK",
      contact: "HENDRI",
      phone: "+62 852-6511-8877",
      address: "Pulau Matak",
      type: "Bank Sampah Keliling",
      status: "Aktif"
    },
    {
      id: 10,
      name: "BANK SAMPAH KELILING PULAU JEMAJA",
      contact: "HABIBI",
      phone: "+62 812-6842-9997",
      address: "Pulau Jemaja",
      type: "Bank Sampah Keliling",
      status: "Aktif"
    }
  ];

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || 
      (activeFilter === "pdu" && bank.type === "PDU") ||
      (activeFilter === "bank" && bank.type === "Bank Sampah") ||
      (activeFilter === "keliling" && bank.type === "Bank Sampah Keliling");
    
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    if (type === "PDU") return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-600" };
    if (type === "Bank Sampah Keliling") return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "text-purple-600" };
    return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-600" };
  };

  return (
    <section 
      id="kontak-bank-sampah" 
      className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-emerald-500/30">
            <Building2 className="w-4 h-4" />
            Jaringan Bank Sampah
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Kontak{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Bank Sampah
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Temukan Bank Sampah terdekat dan hubungi petugas untuk informasi lebih lanjut
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Bank Sampah, Nama Kontak, atau Lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-base font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-slate-600 text-sm">×</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              <Filter className="w-5 h-5 text-slate-400 flex-shrink-0 mt-2" />
              {[
                { key: "all", label: "Semua", count: banks.length },
                { key: "pdu", label: "PDU", count: banks.filter(b => b.type === "PDU").length },
                { key: "bank", label: "Bank Sampah", count: banks.filter(b => b.type === "Bank Sampah").length },
                { key: "keliling", label: "Keliling", count: banks.filter(b => b.type === "Bank Sampah Keliling").length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeFilter === filter.key
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeFilter === filter.key ? "bg-white/20" : "bg-white"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

       {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
            { icon: Building2, label: "Total Bank Sampah", value: banks.length, color: "emerald" },
            { icon: CheckCircle2, label: "Status Aktif", value: banks.filter(b => b.status === "Aktif").length, color: "blue" },
            { icon: MapPin, label: "Lokasi Tetap", value: "8", color: "purple" },
            { icon: Navigation, label: "Bank Keliling", value: "2", color: "orange" }
        ].map((stat, idx) => (
            <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
            <stat.icon className={`w-8 h-8 text-${stat.color}-500 mb-3`} />
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
            </div>
        ))}
        </div>

        {/* BANK LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanks.map((bank) => {
            const typeColor = getTypeColor(bank.type);
            return (
              <div
                key={bank.id}
                className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-xl ${typeColor.bg} flex items-center justify-center ${typeColor.icon} flex-shrink-0`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight">
                          {bank.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${typeColor.bg} ${typeColor.text} border ${typeColor.border}`}>
                          {bank.type}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-semibold">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          {bank.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Cards */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-500 font-medium">Kontak Person</div>
                        <div className="text-sm font-bold text-slate-900 truncate">{bank.contact}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-500 font-medium">Nomor Telepon</div>
                        <div className="text-sm font-bold text-slate-900 truncate">{bank.phone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-500 font-medium">Lokasi</div>
                        <div className="text-sm font-bold text-slate-900 truncate">{bank.address}</div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/${bank.phone.replace(/[^0-9]/g, '').split('/')[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/40 group-hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Hubungi via WhatsApp</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredBanks.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Tidak Ditemukan</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Bank Sampah yang Anda cari tidak tersedia. Coba ubah kata kunci atau filter pencarian.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Filter className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
        )}

        {/* RESULTS COUNT */}
        {filteredBanks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Menampilkan <span className="font-bold text-slate-900">{filteredBanks.length}</span> dari{' '}
              <span className="font-bold text-slate-900">{banks.length}</span> Bank Sampah
            </p>
          </div>
        )}

      

        {/* CTA */}
        <div className="mt-12 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="relative">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <span>Mulai Menabung Sekarang</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-xl opacity-0 hover:opacity-30 transition-opacity duration-500 -z-10"></div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Hubungi Bank Sampah terdekat untuk informasi lebih lanjut
          </p>
        </div>
      </div>
    </section>
  );
}