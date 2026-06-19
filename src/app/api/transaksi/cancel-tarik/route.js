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
      return NextResponse.json({ error: "Hanya petugas yang dapat membatalkan transaksi penarikan" }, { status: 403 });
    }

    const { id_tarik, alasan_batal } = await request.json();

    // Panggil fungsi service dengan menyertakan bank_sampah_id petugas
    const transaksi = await transactionService.cancelPenarikan(
      id_tarik,
      currentUser.id_user,
      currentUser.bank_sampah_id, // Pengaman unit kerja petugas
      alasan_batal
    );

    return NextResponse.json({
      message: "Transaksi penarikan berhasil dibatalkan, saldo nasabah telah dikembalikan",
      data: transaksi,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message || "Gagal membatalkan transaksi penarikan" }, { status: 400 });
  }
}