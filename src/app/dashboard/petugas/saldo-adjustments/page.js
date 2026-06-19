"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Scale, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout"; // 🌟 Sesuai dengan arsitektur proyekmu

export default function RiwayatKoreksiPage() {
    // State Management
    const [adjustments, setAdjustments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalData: 0 });

    // Debounce search input agar tidak spam server
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    // Fetch data dari API route /api/adjustment
    // Fetch data dari API route /api/adjustment
    const fetchAdjustments = async () => {
        try {
            setLoading(true);


            const token = localStorage.getItem("bs_token");

            const res = await fetch(`/api/adjustment?page=${page}&limit=10&search=${debouncedSearch}`, {

                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Gagal mengambil data");

            setAdjustments(result.data || []);
            setPagination(result.pagination || { totalPages: 1, totalData: 0 });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdjustments();
    }, [page, debouncedSearch]);

    const formatRupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value));
    };

    const formatTanggal = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

                {/* Header Halaman */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
                            <Scale className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                                Riwayat Koreksi Saldo
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Daftar seluruh log penyesuaian/koreksi saldo nasabah di unit Anda
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={fetchAdjustments}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {/* Kontrol & Pencarian */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama nasabah / nickname..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                        Total Log: <span className="text-gray-700 dark:text-white font-bold">{pagination.totalData}</span> item
                    </div>
                </div>

                {/* Tabel Utama */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-[11px] font-bold uppercase tracking-wider">
                                        {/* 🌟 Dua header kolom baru */}
                                        <th className="py-3.5 px-4 text-center w-12">No.</th>
                                        <th className="py-3.5 px-4 w-20">ID </th>
                                        <th className="py-3.5 px-4">Waktu</th>
                                        <th className="py-3.5 px-4">Nasabah</th>
                                        <th className="py-3.5 px-4">Aksi</th>
                                        <th className="py-3.5 px-4 text-right">Nominal Koreksi</th>
                                        <th className="py-3.5 px-4 text-right">Historis Saldo</th>
                                        <th className="py-3.5 px-4">Alasan Perubahan</th>
                                        <th className="py-3.5 px-4">Petugas Eksekutor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-800 text-gray-700 dark:text-gray-300 text-xs">
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                {/* 🌟 colSpan disesuaikan jadi 9 karena total kolom sekarang ada 9 */}
                                                {[...Array(9)].map((_, j) => (
                                                    <td key={j} className="py-4 px-4">
                                                        <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-full" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : adjustments.length === 0 ? (
                                        <tr>
                                            {/* 🌟 colSpan disesuaikan jadi 9 */}
                                            <td colSpan={9} className="py-12 text-center text-gray-400 font-medium">
                                                Tidak ada riwayat koreksi saldo ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        adjustments.map((item, index) => {
                                            const isTambah = item.jenis_aksi === "TAMBAH";

                                            {/* 🌟 Hitung nomor urut kontinu berdasarkan halaman (asumsi limit data = 10) */ }
                                            const nomorUrut = (page - 1) * 10 + (index + 1);

                                            return (
                                                <tr key={item.id_adjustment} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-all">
                                                    {/* 🌟 Render Kolom No. */}
                                                    <td className="py-3.5 px-4 text-center font-medium text-gray-400 whitespace-nowrap">
                                                        {nomorUrut}
                                                    </td>

                                                    {/* 🌟 Render Kolom ID Adjustment (Badge bergaya minimalis) */}
                                                    <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                                                        #{item.id_adjustment}
                                                    </td>

                                                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                                                        {formatTanggal(item.waktu)}
                                                    </td>
                                                    <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-white">
                                                        <div>{item.nasabah?.nama_lengkap}</div>
                                                        <div className="text-[10px] text-gray-400 font-normal">@{item.nasabah?.nickname}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isTambah
                                                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                                                    : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
                                                                }`}
                                                        >
                                                            {isTambah ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                                            {item.jenis_aksi}
                                                        </span>
                                                    </td>
                                                    <td className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${isTambah ? "text-emerald-600" : "text-rose-600"}`}>
                                                        {isTambah ? "+" : "-"} {formatRupiah(item.nominal)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right text-[11px] whitespace-nowrap text-gray-500">
                                                        <div>Lama: {formatRupiah(item.saldo_lama)}</div>
                                                        <div className="font-medium text-slate-700 dark:text-slate-300">Baru: {formatRupiah(item.saldo_baru)}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-xs break-words text-gray-600 dark:text-gray-400 italic">
                                                        "{item.alasan_edit}"
                                                    </td>
                                                    <td className="py-3.5 px-4 font-medium text-gray-600 dark:text-gray-400">
                                                        {item.petugas?.nama_lengkap}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Paginasi Footer */}
                    {!loading && pagination.totalPages > 1 && (
                        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="p-1.5 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 text-gray-600 dark:text-gray-300 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-medium text-gray-500">
                                Halaman <span className="text-gray-700 dark:text-white font-bold">{page}</span> dari {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                                disabled={page === pagination.totalPages}
                                className="p-1.5 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 text-gray-600 dark:text-gray-300 transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}