"use client";
import Link from "next/link";
import {
  Building2, Phone, User, MapPin,
  Search, ArrowRight, Filter, CheckCircle2,
  MessageCircle, Navigation
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
    if (type === "PDU")
      return { badge: "bg-blue-50 text-blue-700", bar: "bg-blue-400" };
    if (type === "Bank Sampah Keliling")
      return { badge: "bg-amber-50 text-amber-700", bar: "bg-amber-400" };
    return { badge: "bg-teal-50 text-teal-700", bar: "bg-teal-400" };
  };

  return (
    <section
      id="kontak-bank-sampah"
      className="py-20 sm:py-28 relative overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-teal-200 bg-teal-50 text-xs sm:text-sm font-semibold tracking-wide text-teal-700 mb-6">
            <Building2 className="w-4 h-4" />
            JARINGAN BANK SAMPAH
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Kontak <span className="text-teal-600">Bank Sampah</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Temukan Bank Sampah terdekat dan hubungi petugas untuk informasi lebih lanjut
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            {/* Search Input */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Bank Sampah, Nama Kontak, atau Lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:bg-white focus:outline-none transition-colors duration-200 text-sm font-medium"
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
            <div className="flex flex-wrap items-center gap-2.5">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {[
                { key: "all", label: "Semua", count: banks.length },
                { key: "pdu", label: "PDU", count: banks.filter(b => b.type === "PDU").length },
                { key: "bank", label: "Bank Sampah", count: banks.filter(b => b.type === "Bank Sampah").length },
                { key: "keliling", label: "Keliling", count: banks.filter(b => b.type === "Bank Sampah Keliling").length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeFilter === filter.key
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                    activeFilter === filter.key ? "bg-white/20" : "bg-white text-slate-500"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Building2, label: "Total Bank Sampah", value: banks.length },
            { icon: CheckCircle2, label: "Status Aktif", value: banks.filter(b => b.status === "Aktif").length },
            { icon: MapPin, label: "Lokasi Tetap", value: "8" },
            { icon: Navigation, label: "Bank Keliling", value: "2" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <stat.icon className="w-6 h-6 text-teal-600 mb-3" />
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* BANK LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredBanks.map((bank) => {
            const typeColor = getTypeColor(bank.type);
            return (
            <div
              key={bank.id}
              className="relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${typeColor.bar}`} />
              <div className="p-6 pl-7">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {bank.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColor.badge}`}>
                        {bank.type}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        {bank.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2.5 mb-5 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{bank.contact}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{bank.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{bank.address}</span>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${bank.phone.replace(/[^0-9]/g, '').split('/')[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredBanks.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-9 h-9 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tidak Ditemukan</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Bank Sampah yang Anda cari tidak tersedia. Coba ubah kata kunci atau filter pencarian.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
        )}

        {/* RESULTS COUNT */}
        {filteredBanks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-800">{filteredBanks.length}</span> dari{' '}
              <span className="font-semibold text-slate-800">{banks.length}</span> Bank Sampah
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
      
          <p className="mt-4 text-sm text-slate-500">
            Hubungi Bank Sampah terdekat untuk informasi lebih lanjut
          </p>
        </div>
      </div>
    </section>
  );
}