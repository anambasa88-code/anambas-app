"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
  X,
  ShieldAlert,
  TriangleAlert,
  Loader2,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,

  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
  FileText,
} from "lucide-react";

const MAX_NOMINAL = 100_000_000;
const MIN_ALASAN_LENGTH = 20;

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
    confirmUnderstood: false,
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
  const isLargeAmount = nominalAngka > 10_000_000;
  const alasanValid = form.alasan.trim().length >= MIN_ALASAN_LENGTH;
  const alasanProgress = Math.min(
    (form.alasan.trim().length / MIN_ALASAN_LENGTH) * 100,
    100,
  );

  const isFormValid =
    nominalAngka > 0 &&
    !isMinus &&
    alasanValid &&
    form.confirmUnderstood &&
    !loading;

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
    if (form.alasan.trim().length < MIN_ALASAN_LENGTH)
      return toast.error(
        `Alasan minimal ${MIN_ALASAN_LENGTH} karakter (sekarang: ${form.alasan.trim().length})`,
      );
    if (isMinus) return toast.error("Saldo tidak boleh menjadi minus!");
    if (!form.confirmUnderstood)
      return toast.error("Anda harus mengkonfirmasi pemahaman perubahan ini");

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
      setForm({
        jenis_aksi: "TAMBAH",
        nominal: "",
        alasan: "",
        confirmUnderstood: false,
      });
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose?.()}
    >
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-4 duration-300">
        {/* HEADER - Clean & Professional */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                <TriangleAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Penyesuaian Saldo
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Ubah saldo nasabah dengan audit trail lengkap
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Tutup"
              className="p-2 -mr-2 -mt-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* Saldo Saat Ini - Clean Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-700/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Saldo Saat Ini
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
                  {formatRupiah(saldoSaatIni)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                <Wallet className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Jenis Aksi */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5 block">
              Jenis Penyesuaian
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "TAMBAH",
                  label: "Tambah Saldo",
                  desc: "Menambah nominal",
                  icon: TrendingUp,
                  activeColor:
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-600",
                  activeIcon: "text-emerald-600 dark:text-emerald-400",
                  activeText: "text-emerald-700 dark:text-emerald-300",
                },
                {
                  value: "KURANG",
                  label: "Kurangi Saldo",
                  desc: "Mengurangi nominal",
                  icon: TrendingDown,
                  activeColor:
                    "border-rose-500 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-600",
                  activeIcon: "text-rose-600 dark:text-rose-400",
                  activeText: "text-rose-700 dark:text-rose-300",
                },
              ].map(
                ({
                  value,
                  label,
                  desc,
                  icon: Icon,
                  activeColor,
                  activeIcon,
                  activeText,
                }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, jenis_aksi: value }))
                    }
                    className={`relative flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.jenis_aksi === value
                        ? activeColor
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        form.jenis_aksi === value
                          ? activeIcon
                          : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        form.jenis_aksi === value
                          ? activeText
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {desc}
                    </span>
                    {form.jenis_aksi === value && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className={`w-4 h-4 ${activeIcon}`} />
                      </div>
                    )}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label
              htmlFor="nominal"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block"
            >
              Nominal
            </label>
            <div className="relative">
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
                className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-xl text-base font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 transition-all duration-200 ${
                  isLargeAmount && nominalAngka > 0
                    ? "border-amber-400 dark:border-amber-600 focus:ring-amber-100 dark:focus:ring-amber-900/30"
                    : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
                }`}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maks. {formatRupiah(MAX_NOMINAL)}
              </p>
              {isLargeAmount && nominalAngka > 0 && (
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Nominal besar
                </p>
              )}
            </div>
          </div>

          {/* Simulasi Perubahan */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Simulasi Perubahan
              </p>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Saldo saat ini
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {formatRupiah(saldoSaatIni)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {isTambah ? "Penambahan" : "Pengurangan"}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isTambah
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isTambah ? "+" : "−"} {formatRupiah(nominalAngka)}
                </span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Saldo setelah
                </span>
                <span
                  className={`text-lg font-bold ${
                    isMinus
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {formatRupiah(isMinus ? 0 : saldoSetelah)}
                </span>
              </div>
            </div>
          </div>

          {/* Warning saldo minus */}
          {isMinus && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-4 py-3">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                  Saldo tidak mencukupi
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  Pengurangan melebihi saldo yang tersedia.
                </p>
              </div>
            </div>
          )}

          {/* Alasan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="alasan"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Alasan Penyesuaian
              </label>
              <span
                className={`text-xs font-medium ${
                  alasanValid
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {form.alasan.trim().length}/{MIN_ALASAN_LENGTH}
              </span>
            </div>
            <textarea
              id="alasan"
              required
              rows={4}
              value={form.alasan}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, alasan: e.target.value }))
              }
              placeholder="Jelaskan detail alasan penyesuaian saldo ini..."
              className={`w-full px-4 py-3 border-2 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 resize-none transition-all duration-200 ${
                alasanValid
                  ? "border-emerald-400 dark:border-emerald-600 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
                  : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
              }`}
            />
            {/* Progress bar */}
            <div className="mt-2 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  alasanValid ? "bg-emerald-500" : "bg-indigo-500"
                }`}
                style={{ width: `${alasanProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {alasanValid ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Alasan lengkap
                </span>
              ) : (
                `Minimal ${MIN_ALASAN_LENGTH} karakter untuk audit `
              )}
            </p>
          </div>

          {/* Konfirmasi */}
          <div className="rounded-xl border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/40 p-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={form.confirmUnderstood}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmUnderstood: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-2 border-red-300 dark:border-red-600 accent-red-600 dark:accent-red-500 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-700 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-red-300 transition">
                  Saya memahami dan setuju dengan perubahan ini
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 leading-relaxed">
                  • Perubahan TIDAK BISA DIBATALKAN
                  <br />
                  • Semua aktivitas dicatat dalam audit 
                  <br />• Saya bertanggung jawab atas aksi ini
                </p>
              </div>
            </label>
          </div>
        </form>

        {/* Footer - Sticky */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="submit"
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`w-full py-3.5 font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
              isFormValid
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 focus-visible:ring-red-200 dark:focus-visible:ring-red-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : !isFormValid ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                Lengkapi semua field
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                Sesuaikan Saldo Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
