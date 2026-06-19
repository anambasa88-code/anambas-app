import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
// 🌟 SEKARANG SERAGAM: Panggil Service, bukan Prisma langsung!
import { saldoAdjustmentService } from "@/services/saldoAdjustmentService"; 

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    
    // 1. Validasi Login
    if (!currentUser) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // 2. Validasi Role Nasabah
    if (currentUser.peran !== "NASABAH") {
      return NextResponse.json(
        { error: "Akses ditolak. Endpoint ini hanya untuk Nasabah" },
        { status: 403 }
      );
    }

    // 3. 🌟 Panggil Service untuk mengambil data (Bukan lewat prisma langsung)
    const adjustments = await saldoAdjustmentService.getAdjustmentsByNasabah(currentUser.id_user);

    // 4. Kembalikan response JSON murni berstatus 200
    return NextResponse.json({ data: adjustments }, { status: 200 });

  } catch (error) {
    console.error("ERROR_ADJUSTMENT_NASABAH:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data penyesuaian saldo" },
      { status: 500 }
    );
  }
}