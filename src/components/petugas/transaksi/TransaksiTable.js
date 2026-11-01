"use client";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  Receipt,
  XCircle,
  Ban,
  LockKeyhole,
} from "lucide-react";

const JenisBadge = ({ jenis, isBatal }) => {
  if (isBatal) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-400">
        <XCircle className="w-3 h-3" /> Dibatalkan
      </span>
    );
  }
  return jenis === "SETOR" ? (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
      <TrendingUp className="w-3 h-3" /> Setor
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-orange-50 text-orange-500 ring-1 ring-orange-100 dark:bg-orange-900/20 dark:text-orange-400">
      <TrendingDown className="w-3 h-3" /> Tarik
    </span>
  );
};

const MetodeBadge = ({ metode, isBatal }) => {
  if (isBatal)
    return <span className="text-[11px] font-bold text-slate-400">—</span>;
  if (!metode)
    return <span className="text-[11px] font-bold text-slate-400">—</span>;
  return metode === "TABUNG" ? (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
      <Wallet className="w-3 h-3" /> Tabung
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400">
      <TrendingDown className="w-3 h-3" /> Jual Langsung
    </span>
  );
};

// Helper murni UI — tidak mengubah logic
function getCancelState(t) {
  const isBatal = t.status === "DIBATALKAN" || !!t.alasan_batal;
  if (isBatal) return { isBatal, state: "CANCELLED" };
  const selisihJam = (Date.now() - new Date(t.waktu).getTime()) / 36e5;
  return { isBatal, state: selisihJam > 24 ? "LOCKED" : "CANCELLABLE" };
}

