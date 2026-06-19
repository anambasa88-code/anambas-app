import { getPendingTransactions, removeTransaction } from './offlineQueue';

let isSyncing = false;

// Fungsi untuk mengirim semua transaksi pending ke server
export async function syncPendingTransactions() {
  if (isSyncing) return;
  
  const pending = await getPendingTransactions();
  if (pending.length === 0) return;

  isSyncing = true;

  for (const tx of pending) {
    try {
      // Pisahkan localId agar tidak dikirim ke database server
      const { localId, timestamp, ...payload } = tx;

      const response = await fetch('/api/transaksi/setor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TAMBAHKAN BARIS INI:
          'Authorization': `Bearer ${localStorage.getItem("bs_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Hapus dari IndexedDB jika server berhasil menyimpan
        await removeTransaction(localId);
      } else {
        console.error(`Gagal sync transaksi lokal ID ${localId}:`, await response.text());
        // Jangan dihentikan jika ada satu data yang error formatnya, lanjut ke data berikutnya
      }
    } catch (error) {
      console.error(`Koneksi putus saat sync transaksi lokal ID ${localId}:`, error);
      break; // Hentikan loop jika koneksi internet terputus lagi di tengah jalan
    }
  }

  isSyncing = false;
}

// Pasang listener event 'online' di browser
export function initSyncListener() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    syncPendingTransactions();
  });
}