"use client";

import { forwardRef, useImperativeHandle } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ExportRiwayatTransaksi = forwardRef(
  ({ data, filters, unitName }, ref) => {
    const formatIDR = (val) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(val || 0);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    useImperativeHandle(ref, () => ({
      // EXPORT EXCEL
      generateExcel() {
        const rows = data.map((t, idx) => {
          const detail =
            t.jenis === "SETOR"
              ? (t.subItems || [])
                  .map((item) => item.nama_barang_snapshot)
                  .filter(Boolean)
                  .join(", ")
              : "Penarikan Tunai";
          const catatan =
            t.jenis === "TARIK"
              ? t.catatan_tarik || "-"
              : t.catatan_petugas || "-";

          return [
            idx + 1,
            t.group_id || t.id_setor || t.id_tarik,
            t.jenis,
            t.jenis === "SETOR" ? t.metode_bayar || "-" : "-",
            t.nasabah?.nama_lengkap || "-",
            detail,
            catatan,
            formatIDR(t.totalGroupRp),
            formatDate(t.waktu),
            t.petugas?.nama_lengkap || "-",
          ];
        });

        const ws = XLSX.utils.aoa_to_sheet([
          [`RIWAYAT TRANSAKSI ${unitName}`],
          [
            `Periode : ${filters.startDate || "Semua"} - ${
              filters.endDate || "Semua"
            }`,
          ],
          [`Tipe : ${filters.tipe || "ALL"}`],
          [],
          [
            "No",
            "ID",
            "Jenis",
            "Metode",
            "Nasabah",
            "Detail",
            "Catatan",
            "Nominal",
            "Waktu",
            "Petugas",
          ],
          ...rows,
        ]);

        ws["!cols"] = [
          { wch: 6 },
          { wch: 18 },
          { wch: 12 },
          { wch: 15 },
          { wch: 25 },
          { wch: 30 },
          { wch: 25 },
          { wch: 18 },
          { wch: 20 },
          { wch: 20 },
        ];

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Riwayat Transaksi");

        XLSX.writeFile(wb, `Riwayat_Transaksi_${Date.now()}.xlsx`);
      },

      // EXPORT PDF
      generatePDF() {
        const doc = new jsPDF("l", "mm", "a4"); // Landscape biar muat banyak kolom

        doc.setFontSize(16);
        doc.text(`RIWAYAT TRANSAKSI ${unitName}`, 14, 15);

        doc.setFontSize(10);
        doc.text(
          `Filter Periode: ${filters.startDate || "Semua"} s/d ${filters.endDate || "Semua"}`,
          14,
          22,
        );
        doc.text(`Tipe: ${filters.tipe}`, 14, 27);

        autoTable(doc, {
          startY: 32,
          head: [
            [
              "No",
              "ID",
              "Tipe",
              "Nasabah",
              "Detail",
              "Berat",
              "Total",
              "Waktu",
            ],
          ],
          body: data.map((t, idx) => [
            idx + 1,
            t.group_id || t.id_setor || t.id_tarik,
            t.jenis,
            t.nasabah?.nama_lengkap || "-",

            t.jenis === "SETOR"
              ? (t.subItems || []).map((i) => i.nama_barang_snapshot).join(", ")
              : "Penarikan Tunai",

            t.jenis === "SETOR"
              ? `${(t.subItems || [])
                  .reduce((a, b) => a + Number(b.berat || 0), 0)
                  .toLocaleString("id-ID")} kg`
              : "-",

            formatIDR(t.totalGroupRp),

            formatDate(t.waktu),
          ]),
          theme: "grid",
          headStyles: { fillColor: [22, 163, 74] },
          styles: { fontSize: 8 },
        });

        doc.save(`Riwayat_Transaksi.pdf`);
      },
    }));

    return null;
  },
);

ExportRiwayatTransaksi.displayName = "ExportRiwayatTransaksi";
export default ExportRiwayatTransaksi;
