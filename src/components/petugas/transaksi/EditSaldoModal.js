"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  X,
  Loader2,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

const MAX_NOMINAL = 100_000_000;

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(angka) || 0);

export default function EditSaldoModal({
  isOpen,
  onClose,
  nasabahId,
  nasabahSaldo,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    jenis_aksi: "TAMBAH",
    nominal: "",
    alasan: "",
  });

  if (!isOpen) return null;

  const nominalAngka =
    parseInt((form.nominal || "").replace(/[^0-9]/g, "")) || 0;
  const saldoSaatIni = Number(nasabahSaldo || 0);
  const saldoSetelah =
    form.jenis_aksi === "TAMBAH"
      ? saldoSaatIni + nominalAngka
      : saldoSaatIni - nominalAngka;
  const isMinus = saldoSetelah < 0;
  const isTambah = form.jenis_aksi === "TAMBAH";

  const handleNominalChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (parseInt(val) > MAX_NOMINAL) val = MAX_NOMINAL.toString();
    setForm((prev) => ({
      ...prev,
      nominal: val ? new Intl.NumberFormat("id-ID").format(val) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanNominal =
      parseInt((form.nominal || "").replace(/[^0-9]/g, "")) || 0;

    if (!cleanNominal || cleanNominal <= 0)
      return toast.error("Nominal harus diisi dan lebih dari 0");
    if (cleanNominal > MAX_NOMINAL)
      return toast.error("Nominal maksimal Rp100.000.000");
    if (!form.alasan.trim())
      return toast.error("Alasan penyesuaian harus diisi");
    if (isMinus)
      return toast.error("Saldo tidak boleh menjadi minus!");

    try {
      setLoading(true);
      const token = localStorage.getItem("bs_token");

      const res = await fetch("/api/management/edit-saldo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nasabah_id: parseInt(nasabahId),
          jenis_aksi: form.jenis_aksi,
          nominal: cleanNominal,
          alasan: form.alasan,
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Gagal melakukan penyesuaian saldo");

      toast.success("Saldo berhasil disesuaikan");
      setForm({ jenis_aksi: "TAMBAH", nominal: "", alasan: "" });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose?.()}
    >
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[95dvh]">
        
        {/* Drag handle – mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Penyesuaian Saldo
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-0.5">
              Saldo aktif nasabah:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {formatRupiah(saldoSaatIni)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Tutup"
            className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
        >
          {/* Jenis Aksi */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Jenis Penyesuaian
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  value: "TAMBAH",
                  label: "Tambah Saldo",
                  icon: TrendingUp,
                  active: "bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-600 dark:text-emerald-400",
                },
                {
                  value: "KURANG",
                  label: "Kurangi Saldo",
                  icon: TrendingDown,
                  active: "bg-red-50 border-red-400 text-red-700 dark:bg-red-950/50 dark:border-red-600 dark:text-red-400",
                },
              ].map(({ value, label, icon: Icon, active }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, jenis_aksi: value }))
                  }
                  className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 ${
                    form.jenis_aksi === value
                      ? active
                      : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label
              htmlFor="nominal"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Nominal (Rp)
            </label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium select-none">
                Rp
              </span>
              <input
                id="nominal"
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                value={form.nominal}
                onChange={handleNominalChange}
                className="w-full pl-10 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl text-[15px] font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:border-slate-400 transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Maks. {formatRupiah(MAX_NOMINAL)} · Wajib diisi
            </p>
          </div>

          {/* Simulasi Saldo */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Simulasi Perubahan
              </p>
            </div>
            <div className="px-4 py-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Saldo saat ini</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {formatRupiah(saldoSaatIni)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">
                  {isTambah ? "Penambahan" : "Pengurangan"}
                </span>
                <span
                  className={`font-semibold ${
                    isTambah ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {isTambah ? "+" : "−"} {formatRupiah(nominalAngka)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  Saldo setelah
                </span>
                <span
                  className={`text-base font-bold ${
                    isMinus
                      ? "text-red-600"
                      : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  {formatRupiah(isMinus ? 0 : saldoSetelah)}
                </span>
              </div>
            </div>
          </div>

          {/* Warning saldo minus */}
          {isMinus && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                Pengurangan melebihi saldo tersedia. Saldo tidak boleh minus.
              </p>
            </div>
          )}

          {/* Alasan */}
          <div>
            <label
              htmlFor="alasan"
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
            >
              Alasan Penyesuaian
            </label>
            <textarea
              id="alasan"
              required
              rows={3}
              value={form.alasan}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, alasan: e.target.value }))
              }
              placeholder="Jelaskan alasan perubahan saldo ini..."
              className="mt-2 w-full px-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl text-[15px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:border-slate-400 resize-none transition"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">Wajib diisi</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isMinus}
            className={`w-full py-4 font-bold rounded-2xl text-[15px] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
              isTambah
                ? "bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500"
                : "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                {isTambah ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {isTambah ? "Tambah Saldo" : "Kurangi Saldo"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}