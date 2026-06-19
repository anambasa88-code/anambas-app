// src/app/api/adjustment/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saldoAdjustmentService } from "@/services/saldoAdjustmentService";

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);

    // 1. Proteksi Autentikasi Dasar
    if (!currentUser) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // 2. Ambil Query Parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    // 3. Logika Pembatasan Hak Akses Berbasis Peran

    // ROLE ADMIN: Bebas melihat data (Bisa mem-filter per unit jika diinginkan)
    if (currentUser.peran === "ADMIN") {
      const filterBankSampahId = searchParams.get("bank_sampah_id");

      const result = await saldoAdjustmentService.getAdjustmentsByUnit(
        filterBankSampahId ? parseInt(filterBankSampahId) : null,
        { page, limit, search }
      );
      return NextResponse.json(result, { status: 200 });
    }

    // ROLE PETUGAS: Dikunci mati wajib berdasarkan unit kerjanya saja
    if (currentUser.peran === "PETUGAS") {
      if (!currentUser.bank_sampah_id) {
        return NextResponse.json(
          { error: "Akses ditolak: Akun petugas Anda belum dikaitkan dengan Unit Bank Sampah mana pun" },
          { status: 400 }
        );
      }

      const result = await saldoAdjustmentService.getAdjustmentsByUnit(
        currentUser.bank_sampah_id,
        { page, limit, search }
      );
      return NextResponse.json(result, { status: 200 });
    }

    // ROLE NASABAH / LAINNYA: Blokir dari endpoint log global ini
    return NextResponse.json(
      { error: "Akses ditolak: Anda tidak memiliki otoritas untuk melihat halaman log ini" },
      { status: 403 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data log penyesuaian saldo" },
      { status: 500 }
    );
  }
}