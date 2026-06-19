// src/services/saldoAdjustmentService.js
import prisma from "../lib/prisma"; // 🌟 Diperbaiki agar sesuai dengan konfigurasi proyekmu

export const saldoAdjustmentService = {
    /**
     * Mengambil semua riwayat adjustment berdasarkan unit bank sampah petugas
     */
    async getAdjustmentsByUnit(bankSampahId, options = {}) {
        const { limit = 10, page = 1, search = "" } = options;
        const skip = (page - 1) * limit;

        const whereClause = {};

        // Jika bankSampahId dikirim (Petugas)
        if (bankSampahId) {
            whereClause.bank_sampah_id = Number(bankSampahId);
        }

        // Filter pencarian nama atau nickname nasabah
        if (search && search.trim() !== "") {
            whereClause.nasabah = {
                OR: [
                    { nama_lengkap: { contains: search, mode: "insensitive" } },
                    { nickname: { contains: search, mode: "insensitive" } },
                ],
            };
        }

        const [adjustments, totalCount] = await Promise.all([
            prisma.saldoAdjustment.findMany({
                where: whereClause,
                include: {
                    nasabah: {
                        select: {
                            id_user: true,
                            nickname: true,
                            nama_lengkap: true,
                        },
                    },
                    petugas: {
                        select: {
                            id_user: true,
                            nama_lengkap: true,
                        },
                    },
                },
                orderBy: {
                    waktu: "desc",
                },
                skip: skip,
                take: limit,
            }),
            prisma.saldoAdjustment.count({ where: whereClause }),
        ]);

        return {
            data: adjustments,
            pagination: {
                totalData: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit: limit,
            },
        };
    },

    /**
     * Mengambil riwayat adjustment spesifik milik satu nasabah
     */
    /**
      * Mengambil riwayat adjustment spesifik milik satu nasabah
      */
    async getAdjustmentsByNasabah(nasabahId) {
        return await prisma.saldoAdjustment.findMany({
            where: {
                nasabah_id: Number(nasabahId),
            },
            include: {
                petugas: {
                    select: {
                        nama_lengkap: true,
                    },
                },
            },
            orderBy: {
                waktu: "desc",
            },
        });
    },
};