"use client";
import { X, Receipt, ArrowUpRight, Waves } from "lucide-react";

// Helper untuk warna badge kategori
const getKategoriColor = (kategori) => {
  switch (kategori) {
    case "PLASTIK": return "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800";
    case "KERTAS": return "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800";
    case "LOGAM": return "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
    case "CAMPURAN": return "bg-purple-50 text-purple-600 ring-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-800";
    default: return "bg-slate-50 text-slate-500 ring-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700";
  }
};

export default function DetailTransaksiModal({
  isOpen,
  onClose,
  transaction,
  formatRupiah,
}) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5 min-w-0">
            <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate">
                Rincian Setoran
              </p>
              <p className="text-[10px] text-slate-400">
                {transaction.subItems.length} jenis sampah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Items */}
        <div className="p-3 sm:p-4 space-y-2 max-h-[55vh] overflow-y-auto">
          {transaction.subItems.map((item, idx) => {
            const isCommunity = item.tipe_setoran === "COMMUNITY";
            const kategori = item.barang?.kategori_utama || item.kategori_utama || "LAINNYA";

            return (
              <div
                key={idx}
                className="flex flex-col p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 gap-2"
              >
                {/* Baris Atas: Nama Barang & Harga */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    {isCommunity ? (
                      <ArrowUpRight className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Waves className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-800 dark:text-white truncate">
                        {item.nama_barang_snapshot || "Sampah"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {Number(item.berat).toLocaleString("id-ID")} kg × {formatRupiah(item.harga_deal)}
                      </p>
                    </div>
                  </div>
                  <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200 flex-shrink-0">
                    {formatRupiah(item.total_rp)}
                  </p>
                </div>

                {/* Baris Bawah: Badge Kategori & Tipe Setoran & ID */}
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Badge Kategori */}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ring-1 uppercase tracking-wider ${getKategoriColor(kategori)}`}>
                      {kategori}
                    </span>
                    {/* Badge Tipe Setoran */}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ring-1 ${isCommunity ? "bg-emerald-50 ring-emerald-100 text-emerald-600" : "bg-blue-50 ring-blue-100 text-blue-600"}`}>
                      {isCommunity ? "Community" : "Ocean"}
                    </span>
                  </div>
                  
                  {/* ID Detail */}
                  <p className="text-[9px] font-mono text-slate-400 text-right">
                    #{item.id || item.id_setor_detail || '—'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 bg-emerald-600 dark:bg-emerald-700">
          <div className="min-w-0">
            <p className="text-[10px] text-emerald-200 font-medium">
              Total Setoran
            </p>
            <p className="text-lg sm:text-xl font-bold text-white truncate">
              {formatRupiah(transaction.totalGroupRp)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2.5 bg-white text-emerald-600 rounded-xl text-[12px] font-semibold hover:bg-emerald-50 transition-all active:scale-95 flex-shrink-0"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}