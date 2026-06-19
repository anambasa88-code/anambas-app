import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { userService } from "@/services/userService";

const MAX_NOMINAL = 100_000_000;

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    if (currentUser.peran !== "PETUGAS") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Petugas yang dapat mengedit saldo secara manual" },
        { status: 403 }
      );
    }

    const { nasabah_id, jenis_aksi, nominal, alasan } = await request.json();

    // Validasi di route sebelum masuk service
    if (!nasabah_id) {
      return NextResponse.json({ error: "ID nasabah wajib diisi" }, { status: 400 });
    }

    if (!["TAMBAH", "KURANG"].includes(jenis_aksi)) {
      return NextResponse.json({ error: "Jenis aksi tidak valid" }, { status: 400 });
    }

    if (!nominal || nominal <= 0 || nominal > MAX_NOMINAL) {
      return NextResponse.json(
        { error: `Nominal harus antara 1 dan ${MAX_NOMINAL}` },
        { status: 400 }
      );
    }

    if (!alasan || alasan.trim() === "") {
      return NextResponse.json(
        { error: "Alasan perubahan saldo wajib diisi" },
        { status: 400 }
      );
    }

    const nasabahUpdated = await userService.updateSaldoManual(
      parseInt(nasabah_id),
      currentUser.id_user,
      currentUser.bank_sampah_id,
      jenis_aksi,
      Number(nominal),
      alasan.trim(),
    );

    return NextResponse.json(
      {
        message: "Saldo nasabah berhasil diperbarui",
        data: nasabahUpdated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui saldo" },
      { status: 400 }
    );
  }
}