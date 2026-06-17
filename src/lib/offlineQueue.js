import { openDB } from 'idb';

const DB_NAME = 'bank-sampah-offline-db';
const STORE_NAME = 'setor-queue';
const STORE_NASABAH = 'data-nasabah'; // Menyimpan data User (Peran: NASABAH)
const STORE_HARGA = 'data-harga-lokal'; // Menyimpan data gabungan HargaLokalUnit & MasterSampah
const DB_VERSION = 2; // Naik ke versi 2

// Inisialisasi Database IndexedDB
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'localId', autoIncrement: true });
      }
      // Tambah store data master jika belum ada
      if (!db.objectStoreNames.contains(STORE_NASABAH)) {
        db.createObjectStore(STORE_NASABAH, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_HARGA)) {
        db.createObjectStore(STORE_HARGA, { keyPath: 'id' });
      }
    },
  });
}

// 1. Simpan transaksi setor ke antrean lokal saat offline
export async function queueTransaction(data) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  const item = {
    ...data,
    timestamp: new Date().toISOString(),
  };
  
  await store.add(item);
  await tx.done;
  
  updateLocalBackupCount();
}

// 2. Ambil semua transaksi yang masih pending
export async function getPendingTransactions() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

// 3. Hapus dari queue setelah berhasil sync ke server
export async function removeTransaction(localId) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(localId);
  await tx.done;
  
  updateLocalBackupCount();
}

// Helper untuk sinkronisasi jumlah data ke localStorage (dibaca oleh OfflineBanner)
async function updateLocalBackupCount() {
  if (typeof window !== 'undefined') {
    const db = await initDB();
    const allItems = await db.getAll(STORE_NAME);
    localStorage.setItem('offline-transaction-queue', JSON.stringify(allItems));
  }
}

// --- FUNGSI BARU UNTUK CACHING DATA MASTER ---

// Simpan/Overwrite data master (Nasabah atau Harga)
export async function saveMasterData(storeName, dataArray) {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  
  await store.clear(); // Bersihkan data lama agar selalu fresh
  for (const item of dataArray) {
    await store.put(item);
  }
  await tx.done;
}

// Ambil data master saat offline
export async function getMasterData(storeName) {
  const db = await initDB();
  return db.getAll(storeName);
}

export { STORE_NASABAH, STORE_HARGA };