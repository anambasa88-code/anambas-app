"use client";

import { useState, useEffect } from "react";
import { Scale, ArrowUpRight, ArrowDownLeft, Calendar, User, Info, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

export default function KoreksiSaldoNasabahPage() {
    const [adjustments, setAdjustments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyAdjustments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("bs_token");
            if (!token) {
                toast.error("Sesi berakhir, silakan login ulang");
                return;
            }

            const res = await fetch("/api/users/nasabah/adjustments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Gagal mengambil data");
            setAdjustments(result.data || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAdjustments();
    }, []);

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
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">

                {/* Banner Informative Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex-shrink-0">
                            <Scale className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                                Log Koreksi & Penyesuaian Saldo
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                Halaman transparansi finansial. Di bawah ini adalah daftar riwayat koreksi atau penyesuaian nominal saldo dompet Anda yang dilakukan manual oleh pihak manajemen petugas unit bank sampah.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchMyAdjustments}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all disabled:opacity-50 h-fit"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {/* List Card Konten Log */}
                <div className="space-y-3">
                    {loading ? (
                        [...Array(2)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white dark:bg-slate-900 p-5 rounded-2xl h-24 border border-gray-100" />
                        ))
                    ) : adjustments.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-center py-16 px-4 rounded-2xl text-gray-400">
                            <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">Saldo Anda sepenuhnya normal.</p>
                            <p className="text-xs text-gray-400 mt-0.5">Belum ada catatan penyesuaian saldo manual dari petugas.</p>
                        </div>
                    ) : (
                        adjustments.map((item) => {
                            const isTambah = item.jenis_aksi === "TAMBAH";
                            return (
                                <div
                                    key={item.id_adjustment}
                                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-gray-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isTambah
                                                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                                        : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
                                                    }`}
                                            >
                                                {isTambah ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                                SALDO DI{item.jenis_aksi}
                                            </span>
                                            <span className="text-[11px] font-mono font-semibold text-gray-400">
                                                #ADJ-{item.id_adjustment}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-white">
                                                <Info className="w-3.5 h-3.5 text-gray-400" />
                                                Alasan: <span className="italic font-normal">"{item.alasan_edit}"</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatTanggal(item.waktu)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" /> Oleh: {item.petugas?.nama_lengkap}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sisi Kanan: Nominal Finansial */}
                                    <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-slate-800 flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
                                        <div>
                                            <p className={`text-base font-extrabold ${isTambah ? "text-emerald-600" : "text-rose-600"}`}>
                                                {isTambah ? "+" : "-"} {formatRupiah(item.nominal)}
                                            </p>
                                        </div>
                                        <div className="text-[11px] text-gray-500 font-medium">
                                            <div className="text-gray-400 line-through">Lama: {formatRupiah(item.saldo_lama)}</div>
                                            <div className="text-gray-700 dark:text-gray-300 font-bold">Baru: {formatRupiah(item.saldo_baru)}</div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}