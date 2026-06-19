"use client";

import { useState } from "react";
import {
  X,
  AlertTriangle,
  Loader2,
  User,
  ReceiptText,
  ShieldAlert,
  Hash,
} from "lucide-react";

export default function CancelTransaksiModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}) {
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !transaction) return null;

  const transactionId =
    transaction.group_id ||
    transaction.id_setor ||
    transaction.id_tarik;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alasan.trim()) return;
    setLoading(true);
    try {
      await onConfirm(transaction, alasan.trim());
      setAlasan("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      {/* Backdrop close */}
      <div className="absolute inset-0" onClick={!loading ? onClose : undefined} />

      <div className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* ── Header ── */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Batalkan Transaksi
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tindakan ini tidak dapat dikembalikan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

            {/* Detail Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Detail Transaksi
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* ID */}
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
                    <Hash className="h-3.5 w-3.5" />
                    <span className="text-sm">ID Transaksi</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-right break-all">
                    {transactionId}
                  </span>
                </div>

                {/* Jenis */}
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
                    <ReceiptText className="h-3.5 w-3.5" />
                    <span className="text-sm">Jenis</span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {transaction.jenis}
                  </span>
                </div>

                {/* Nasabah */}
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-sm">Nasabah</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100 text-right break-words max-w-[60%]">
                    {transaction.nasabah?.nama_lengkap || "–"}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="flex gap-3 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 p-4">
              <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                Pembatalan akan tercatat dalam <span className="font-semibold">audit sistem</span> dan tidak dapat dikembalikan setelah dikonfirmasi.
              </p>
            </div>

            {/* Textarea */}
            <div>
              <label className="flex items-center gap-1 mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Alasan Pembatalan
                <span className="text-red-500">*</span>
              </label>

              <textarea
                required
                rows={4}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Jelaskan alasan pembatalan secara detail..."
                className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:focus:border-red-500 transition-all"
              />

              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Alasan tersimpan dalam riwayat transaksi
                </p>
                <p className={`text-xs tabular-nums ${alasan.length > 0 ? "text-slate-500" : "text-slate-300"}`}>
                  {alasan.length} karakter
                </p>
              </div>
            </div>
          </div>

          {/* ── Sticky Footer ── */}
          <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
            <div className="flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-40"
              >
                Kembali
              </button>

              <button
                type="submit"
                disabled={loading || !alasan.trim()}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Memproses..." : "Ya, Batalkan"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}