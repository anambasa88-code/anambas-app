import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/auth";
import { transactionService } from "@/services/transactionService";

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }

    // Mengunci hak akses hanya untuk PETUGAS
    if (currentUser.peran !== "PETUGAS") {
      return NextResponse.json({ error: "Hanya petugas yang dapat membatalkan transaksi" }, { status: 403 });
    }

    const { id_setor, alasan_batal } = await request.json();

    // Panggil fungsi service dengan menyertakan bank_sampah_id petugas untuk validasi internal
    const transaksi = await transactionService.cancelSetoran(
      id_setor,
      currentUser.id_user,
      currentUser.bank_sampah_id, // Tambahan parameter pengaman unit
      alasan_batal
    );

    return NextResponse.json({
      message: "Transaksi berhasil dibatalkan",
      data: transaksi,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message || "Gagal membatalkan transaksi" }, { status: 400 });
  }
}