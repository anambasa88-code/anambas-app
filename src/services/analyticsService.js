// src/services/analyticsService.js
import prisma from "../lib/prisma";

/**
 * Helper untuk menormalisasi hasil angka dari database (termasuk BigInt & Decimal PostgreSQL)
 * agar aman diserialisasi oleh NextResponse.json() di Next.js.
 */
const toNum = (val) => {
  if (val === null || val === undefined) return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

/**
 * Helper untuk menyusun klausa filter waktu secara parameter terikat (SQL Injection Safe).
 */
function buildDateFilter(columnName, startDate, endDate, paramOffset = 1) {
  const clauses = [];
  const params = [];
  let idx = paramOffset;

  if (startDate) {
    clauses.push(`${columnName} >= $${idx++}::timestamptz`);
    params.push(new Date(`${startDate}T00:00:00.000Z`));
  }
  if (endDate) {
    clauses.push(`${columnName} <= $${idx++}::timestamptz`);
    params.push(new Date(`${endDate}T23:59:59.999Z`));
  }

  return {
    sql: clauses.length > 0 ? " AND " + clauses.join(" AND ") : "",
    params,
    nextIdx: idx,
  };
}

/**
 * Helper untuk menghitung breakdown gender dan persentasenya.
 */
function buildGenderBreakdown(genderCounts, totalNasabah) {
  const result = {};
  for (const [gender, count] of Object.entries(genderCounts)) {
    result[gender] = {
      jumlah: count,
      persen: totalNasabah > 0 ? ((count / totalNasabah) * 100).toFixed(2) : "0.00",
    };
  }
  return result;
}

/**
 * Helper internal untuk mengambil daftar sampah terkumpul.
 */
async function fetchSampahTerkumpul({ unitId, startDate, endDate } = {}, defaultKategori = "LAINNYA") {
  const conditions = ["ts.is_cancelled = false"];
  const params = [];
  let paramIdx = 1;

  if (unitId !== undefined && unitId !== null) {
    conditions.push(`u.bank_sampah_id = $${paramIdx++}`);
    params.push(unitId);
  }

  if (startDate) {
    conditions.push(`ts.waktu >= $${paramIdx++}::timestamptz`);
    params.push(new Date(`${startDate}T00:00:00.000Z`));
  }
  if (endDate) {
    conditions.push(`ts.waktu <= $${paramIdx++}::timestamptz`);
    params.push(new Date(`${endDate}T23:59:59.999Z`));
  }

  const whereClause = "WHERE " + conditions.join(" AND ");

  const sql = `
    SELECT 
      ds.barang_id,
      ds.nama_barang_snapshot AS nama_sampah,
      ms.kategori_utama,
      SUM(ds.berat) AS total_berat,
      COUNT(ds.id)::int AS total_transaksi
    FROM detail_setor ds
    JOIN transaksi_setor ts ON ds.setor_id = ts.id_setor
    JOIN users u ON ts.nasabah_id = u.id_user
    JOIN master_sampah ms ON ds.barang_id = ms.id_barang
    ${whereClause}
    GROUP BY ds.barang_id, ds.nama_barang_snapshot, ms.kategori_utama
    ORDER BY total_berat DESC
  `;

  const rows = await prisma.$queryRawUnsafe(sql, ...params);

  return rows.map((r) => ({
    barang_id: toNum(r.barang_id),
    nama_sampah: r.nama_sampah,
    kategori_utama: r.kategori_utama || defaultKategori,
    total_berat: toNum(r.total_berat),
    total_transaksi: toNum(r.total_transaksi),
  }));
}

export const analyticsService = {
  async getNasabahSummary(nasabahId, startDate = null, endDate = null) {
    const { sql: dateFilterTs, params: paramsTs } = buildDateFilter("ts.waktu", startDate, endDate, 2);
    const { sql: dateFilterTt, params: paramsTt } = buildDateFilter("tt.waktu", startDate, endDate, 2);

    const [userSaldo, setorRows, tarikRows, detailRows] = await Promise.all([
      prisma.user.findUnique({
        where: { id_user: nasabahId },
        select: { total_saldo: true },
      }),
      prisma.$queryRawUnsafe(
        `
        SELECT 
          ts.metode_bayar,
          COUNT(ts.id_setor)::int AS count_setor,
          SUM(ts.total_rp) AS sum_rp
        FROM transaksi_setor ts
        WHERE ts.nasabah_id = $1 AND ts.is_cancelled = false
        ${dateFilterTs}
        GROUP BY ts.metode_bayar
      `,
        nasabahId,
        ...paramsTs
      ),
      prisma.$queryRawUnsafe(
        `
        SELECT 
          COUNT(tt.id_tarik)::int AS count_tarik,
          SUM(tt.jumlah_tarik) AS sum_tarik
        FROM transaksi_tarik tt
        WHERE tt.nasabah_id = $1 AND tt.status != 'DIBATALKAN'
        ${dateFilterTt}
      `,
        nasabahId,
        ...paramsTt
      ),
      prisma.$queryRawUnsafe(
        `
        SELECT 
          ds.tipe_setoran,
          ms.kategori_utama,
          SUM(ds.berat) AS sum_berat
        FROM detail_setor ds
        JOIN transaksi_setor ts ON ds.setor_id = ts.id_setor
        JOIN master_sampah ms ON ds.barang_id = ms.id_barang
        WHERE ts.nasabah_id = $1 AND ts.is_cancelled = false
        ${dateFilterTs}
        GROUP BY ds.tipe_setoran, ms.kategori_utama
      `,
        nasabahId,
        ...paramsTs
      ),
    ]);

    let totalKg = 0;
    const perTipe = {};
    const perKategori = {};

    for (const row of detailRows) {
      const berat = toNum(row.sum_berat);
      totalKg += berat;
      if (row.tipe_setoran) {
        perTipe[row.tipe_setoran] = (perTipe[row.tipe_setoran] || 0) + berat;
      }
      if (row.kategori_utama) {
        perKategori[row.kategori_utama] = (perKategori[row.kategori_utama] || 0) + berat;
      }
    }

    let totalTransaksiSetor = 0;
    const transaksiMetodeBayar = {};
    const perputaranUangPerMetode = {};
    let tabungRp = 0;

    for (const row of setorRows) {
      const count = toNum(row.count_setor);
      const sumRp = toNum(row.sum_rp);
      totalTransaksiSetor += count;
      transaksiMetodeBayar[row.metode_bayar] = count;
      perputaranUangPerMetode[row.metode_bayar] = sumRp;
      if (row.metode_bayar === "TABUNG") {
        tabungRp += sumRp;
      }
    }

    const tarikRow = tarikRows[0] || {};

    return {
      total_kg: totalKg,
      total_rp: tabungRp,
      per_tipe: perTipe,
      per_kategori: perKategori,
      total_transaksi_setor: totalTransaksiSetor,
      total_transaksi_tarik: toNum(tarikRow.count_tarik),
      transaksi_metode_bayar: transaksiMetodeBayar,
      perputaran_uang_per_metode: perputaranUangPerMetode,
      total_penarikan_rp: toNum(tarikRow.sum_tarik),
      saldo_aktif: toNum(userSaldo?.total_saldo),
      periode: startDate || endDate ? { start: startDate, end: endDate } : null,
    };
  },

  async getPetugasUnitSummary(unitId, options = {}) {
    const { startDate, endDate } = options;
    const { sql: dateFilterTs, params: paramsTs } = buildDateFilter("ts.waktu", startDate, endDate, 2);
    const { sql: dateFilterTt, params: paramsTt } = buildDateFilter("tt.waktu", startDate, endDate, 2);

    const [userRows, setorRows, tarikRows, detailRows, sampahTerkumpul] = await Promise.all([
      prisma.$queryRawUnsafe(
        `
        SELECT 
          jenis_kelamin,
          COUNT(id_user)::int AS count_user,
          SUM(total_saldo) AS sum_saldo
        FROM users
        WHERE bank_sampah_id = $1 AND peran = 'NASABAH'
        GROUP BY jenis_kelamin
      `,
        unitId
      ),
      prisma.$queryRawUnsafe(
        `
        SELECT 
          ts.metode_bayar,
          COUNT(ts.id_setor)::int AS count_setor,
          SUM(ts.total_rp) AS sum_rp
        FROM transaksi_setor ts
        JOIN users u ON ts.nasabah_id = u.id_user
        WHERE u.bank_sampah_id = $1 AND ts.is_cancelled = false
        ${dateFilterTs}
        GROUP BY ts.metode_bayar
      `,
        unitId,
        ...paramsTs
      ),
      prisma.$queryRawUnsafe(
        `
        SELECT 
          COUNT(tt.id_tarik)::int AS count_tarik,
          SUM(tt.jumlah_tarik) AS sum_tarik
        FROM transaksi_tarik tt
        JOIN users u ON tt.nasabah_id = u.id_user
        WHERE u.bank_sampah_id = $1 AND tt.status != 'DIBATALKAN'
        ${dateFilterTt}
      `,
        unitId,
        ...paramsTt
      ),
      prisma.$queryRawUnsafe(
        `
        SELECT 
          ds.tipe_setoran,
          ms.kategori_utama,
          SUM(ds.berat) AS sum_berat
        FROM detail_setor ds
        JOIN transaksi_setor ts ON ds.setor_id = ts.id_setor
        JOIN users u ON ts.nasabah_id = u.id_user
        JOIN master_sampah ms ON ds.barang_id = ms.id_barang
        WHERE u.bank_sampah_id = $1 AND ts.is_cancelled = false
        ${dateFilterTs}
        GROUP BY ds.tipe_setoran, ms.kategori_utama
      `,
        unitId,
        ...paramsTs
      ),
      this.getSampahTerkumpulPerJenis(unitId, options),
    ]);

    let totalNasabah = 0;
    let saldoAktif = 0;
    const genderCounts = {};

    for (const row of userRows) {
      const count = toNum(row.count_user);
      totalNasabah += count;
      saldoAktif += toNum(row.sum_saldo);
      if (row.jenis_kelamin) {
        genderCounts[row.jenis_kelamin] = count;
      }
    }

    let totalKg = 0;
    const perTipe = {};
    const perKategori = {};

    for (const row of detailRows) {
      const berat = toNum(row.sum_berat);
      totalKg += berat;
      if (row.tipe_setoran) {
        perTipe[row.tipe_setoran] = (perTipe[row.tipe_setoran] || 0) + berat;
      }
      if (row.kategori_utama) {
        perKategori[row.kategori_utama] = (perKategori[row.kategori_utama] || 0) + berat;
      }
    }

    let totalTransaksiSetor = 0;
    let totalRp = 0;
    const transaksiMetodeBayar = {};
    const perputaranUangPerMetode = {};

    for (const row of setorRows) {
      const count = toNum(row.count_setor);
      const sumRp = toNum(row.sum_rp);
      totalTransaksiSetor += count;
      totalRp += sumRp;
      transaksiMetodeBayar[row.metode_bayar] = count;
      perputaranUangPerMetode[row.metode_bayar] = sumRp;
    }

    const tarikRow = tarikRows[0] || {};

    return {
      total_kg: totalKg,
      total_rp: totalRp,
      per_tipe: perTipe,
      per_kategori: perKategori,
      total_nasabah: totalNasabah,
      gender_breakdown: buildGenderBreakdown(genderCounts, totalNasabah),
      total_transaksi_setor: totalTransaksiSetor,
      total_transaksi_tarik: toNum(tarikRow.count_tarik),
      transaksi_metode_bayar: transaksiMetodeBayar,
      perputaran_uang_per_metode: perputaranUangPerMetode,
      total_penarikan_rp: toNum(tarikRow.sum_tarik),
      saldo_aktif: saldoAktif,
      sampah_terkumpul: sampahTerkumpul,
    };
  },

  async getAdminGlobalSummary(filters = {}) {
    try {
      const { startDate, endDate } = filters;
      const { sql: dateFilterTs, params: paramsTs } = buildDateFilter("ts.waktu", startDate, endDate, 1);
      const { sql: dateFilterTt, params: paramsTt } = buildDateFilter("tt.waktu", startDate, endDate, 1);

      const [units, userRows, setorRows, tarikRows, detailRows, sampahTerkumpul] = await Promise.all([
        prisma.unitBankSampah.findMany({
          select: { id_unit: true, nama_unit: true },
          orderBy: { id_unit: "asc" },
        }),
        prisma.$queryRawUnsafe(`
          SELECT 
            bank_sampah_id,
            jenis_kelamin,
            COUNT(id_user)::int AS count_user,
            SUM(total_saldo) AS sum_saldo
          FROM users
          WHERE peran = 'NASABAH'
          GROUP BY bank_sampah_id, jenis_kelamin
        `),
        prisma.$queryRawUnsafe(
          `
          SELECT 
            u.bank_sampah_id,
            ts.metode_bayar,
            COUNT(ts.id_setor)::int AS count_setor,
            SUM(ts.total_rp) AS sum_rp
          FROM transaksi_setor ts
          JOIN users u ON ts.nasabah_id = u.id_user
          WHERE ts.is_cancelled = false
          ${dateFilterTs}
          GROUP BY u.bank_sampah_id, ts.metode_bayar
        `,
          ...paramsTs
        ),
        prisma.$queryRawUnsafe(
          `
          SELECT 
            u.bank_sampah_id,
            COUNT(tt.id_tarik)::int AS count_tarik,
            SUM(tt.jumlah_tarik) AS sum_tarik
          FROM transaksi_tarik tt
          JOIN users u ON tt.nasabah_id = u.id_user
          WHERE tt.status != 'DIBATALKAN'
          ${dateFilterTt}
          GROUP BY u.bank_sampah_id
        `,
          ...paramsTt
        ),
        prisma.$queryRawUnsafe(
          `
          SELECT 
            u.bank_sampah_id,
            ds.tipe_setoran,
            ms.kategori_utama,
            SUM(ds.berat) AS sum_berat
          FROM detail_setor ds
          JOIN transaksi_setor ts ON ds.setor_id = ts.id_setor
          JOIN users u ON ts.nasabah_id = u.id_user
          JOIN master_sampah ms ON ds.barang_id = ms.id_barang
          WHERE ts.is_cancelled = false
          ${dateFilterTs}
          GROUP BY u.bank_sampah_id, ds.tipe_setoran, ms.kategori_utama
        `,
          ...paramsTs
        ),
        this.getGlobalSampahTerkumpul(filters),
      ]);

      const unitMap = new Map();
      const unitGenderMap = new Map();

      for (const unit of units) {
        unitMap.set(unit.id_unit, {
          unit_id: unit.id_unit,
          nama_unit: unit.nama_unit,
          total_kg: 0,
          total_rp: 0,
          total_nasabah: 0,
          total_transaksi_setor: 0,
          total_transaksi_tarik: 0,
          per_tipe: {},
          per_kategori: {},
          gender_breakdown: {},
          transaksi_metode_bayar: {},
          perputaran_uang_per_metode: {},
          total_penarikan_rp: 0,
          saldo_aktif: 0,
        });
        unitGenderMap.set(unit.id_unit, {});
      }

      const globalData = {
        total_kg: 0,
        total_rp: 0,
        per_tipe: {},
        per_kategori: {},
        total_nasabah: 0,
        gender_breakdown: {},
        total_transaksi_setor: 0,
        total_transaksi_tarik: 0,
        transaksi_metode_bayar: {},
        perputaran_uang_per_metode: {},
        total_penarikan_rp: 0,
        saldo_aktif: 0,
        sampah_terkumpul: sampahTerkumpul,
      };

      const globalGenderCounts = {};

      for (const row of userRows) {
        const count = toNum(row.count_user);
        const saldo = toNum(row.sum_saldo);
        const unitId = row.bank_sampah_id;

        globalData.total_nasabah += count;
        globalData.saldo_aktif += saldo;
        if (row.jenis_kelamin) {
          globalGenderCounts[row.jenis_kelamin] =
            (globalGenderCounts[row.jenis_kelamin] || 0) + count;
        }

        if (unitId && unitMap.has(unitId)) {
          const uData = unitMap.get(unitId);
          uData.total_nasabah += count;
          uData.saldo_aktif += saldo;

          const gMap = unitGenderMap.get(unitId);
          if (row.jenis_kelamin) {
            gMap[row.jenis_kelamin] = (gMap[row.jenis_kelamin] || 0) + count;
          }
        }
      }

      for (const row of setorRows) {
        const count = toNum(row.count_setor);
        const sumRp = toNum(row.sum_rp);
        const unitId = row.bank_sampah_id;
        const metode = row.metode_bayar;

        globalData.total_transaksi_setor += count;
        globalData.total_rp += sumRp;
        globalData.transaksi_metode_bayar[metode] =
          (globalData.transaksi_metode_bayar[metode] || 0) + count;
        globalData.perputaran_uang_per_metode[metode] =
          (globalData.perputaran_uang_per_metode[metode] || 0) + sumRp;

        if (unitId && unitMap.has(unitId)) {
          const uData = unitMap.get(unitId);
          uData.total_transaksi_setor += count;
          uData.total_rp += sumRp;
          uData.transaksi_metode_bayar[metode] =
            (uData.transaksi_metode_bayar[metode] || 0) + count;
          uData.perputaran_uang_per_metode[metode] =
            (uData.perputaran_uang_per_metode[metode] || 0) + sumRp;
        }
      }

      for (const row of tarikRows) {
        const count = toNum(row.count_tarik);
        const sumTarik = toNum(row.sum_tarik);
        const unitId = row.bank_sampah_id;

        globalData.total_transaksi_tarik += count;
        globalData.total_penarikan_rp += sumTarik;

        if (unitId && unitMap.has(unitId)) {
          const uData = unitMap.get(unitId);
          uData.total_transaksi_tarik += count;
          uData.total_penarikan_rp += sumTarik;
        }
      }

      for (const row of detailRows) {
        const berat = toNum(row.sum_berat);
        const unitId = row.bank_sampah_id;
        const tipe = row.tipe_setoran;
        const kat = row.kategori_utama;

        globalData.total_kg += berat;
        if (tipe) {
          globalData.per_tipe[tipe] = (globalData.per_tipe[tipe] || 0) + berat;
        }
        if (kat) {
          globalData.per_kategori[kat] = (globalData.per_kategori[kat] || 0) + berat;
        }

        if (unitId && unitMap.has(unitId)) {
          const uData = unitMap.get(unitId);
          uData.total_kg += berat;
          if (tipe) {
            uData.per_tipe[tipe] = (uData.per_tipe[tipe] || 0) + berat;
          }
          if (kat) {
            uData.per_kategori[kat] = (uData.per_kategori[kat] || 0) + berat;
          }
        }
      }

      globalData.gender_breakdown = buildGenderBreakdown(
        globalGenderCounts,
        globalData.total_nasabah
      );

      const perUnitData = Array.from(unitMap.values()).map((uData) => {
        const gCounts = unitGenderMap.get(uData.unit_id) || {};
        return {
          ...uData,
          gender_breakdown: buildGenderBreakdown(gCounts, uData.total_nasabah),
        };
      });

      return {
        global: globalData,
        per_unit: perUnitData,
      };
    } catch (error) {
      console.error("Critical Analytics Error:", error);
      throw error;
    }
  },

  async getSampahTerkumpulPerJenis(unitId, options = {}) {
    return fetchSampahTerkumpul({ unitId, ...options }, null);
  },

  async getGlobalSampahTerkumpul(options = {}) {
    return fetchSampahTerkumpul(options, "LAINNYA");
  },
};