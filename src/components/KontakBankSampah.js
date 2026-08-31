"use client";

import Link from "next/link";
import {
  Building2, Phone, User, MapPin,
  Search, ArrowRight, Filter, CheckCircle2,
  MessageCircle, Navigation, X
} from "lucide-react";
import { useState } from "react";

export default function KontakBankSampah() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBankForModal, setSelectedBankForModal] = useState(null);

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
      return { badge: "bg-blue-50 text-blue-700 border border-blue-200", bar: "bg-blue-500" };
    if (type === "Bank Sampah Keliling")
      return { badge: "bg-amber-50 text-amber-700 border border-amber-200", bar: "bg-amber-500" };
    return { badge: "bg-teal-50 text-teal-700 border border-teal-200", bar: "bg-teal-500" };
  };

  const parseContacts = (bank) => {
    const contacts = bank.contact.split(" / ");
    const phones = bank.phone.split(" / ");

    return contacts.map((name, index) => ({
      name: name.trim(),
      phone: phones[index] ? phones[index].trim() : phones[0].trim(),
      cleanPhone: (phones[index] || phones[0]).replace(/[^0-9]/g, '')
    }));
  };

  const handleWaClick = (bank) => {
    const parsed = parseContacts(bank);
    if (parsed.length > 1) {
      setSelectedBankForModal({ ...bank, parsedContacts: parsed });
    } else {
      window.open(`https://wa.me/${parsed[0].cleanPhone}`, '_blank');
    }
  };

  return (
    <section id="kontak-bank-sampah" className="py-12 sm:py-20 md:py-28 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-teal-200 bg-teal-50 text-xs sm:text-sm font-semibold tracking-wide text-teal-700 mb-4 sm:mb-6">
            <Building2 className="w-4 h-4" />
            JARINGAN BANK SAMPAH
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3 sm:mb-4">
            Kontak <span className="text-teal-600">Bank Sampah</span>
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto px-2">
            Temukan Bank Sampah terdekat dan hubungi petugas untuk informasi lebih lanjut
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm">
            <div className="relative mb-4 sm:mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Bank Sampah, Kontak, atau Lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:bg-white focus:outline-none transition-colors duration-200 text-xs sm:text-sm font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-slate-600 text-sm leading-none">×</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>
              {[
                { key: "all", label: "Semua", count: banks.length },
                { key: "pdu", label: "PDU", count: banks.filter(b => b.type === "PDU").length },
                { key: "bank", label: "Bank Sampah", count: banks.filter(b => b.type === "Bank Sampah").length },
                { key: "keliling", label: "Keliling", count: banks.filter(b => b.type === "Bank Sampah Keliling").length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter.key
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                    activeFilter === filter.key ? "bg-white/20 text-white" : "bg-white text-slate-500 border border-slate-200"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {[
            { icon: Building2, label: "Total Unit", value: banks.length },
            { icon: CheckCircle2, label: "Status Aktif", value: banks.filter(b => b.status === "Aktif").length },
            { icon: MapPin, label: "Lokasi Tetap", value: "8" },
            { icon: Navigation, label: "Bank Keliling", value: "2" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* BANK LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBanks.map((bank) => {
            const typeColor = getTypeColor(bank.type);
            const isMultiContact = bank.contact.includes("/");

            return (
              <div
                key={bank.id}
                className="relative bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${typeColor.bar}`} />
                <div className="p-5 sm:p-6 pl-6 sm:pl-7 flex-1 flex flex-col justify-between">
                  
                  {/* Card Body Top */}
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
                          {bank.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className={`text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-medium ${typeColor.badge}`}>
                            {bank.type}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                            {bank.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-5 pt-4 border-t border-slate-100">
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <User className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="break-words">{bank.contact}</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="break-all">{bank.phone}</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{bank.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Action Button */}
                  <button
                    type="button"
                    onClick={() => handleWaClick(bank)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isMultiContact ? "Pilih Kontak WhatsApp" : "Hubungi via WhatsApp"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredBanks.length === 0 && (
          <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border border-slate-200 mt-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 px-4">
              Bank Sampah yang Anda cari tidak tersedia. Coba ubah kata kunci atau filter pencarian.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
        )}

        {/* RESULTS COUNT */}
        {filteredBanks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-800">{filteredBanks.length}</span> dari{' '}
              <span className="font-semibold text-slate-800">{banks.length}</span> Bank Sampah
            </p>
          </div>
        )}

      </div>

      {/* RESPONSIVE MODAL PEMILIHAN KONTAK WHATSAPP */}
      {selectedBankForModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedBankForModal(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                  Pilih Kontak WhatsApp
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 leading-snug">
                  {selectedBankForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBankForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors -mr-1"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 my-4">
              Silakan pilih salah satu kontak pengurus dibawah ini untuk membuka obrolan WhatsApp:
            </p>

            {/* Modal Options List */}
            <div className="space-y-3 overflow-y-auto pr-1">
              {selectedBankForModal.parsedContacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${contact.cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedBankForModal(null)}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/60 transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                        {contact.name}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                        {contact.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-teal-600 font-medium text-xs flex-shrink-0">
                    <span className="hidden sm:inline">Chat</span>
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  </div>
                </a>
              ))}
            </div>

            {/* Modal Footer Close Button */}
            <button
              onClick={() => setSelectedBankForModal(null)}
              className="mt-5 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm rounded-xl transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </section>
  );
}