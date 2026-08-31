"use client";
import { Users, UsersRound, Package, TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Recycle, Wrench, FileText, Layers, Percent } from "lucide-react";

const CATEGORY_ICONS = {
  PLASTIK: Recycle,
  LOGAM: Wrench,
  KERTAS: FileText,
  LAINNYA: Layers,
  CAMPURAN: Package,
};

export default function DashboardStatsCard({ 
  type, 
  data, 
  global, 
  formatRupiah
}) {

  // Format angka dengan titik ribuan agar angka 15988 langsung terbaca sebagai 15.988 (15 ribu)
  const formatBerat = (kg) => {
    const val = Number(kg) || 0;
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(val) + ' kg';
  };

  const renderNasabahCard = () => (
    <div className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Nasabah</p>
      <p className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white break-words">
        {new Intl.NumberFormat('id-ID').format(global.total_nasabah)}
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-2">
        {[
          { key: "LAKI_LAKI",  label: "Laki-laki"  },
          { key: "PEREMPUAN",  label: "Perempuan"   },
        ].map(({ key, label }) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <UsersRound className="w-4 h-4" /> {label}
            </span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {new Intl.NumberFormat('id-ID').format(global.gender_breakdown?.[key]?.jumlah || 0)}{" "}
              <span className="text-xs text-gray-400 font-medium ml-1">({global.gender_breakdown?.[key]?.persen || "0.00"}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSampahCard = () => {
    const globalSampah = global.sampah_terkumpul || [];
    const totalBerat = globalSampah.reduce((sum, item) => sum + (Number(item.total_berat) || 0), 0);
    const allCategories = ["PLASTIK", "LOGAM", "KERTAS", "LAINNYA", "CAMPURAN"];
    
    return (
      <div className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Setoran</p>
        <p className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white break-words">
          {formatBerat(totalBerat)}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-2">
          {allCategories.map((name) => {
            const Icon = CATEGORY_ICONS[name] || Package;
            const berat = global.per_kategori?.[name] || 0;
            return (
              <div key={name} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Icon className="w-4 h-4" />
                  {name.charAt(0) + name.slice(1).toLowerCase()}
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {formatBerat(berat)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTransaksiCard = () => (
    <div className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-4">
        <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Transaksi</p>
      <p className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white break-words">
        {new Intl.NumberFormat('id-ID').format(global.total_transaksi_setor + global.total_transaksi_tarik)}
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Package className="w-4 h-4" />
              Setoran
            </span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {new Intl.NumberFormat('id-ID').format(global.total_transaksi_setor)}
            </span>
          </div>
          <div className="pl-5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                <Wallet className="w-3 h-3" />
                Tabung
              </span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {new Intl.NumberFormat('id-ID').format(global.transaksi_metode_bayar?.TABUNG || 0)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                <DollarSign className="w-3 h-3" />
                Jual Langsung
              </span>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {new Intl.NumberFormat('id-ID').format(global.transaksi_metode_bayar?.JUAL_LANGSUNG || 0)}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-50 dark:border-slate-800/80">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 rotate-180" />
              Penarikan
            </span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {new Intl.NumberFormat('id-ID').format(global.total_transaksi_tarik)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKeuanganCard = () => (
    <div className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center mb-4">
        <DollarSign className="w-6 h-6 text-violet-600 dark:text-violet-400" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Perputaran Uang Seluruh</p>
      {/* Warna teks dinetralkan dan ditambah break-words agar susut rapi ke bawah jika melebihi container */}
      <p className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white mb-5 break-words">
        {formatRupiah(global.total_rp)}
      </p>
      
      <div className="space-y-3 mb-5">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Breakdown Metode Bayar
        </p>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Wallet className="w-4 h-4" />
            Tabung
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {formatRupiah(global.perputaran_uang_per_metode?.TABUNG || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <DollarSign className="w-4 h-4" />
            Jual Langsung
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {formatRupiah(global.perputaran_uang_per_metode?.JUAL_LANGSUNG || 0)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-3">
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Saldo Tabungan Nasabah
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-green-50/50 dark:bg-green-900/10 text-sm border border-green-100/50 dark:border-green-800/30">
            <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Masuk (Tabung)
            </span>
            <span className="font-bold text-green-700 dark:text-green-400">
              {formatRupiah(global.perputaran_uang_per_metode?.TABUNG || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center px-3 py-2 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 text-sm border border-orange-100/50 dark:border-orange-800/30">
            <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Keluar (Tarik)
            </span>
            <span className="font-bold text-orange-600 dark:text-orange-400">
              {formatRupiah(global.total_penarikan_rp || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSaldoCard = () => {
    const uangMasukTabungan = global.perputaran_uang_per_metode?.TABUNG || 0;
    const saldoAktif = global.saldo_aktif || 0;
    const rasioSaldoAktif = uangMasukTabungan > 0 
      ? ((saldoAktif / uangMasukTabungan) * 100).toFixed(1) 
      : "0.0";

    return (
      <div className="p-6 rounded-2xl border border-gray-200 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Saldo Aktif</p>
          <p className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white break-words">
            {formatRupiah(saldoAktif)}
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium text-xs">
              <Percent className="w-3.5 h-3.5" /> Rasio Saldo Tersimpan
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              {rasioSaldoAktif}%
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(parseFloat(rasioSaldoAktif), 100)}%` }}
            ></div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-gray-50 dark:border-slate-800/80">
            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Total Penarikan</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/40 text-[11px] font-bold text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
              <ArrowDownRight className="w-3 h-3" />
              {formatRupiah(global.total_penarikan_rp || 0)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const cardRenderers = {
    nasabah: renderNasabahCard,
    sampah: renderSampahCard,
    transaksi: renderTransaksiCard,
    keuangan: renderKeuanganCard,
    saldo: renderSaldoCard,
  };

  return cardRenderers[type]?.() || null;
}