export default function TransaksiTable({
  data,
  loading,
  page,
  pagination,
  onPageChange,
  onOpenModal,
  onCancelTransaksi,
  formatRupiah,
  formatDate,
}) {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-[12px]">Memuat transaksi...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Inbox className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-[12px] font-medium">
            Tidak ada transaksi ditemukan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* ===================== DESKTOP TABLE (lg+) ===================== */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
              {[
                "No",
                "ID",
                "Jenis",
                "Metode",
                "Nasabah",
                "Detail",
                "Catatan / Alasan",
                "Nominal",
                "Waktu",
                "Petugas",
                "Aksi",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap ${i >= 7 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {data.map((t, idx) => {
              const isBatal = t.status === "DIBATALKAN" || !!t.alasan_batal;
              return (
                <tr
                  key={t.group_id || t.id_setor || t.id_tarik}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3.5 text-[11px] text-slate-400">
                    {(page - 1) * pagination.limit + idx + 1}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                      #{t.group_id || t.id_setor || t.id_tarik}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <JenisBadge jenis={t.jenis} isBatal={isBatal} />
                  </td>
                  <td className="px-4 py-3.5">
                    <MetodeBadge
                      metode={t.jenis === "SETOR" ? t.metode_bayar : null}
                      isBatal={isBatal}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[12px] font-semibold text-slate-700 dark:text-white">
                      {t.nasabah?.nama_lengkap}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {t.nasabah?.nickname}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    {t.jenis === "SETOR" ? (
                      <div>
                        <p className="text-[12px] font-medium text-slate-700 dark:text-slate-200 truncate max-w-[160px]">
                          {t.subItems[0]?.nama_barang_snapshot}
                          {t.subItems.length > 1 && (
                            <span className="text-slate-400 ml-1">
                              +{t.subItems.length - 1}
                            </span>
                          )}
                        </p>
                        <button
                          onClick={() =>
                            onOpenModal({
                              ...t,
                              subItems: t.detail_items || [],
                            })
                          }
                          className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 mt-0.5 transition-colors"
                        >
                          <Receipt className="w-3 h-3" />{" "}
                          {t.detail_items?.length || 0} item rincian
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Wallet className="w-3 h-3" />{" "}
                        <span className="text-[11px]">Penarikan Tunai</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {(() => {
                      if (isBatal) {
                        return (
                          <span className="inline-flex items-center gap-1.5 max-w-[140px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            <span
                              className="text-[11px] text-red-600 dark:text-red-400 font-medium truncate"
                              title={t.alasan_batal}
                            >
                              Batal: {t.alasan_batal}
                            </span>
                          </span>
                        );
                      }
                      const catatan =
                        t.jenis === "TARIK"
                          ? t.catatan_tarik
                          : t.catatan_petugas;
                      return catatan ? (
                        <span className="inline-flex items-center gap-1.5 max-w-[140px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          <span
                            className="text-[11px] text-slate-600 dark:text-slate-300 truncate"
                            title={catatan}
                          >
                            {catatan}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300 dark:text-slate-600">
                          —
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <p
                      className={`text-[13px] font-bold ${isBatal ? "text-slate-400 line-through" : t.jenis === "TARIK" ? "text-red-500" : t.metode_bayar === "TABUNG" ? "text-emerald-600" : "text-slate-600"}`}
                    >
                      {t.jenis === "SETOR" ? "+" : "−"}
                      {formatRupiah(t.totalGroupRp)}
                    </p>
                    {t.subItems?.length > 1 && (
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        {t.subItems.length} jenis sampah
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <p className="text-[11px] text-slate-500 whitespace-nowrap">
                      {formatDate(t.waktu)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <p className="text-[11px] font-medium text-slate-500">
                      {t.petugas?.nama_lengkap}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {isBatal ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Ban className="w-3 h-3" /> Dibatalkan
                      </span>
                    ) : (
                      (() => {
                        const selisihJam =
                          (Date.now() - new Date(t.waktu).getTime()) / 36e5;
                        if (selisihJam > 24) {
                          return (
                            <span
                              title="Batas waktu pembatalan 24 jam telah berlalu"
                              className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                            >
                              <LockKeyhole className="w-3 h-3" /> Terkunci
                            </span>
                          );
                        }
                        return (
                          <button
                            onClick={() => onCancelTransaksi(t)}
                            title="Batalkan Transaksi"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all ml-auto"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Batalkan
                          </button>
                        );
                      })()
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===================== MOBILE / TABLET CARD VIEW (< lg) ===================== */}
      <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {data.map((t, idx) => {
          const isBatal = t.status === "DIBATALKAN" || !!t.alasan_batal;
          const catatan = isBatal
            ? `Batal: ${t.alasan_batal}`
            : t.jenis === "TARIK"
              ? t.catatan_tarik
              : t.catatan_petugas;

          return (
            <div
              key={t.group_id || t.id_setor || t.id_tarik}
              className="p-3.5 sm:p-4"
            >
              {/* Top row: nomor + badge + nominal */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="text-[10px] text-slate-400 font-mono">
                    #{(page - 1) * pagination.limit + idx + 1}
                  </span>
                  <JenisBadge jenis={t.jenis} isBatal={isBatal} />
                  <MetodeBadge
                    metode={t.jenis === "SETOR" ? t.metode_bayar : null}
                    isBatal={isBatal}
                  />
                </div>
                <p
                  className={`text-[14px] font-bold whitespace-nowrap flex-shrink-0 ${isBatal ? "text-slate-400 line-through" : t.jenis === "TARIK" ? "text-red-500" : t.metode_bayar === "TABUNG" ? "text-emerald-600" : "text-slate-600"}`}
                >
                  {t.jenis === "SETOR" ? "+" : "−"}
                  {formatRupiah(t.totalGroupRp)}
                </p>
              </div>

              {/* ID */}
              <div className="mt-1.5">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                  #{t.group_id || t.id_setor || t.id_tarik}
                </span>
              </div>

              {/* Nasabah */}
              <div className="mt-2">
                <p className="text-[13px] font-semibold text-slate-700 dark:text-white leading-tight">
                  {t.nasabah?.nama_lengkap}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t.nasabah?.nickname}
                </p>
              </div>

              {/* Detail */}
              <div className="mt-2">
                {t.jenis === "SETOR" ? (
                  <div>
                    <p className="text-[12px] font-medium text-slate-700 dark:text-slate-200 truncate">
                      {t.subItems[0]?.nama_barang_snapshot}
                      {t.subItems.length > 1 && (
                        <span className="text-slate-400 ml-1">
                          +{t.subItems.length - 1} lainnya
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() =>
                        onOpenModal({ ...t, subItems: t.detail_items || [] })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 mt-1 transition-colors"
                    >
                      <Receipt className="w-3 h-3" />{" "}
                      {t.detail_items?.length || 0} item rincian
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Wallet className="w-3 h-3" />{" "}
                    <span className="text-[11px]">Penarikan Tunai</span>
                  </div>
                )}
              </div>

              {/* Catatan / alasan batal */}
              {catatan && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1.5 max-w-full">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isBatal ? "bg-red-500" : "bg-amber-400"}`}
                    />
                    <span
                      className={`text-[11px] truncate ${isBatal ? "text-red-600 dark:text-red-400 font-medium" : "text-slate-600 dark:text-slate-300"}`}
                      title={catatan}
                    >
                      {catatan}
                    </span>
                  </span>
                </div>
              )}

              {/* Meta: waktu + petugas */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                <span>{formatDate(t.waktu)}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>
                  Petugas:{" "}
                  <span className="font-medium text-slate-500">
                    {t.petugas?.nama_lengkap}
                  </span>
                </span>
              </div>

              {/* Aksi */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                {isBatal ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    <Ban className="w-3 h-3" /> Dibatalkan
                  </span>
                ) : (
                  (() => {
                    const selisihJam =
                      (Date.now() - new Date(t.waktu).getTime()) / 36e5;
                    if (selisihJam > 24) {
                      return (
                        <span
                          title="Batas waktu pembatalan 24 jam telah berlalu"
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                        >
                          <LockKeyhole className="w-3 h-3" /> Terkunci
                        </span>
                      );
                    }
                    return (
                      <button
                        onClick={() => onCancelTransaksi(t)}
                        title="Batalkan Transaksi"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Batalkan
                      </button>
                    );
                  })()
                )}
              </div>
            </div>
          );
        })}
      </div>

     
      {/* Pagination */}
      <div className="px-3 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Teks Informasi */}
        <p className="text-[10px] sm:text-[11px] text-slate-400 truncate w-full sm:w-auto text-center sm:text-left">
          Menampilkan{" "}
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {(page - 1) * pagination.limit + 1}
          </span>{" "}
          -{" "}
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {Math.min(page * pagination.limit, pagination.total)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {pagination.total}
          </span>{" "}
          data
        </p>

        {/* Kontrol Navigasi */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Tombol Prev */}
          <button
            onClick={() => onPageChange((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>

          {/* Logic Nomor Halaman */}
          {(() => {
            const pages = [];
            const maxVisible = 5; // Maksimal kotak yang muncul (selain ...)

            // Logika sederhana: jika total halaman <= 5, tampilkan semua
            if (totalPages <= maxVisible) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              // Jika lebih dari 5, kita mainkan posisi halaman aktif
              if (page <= 3) {
                // Kalau di awal: 1 2 3 4 5 ... 10
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
              } else if (page >= totalPages - 2) {
                // Kalau di akhir: 1 ... 6 7 8 9 10
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 4; i <= totalPages; i++)
                  pages.push(i);
              } else {
                // Kalau di tengah: 1 ... 4 5 6 ... 10
                pages.push(1);
                pages.push("...");
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
              }
            }

            return pages.map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="px-1.5 text-[11px] text-slate-400 font-bold"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`min-w-[28px] h-7 flex items-center justify-center rounded-lg text-[11px] font-semibold transition-all ${
                    page === p
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              );
            });
          })()}

          {/* Tombol Next */}
          <button
            onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
