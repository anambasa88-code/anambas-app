"use client";
import { X, CalendarRange, SlidersHorizontal, Check } from "lucide-react";

const TIPE_OPTIONS = [
  { value: "ALL",   label: "Semua Tipe"  },
  { value: "SETOR", label: "Setoran"     },
  { value: "TARIK", label: "Penarikan"   },
];

const KATEGORI_OPTIONS = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "PLASTIK", label: "Plastik" },
  { value: "LOGAM", label: "Logam" },
  { value: "KERTAS", label: "Kertas" },
  { value: "LAINNYA", label: "Lainnya" },
  { value: "CAMPURAN", label: "Campuran" },
  { value: "PRESS", label: "Press" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "Semua Status" },
  { value: "SUKSES", label: "Sukses" },
  { value: "BATAL", label: "Dibatalkan" },
];

export default function TransaksiFilterPanel({ 
  filters, 
  onFilterChange, 
  onReset, 
  onApply, 
  onClose 
}) {
  const isActive = 
    filters.tipe !== "ALL" || 
    filters.startDate || 
    filters.endDate || 
    filters.kategori !== "ALL" || 
    filters.status !== "ALL";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-300">Filter Transaksi</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {/* Grid Filter: 1 kolom di HP, 3 kolom di Tablet, 5 kolom di Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Tipe Transaksi */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tipe Transaksi
            </label>
            <select
              value={filters.tipe}
              onChange={(e) => onFilterChange("tipe", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[12px] font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              {TIPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Kategori Sampah */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Kategori Sampah
            </label>
            <select
              value={filters.kategori || "ALL"}
              onChange={(e) => onFilterChange("kategori", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[12px] font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              {KATEGORI_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Status Transaksi */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Status Data
            </label>
            <select
              value={filters.status || "ALL"}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[12px] font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Tanggal Mulai */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tanggal Mulai
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <CalendarRange className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input type="date" value={filters.startDate}
                onChange={(e) => onFilterChange("startDate", e.target.value)}
                className="bg-transparent w-full text-[12px] font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer min-w-0" />
            </div>
          </div>

          {/* Tanggal Akhir */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tanggal Akhir
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <CalendarRange className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input type="date" value={filters.endDate} min={filters.startDate}
                onChange={(e) => onFilterChange("endDate", e.target.value)}
                className="bg-transparent w-full text-[12px] font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer min-w-0" />
            </div>
          </div>

        </div>

        {/* Tombol Aksi: Posisi di KANAN */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
          {isActive && (
            <button 
              onClick={onReset}
              className="px-4 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
            >
              Reset Filter
            </button>
          )}
          <button 
            onClick={onApply}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}