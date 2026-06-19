// src/services/transactionService.js
import prisma from "../lib/prisma";
import { logService } from "./logService";
import { validateHarga } from "./masterSampahService";

export const transactionService = {
  async createSetoranBulk(dataBulk, actorRole, actorId, actorBankSampahId) {
    const {
      nasabah_id,
      items,
      metode_bayar = "TABUNG",
      catatan_petugas = "",
    } = dataBulk;

    const nasabah = await prisma.user.findUnique({
      where: { id_user: nasabah_id },
      select: { bank_sampah_id: true, peran: true, is_blocked: true },
    });

    if (!nasabah || nasabah.peran !== "NASABAH")
      throw new Error("Nasabah tidak valid");
    if (nasabah.is_blocked) throw new Error("Nasabah sedang diblokir");
    if (actorRole === "PETUGAS" && nasabah.bank_sampah_id !== actorBankSampahId)
      throw new Error("Akses ditolak: Nasabah di luar unit kerja Anda");
    if (!items || items.length === 0)
      throw new Error("Tidak ada item sampah untuk disetor");

    const groupId = `GRP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return await prisma.$transaction(
      async (tx) => {
        const id_setor = `STR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        const detailItems = [];
        let grandTotalRp = 0;

        for (const item of items) {
          const barang = await tx.masterSampah.findUnique({
            where: { id_barang: item.barang_id },
          });
          if (!barang)
            throw new Error(`Barang ID ${item.barang_id} tidak ditemukan`);

          let hargaFinal = 0;
          if (item.tipe_harga === "SISTEM")
            hargaFinal = Number(barang.harga_pusat);
          else if (item.tipe_harga === "LOKAL")
            hargaFinal = Number(item.harga_lokal || barang.harga_pusat);
          else if (item.tipe_harga === "CUSTOM") {
            const customVal = Number(item.harga_manual);
            if (
              customVal < Number(barang.batas_bawah) ||
              customVal > Number(barang.batas_atas)
            )
              throw new Error(
                `Harga ${barang.nama_barang} (Rp${customVal}) melampaui batas resmi!`,
              );
            hargaFinal = customVal;
          }

          const total_item_rp = hargaFinal * Number(item.berat);
          grandTotalRp += total_item_rp;

          detailItems.push({
            barang_id: item.barang_id,
            nama_barang_snapshot: barang.nama_barang,
            berat: Number(item.berat),
            harga_deal: hargaFinal,
            total_rp: total_item_rp,
            tipe_setoran: item.tipe_setoran,
          });
        }

        const transaksi = await tx.transaksiSetor.create({
          data: {
            id_setor,
            nasabah_id,
            petugas_id: actorId,
            tipe_setoran: items[0].tipe_setoran,
            metode_bayar,
            total_rp: grandTotalRp,
            catatan_petugas,
            detail_items: { create: detailItems },
          },
          include: { detail_items: true },
        });

        if (metode_bayar === "TABUNG" && grandTotalRp > 0) {
          await tx.user.update({
            where: { id_user: nasabah_id },
            data: { total_saldo: { increment: grandTotalRp } },
          });
        }

        await logService.record(
          actorId,
          "SETOR_SAMPAH_BULK",
          `Setoran ${items.length} item oleh nasabah ${nasabah_id}, Total: Rp${grandTotalRp}`,
          { id_setor, items_count: items.length },
        );

        return { id_setor, total_rp: grandTotalRp, transaksi };
      },
      { timeout: 15000 },
    );
  },

  async createPenarikan(data, actorRole, actorId, actorBankSampahId) {
    const { nasabah_id, petugas_id, jumlah_tarik, catatan_tarik = "" } = data;

    const nasabah = await prisma.user.findUnique({
      where: { id_user: nasabah_id },
      select: {
        total_saldo: true,
        is_blocked: true,
        peran: true,
        bank_sampah_id: true,
      },
    });

    if (!nasabah || nasabah.peran !== "NASABAH")
      throw new Error("Nasabah tidak valid.");
    if (nasabah.is_blocked) throw new Error("Nasabah sedang diblokir.");
    if (actorRole === "PETUGAS" && nasabah.bank_sampah_id !== actorBankSampahId)
      throw new Error(
        "Petugas hanya boleh tarik saldo nasabah di unit sendiri.",
      );

    const jumlah = parseFloat(jumlah_tarik);
    if (parseFloat(nasabah.total_saldo) < jumlah)
      throw new Error(
        `Saldo tidak mencukupi! Saat ini: Rp${nasabah.total_saldo}`,
      );

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const id_tarik = `TRK-${dateStr}-${randomId}`;

    return await prisma.$transaction(
      async (tx) => {
        const transaksi = await tx.transaksiTarik.create({
          data: {
            id_tarik,
            nasabah_id,
            petugas_id,
            jumlah_tarik: jumlah,
            status: "SUKSES",
            catatan_tarik,
          },
        });

        await tx.user.update({
          where: { id_user: nasabah_id },
          data: { total_saldo: { decrement: jumlah } },
        });

        await logService.record(
          actorId,
          "TARIK_SALDO",
          `Tarik Rp${jumlah} oleh nasabah ${nasabah_id}, catatan: ${catatan_tarik || "tidak ada"}`,
          { id_tarik },
        );

        return transaksi;
      },
      { timeout: 15000 },
    );
  },

  async getTransaksiByUnit(unitId, options = {}) {
    const {
      page = 1,
      limit = 20,
      tipe = "ALL",
      startDate,
      endDate,
      nasabahId,
    } = options;

    const skip = (page - 1) * limit;

    const nasabahIds = await prisma.user.findMany({
      where: { bank_sampah_id: unitId, peran: "NASABAH" },
      select: { id_user: true },
    });

    const validNasabahIds = nasabahIds.map((n) => n.id_user);

    const whereSetor = { nasabah_id: { in: validNasabahIds } };
    const whereTarik = { nasabah_id: { in: validNasabahIds } };

    if (nasabahId) {
      whereSetor.nasabah_id = parseInt(nasabahId);
      whereTarik.nasabah_id = parseInt(nasabahId);
    }

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      whereSetor.waktu = dateFilter;
      whereTarik.waktu = dateFilter;
    }

    let setor = [],
      tarik = [],
      totalSetor = 0,
      totalTarik = 0;

    if (tipe === "SETOR" || tipe === "ALL") {
      [setor, totalSetor] = await Promise.all([
        prisma.transaksiSetor.findMany({
          where: whereSetor,
          include: {
            detail_items: true,
            nasabah: { select: { nama_lengkap: true, nickname: true } },
            petugas: { select: { nama_lengkap: true } },
          },
          orderBy: { waktu: "desc" },
          skip,
          take: limit,
        }),
        prisma.transaksiSetor.count({ where: whereSetor }),
      ]);
    }

    if (tipe === "TARIK" || tipe === "ALL") {
      [tarik, totalTarik] = await Promise.all([
        prisma.transaksiTarik.findMany({
          where: whereTarik,
          include: {
            nasabah: { select: { nama_lengkap: true, nickname: true } },
            petugas: { select: { nama_lengkap: true } },
          },
          orderBy: { waktu: "desc" },
          skip,
          take: limit,
        }),
        prisma.transaksiTarik.count({ where: whereTarik }),
      ]);
    }

    const allTransaksi = [
      ...setor.map((s) => ({ ...s, jenis: "SETOR" })),
      ...tarik.map((t) => ({ ...t, jenis: "TARIK" })),
    ].sort((a, b) => new Date(b.waktu) - new Date(a.waktu));

    return {
      data: allTransaksi.slice(0, limit),
      total: totalSetor + totalTarik,
      page,
      limit,
    };
  },

  async cancelSetoran(
    id_setor,
    user_id_petugas,
    bank_sampah_id_petugas,
    alasan_batal,
  ) {
    if (!alasan_batal || alasan_batal.trim() === "")
      throw new Error("Alasan pembatalan harus diisi");

    const transaksi = await prisma.transaksiSetor.findUnique({
      where: { id_setor },
      include: { nasabah: true },
    });

    if (!transaksi) throw new Error("Transaksi tidak ditemukan");
    if (transaksi.is_cancelled)
      throw new Error("Transaksi sudah pernah dibatalkan");
    if (transaksi.nasabah.bank_sampah_id !== bank_sampah_id_petugas)
      throw new Error(
        "Akses ditolak: Anda tidak bisa membatalkan transaksi dari Unit Bank Sampah lain",
      );

    const selisihJam =
      (new Date() - new Date(transaksi.waktu)) / (1000 * 60 * 60);
    if (selisihJam > 24)
      throw new Error("Batas waktu pembatalan (24 jam) sudah habis");

    const isTabung = transaksi.metode_bayar === "TABUNG";

    return await prisma.$transaction(
      async (tx) => {
        const transaksiUpdated = await tx.transaksiSetor.update({
          where: { id_setor },
          data: {
            is_cancelled: true,
            alasan_batal: alasan_batal,
          },
        });

        if (isTabung) {
          await tx.user.update({
            where: { id_user: transaksi.nasabah_id },
            data: { total_saldo: { decrement: transaksi.total_rp } },
          });
        }

        const pesanLog = isTabung
          ? `Petugas membatalkan transaksi setor ${id_setor} (TABUNG). Alasan: ${alasan_batal}. Saldo nasabah dikurangi ${transaksi.total_rp}`
          : `Petugas membatalkan transaksi setor ${id_setor} (JUAL LANGSUNG). Alasan: ${alasan_batal}. Tidak mempengaruhi saldo nasabah.`;

        await tx.logAktivitas.create({
          data: {
            user_id: user_id_petugas,
            aksi: "CANCEL_TRANSAKSI_SETOR",
            detail: pesanLog,
          },
        });

        return transaksiUpdated;
      },
      { timeout: 15000 },
    );
  },

  async cancelPenarikan(
    id_tarik,
    user_id_petugas,
    bank_sampah_id_petugas,
    alasan_batal,
  ) {
    if (!alasan_batal || alasan_batal.trim() === "")
      throw new Error("Alasan pembatalan wajib diisi dan tidak boleh kosong");

    const transaksi = await prisma.transaksiTarik.findUnique({
      where: { id_tarik },
      include: { nasabah: true },
    });

    if (!transaksi) throw new Error("Transaksi penarikan tidak ditemukan");
    if (transaksi.status === "DIBATALKAN")
      throw new Error("Transaksi ini sudah pernah dibatalkan sebelumnya");
    if (transaksi.nasabah.bank_sampah_id !== bank_sampah_id_petugas)
      throw new Error(
        "Akses ditolak: Anda tidak bisa membatalkan transaksi dari Unit Bank Sampah lain",
      );

    const selisihJam =
      (new Date() - new Date(transaksi.waktu)) / (1000 * 60 * 60);
    if (selisihJam > 24)
      throw new Error("Batas waktu pembatalan tarik dana (24 jam) sudah habis");

    return await prisma.$transaction(
      async (tx) => {
        const transaksiUpdated = await tx.transaksiTarik.update({
          where: { id_tarik },
          data: {
            status: "DIBATALKAN",
            alasan_batal: alasan_batal,
          },
        });

        await tx.user.update({
          where: { id_user: transaksi.nasabah_id },
          data: { total_saldo: { increment: transaksi.jumlah_tarik } },
        });

        await tx.logAktivitas.create({
          data: {
            user_id: user_id_petugas,
            aksi: "CANCEL_TRANSAKSI_TARIK",
            detail: `Petugas membatalkan penarikan ${id_tarik}. Alasan: ${alasan_batal}. Saldo nasabah dikembalikan sebesar ${transaksi.jumlah_tarik}`,
          },
        });

        return transaksiUpdated;
      },
      { timeout: 15000 },
    );
  },

 
};
